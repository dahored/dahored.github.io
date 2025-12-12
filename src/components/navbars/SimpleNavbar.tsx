"use client";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { NAV_MENU_ITEMS } from "@/src/constants/menu.constants";
import ThemeButton from "@/src/components/theme/ThemeButton";
import LocaleSwitcher from "../language/LocaleSwitcher";
import ProfileMenu from "../menus/ProfileMenu";
import CartButton from "../cart/CartButton";
import {
  CaretLeftIcon,
  CaretRightIcon,
  ListIcon,
  XIcon,
} from "@phosphor-icons/react";

const DEFAULT_ICON_SIZE_NAVBAR = 20;
const CART_COUNT_STORAGE_KEY = "cartItemsCount";

export default function SimpleNavbar() {
  const tMenuItems = useTranslations("Navbar.menu");
  const tSubmenuSections = useTranslations("Navbar.sections");
  const tSubmenuItems = useTranslations("Navbar.items");
  const tNav = useTranslations("Navbar");
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [submenuHeight, setSubmenuHeight] = useState(0);
  const [cartItemsCount, setCartItemsCount] = useState(0);
  const [isResponsiveMenuOpen, setIsResponsiveMenuOpen] = useState(false);
  const [mobileActiveMenu, setMobileActiveMenu] = useState<string | null>(null);
  const submenuContentRef = useRef<HTMLDivElement | null>(null);
  const pathname = usePathname();
  const router = useRouter();

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
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between gap-4 h-14">
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
          <div
            id="simple-navbar-center-links"
            className="hidden md:flex flex-1 min-w-[240px] px-4 justify-center"
          >
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
            <button
              type="button"
              className="md:hidden"
              onClick={() => {
                setIsResponsiveMenuOpen(true);
                setMobileActiveMenu(null);
              }}
              aria-label="Open menu"
            >
              <ListIcon
                size={DEFAULT_ICON_SIZE_NAVBAR}
                className="cursor-pointer"
              />
            </button>
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
      <div
        className={`simple-navbar__responsive-menu fixed inset-0 z-[999] transition-opacity duration-300 ${
          isResponsiveMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        } ${isDarkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"}`}
        aria-hidden={!isResponsiveMenuOpen}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between px-4 h-14 dark:border-gray-800">
            <div className="flex items-center gap-2">
              {mobileActiveMenu && (
                <button
                  type="button"
                  className="flex items-center gap-2 text-sm uppercase tracking-wide cursor-pointer"
                  onClick={() => setMobileActiveMenu(null)}
                >
                  <CaretLeftIcon size={DEFAULT_ICON_SIZE_NAVBAR} />
                </button>
              )}
              <span className="relative inline-flex min-h-[24px] w-36 items-center overflow-hidden">
                <span
                  className={`absolute left-0 text-lg font-semibold transition-opacity duration-200 ${
                    mobileActiveMenu ? "opacity-0" : "opacity-100"
                  }`}
                >
                  {tNav("title")}
                </span>
                <span
                  className={`absolute left-0 text-lg font-semibold transition-opacity duration-200 ${
                    mobileActiveMenu ? "opacity-100" : "opacity-0"
                  }`}
                >
                  {mobileActiveMenu ? tMenuItems(mobileActiveMenu) : ""}
                </span>
              </span>
            </div>
            <button
              type="button"
              aria-label="Close menu"
              onClick={() => {
                setIsResponsiveMenuOpen(false);
                setMobileActiveMenu(null);
              }}
            >
              <XIcon
                size={DEFAULT_ICON_SIZE_NAVBAR}
                className="cursor-pointer"
              />
            </button>
          </div>
          <div className="relative flex-1 overflow-hidden px-4 py-4">
            <div
              className={`absolute inset-0 transition-transform duration-300 ease-in-out ${
                mobileActiveMenu ? "-translate-x-full" : "translate-x-0"
              }`}
            >
              <div className="h-full overflow-y-auto pt-8 px-4">
                <ul className="space-y-4 text-xl font-semibold">
                  {NAV_MENU_ITEMS.map(({ key, submenus, href }) => (
                    <li key={key}>
                      <button
                        type="button"
                        className="flex w-full items-center justify-between text-left cursor-pointer"
                        onClick={() => {
                          if (submenus?.length) {
                            setMobileActiveMenu(key);
                          } else if (href) {
                            setIsResponsiveMenuOpen(false);
                            setMobileActiveMenu(null);
                            router.push(href);
                          }
                        }}
                      >
                        {tMenuItems(key)}
                        {submenus?.length ? (
                          <CaretRightIcon
                            size={DEFAULT_ICON_SIZE_NAVBAR}
                            className="shrink-0 cursor-pointer"
                          />
                        ) : null}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div
              className={`absolute inset-0 transition-transform duration-300 ease-in-out ${
                mobileActiveMenu ? "translate-x-0" : "translate-x-full"
              }`}
            >
              <div className="h-full overflow-y-auto space-y-6 text-lg pt-8 px-4">
                {mobileActiveMenu ? (
                  NAV_MENU_ITEMS.find(
                    ({ key }) => key === mobileActiveMenu
                  )?.submenus?.map((section) => (
                    <div key={section.key} className="space-y-3">
                      <p className="text-sm tracking-wide text-gray-400">
                        {tSubmenuSections(section.key)}
                      </p>
                      <ul className="space-y-3">
                        {section.items.map((item) => (
                          <li key={item.key}>
                            {item.href.startsWith("http") ? (
                              <a
                                href={item.href}
                                target="_blank"
                                rel="noreferrer"
                                className="text-2xl font-semibold"
                              >
                                {tSubmenuItems(item.key)}
                              </a>
                            ) : (
                              <Link
                                href={item.href}
                                onClick={() => {
                                  setIsResponsiveMenuOpen(false);
                                  setMobileActiveMenu(null);
                                }}
                                className="text-2xl font-semibold cursor-pointer"
                              >
                                {tSubmenuItems(item.key)}
                              </Link>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Select a section to view more links.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
