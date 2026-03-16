import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { Heart } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Coexist',
  description: 'Un espacio de motivación, ayuda y coexistir juntos.',
};

export default async function CoexistPage() {
  const t = await getTranslations('nav');

  return (
    <main className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="text-center flex flex-col items-center gap-6">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(236,72,153,0.12)', border: '1px solid rgba(236,72,153,0.3)' }}>
          <Heart className="w-8 h-8 text-pink-400" />
        </div>
        <h1 className="text-5xl sm:text-6xl font-bold text-[#f5f5f7]" style={{ letterSpacing: '-0.02em' }}>
          {t('coexist')}
        </h1>
        <p className="text-xl text-[#6e6e73] max-w-md">
          Coming soon — un espacio para coexistir juntos.
        </p>
      </div>
    </main>
  );
}
