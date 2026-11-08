import { Suspense } from "react";
import { AuthCallback } from "@/components/auth-callback";
export const metadata = {
  title: "Confirm Email",
  robots: { index: false, follow: false },
  referrer: "no-referrer" as const,
};
export default function Page() {
  return (
    <main id="main-content">
      <Suspense
        fallback={<p className="loading-state">Checking confirmation...</p>}
      >
        <AuthCallback />
      </Suspense>
    </main>
  );
}
