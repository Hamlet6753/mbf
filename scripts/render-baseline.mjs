// Rebuilds the schema-only baseline from the reviewed catalog snapshot.
// This script writes SQL locally; it never connects to a database.
import { readFileSync, writeFileSync } from "node:fs";
const s = JSON.parse(
  readFileSync("supabase/baseline/production-schema.json", "utf8"),
);
const q = (value) => `"${value.replaceAll('"', '""')}"`;
const lit = (value) => `'${value.replaceAll("'", "''")}'`;
const fq = (value) => `${q(value.schema)}.${q(value.name)}`;
const role = (name) => (name === "PUBLIC" ? "PUBLIC" : q(name));
const sql = [
  "-- MBF schema-only baseline for a NEW development database.",
  "-- Existing production already contains these objects: NEVER replay there.",
  "-- Source: read-only catalog snapshot, 2026-11-08. No member data included.",
  "BEGIN;",
  "SET LOCAL check_function_bodies = off;",
  "SET LOCAL search_path = public, extensions;",
  "DO $$ BEGIN IF to_regclass('public.musicians') IS NOT NULL THEN RAISE EXCEPTION 'Baseline requires an empty application schema'; END IF; END $$;",
];
const emit = (text) => sql.push(text);
for (const name of ["public", "app_private"])
  emit(`CREATE SCHEMA IF NOT EXISTS ${q(name)};`);
for (const e of s.extensions) {
  emit(`CREATE SCHEMA IF NOT EXISTS ${q(e.schema)};`);
  emit(
    `CREATE EXTENSION IF NOT EXISTS ${q(e.name)} WITH SCHEMA ${q(e.schema)};`,
  );
}
for (const e of s.enums)
  emit(`CREATE TYPE ${fq(e)} AS ENUM (${e.values.map(lit).join(", ")});`);
for (const seq of s.sequences.filter((x) => x.dependency_type !== "i"))
  emit(
    `CREATE SEQUENCE ${fq(seq)} AS ${seq.type} INCREMENT BY ${seq.increment} MINVALUE ${seq.min} MAXVALUE ${seq.max} START WITH ${seq.start} CACHE ${seq.cache}${seq.cycle ? " CYCLE" : ""};`,
  );
for (const t of s.tables) {
  const columns = t.columns.map((c) => {
    let definition = `${q(c.name)} ${c.type}`;
    if (c.identity) {
      const seq = s.sequences.find(
        (x) =>
          x.schema === t.schema &&
          x.owned_table === t.name &&
          x.owned_column === c.name,
      );
      if (!seq) throw new Error("Missing identity sequence");
      definition += ` GENERATED ${c.identity === "a" ? "ALWAYS" : "BY DEFAULT"} AS IDENTITY (SEQUENCE NAME ${fq(seq)} START WITH ${seq.start} INCREMENT BY ${seq.increment} MINVALUE ${seq.min} MAXVALUE ${seq.max} CACHE ${seq.cache}${seq.cycle ? " CYCLE" : ""})`;
    } else if (c.generated)
      definition += ` GENERATED ALWAYS AS (${c.default}) STORED`;
    else if (c.default) definition += ` DEFAULT ${c.default}`;
    if (c.not_null) definition += " NOT NULL";
    return `  ${definition}`;
  });
  emit(`CREATE TABLE ${fq(t)} (\n${columns.join(",\n")}\n);`);
}
for (const seq of s.sequences.filter((x) => x.dependency_type === "a"))
  emit(
    `ALTER SEQUENCE ${fq(seq)} OWNED BY ${q(seq.schema)}.${q(seq.owned_table)}.${q(seq.owned_column)};`,
  );
for (const c of [...s.constraints].sort(
  (a, b) => Number(a.kind === "f") - Number(b.kind === "f"),
))
  emit(
    `ALTER TABLE ${q(c.schema)}.${q(c.table)} ADD CONSTRAINT ${q(c.name)} ${c.definition};`,
  );
for (const i of s.indexes) emit(i.definition + ";");

