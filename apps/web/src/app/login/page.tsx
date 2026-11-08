import { AuthForm } from "@/components/auth-form";
export const metadata = {
  title: "Sign In",
  robots: { index: false, follow: false },
};
export default function Page() {
  return (
    <main id="main-content">
      <AuthForm mode="login" />
    </main>
  );
}
