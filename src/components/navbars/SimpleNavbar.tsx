"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  MoonStarsIcon,
  ShoppingCartSimpleIcon,
  SunDimIcon,
  UserIcon,
} from "@phosphor-icons/react";
import { NAV_MENU } from "@/src/constants/menu.constants";
import { THEME_STORAGE_KEY } from "@/src/constants/general.constants";

const DEFAULT_ICON_SIZE_NAVBAR = 20;

export default function SimpleNavbar() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [submenuHeight, setSubmenuHeight] = useState(0);
  const submenuContentRef = useRef<HTMLDivElement | null>(null);
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

  const handleMenuHover = (menuLabel: string, hasSubmenu?: boolean) => {
    if (hasSubmenu) {
      setActiveMenu(menuLabel);
    } else {
      setActiveMenu(null);
    }
  };

  const activeSubmenu = NAV_MENU.find(
    ({ label, submenus }) => label === activeMenu && submenus?.length
  );

  const isSubmenuOpen = Boolean(activeSubmenu);
  useEffect(() => {
    if (!activeSubmenu) {
      setSubmenuHeight(0);
    }
  }, [activeSubmenu]);

  useLayoutEffect(() => {
    if (!activeSubmenu) {
      return;
    }

    const node = submenuContentRef.current;
    if (!node) return;

    const updateHeight = () => {
      requestAnimationFrame(() => {
        setSubmenuHeight(node.scrollHeight * 2);
      });
    };

    updateHeight();

    const resizeObserver = new ResizeObserver(updateHeight);
    resizeObserver.observe(node);

    return () => {
      resizeObserver.disconnect();
    };
  }, [activeSubmenu]);

  const submenuBg = isDarkMode ? "bg-gray-900" : "bg-white";
  const submenuBorder = isDarkMode ? "border-gray-800" : "border-gray-200";
  const submenuBorderClass = isSubmenuOpen
    ? submenuBorder
    : "border-transparent";

  return (
    <div
      className="relative"
      onMouseLeave={() => setActiveMenu(null)}
      onBlur={(event) => {
        const nextTarget = event.relatedTarget as Node | null;
        if (!nextTarget || !event.currentTarget.contains(nextTarget)) {
          setActiveMenu(null);
        }
      }}
    >
      <nav
        className={`simple-navbar__menu fixed w-full border-b top-0 left-0 right-0 z-50 ${
          isDarkMode
            ? "bg-gray-900 border-gray-800"
            : "bg-white border-gray-200"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 flex items-center gap-4 h-14">
          {/* Logo */}
          <div className="flex items-center shrink-0">
            <Link
              href="/"
              className={`text-xl font-semibold cursor-pointer ${
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
              {NAV_MENU.map(({ label, href, submenus }) => {
                const isActive = pathname === href;
                const hasSubmenu = Boolean(submenus?.length);
                return (
                  <li
                    key={label}
                    onMouseEnter={() => handleMenuHover(label, hasSubmenu)}
                    onFocus={() => handleMenuHover(label, hasSubmenu)}
                  >
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
      <div className="h-14" aria-hidden />
      <div
        className={`fixed inset-x-0 top-14 bottom-0 z-40 transition-opacity duration-300 ${
          isSubmenuOpen
            ? "opacity-100 pointer-events-auto cursor-pointer"
            : "opacity-0 pointer-events-none"
        } ${
          isDarkMode
            ? "backdrop-blur-md bg-gray-900/10"
            : "backdrop-blur-md bg-white/30"
        }`}
        onMouseEnter={() => setActiveMenu(null)}
        aria-hidden="true"
      />
      <div
        className={`simple-navbar__submenu fixed left-0 top-14 w-full border-b overflow-hidden transition-[max-height] duration-500 ease-in-out z-50 ${submenuBg} ${submenuBorderClass} ${
          isSubmenuOpen ? "pointer-events-auto" : "pointer-events-none"
        }`}
        style={{
          maxHeight: isSubmenuOpen ? submenuHeight || 600 : 0,
        }}
        onMouseEnter={() => activeSubmenu && setActiveMenu(activeSubmenu.label)}
      >
        <div
          ref={submenuContentRef}
          className={`max-w-7xl mx-auto px-4 grid gap-8 sm:grid-cols-2 md:grid-cols-3 transition-all duration-300 ${
            isSubmenuOpen
              ? "opacity-100 translate-y-0 delay-200 py-8 pb-16"
              : "opacity-0 translate-y-4 delay-0 py-0"
          }`}
        >
          {activeSubmenu?.submenus?.map((section) => (
            <div key={section.label}>
              <p
                className={`text-sm ${
                  isDarkMode ? "text-gray-300" : "text-gray-500"
                }`}
              >
                {section.label}
              </p>
              <ul className="mt-4 space-y-2">
                {section.items.map((item) => {
                  const isExternal = item.href.startsWith("http");
                  const linkClasses = `block text-xl font-semibold ${
                    isDarkMode
                      ? "text-white hover:text-gray-300"
                      : "text-gray-900 hover:text-gray-600"
                  }`;
                  return (
                    <li key={item.label}>
                      {isExternal ? (
                        <a
                          href={item.href}
                          target="_blank"
                          rel="noreferrer"
                          className={linkClasses}
                        >
                          {item.label}
                        </a>
                      ) : (
                        <Link href={item.href} className={linkClasses}>
                          {item.label}
                        </Link>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
