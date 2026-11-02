"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="h-10 w-10 rounded-xl bg-emerald-100/60 dark:bg-emerald-950/40 border border-emerald-500/20" />
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="relative h-10 w-10 flex items-center justify-center rounded-xl bg-white dark:bg-[#0c120c] border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-500/15 hover:border-emerald-500 transition-all overflow-hidden shadow-sm active:scale-95 cursor-pointer"
      aria-label="Toggle theme"
      title={isDark ? "Switch to Light Theme" : "Switch to Dark Theme"}
    >
      {isDark ? (
        <Sun className="h-5 w-5 text-amber-400 animate-in spin-in-90 duration-300" />
      ) : (
        <Moon className="h-5 w-5 text-emerald-800 animate-in spin-in-90 duration-300" />
      )}
      <span className="sr-only">Toggle theme</span>
    </button>
  );
}
