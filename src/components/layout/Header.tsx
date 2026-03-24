'use client';

import { useState, useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import { Menu, X, ChevronDown } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import Image from 'next/image';
import LocaleSwitcher from '@/components/ui/LocaleSwitcher';

interface SubItem { href: string; label: string }
interface NavLink { href: string; label: string; color: string; submenu?: SubItem[] }

export default function Header() {
  const t = useTranslations('nav');
  const rawPathname = usePathname();
  const pathname = rawPathname.replace(/^\/[a-z]{2}(\/|$)/, '/');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const [desktopOpen, setDesktopOpen] = useState<string | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') { setMobileOpen(false); setDesktopOpen(null); }
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const links: NavLink[] = [
    { href: '/developer',  label: t('developer'),  color: '#6366f1' },
    { href: '/gamer',      label: t('gamer'),       color: '#4ade80' },
    { href: '/coexist',    label: t('coexist'),     color: '#C8344A', submenu: [
      { href: '/coexist/posts', label: t('submenuPosts') },
    ]},
    { href: '/adventures', label: t('adventures'),  color: '#4ade80', submenu: [
      { href: '/adventures/posts', label: t('submenuPosts') },
    ]},
    { href: '/#contact',   label: t('contact'),     color: '#6366f1' },
  ];

  function handleMouseEnter(href: string) {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setDesktopOpen(href);
  }

  function handleMouseLeave() {
    closeTimer.current = setTimeout(() => setDesktopOpen(null), 150);
  }

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
            const hasSubmenu = !!link.submenu?.length;
            const isOpen = desktopOpen === link.href;

            return (
              <div
                key={link.href}
                className="relative"
                onMouseEnter={() => hasSubmenu && handleMouseEnter(link.href)}
                onMouseLeave={() => hasSubmenu && handleMouseLeave()}
              >
                <Link
                  href={link.href}
                  className={`inline-flex items-center gap-1 px-4 py-2 text-sm font-medium transition-colors ${
                    isActive ? 'text-[#f5f5f7]' : 'text-[#f5f5f7]/50 hover:text-[#f5f5f7]'
                  }`}
                >
                  <span>
                    {link.label}
                    {isActive && (
                      <span className="block h-0.5 mt-0.5 rounded-full" style={{ background: link.color }} />
                    )}
                  </span>
                  {hasSubmenu && (
                    <ChevronDown
                      className={`w-3 h-3 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                    />
                  )}
                </Link>

                {/* Dropdown */}
                {hasSubmenu && isOpen && (
                  <div
                    className="absolute top-full left-1/2 -translate-x-1/2 pt-2"
                    onMouseEnter={() => handleMouseEnter(link.href)}
                    onMouseLeave={handleMouseLeave}
                  >
                    <div
                      className="rounded-xl overflow-hidden py-1 min-w-40"
                      style={{ background: 'rgba(20,20,20,0.95)', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(16px)' }}
                    >
                      {link.submenu!.map((sub) => (
                        <Link
                          key={sub.href}
                          href={sub.href}
                          className="block px-4 py-2.5 text-sm text-[#f5f5f7]/60 hover:text-[#f5f5f7] hover:bg-white/5 transition-colors"
                          onClick={() => setDesktopOpen(null)}
                        >
                          {sub.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
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
            const hasSubmenu = !!link.submenu?.length;
            const expanded = mobileExpanded === link.href;

            return (
              <div key={link.href}>
                <div className="flex items-center">
                  <Link
                    href={link.href}
                    className={`flex-1 px-4 py-3 text-base font-medium transition-colors ${
                      isActive ? 'text-[#f5f5f7]' : 'text-[#f5f5f7]/50 hover:text-[#f5f5f7]'
                    }`}
                    onClick={() => !hasSubmenu && setMobileOpen(false)}
                  >
                    {link.label}
                  </Link>
                  {hasSubmenu && (
                    <button
                      className="px-3 py-3 text-[#f5f5f7]/40 hover:text-[#f5f5f7] transition-colors"
                      onClick={() => setMobileExpanded(expanded ? null : link.href)}
                    >
                      <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`} />
                    </button>
                  )}
                </div>
                {hasSubmenu && expanded && (
                  <div className="pl-6 pb-1 flex flex-col gap-0.5">
                    {link.submenu!.map((sub) => (
                      <Link
                        key={sub.href}
                        href={sub.href}
                        className="px-4 py-2 text-sm text-[#f5f5f7]/40 hover:text-[#f5f5f7] transition-colors"
                        onClick={() => { setMobileOpen(false); setMobileExpanded(null); }}
                      >
                        {sub.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      )}
    </header>
  );
}
