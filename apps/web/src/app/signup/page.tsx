import { AuthForm } from "@/components/auth-form";
export const metadata = {
  title: "Create Account",
  robots: { index: false, follow: false },
};
export default function Page() {
  return (
    <main id="main-content">
      <AuthForm mode="signup" />
    </main>
  );
}
