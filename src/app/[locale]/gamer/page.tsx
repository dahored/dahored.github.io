import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { Gamepad2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Gamer',
  description: 'Daho Gaming — streams, video game content and gaming community.',
};

export default async function GamerPage() {
  const t = await getTranslations('nav');
  const tc = await getTranslations('comingSoon');

  return (
    <main className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="text-center flex flex-col items-center gap-6">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(234,179,8,0.12)', border: '1px solid rgba(234,179,8,0.3)' }}>
          <Gamepad2 className="w-8 h-8 text-yellow-400" />
        </div>
        <h1 className="text-5xl sm:text-6xl font-bold text-[#f5f5f7]" style={{ letterSpacing: '-0.02em' }}>
          {t('gamer')}
        </h1>
        <p className="text-xl text-[#6e6e73] max-w-md">
          {tc('label')} — {tc('gamer')}
        </p>
      </div>
    </main>
  );
}
