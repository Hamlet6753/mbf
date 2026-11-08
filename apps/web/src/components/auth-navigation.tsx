"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth-provider";
import { getSupabase } from "@/lib/supabase/client";
import { readableError } from "@/lib/auth-errors";
export function AuthNavigation() {
  const { user, loading } = useAuth();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  async function signOut() {
    setBusy(true);
    setError("");
    try {
      const { error } = await getSupabase().auth.signOut();
      if (error) throw error;
      router.replace("/");
    } catch (error) {
      setError(readableError(error));
    } finally {
      setBusy(false);
    }
  }
  if (loading)
    return (
      <span className="muted small" role="status">
        Loading account...
      </span>
    );
  return (
    <div className="auth-navigation">
      {user ? (
        <>
          <Link className="button primary" href="/account">
            My Profile
          </Link>
          <button className="text-link" disabled={busy} onClick={signOut}>
            {busy ? "Signing out..." : "Sign Out"}
          </button>
        </>
      ) : (
        <>
          <Link href="/login">Log In</Link>
          <Link className="button primary" href="/signup">
            Create Profile
          </Link>
        </>
      )}
      {error && (
        <span className="form-error" role="alert">
          {error}
        </span>
      )}
    </div>
  );
}
