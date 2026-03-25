import type { Metadata } from 'next';
import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { fetchInstagramPosts, getPostImage } from '@/lib/instagram';
import ScrollReveal from '@/components/ui/ScrollReveal';
import { ArrowLeft, Play } from 'lucide-react';
import AdUnit from '@/components/blog/AdUnit';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('coexist');
  return {
    title: t('allPostsTitle'),
    robots: { index: false, follow: false },
  };
}

export default async function CoexistPostsPage() {
  const t = await getTranslations('coexist');
  const igCoexistId = process.env.IG_COEXIST_ID!;
  const igPersonalId = process.env.IG_PERSONAL_ID!;

  const [coexistPosts, personalPosts] = await Promise.allSettled([
    fetchInstagramPosts(igCoexistId, 36),
    fetchInstagramPosts(igPersonalId, 36),
  ]);

  const fromCoexist  = coexistPosts.status  === 'fulfilled' ? coexistPosts.value  : [];
  const fromPersonal = personalPosts.status === 'fulfilled' ? personalPosts.value : [];

  // Merge & sort by timestamp, newest first
  const seen = new Set<string>();
  const allPosts = [...fromCoexist, ...fromPersonal]
    .filter(p => { if (seen.has(p.id)) return false; seen.add(p.id); return true; })
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return (
    <div className="bg-zinc-950 min-h-screen pt-24 pb-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">

        <div className="flex items-center gap-4 mb-10">
          <Link
            href="/coexist"
            className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            {t('backTo')}
          </Link>
        </div>

        <div className="flex items-end justify-between mb-8">
          <h1 className="text-4xl font-bold text-white" style={{ letterSpacing: '-0.02em' }}>
            {t('allPostsTitle')}
          </h1>
          <div className="flex items-center gap-2 text-xs text-zinc-500">
            <span className="w-2 h-2 rounded-full bg-rose-500 inline-block" />
            @daho.coexist
            <span className="w-2 h-2 rounded-full bg-zinc-400 inline-block ml-2" />
            @diego.hernandezorrego
          </div>
        </div>

        {allPosts.length === 0 && (
          <p className="text-center text-zinc-500 py-24">{t('noPostsAvailable')}</p>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {allPosts.map(post => {
            const img = getPostImage(post);
            const isPersonal = fromPersonal.some(p => p.id === post.id);
            return (
              <ScrollReveal key={post.id}>
                <a
                  href={post.permalink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative aspect-square rounded-2xl overflow-hidden block"
                >
                  {img ? (
                    <Image
                      src={img}
                      alt={post.caption?.slice(0, 80) || 'Daho Coexist'}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      unoptimized
                    />
                  ) : (
                    <div className="w-full h-full" style={{ background: 'linear-gradient(135deg, #C8344A 0%, #9b1c2e 100%)' }} />
                  )}
                  {/* Account badge */}
                  <span className="absolute top-2 left-2 text-white text-xs bg-black/60 px-2 py-0.5 rounded-full">
                    {isPersonal ? '@diego' : '@coexist'}
                  </span>
                  {post.media_type === 'VIDEO' && (
                    <span className="absolute top-2 right-2 flex items-center gap-1 text-white text-xs bg-black/60 px-2 py-0.5 rounded-full">
                      <Play className="w-3 h-3 fill-white" />
                    </span>
                  )}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                    <p className="text-white text-xs leading-snug line-clamp-3">{post.caption}</p>
                  </div>
                </a>
              </ScrollReveal>
            );
          })}
        </div>

        <div className="mt-12">
          <AdUnit format="horizontal" slot="posts-bottom" />
        </div>
      </div>
    </div>
  );
}
