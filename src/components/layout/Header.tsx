'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import Image from 'next/image';
import LocaleSwitcher from '@/components/ui/LocaleSwitcher';

export default function Header() {
  const t = useTranslations('nav');
  const rawPathname = usePathname();
  // Strip locale prefix e.g. /en/coexist → /coexist
  const pathname = rawPathname.replace(/^\/[a-z]{2}(\/|$)/, '/');
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setMobileOpen(false);
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const links = [
    { href: '/developer',  label: t('developer'),  color: '#6366f1' },
    { href: '/gamer',      label: t('gamer'),       color: '#4ade80' },
    { href: '/coexist',    label: t('coexist'),     color: '#C8344A' },
    { href: '/adventures', label: t('adventures'),  color: '#0ea5e9' },
    { href: '/#contact',   label: t('contact'),     color: '#6366f1' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="hover:opacity-80 transition-opacity">
          <Image
            src="/images/logo/logo_daho.png"
            alt="DAHO"
            width={100}
            height={40}
            className="h-10 w-auto"
            priority
          />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {links.map((link) => {
            const isActive = link.href !== '/#contact' && pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  isActive ? 'text-[#f5f5f7]' : 'text-[#f5f5f7]/50 hover:text-[#f5f5f7]'
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="block h-0.5 mt-0.5 rounded-full" style={{ background: link.color }} />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <LocaleSwitcher />
          <button
            className="md:hidden p-2 text-[#f5f5f7]/70 hover:text-[#f5f5f7] transition-colors"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <nav className="md:hidden bg-black/90 backdrop-blur-xl px-4 py-4 flex flex-col gap-1">
          {links.map((link) => {
            const isActive = link.href !== '/#contact' && pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-3 text-base font-medium transition-colors ${
                  isActive ? 'text-[#f5f5f7]' : 'text-[#f5f5f7]/50 hover:text-[#f5f5f7]'
                }`}
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      )}
    </header>
  );
}
