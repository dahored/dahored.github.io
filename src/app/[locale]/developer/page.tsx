import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { Code2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Developer',
  description: 'Senior Front End Developer — 10+ years building modern web and mobile products.',
};

export default async function DeveloperPage() {
  const t = await getTranslations('nav');

  return (
    <main className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="text-center flex flex-col items-center gap-6">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.3)' }}>
          <Code2 className="w-8 h-8 text-violet-400" />
        </div>
        <h1 className="text-5xl sm:text-6xl font-bold text-[#f5f5f7]" style={{ letterSpacing: '-0.02em' }}>
          {t('developer')}
        </h1>
        <p className="text-xl text-[#6e6e73] max-w-md">
          Coming soon — my full developer portfolio, projects and experience.
        </p>
      </div>
    </main>
  );
}
