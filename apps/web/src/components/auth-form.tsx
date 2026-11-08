"use client";
import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getSupabase } from "@/lib/supabase/client";
import { readableError } from "@/lib/auth-errors";
import { useAuth } from "@/components/auth-provider";

type Mode = "login" | "signup" | "forgot" | "reset";
export function AuthForm({ mode }: { mode: Mode }) {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const title = {
    login: "Welcome Back",
    signup: "Find Your People",
    forgot: "Reset Your Password",
    reset: "Choose a New Password",
  }[mode];
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    setError("");
    try {
      const supabase = getSupabase();
      if ((mode === "signup" || mode === "reset") && password !== confirmation)
        throw new Error("Passwords do not match.");
      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        });
        if (error) throw error;
        setPassword("");
        setConfirmation("");
        if (data.session) router.replace("/account");
        else
          setMessage(
            "Check your inbox for a confirmation link. Open it in this same browser. If you already have an account, sign in or reset your password.",
          );
      } else if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });
        if (error) throw error;
        setPassword("");
        router.replace("/account");
      } else if (mode === "forgot") {
        const { error } = await supabase.auth.resetPasswordForEmail(
          email.trim(),
          {
            redirectTo: `${window.location.origin}/auth/callback?next=/auth/reset-password`,
          },
        );
        if (error) throw error;
        setMessage(
          "If an account exists for this email, a reset link has been requested. Check your inbox and spam folder, and open the link in this browser.",
        );
      } else {
        const { error } = await supabase.auth.updateUser({ password });
        if (error) throw error;
        setPassword("");
        setConfirmation("");
        router.replace("/account?password=updated");
      }
    } catch (error) {
      setError(
        error instanceof Error && error.message === "Passwords do not match."
          ? error.message
          : readableError(error),
      );
    } finally {
      setBusy(false);
    }
  }
  async function resend() {
    if (!email.trim()) {
      setError("Enter your email address first.");
      return;
    }
    setBusy(true);
    setError("");
    setMessage("");
    try {
      const { error } = await getSupabase().auth.resend({
        type: "signup",
        email: email.trim(),
        options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
      });
      if (error) throw error;
      setMessage(
        "A confirmation email has been requested. Check your inbox and spam folder.",
      );
    } catch (error) {
      setError(readableError(error));
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="auth-page">
      <div className="panel auth-panel">
        <p className="eyebrow">MUSIC STARTS WITH A CONNECTION</p>
        <h1>{title}</h1>
        <p>
          {mode === "signup"
            ? "Create your account, then tell us about your sound. Your profile stays private until you publish it."
            : mode === "login"
              ? "Sign in to manage your musician profile."
              : "Use your email account to securely recover access."}
        </p>
        {mode === "reset" && loading ? (
          <p role="status">Checking your session...</p>
        ) : mode === "reset" && !user ? (
          <div className="form-message">
            <p>
              Open the password recovery email in the browser where you
              requested it.
            </p>
            <Link className="text-link" href="/forgot-password">
              Request a new link
            </Link>
          </div>
        ) : (
          <form className="profile-form" onSubmit={submit}>
            {mode !== "reset" && (
              <label>
                Email
                <input
                  type="email"
                  autoComplete="email"
                  name="email"
                  required
                  maxLength={254}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={busy}
                />
              </label>
            )}
            {mode !== "forgot" && (
              <label>
                {mode === "reset" ? "New password" : "Password"}
                <input
                  type="password"
                  name="password"
                  autoComplete={
                    mode === "login" ? "current-password" : "new-password"
                  }
                  required
                  minLength={mode === "login" ? 1 : 8}
                  maxLength={128}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={busy}
                />
                {mode !== "login" && (
                  <small>At least 8 characters. Use a unique password.</small>
                )}
              </label>
            )}
            {(mode === "signup" || mode === "reset") && (
              <label>
                Confirm password
                <input
                  type="password"
                  autoComplete="new-password"
                  required
                  minLength={8}
                  maxLength={128}
                  value={confirmation}
                  onChange={(e) => setConfirmation(e.target.value)}
                  disabled={busy}
                />
              </label>
            )}
            {error && (
              <p className="form-error" role="alert">
                {error}
              </p>
            )}
            {message && (
              <p className="form-message" role="status">
                {message}
              </p>
            )}
            <button
              className="button primary full-width"
              disabled={busy}
              type="submit"
            >
              {busy
                ? "Please wait..."
                : {
                    login: "Sign In",
                    signup: "Create Account",
                    forgot: "Send Reset Link",
                    reset: "Update Password",
                  }[mode]}
            </button>
            {(mode === "login" || mode === "signup") && (
              <button
                className="text-link"
                type="button"
                onClick={resend}
                disabled={busy}
              >
                Resend confirmation email
              </button>
            )}
          </form>
        )}
        <div className="auth-links">
          {mode !== "login" && <Link href="/login">Sign In</Link>}
          {mode !== "signup" && mode !== "reset" && (
            <Link href="/signup">Create Account</Link>
          )}
          {mode === "login" && (
            <Link href="/forgot-password">Forgot Password?</Link>
          )}
          {mode === "reset" && user && (
            <Link href="/account">Go to My Profile</Link>
          )}
        </div>
      </div>
    </div>
  );
}
