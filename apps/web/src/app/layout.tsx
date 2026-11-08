import { AuthProvider } from "@/components/auth-provider";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Header, Footer } from "@/components/site";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});
export const metadata: Metadata = {
  title: {
    default: "MusicBandFinder | Find Your Next Bandmate",
    template: "%s | MusicBandFinder",
  },
  description:
    "Discover musicians, find your next band, and showcase your sound. MusicBandFinder connects people through music.",
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        <AuthProvider>
          <Header />
          {children}
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
