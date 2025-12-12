"use client";

import Link from "next/link";
import { ShoppingCartSimpleIcon } from "@phosphor-icons/react";

type CartButtonProps = {
  itemsCount?: number;
  iconSize?: number;
  isDarkMode: boolean;
  showIndicator?: boolean;
};

const DEFAULT_ICON_SIZE = 20;

export default function CartButton({
  itemsCount = 0,
  iconSize = DEFAULT_ICON_SIZE,
  isDarkMode,
  showIndicator = false,
}: CartButtonProps) {
  const hasItems = !showIndicator && itemsCount > 0;
  const shouldShowBadge = hasItems || showIndicator;
  const showDotIndicator = showIndicator && !hasItems;
  const badgeBase =
    "absolute -top-0.5 -right-0.5 min-w-[18px] rounded-full border text-[10px] font-semibold leading-[14px] text-center px-1 opacity-80";
  const badgeClasses = isDarkMode
    ? "bg-[#c0392b] text-white border-gray-900"
    : "bg-[#c0392b] text-white border-white";
  const dotClasses = isDarkMode
    ? "absolute top-0.5 right-0.5 h-2.5 w-2.5 rounded-full border border-gray-900 bg-[#c0392b]"
    : "absolute top-0.5 right-0.5 h-2.5 w-2.5 rounded-full border border-white bg-[#c0392b]";

  return (
    <Link
      href="/cart"
      aria-label="Bag"
      className={`relative inline-flex items-center justify-center p-1.5 rounded-full transition ${
        isDarkMode ? "hover:text-gray-300" : "hover:text-gray-600"
      }`}
    >
      <ShoppingCartSimpleIcon size={iconSize} />
      {shouldShowBadge &&
        (showDotIndicator ? (
          <span className={dotClasses} />
        ) : (
          <span className={`${badgeBase} ${badgeClasses}`}>{itemsCount}</span>
        ))}
    </Link>
  );
}
