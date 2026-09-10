import type { Metadata } from "next";
import { Fraunces, Inter, IBM_Plex_Mono } from "next/font/google";
import Link from "next/link";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ThemeToggle } from "@/components/ThemeToggle";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  weight: ["500", "600"],
});
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-plex-mono",
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Momentum",
  description: "Tasks, sorted by Work and Life — and a recap of what you actually got done.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable} ${plexMono.variable}`}>
      <body className="min-h-screen bg-paper font-body text-ink transition-colors dark:bg-paper dark:text-ink">
        <ThemeProvider>
          <div className="mx-auto flex min-h-screen max-w-2xl flex-col px-5 py-10 sm:px-8">
            <header className="mb-8 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-3">
              <Link href="/" className="font-display text-xl font-semibold text-ink dark:text-ink sm:text-2xl">
                Momentum
              </Link>
              <nav className="flex items-center gap-3 font-body text-sm sm:gap-4">
                <Link href="/" className="text-muted transition-colors hover:text-ink dark:text-muted dark:hover:text-ink">
                  Tasks
                </Link>
                <Link href="/habits" className="text-muted transition-colors hover:text-ink dark:text-muted dark:hover:text-ink">
                  Habits
                </Link>
                <Link href="/recap" className="text-muted transition-colors hover:text-ink dark:text-muted dark:hover:text-ink">
                  Recap
                </Link>
                <Link href="/settings" className="text-muted transition-colors hover:text-ink dark:text-muted dark:hover:text-ink">
                  Settings
                </Link>
                <ThemeToggle />
              </nav>
            </header>
            <main className="flex-1">{children}</main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
