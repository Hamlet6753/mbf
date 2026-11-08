import { AuthForm } from "@/components/auth-form";
export const metadata = {
  title: "New Password",
  robots: { index: false, follow: false },
};
export default function Page() {
  return (
    <main id="main-content">
      <AuthForm mode="reset" />
    </main>
  );
}
