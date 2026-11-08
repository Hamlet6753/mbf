import { AuthForm } from "@/components/auth-form";
export const metadata = {
  title: "Reset Password",
  robots: { index: false, follow: false },
};
export default function Page() {
  return (
    <main id="main-content">
      <AuthForm mode="forgot" />
    </main>
  );
}
