import { Suspense } from "react";
import { MusicianDirectory } from "@/components/musician-directory";
export const metadata = { title: "Find Musicians" };
export default function MusiciansPage() {
  return (
    <main id="main-content" className="page-container directory-page">
      <Suspense
        fallback={
          <p className="loading-state" role="status">
            Loading musician directory...
          </p>
        }
      >
        <MusicianDirectory />
      </Suspense>
    </main>
  );
}