const created = new Set();
let pending = [...s.views];
while (pending.length) {
  const ready = pending.filter((v) =>
    (v.dependencies || []).every((d) => created.has(d)),
  );
  if (!ready.length) throw new Error("View dependency cycle");
  for (const v of ready) {
    emit(
      `CREATE VIEW ${fq(v)}${v.options?.length ? ` WITH (${v.options.join(", ")})` : ""} AS\n${v.definition.trim()}`,
    );
    created.add(`${v.schema}.${v.name}`);
  }
  pending = pending.filter((v) => !ready.includes(v));
}
for (const f of s.functions) emit(f.definition.trim() + ";");
for (const t of s.tables) {
  if (t.rls) emit(`ALTER TABLE ${fq(t)} ENABLE ROW LEVEL SECURITY;`);
  if (t.force_rls) emit(`ALTER TABLE ${fq(t)} FORCE ROW LEVEL SECURITY;`);
}
const commands = {
  "*": "ALL",
  r: "SELECT",
  a: "INSERT",
  w: "UPDATE",
  d: "DELETE",
};
for (const p of s.policies)
  emit(
    `CREATE POLICY ${q(p.name)} ON ${q(p.schema)}.${q(p.table)} AS ${p.permissive ? "PERMISSIVE" : "RESTRICTIVE"} FOR ${commands[p.command]} TO ${p.roles.map(role).join(", ")}${p.using ? ` USING (${p.using})` : ""}${p.check ? ` WITH CHECK (${p.check})` : ""};`,
  );
for (const t of s.triggers) {
  emit(t.definition + ";");
  if (t.enabled !== "O")
    emit(
      `ALTER TABLE ${q(t.schema)}.${q(t.table)} ${t.enabled === "D" ? "DISABLE" : `ENABLE ${t.enabled === "R" ? "REPLICA" : "ALWAYS"}`} TRIGGER ${q(t.name)};`,
    );
}
const clients = ["PUBLIC", "anon", "authenticated", "service_role"];
function grants(type, name, acl) {
  emit(`REVOKE ALL ON ${type} ${name} FROM ${clients.map(role).join(", ")};`);
  for (const a of acl || [])
    if (a.grantee !== "postgres")
      emit(
        `GRANT ${a.privilege} ON ${type} ${name} TO ${role(a.grantee)}${a.grantable ? " WITH GRANT OPTION" : ""};`,
      );
}
for (const a of s.schema_acls) grants("SCHEMA", q(a.name), a.acl);
for (const a of s.relation_acls)
  grants(a.kind === "S" ? "SEQUENCE" : "TABLE", fq(a), a.acl);
for (const f of s.functions)
  grants("FUNCTION", `${fq(f)}(${f.signature})`, f.acl);
for (const a of s.column_acls || []) {
  for (const g of a.acl) emit(`GRANT ${g.privilege} (${q(a.column)}) ON TABLE ${q(a.schema)}.${q(a.table)} TO ${role(g.grantee)}${g.grantable ? ' WITH GRANT OPTION' : ''};`);
}
for (const a of s.default_acls.filter((a) => a.owner === "postgres")) {
  const type = { r: "TABLES", S: "SEQUENCES", f: "FUNCTIONS" }[a.kind];
  if (!type) throw new Error("Unknown default ACL");
  const prefix = `ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA ${q(a.schema)}`;
  emit(`${prefix} REVOKE ALL ON ${type} FROM ${clients.map(role).join(", ")};`);
  for (const g of a.acl)
    if (g.grantee !== "postgres")
      emit(
        `${prefix} GRANT ${g.privilege} ON ${type} TO ${role(g.grantee)}${g.grantable ? " WITH GRANT OPTION" : ""};`,
      );
}
for (const b of s.buckets)
  emit(
    `INSERT INTO storage.buckets (id,name,public,file_size_limit,allowed_mime_types) VALUES (${lit(b.id)},${lit(b.name)},${b.public},${b.file_size_limit ?? "NULL"},${b.allowed_mime_types ? `ARRAY[${b.allowed_mime_types.map(lit).join(",")}]::text[]` : "NULL"});`,
  );
emit("COMMIT;");
writeFileSync("supabase/baseline/dev-baseline.sql", sql.join("\n\n") + "\n");
console.log(`Generated ${sql.length} statements, no database changes.`);
