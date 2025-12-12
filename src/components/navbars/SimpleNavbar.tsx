"use client";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { NAV_MENU_ITEMS } from "@/src/constants/menu.constants";
import ThemeButton from "@/src/components/theme/ThemeButton";
import LocaleSwitcher from "../language/LocaleSwitcher";
import ProfileMenu from "../menus/ProfileMenu";
import CartButton from "../cart/CartButton";

const DEFAULT_ICON_SIZE_NAVBAR = 20;
const CART_COUNT_STORAGE_KEY = "cartItemsCount";

export default function SimpleNavbar() {
  const tMenuItems = useTranslations("Navbar.menu");
  const tSubmenuSections = useTranslations("Navbar.sections");
  const tSubmenuItems = useTranslations("Navbar.items");
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [submenuHeight, setSubmenuHeight] = useState(0);
  const [cartItemsCount, setCartItemsCount] = useState(0);
  const submenuContentRef = useRef<HTMLDivElement | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const isDarkActive = document.documentElement.classList.contains("dark");
    setTheme(isDarkActive ? "dark" : "light");
  }, []);

  useEffect(() => {
    const parseCartCount = (value: string | null) => {
      const parsed = Number(value ?? "0");
      return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
    };

    const updateCartCount = () => {
      if (typeof window === "undefined") return;
      const storedValue = window.localStorage.getItem(CART_COUNT_STORAGE_KEY);
      setCartItemsCount(parseCartCount(storedValue));
    };

    if (typeof window === "undefined") {
      return;
    }

    updateCartCount();
    const handleStorage = (event: StorageEvent) => {
      if (event.key === CART_COUNT_STORAGE_KEY) {
        setCartItemsCount(parseCartCount(event.newValue));
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const isDarkMode = theme === "dark";
  const inactiveLinkClass = isDarkMode
    ? "text-gray-300 hover:text-white"
    : "text-gray-800 hover:text-gray-500";
  const activeLinkClass = isDarkMode ? "text-white" : "text-black";

  const handleMenuHover = (menuKey: string, hasSubmenu?: boolean) => {
    if (hasSubmenu) {
      setActiveMenu(menuKey);
    } else {
      setActiveMenu(null);
    }
  };

  const activeSubmenu = NAV_MENU_ITEMS.find(
    ({ key, submenus }) => key === activeMenu && submenus?.length
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
        setSubmenuHeight(node.scrollHeight);
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
        className={`simple-navbar__menu background z-99 fixed w-full border-b top-0 left-0 right-0 z-50 ${
          isDarkMode
            ? "bg-gray-900 border-gray-800"
            : "bg-white border-gray-100"
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
              {NAV_MENU_ITEMS.map(({ key, href, submenus }) => {
                const isActive = pathname === href;
                const hasSubmenu = Boolean(submenus?.length);
                const label = tMenuItems(key);
                return (
                  <li
                    key={key}
                    onMouseEnter={() => handleMenuHover(key, hasSubmenu)}
                    onFocus={() => handleMenuHover(key, hasSubmenu)}
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
            <LocaleSwitcher />
            <ThemeButton onThemeChange={(mode) => setTheme(mode)} />
            <CartButton
              itemsCount={cartItemsCount}
              iconSize={DEFAULT_ICON_SIZE_NAVBAR}
              isDarkMode={isDarkMode}
            />
            <ProfileMenu />
          </div>
        </div>
      </nav>
      <div className="h-14" aria-hidden />
      <div
        className={`fixed inset-x-0 top-14 bottom-0 z-40 transition-opacity duration-500 ${
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
        className={`simple-navbar__submenu fixed left-0 top-14 w-full border-b overflow-hidden transition-[height] duration-500 ease-in-out z-50 ${submenuBg} ${submenuBorderClass} ${
          isSubmenuOpen ? "pointer-events-auto" : "pointer-events-none"
        }`}
        style={{
          height: isSubmenuOpen ? submenuHeight : 0,
        }}
        onMouseEnter={() => activeSubmenu && setActiveMenu(activeSubmenu.key)}
      >
        <div
          ref={submenuContentRef}
          className={`max-w-7xl mx-auto px-4 grid gap-8 py-0 pb-16 sm:grid-cols-2 md:grid-cols-3 transition-all duration-300 ${
            isSubmenuOpen
              ? "opacity-100 translate-y-0 delay-300"
              : "opacity-0 translate-y-4 delay-0"
          }`}
        >
          {activeSubmenu?.submenus?.map((section) => (
            <div key={section.key} className="pt-8">
              <p
                className={`text-sm ${
                  isDarkMode ? "text-gray-300" : "text-gray-500"
                }`}
              >
                {tSubmenuSections(section.key)}
              </p>
              <ul className="mt-4 space-y-2">
                {section.items.map((item) => {
                  const isExternal = item.href.startsWith("http");
                  const linkClasses = `block text-xl font-semibold ${
                    isDarkMode
                      ? "text-white hover:text-gray-300"
                      : "text-gray-900 hover:text-gray-600"
                  }`;
                  const label = tSubmenuItems(item.key);
                  return (
                    <li key={item.key}>
                      {isExternal ? (
                        <a
                          href={item.href}
                          target="_blank"
                          rel="noreferrer"
                          className={linkClasses}
                        >
                          {label}
                        </a>
                      ) : (
                        <Link href={item.href} className={linkClasses}>
                          {label}
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
