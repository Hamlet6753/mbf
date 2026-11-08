export function readableError(error: unknown): string {
  const value = error as { code?: string; message?: string; status?: number };
  const code = value?.code;
  const messages: Record<string, string> = {
    pkce_verifier_missing:
      "Open the email link in the same browser where you requested it. If your email is confirmed, sign in instead.",
    pkce_verifier_mismatch:
      "This link belongs to a different sign-in request. Request a new email and open the latest link in the same browser.",
    invalid_credentials: "Email or password is incorrect.",
    email_not_confirmed:
      "Confirm your email before signing in. You can request another confirmation below.",
    over_email_send_rate_limit:
      "Too many emails requested. Please wait before trying again.",
    over_request_rate_limit: "Too many requests. Please wait and try again.",
    email_address_not_authorized:
      "This development email service can only send to approved addresses. Contact the project owner.",
    email_address_invalid: "Enter a valid email address.",
    user_already_exists:
      "An account may already exist. Try signing in or resetting your password.",
    weak_password: "Choose a stronger password with at least 8 characters.",
    same_password: "Choose a password different from your current password.",
    otp_expired:
      "This link has expired or was already used. Request a new email.",
    flow_state_not_found:
      "Open the link in the browser where you requested it. If your email is confirmed, you can sign in instead.",
    bad_code_verifier:
      "Open the email link in the same browser and on the same device where you requested it.",
    "23505": "This username is already taken. Please choose another.",
    "23503":
      "One of the selected profile options is no longer available. Reload and try again.",
    "42501":
      "You do not have permission for this action. Please sign in again.",
    "23514":
      "Some profile information does not meet the database requirements.",
  };
  if (code && messages[code]) return messages[code];
  if (code === "P0001" && value.message && value.message.length < 220)
    return value.message;
  if (value.status === 413)
    return "This file is too large. Choose an image smaller than 5 MiB.";
  if (/fetch|network/i.test(value?.message || ""))
    return "Cannot reach the server. Check your connection and try again.";
  if (value?.message === "Supabase is not configured for this environment.")
    return value.message;
  return "Something went wrong. Please try again. Your password and session details are never displayed here.";
}

export function safeCallbackDestination(value: string | null) {
  return value === "/auth/reset-password" ? value : "/account";
}
