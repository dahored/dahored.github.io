'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';

export default function LocaleSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  function switchLocale() {
    const next = routing.locales.find((l) => l !== locale) ?? routing.defaultLocale;
    router.replace(pathname, { locale: next });
  }

  return (
    <button
      onClick={switchLocale}
      className="px-3 py-1.5 rounded-lg text-sm font-semibold tracking-widest uppercase text-zinc-400 hover:text-zinc-50 hover:bg-zinc-800/60 transition-colors border border-zinc-800/60 hover:border-zinc-700"
      aria-label="Switch language"
    >
      {locale === 'es' ? 'EN' : 'ES'}
    </button>
  );
}
