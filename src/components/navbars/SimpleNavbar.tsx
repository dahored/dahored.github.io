"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  MoonStarsIcon,
  ShoppingCartSimpleIcon,
  SunDimIcon,
  UserIcon,
} from "@phosphor-icons/react";
import { NAV_LINKS } from "@/src/constants/links.constants";

const DEFAULT_ICON_SIZE_NAVBAR = 20;
const THEME_STORAGE_KEY = "theme";

export default function SimpleNavbar() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const pathname = usePathname();

  useEffect(() => {
    const isDarkActive = document.documentElement.classList.contains("dark");
    setTheme(isDarkActive ? "dark" : "light");
  }, []);

  const handleThemeChange = (mode: "light" | "dark") => {
    setTheme(mode);
    document.documentElement.classList.toggle("dark", mode === "dark");
    window.localStorage.setItem(THEME_STORAGE_KEY, mode);
  };

  const isDarkMode = theme === "dark";
  const inactiveLinkClass = isDarkMode
    ? "text-gray-300 hover:text-white"
    : "text-gray-800 hover:text-gray-500";
  const activeLinkClass = isDarkMode ? "text-white" : "text-black";

  return (
    <nav
      className={`w-full border-b top-0 left-0 z-50 ${
        isDarkMode ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 flex items-center gap-4 h-14">
        {/* Logo */}
        <div className="flex items-center shrink-0">
          <Link
            href="/"
            className={`text-xl cursor-pointer ${
              isDarkMode
                ? "text-white hover:text-gray-300"
                : "text-black hover:text-gray-600"
            }`}
            aria-label="DAHO home"
          >
            DAHO
          </Link>
        </div>

        {/* Center links */}
        <div className="flex-1 min-w-[240px] px-4">
          <ul className="flex flex-wrap justify-center gap-x-8 gap-y-2 text-sm font-medium">
            {NAV_LINKS.map(({ label, href }) => {
              const isActive = pathname === href;
              return (
                <li key={label}>
                  <Link
                    href={href}
                    className={`transition-colors ${
                      isActive ? activeLinkClass : inactiveLinkClass
                    }`}
                  >
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Right side */}
        <div
          className={`flex items-center space-x-4 text-lg shrink-0 ${
            isDarkMode ? "text-gray-200" : "text-gray-700"
          }`}
        >
          {isDarkMode ? (
            <button
              aria-label="Switch to light theme"
              className="hover:text-gray-300 cursor-pointer"
              onClick={() => handleThemeChange("light")}
            >
              <SunDimIcon size={DEFAULT_ICON_SIZE_NAVBAR} />
            </button>
          ) : (
            <button
              aria-label="Switch to dark theme"
              className="hover:text-gray-500 cursor-pointer"
              onClick={() => handleThemeChange("dark")}
            >
              <MoonStarsIcon size={DEFAULT_ICON_SIZE_NAVBAR} />
            </button>
          )}
          <Link
            href="/cart"
            aria-label="Bag"
            className={`cursor-pointer ${
              isDarkMode ? "hover:text-gray-300" : "hover:text-gray-500"
            }`}
          >
            <ShoppingCartSimpleIcon size={DEFAULT_ICON_SIZE_NAVBAR} />
          </Link>
          <Link
            href="/profile"
            aria-label="Profile"
            className={`cursor-pointer ${
              isDarkMode ? "hover:text-gray-300" : "hover:text-gray-500"
            }`}
          >
            <UserIcon size={DEFAULT_ICON_SIZE_NAVBAR} />
          </Link>
        </div>
      </div>
    </nav>
  );
}
