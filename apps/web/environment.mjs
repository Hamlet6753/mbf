/** Environment validation shared by the launcher and Next.js configuration. */
export const productionProjectRef = "cjzrnyvyhhkqircmehbi";
export const developmentProjectRef = "gawblqkuodzuerzirsyr";

/** @param {Record<string, string | undefined>} env */
export function validateEnvironment(env) {
  const target = env.MBF_ENV || "dev";
  if (!["dev", "prod"].includes(target))
    throw new Error("MBF_ENV must be dev or prod.");
  if (env.NEXT_PUBLIC_APP_ENV && env.NEXT_PUBLIC_APP_ENV !== target) {
    throw new Error("Public app environment does not match MBF_ENV.");
  }
  for (const [name, value] of Object.entries(env)) {
    if (!name.startsWith("NEXT_PUBLIC_")) continue;
    if (
      /SECRET|SERVICE_ROLE|DATABASE|PASSWORD|ACCESS_TOKEN/.test(name) ||
      value?.startsWith("sb_secret_")
    ) {
      throw new Error(
        "A server secret must not be exposed through NEXT_PUBLIC_ variables.",
      );
    }
  }
  const url = env.NEXT_PUBLIC_SUPABASE_URL?.trim() || "";
  const key = env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim() || "";
  const ref = env.SUPABASE_PROJECT_REF?.trim() || "";
  if (!url && !key && !ref && target === "dev") return target;
  if (!url || !key || !ref)
    throw new Error(
      "Set Supabase URL, publishable key and project ref together. Production requires all three.",
    );
  if (!/^[a-z]{20}$/.test(ref))
    throw new Error("Supabase project ref must contain 20 lowercase letters.");
  const expectedUrl = `https://${ref}.supabase.co`;
  if (url !== expectedUrl && url !== `${expectedUrl}/`)
    throw new Error("Supabase URL does not match the configured project ref.");
  if (target === "dev" && ref === productionProjectRef)
    throw new Error(
      "Development must never use the production Supabase project.",
    );
  if (target === "dev" && ref !== developmentProjectRef) {
    throw new Error(
      "Development must use the registered development Supabase project.",
    );
  }
  if (target === "prod" && ref !== productionProjectRef)
    throw new Error(
      "Production must use the registered production Supabase project.",
    );
  if (key.startsWith("sb_publishable_") && key.length > 20) return target;
  // Legacy anon keys are accepted only when their role and project match.
  try {
    const payload = JSON.parse(
      Buffer.from(key.split(".")[1], "base64url").toString("utf8"),
    );
    if (
      payload.role === "anon" &&
      payload.ref === ref &&
      key.split(".").length === 3
    )
      return target;
  } catch {
    /* Malformed key: report without echoing its value. */
  }
  throw new Error(
    "Use a Supabase publishable key or a matching legacy anon key; never a service-role key.",
  );
}
