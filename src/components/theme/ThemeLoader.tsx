"use client";

import { useEffect } from "react";

const THEME_STORAGE_KEY = "theme";

function ensureThemePreference(): "light" | "dark" {
  if (typeof window === "undefined") return "light";

  const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
  if (storedTheme === "light" || storedTheme === "dark") {
    return storedTheme;
  }

  window.localStorage.setItem(THEME_STORAGE_KEY, "light");
  return "light";
}

export default function ThemeLoader() {
  useEffect(() => {
    const theme = ensureThemePreference();
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, []);

  return null;
}
