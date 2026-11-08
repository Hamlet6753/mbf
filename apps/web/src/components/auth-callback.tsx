"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { exchangeAuthCode } from "@/lib/supabase/client";
import { readableError, safeCallbackDestination } from "@/lib/auth-errors";
export function AuthCallback() {
  const params = useSearchParams();
  const router = useRouter();
  const [error, setError] = useState("");
  const [initial] = useState(() => ({
    code: params.get("code"),
    next: params.get("next"),
    error: params.get("error"),
  }));
  useEffect(() => {
    let active = true;
    const code = initial.code;
    const fail = (message: string) => {
      if (active) {
        window.history.replaceState(null, "", "/auth/callback");
        setError(message);
      }
    };
    if (initial.error)
      fail("The email link is invalid or expired. Please request a new link.");
    else if (!code)
      fail(
        "No confirmation code was provided. Request a new email or sign in if your email is already confirmed.",
      );
    else
      void exchangeAuthCode(code)
        .then(({ error }) => {
          if (!active) return;
          if (error) fail(readableError(error));
          else router.replace(safeCallbackDestination(initial.next));
        })
        .catch((error) => fail(readableError(error)));
    return () => {
      active = false;
    };
  }, [initial, router]);
  return (
    <div className="auth-page">
      <div className="panel auth-panel">
        <h1>{error ? "Check Your Email Link" : "Confirming Your Email"}</h1>
        {error ? (
          <>
            <p className="form-error" role="alert">
              {error}
            </p>
            <div className="auth-links">
              <Link href="/login">Sign In / Resend Confirmation</Link>
              <Link href="/forgot-password">Reset Password</Link>
            </div>
          </>
        ) : (
          <p role="status">Securely completing sign-in...</p>
        )}
      </div>
    </div>
  );
}
