"use client";

import { useEffect, useState } from "react";
import { MoonStarsIcon, SunDimIcon } from "@phosphor-icons/react";
import { THEME_STORAGE_KEY } from "@/src/constants/general.constants";

const DEFAULT_ICON_SIZE = 20;

type ThemeButtonProps = {
  defaultTheme?: "light" | "dark";
  onThemeChange?: (mode: "light" | "dark") => void;
};

export default function ThemeButton({
  defaultTheme,
  onThemeChange,
}: ThemeButtonProps) {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    if (defaultTheme) {
      setTheme(defaultTheme);
    } else {
      const isDarkActive = document.documentElement.classList.contains("dark");
      setTheme(isDarkActive ? "dark" : "light");
    }
  }, [defaultTheme]);

  const handleThemeChange = (mode: "light" | "dark") => {
    setTheme(mode);
    document.documentElement.classList.toggle("dark", mode === "dark");
    window.localStorage.setItem(THEME_STORAGE_KEY, mode);
    onThemeChange?.(mode);
  };

  const isDarkMode = theme === "dark";

  return isDarkMode ? (
    <button
      aria-label="Switch to light theme"
      className="hover:text-gray-300 cursor-pointer"
      onClick={() => handleThemeChange("light")}
    >
      <SunDimIcon size={DEFAULT_ICON_SIZE} />
    </button>
  ) : (
    <button
      aria-label="Switch to dark theme"
      className="hover:text-gray-500 cursor-pointer"
      onClick={() => handleThemeChange("dark")}
    >
      <MoonStarsIcon size={DEFAULT_ICON_SIZE} />
    </button>
  );
}
