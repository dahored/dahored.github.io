'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/navigation';
import { useRef, useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

const LOCALES = [
  { code: 'es', label: 'ES', flag: '🇪🇸' },
  { code: 'en', label: 'EN', flag: '🇺🇸' },
];

export default function LocaleSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const current = LOCALES.find((l) => l.code === locale) ?? LOCALES[0];

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  function switchLocale(code: string) {
    setOpen(false);
    router.replace(pathname, { locale: code });
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold tracking-widest uppercase text-zinc-400 hover:text-zinc-50 hover:bg-zinc-800/60 transition-colors border border-zinc-800/60 hover:border-zinc-700"
        aria-label="Switch language"
        aria-expanded={open}
      >
        <span>{current.flag}</span>
        <span>{current.label}</span>
        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div
          className="absolute right-0 top-full mt-2 w-28 rounded-2xl overflow-hidden z-50 py-1"
          style={{ background: '#1c1c1e', border: '1px solid rgba(255,255,255,0.1)' }}
        >
          {LOCALES.map(({ code, label, flag }) => (
            <button
              key={code}
              onClick={() => switchLocale(code)}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-semibold tracking-widest uppercase transition-colors hover:bg-white/8 cursor-pointer"
              style={{ color: code === locale ? '#a78bfa' : '#f5f5f7' }}
            >
              <span>{flag}</span>
              <span>{label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
