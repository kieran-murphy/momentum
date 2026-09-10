"use client";

import { useEffect, useState } from "react";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Read stored preference or system preference
    const stored = localStorage.getItem("theme-preference");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const shouldBeDark = stored === "dark" || (stored === null && prefersDark);

    setIsDark(shouldBeDark);
    applyTheme(shouldBeDark);
    setMounted(true);
  }, []);

  const applyTheme = (dark: boolean) => {
    const html = document.documentElement;
    if (dark) {
      html.classList.add("dark");
    } else {
      html.classList.remove("dark");
    }
  };

  const toggleTheme = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    applyTheme(newIsDark);
    localStorage.setItem("theme-preference", newIsDark ? "dark" : "light");
  };

  // Store toggle in window for access from layout
  useEffect(() => {
    (window as any).__toggleTheme = toggleTheme;
  }, [toggleTheme]);

  if (!mounted) return null;
  return <>{children}</>;
}
