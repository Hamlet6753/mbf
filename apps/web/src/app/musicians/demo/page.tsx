import { Suspense } from "react";
import { DemoProfile } from "@/components/demo-profile";
export const metadata = {
  title: "Demo Musician Profile",
  robots: { index: false, follow: false },
};
export default function DemoProfilePage() {
  return (
    <main id="main-content">
      <Suspense
        fallback={
          <p className="page-container loading-state" role="status">
            Loading demo profile...
          </p>
        }
      >
        <DemoProfile />
      </Suspense>
    </main>
  );
}
