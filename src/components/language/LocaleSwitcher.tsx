"use client";

import { CaretDownIcon, CheckIcon } from "@phosphor-icons/react";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";

const SUPPORTED_LOCALES = ["es", "en"] as const;
const LABELS: Record<(typeof SUPPORTED_LOCALES)[number], string> = {
  es: "ES",
  en: "EN",
};
const DROPDOWN_ICON_SIZE = 20;

export default function LocaleSwitcher() {
  const router = useRouter();
  const locale = useLocale();
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [isPending, startTransition] = useTransition();
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

  const handleChange = (newLocale: string) => {
    if (
      !SUPPORTED_LOCALES.includes(
        newLocale as (typeof SUPPORTED_LOCALES)[number]
      )
    ) {
      return;
    }

    document.cookie = `locale=${newLocale}; path=/; max-age=31536000`;

    startTransition(() => {
      router.refresh();
      setIsOpen(false);
    });
  };

  return (
    <div className="relative inline-flex text-sm" ref={wrapperRef}>
      <button
        type="button"
        disabled={isPending}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((prev) => !prev)}
        className={`inline-flex items-center gap-1 rounded-xl border px-4 py-2 font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-950 ${
          theme === "dark"
            ? isOpen
              ? "border-gray-600 bg-gray-800 text-gray-100 ring-gray-700"
              : "border-gray-700 bg-gray-900 text-gray-100 hover:border-gray-600"
            : isOpen
            ? "border-gray-400 bg-white text-gray-900 ring-gray-200"
            : "border-gray-300 bg-white text-gray-800 hover:border-gray-400"
        } ${isPending ? "cursor-not-allowed opacity-60" : ""}`}
        style={{ width: "4.5rem" }}
      >
        <span>{LABELS[locale as keyof typeof LABELS] ?? locale}</span>
        <CaretDownIcon size={DROPDOWN_ICON_SIZE} />
      </button>

      <div
        className={`absolute right-0 z-[60] min-w-[148px] rounded-xl border shadow-[0_15px_40px_rgba(15,23,42,0.35)] transition-all backdrop-blur-sm ${
          theme === "dark"
            ? "border-slate-700/70 bg-gray-900/90 text-gray-100"
            : "border-slate-300/80 bg-white/95 text-gray-900"
        } ${
          isOpen
            ? "pointer-events-auto opacity-100 translate-y-0"
            : "pointer-events-none opacity-0 -translate-y-1"
        }`}
        style={{ top: "calc(100% + 0.325rem)" }}
      >
        <ul role="listbox" className="py-2 space-y-1">
          {SUPPORTED_LOCALES.map((code) => {
            const isActive = locale === code;
            return (
              <li key={code}>
                <button
                  type="button"
                  role="option"
                  aria-selected={isActive}
                  className={`flex w-full items-center justify-between px-4 py-2 text-sm uppercase tracking-wide transition cursor-pointer ${
                    isActive
                      ? theme === "dark"
                        ? "bg-gray-800 text-white"
                        : "bg-gray-100 text-gray-900"
                      : theme === "dark"
                      ? "text-gray-200 hover:bg-gray-800/70"
                      : "text-gray-800 hover:bg-gray-100"
                  }`}
                  onClick={() => handleChange(code)}
                >
                  {LABELS[code]}
                  {isActive && (
                    <CheckIcon
                      size={16}
                      weight="bold"
                      className="text-current"
                    />
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
