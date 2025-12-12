"use client";

import {
  SignOutIcon,
  UserCircleGearIcon,
  UserIcon,
  UserListIcon,
  WalletIcon,
} from "@phosphor-icons/react";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { PROFILE_MENU_ITEMS } from "@/src/constants/menu.constants";

const DROPDOWN_ICON_SIZE = 20;

const ICONS = {
  UserCircleGearIcon,
  UserListIcon,
  WalletIcon,
  SignOutIcon,
};

export default function ProfileMenu() {
  const tProfileMenuItems = useTranslations("ProfileMenu.items");
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    const updateTheme = () => {
      const isDarkActive = document.documentElement.classList.contains("dark");
      setTheme(isDarkActive ? "dark" : "light");
    };
    updateTheme();
    const observer = new MutationObserver(updateTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  const handleItemClick = (item: (typeof PROFILE_MENU_ITEMS)[number]) => {
    if (item.href) {
      window.location.href = item.href;
    } else if (item.action === "closeSession") {
      console.log("Close session");
    }
    setIsOpen(false);
  };

  return (
    <div className="relative inline-flex text-sm" ref={wrapperRef}>
      <UserIcon
        className="cursor-pointer"
        size={DROPDOWN_ICON_SIZE}
        onClick={() => setIsOpen((prev) => !prev)}
      />

      <div
        className={`absolute right-0 z-[60] min-w-[180px] rounded-xl border shadow-[0_15px_40px_rgba(15,23,42,0.35)] transition-all backdrop-blur-sm ${
          theme === "dark"
            ? "border-slate-700/70 bg-gray-900/90 text-gray-100"
            : "border-slate-300/80 bg-white/95 text-gray-900"
        } ${
          isOpen
            ? "pointer-events-auto opacity-100 translate-y-0"
            : "pointer-events-none opacity-0 -translate-y-1"
        }`}
        style={{ top: "calc(100% + 1rem)" }}
      >
        <ul role="menu" className="py-2 space-y-1">
          {PROFILE_MENU_ITEMS.map((item) => {
            const IconComponent =
              ICONS[item.icon as keyof typeof ICONS] ?? UserCircleGearIcon;
            const label = tProfileMenuItems(item.key);
            return (
              <li key={item.key}>
                <button
                  type="button"
                  className={`flex w-full items-center gap-2 px-4 py-2 text-sm font-medium transition cursor-pointer ${
                    theme === "dark"
                      ? "hover:bg-gray-800/70 text-gray-200"
                      : "hover:bg-gray-100 text-gray-800"
                  }`}
                  onClick={() => handleItemClick(item)}
                >
                  <IconComponent size={20} />
                  {label}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
