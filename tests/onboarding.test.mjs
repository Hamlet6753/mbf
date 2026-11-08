import test from "node:test";
import assert from "node:assert/strict";
import {
  validateProfile,
  validateAvatar,
} from "../apps/web/src/lib/profile-validation.ts";
import {
  safeCallbackDestination,
  readableError,
} from "../apps/web/src/lib/auth-errors.ts";
const complete = {
  firstname: "Andrii",
  lastname: "",
  username: "andrii_test",
  place_id: "1",
  bio: "",
  experience: "",
  available: true,
  in_search: true,
};
test("drafts can be incomplete but publication requires all essential fields", () => {
  assert.equal(
    validateProfile(
      { ...complete, firstname: "", username: "", place_id: "" },
      [],
      [],
      [],
      false,
    ),
    "",
  );
  for (const patch of [{ firstname: "" }, { username: "" }, { place_id: "" }])
    assert.match(
      validateProfile({ ...complete, ...patch }, [1], [1], [1], true),
      /before publishing/,
    );
  assert.match(
    validateProfile(complete, [], [1], [1], true),
    /before publishing/,
  );
  assert.match(
    validateProfile(complete, [1], [], [1], true),
    /before publishing/,
  );
  assert.match(
    validateProfile(complete, [1], [1], [], true),
    /before publishing/,
  );
  assert.equal(validateProfile(complete, [1], [1], [1], true), "");
});
test("username format and field lengths are validated", () => {
  for (const username of ["ab", "bad/name", "UpperCase", "a".repeat(31)])
    assert.match(
      validateProfile({ ...complete, username }, [1], [1], [1], false),
      /Username/,
    );
  assert.match(
    validateProfile(
      { ...complete, bio: "a".repeat(3001) },
      [1],
      [1],
      [1],
      false,
    ),
    /too long/,
  );
});
test("avatar MIME and size boundaries agree with the bucket", () => {
  assert.equal(
    validateAvatar({ type: "image/png", size: 5 * 1024 * 1024 }),
    "",
  );
  assert.match(
    validateAvatar({ type: "image/png", size: 5 * 1024 * 1024 + 1 }),
    /5 MiB/,
  );
  assert.match(validateAvatar({ type: "image/svg+xml", size: 30 }), /JPEG/);
  assert.match(validateAvatar({ type: "image/jpeg", size: 0 }), /empty/);
});
test("callback redirects cannot leave the allowlisted local app routes", () => {
  assert.equal(
    safeCallbackDestination("/auth/reset-password"),
    "/auth/reset-password",
  );
  for (const destination of [
    null,
    "https://evil.invalid",
    "//evil.invalid",
    "javascript:alert(1)",
    "/account?next=https://evil.invalid",
  ])
    assert.equal(safeCallbackDestination(destination), "/account");
});
test("unknown auth errors do not echo credentials and token values", () => {
  const secret = "token-secret-fixture";
  assert.ok(!readableError({ message: secret }).includes(secret));
  assert.match(
    readableError({ code: "email_not_confirmed" }),
    /Confirm your email/,
  );
  assert.match(readableError({ code: "23505" }), /username/);
  assert.match(
    readableError({ code: "pkce_verifier_missing" }),
    /same browser/,
  );
});
