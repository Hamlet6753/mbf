import { Suspense } from "react";
import { PublicMusicianProfile } from "@/components/public-musician-profile";
export const metadata = { title: "Musician Profile" };
export default function Page() {
  return (
    <main id="main-content">
      <Suspense fallback={<p className="loading-state">Loading profile...</p>}>
        <PublicMusicianProfile />
      </Suspense>
    </main>
  );
}
