"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "@/components/theme-provider";
import { Sun, Moon } from "lucide-react";

interface ThemeToggleProps {
  className?: string;
  size?: "sm" | "default";
  showLabel?: boolean;
}

/**
 * Small accessible button to switch between day (light) and night (dark) modes.
 */
export function ThemeToggle({
  className = "",
  size = "sm",
  showLabel = false,
}: ThemeToggleProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = resolvedTheme === "dark";

  const toggleTheme = () => {
    const nextTheme = isDark ? "light" : "dark";
    setTheme(nextTheme);
  };

  const buttonSizeClasses =
    size === "sm"
      ? showLabel
        ? "h-8 px-2.5 text-xs gap-1.5"
        : "h-8 w-8 text-xs"
      : showLabel
      ? "h-9 px-3 text-xs gap-2"
      : "h-9 w-9 text-sm";

  // Prevent SSR hydration mismatch while keeping identical dimensions
  if (!mounted) {
    return (
      <button
        type="button"
        aria-label="Switch between day and night modes"
        disabled
        className={`inline-flex items-center justify-center rounded-lg border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 text-slate-400 opacity-60 ${buttonSizeClasses} ${className}`}
      >
        <Sun className="h-4 w-4 shrink-0" />
        {showLabel && <span>Mode</span>}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to day mode" : "Switch to night mode"}
      title={isDark ? "Switch to day mode (Light)" : "Switch to night mode (Dark)"}
      className={`group relative inline-flex items-center justify-center rounded-lg border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900/90 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-all duration-200 cursor-pointer active:scale-95 shadow-2xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50 shrink-0 ${buttonSizeClasses} ${className}`}
    >
      {isDark ? (
        <Sun className="h-4 w-4 text-amber-400 transition-transform duration-300 group-hover:rotate-45 shrink-0" />
      ) : (
        <Moon className="h-4 w-4 text-indigo-600 transition-transform duration-300 group-hover:-rotate-12 shrink-0" />
      )}
      {showLabel && (
        <span className="font-medium text-xs select-none">
          {isDark ? "Day Mode" : "Night Mode"}
        </span>
      )}
      <span className="sr-only">
        {isDark ? "Switch to day mode" : "Switch to night mode"}
      </span>
    </button>
  );
}

export default ThemeToggle;
