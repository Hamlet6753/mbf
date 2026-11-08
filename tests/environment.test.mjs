import test from "node:test";
import assert from "node:assert/strict";
import {
  productionProjectRef,
  developmentProjectRef,
  validateEnvironment,
} from "../apps/web/environment.mjs";

const devRef = developmentProjectRef;
const key = "sb_publishable_test_fixture_only";
const configured = (target, ref) => ({
  MBF_ENV: target,
  NEXT_PUBLIC_APP_ENV: target,
  SUPABASE_PROJECT_REF: ref,
  NEXT_PUBLIC_SUPABASE_URL: `https://${ref}.supabase.co`,
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: key,
});

test("unconnected dev preview is allowed but unconfigured prod fails closed", () => {
  assert.equal(validateEnvironment({ MBF_ENV: "dev" }), "dev");
  assert.throws(() => validateEnvironment({ MBF_ENV: "prod" }), /Set Supabase/);
});
test("development cannot connect to production even with complete credentials", () => {
  assert.throws(
    () => validateEnvironment(configured("dev", productionProjectRef)),
    /Development must never/,
  );
});
test("production rejects a development project", () => {
  assert.throws(
    () => validateEnvironment(configured("prod", devRef)),
    /Production must use/,
  );
});
test("separate correctly configured projects are accepted", () => {
  assert.equal(validateEnvironment(configured("dev", devRef)), "dev");
  assert.equal(
    validateEnvironment(configured("prod", productionProjectRef)),
    "prod",
  );
});
test("mismatched URL and incomplete credentials are rejected", () => {
  assert.throws(
    () =>
      validateEnvironment({
        ...configured("dev", devRef),
        NEXT_PUBLIC_SUPABASE_URL: `https://${productionProjectRef}.supabase.co`,
      }),
    /URL does not match/,
  );
  assert.throws(
    () =>
      validateEnvironment({
        ...configured("dev", devRef),
        NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: "",
      }),
    /Set Supabase/,
  );
});
test("public server secrets and service-role keys are rejected without echoing values", () => {
  const secret = "sb_secret_sensitive_fixture";
  assert.throws(
    () =>
      validateEnvironment({
        ...configured("dev", devRef),
        NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: secret,
      }),
    (error) =>
      !error.message.includes(secret) && /server secret/.test(error.message),
  );
  assert.throws(
    () =>
      validateEnvironment({
        ...configured("dev", devRef),
        NEXT_PUBLIC_SERVICE_ROLE_KEY: "hidden",
      }),
    /server secret/,
  );
  const jwt = (role) =>
    `eyJhbGciOiJIUzI1NiJ9.${Buffer.from(JSON.stringify({ role, ref: devRef })).toString("base64url")}.fixture`;
  assert.throws(
    () =>
      validateEnvironment({
        ...configured("dev", devRef),
        NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: jwt("service_role"),
      }),
    /publishable key/,
  );
  assert.equal(
    validateEnvironment({
      ...configured("dev", devRef),
      NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: jwt("anon"),
    }),
    "dev",
  );
});
test("invalid environment names and public/private target mismatches are rejected", () => {
  assert.throws(
    () => validateEnvironment({ MBF_ENV: "staging" }),
    /must be dev or prod/,
  );
  assert.throws(
    () => validateEnvironment({ MBF_ENV: "dev", NEXT_PUBLIC_APP_ENV: "prod" }),
    /does not match/,
  );
});

test("unregistered development project is rejected", () => {
  assert.throws(
    () => validateEnvironment(configured("dev", "abcdefghijklmnopqrst")),
    /registered development/,
  );
});
