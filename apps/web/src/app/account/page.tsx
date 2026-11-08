import { Suspense } from "react";
import { AccountProfile } from "@/components/account-profile";
export const metadata = {
  title: "My Musician Profile",
  robots: { index: false, follow: false },
};
export default function Page() {
  return (
    <main className="page-container account-page" id="main-content">
      <Suspense
        fallback={
          <p className="loading-state" role="status">
            Loading your profile...
          </p>
        }
      >
        <AccountProfile />
      </Suspense>
    </main>
  );
}
