import { createHash } from "node:crypto";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { parseEnv } from "node:util";
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";
import { spawn } from "node:child_process";
import { validateEnvironment } from "../apps/web/environment.mjs";

const root = fileURLToPath(new URL("../", import.meta.url));
const web = resolve(root, "apps/web");
const [target, command, ...args] = process.argv.slice(2);
try {
  if (
    !["dev", "prod"].includes(target) ||
    !["dev", "build", "start", "check"].includes(command)
  ) {
    throw new Error(
      "Usage: node scripts/web.mjs <dev|prod> <dev|build|start|check> [Next.js arguments]",
    );
  }
  if (target === "prod" && command === "dev")
    throw new Error("The development server cannot target production.");
  // Avoid Next.js auto-loading a second, ambiguous set of credentials.
  const ambiguous = [
    ".env",
    ".env.local",
    ".env.development",
    ".env.development.local",
    ".env.production",
    ".env.production.local",
  ];
  if (ambiguous.some((name) => existsSync(resolve(web, name)))) {
    throw new Error(
      "Move apps/web/.env* credentials into root .env.dev.local or .env.prod.local. Mixed env loading is disabled.",
    );
  }
  const envPath = resolve(root, `.env.${target}.local`);
  const local = existsSync(envPath)
    ? parseEnv(readFileSync(envPath, "utf8"))
    : {};
  const env = {
    ...process.env,
    ...local,
    MBF_ENV: target,
    NEXT_PUBLIC_APP_ENV: target,
  };
  // Explicit blanks also prevent Next.js dotenv fallbacks.
  for (const name of [
    "SUPABASE_PROJECT_REF",
    "NEXT_PUBLIC_SUPABASE_URL",
    "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
  ])
    env[name] ??= "";
  validateEnvironment(env);
  console.log(
    `[MBF] ${target} / ${command} / Supabase: ${env.SUPABASE_PROJECT_REF ? "configured" : "not connected (UI preview)"}`,
  );
  const output = resolve(web, target === "prod" ? ".next-prod" : ".next-dev");
  const manifestPath = resolve(output, "mbf-environment.json");
  const fingerprint = createHash("sha256")
    .update(
      JSON.stringify({
        target,
        ref: env.SUPABASE_PROJECT_REF,
        url: env.NEXT_PUBLIC_SUPABASE_URL,
        key: env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
      }),
    )
    .digest("hex");
  if (command === "start") {
    if (
      !existsSync(manifestPath) ||
      JSON.parse(readFileSync(manifestPath, "utf8")).fingerprint !== fingerprint
    ) {
      throw new Error(
        "Build environment does not match the current environment. Rebuild this target before starting.",
      );
    }
  }
  if (command !== "check") {
    const next = resolve(root, "node_modules/next/dist/bin/next");
    const child = spawn(process.execPath, [next, command, ...args], {
      cwd: web,
      env,
      stdio: "inherit",
    });
    child.on("error", (error) => {
      console.error(error.message);
      process.exitCode = 1;
    });
    child.on("exit", (code) => {
      if (code === 0 && command === "build")
        writeFileSync(
          manifestPath,
          JSON.stringify({ target, fingerprint }, null, 2) + "\n",
        );
      process.exitCode = code ?? 1;
    });
  }
} catch (error) {
  console.error(`[MBF] ${error.message}`);
  process.exitCode = 1;
}
