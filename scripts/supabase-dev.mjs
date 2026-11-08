// All database actions in this launcher are pinned to MBF development.
import { spawn } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";
const root = fileURLToPath(new URL("../", import.meta.url));
const registry = JSON.parse(
  readFileSync(resolve(root, "supabase/environments.json"), "utf8"),
);
const ref = registry.dev.projectRef;
if (ref !== "gawblqkuodzuerzirsyr" || ref === registry.prod.projectRef)
  throw new Error("Unexpected development project.");
const mode = process.argv[2];
const commands = {
  plan: ["db", "push", `--remote=${ref}`, "--dry-run"],
  migrate: ["db", "push", `--remote=${ref}`, "--yes"],
  test: [
    "db",
    "query",
    `--remote=${ref}`,
    "--file",
    "supabase/tests/environment-isolation.sql",
    "--yes",
  ],
  onboarding: [
    "db",
    "query",
    `--remote=${ref}`,
    "--file",
    "supabase/tests/onboarding.sql",
    "--yes",
  ],
  types: [
    "gen",
    "types",
    "typescript",
    `--remote=${ref}`,
    "--schema",
    "public",
  ],
};
if (!commands[mode])
  throw new Error(
    "Choose plan, migrate, test, onboarding or types. Production is not supported by this launcher.",
  );
const child = spawn(
  process.execPath,
  [resolve(root, "node_modules/supabase/dist/supabase.js"), ...commands[mode]],
  {
    cwd: root,
    env: { ...process.env, NODE_USE_SYSTEM_CA: "1" },
    stdio: mode === "types" ? ["inherit", "pipe", "inherit"] : "inherit",
  },
);
let output = "";
if (mode === "types")
  child.stdout.on("data", (chunk) => {
    output += chunk.toString();
  });
child.on("error", (error) => {
  console.error(error.message);
  process.exitCode = 1;
});
child.on("exit", (code) => {
  if (code === 0 && mode === "types") {
    if (!output.includes("export type Database")) {
      console.error("Unexpected type generation output");
      process.exitCode = 1;
      return;
    }
    writeFileSync(resolve(root, "apps/web/src/lib/database.types.ts"), output);
    console.log("Development database types generated.");
  }
  process.exitCode = code ?? 1;
});
