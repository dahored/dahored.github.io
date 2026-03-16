'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Menu, X } from 'lucide-react';
import LocaleSwitcher from '@/components/ui/LocaleSwitcher';

interface NavLink {
  href: string;
  label: string;
}

function DahoWordmark({ className = '' }: { className?: string }) {
  return (
    <a
      href="#hero"
      className={`font-semibold text-lg tracking-tight text-[#f5f5f7] hover:opacity-80 transition-opacity ${className}`}
    >
      DAHO
    </a>
  );
}

export default function Header() {
  const t = useTranslations('nav');
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 24);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const links: NavLink[] = [
    { href: '#about', label: t('about') },
    { href: '#worlds', label: t('worlds') },
    { href: '#projects', label: t('projects') },
    { href: '#blog', label: t('blog') },
    { href: '#contact', label: t('contact') },
  ];

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Wordmark */}
        <DahoWordmark />

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="px-4 py-2 text-sm font-medium text-[#f5f5f7]/70 hover:text-[#f5f5f7] transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <LocaleSwitcher />
          {/* Mobile hamburger */}
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
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="px-4 py-3 text-base font-medium text-[#f5f5f7]/70 hover:text-[#f5f5f7] transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}
