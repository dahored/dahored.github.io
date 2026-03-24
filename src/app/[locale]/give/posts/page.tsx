import type { Metadata } from 'next';
import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { fetchInstagramPosts, getPostImage } from '@/lib/instagram';
import ScrollReveal from '@/components/ui/ScrollReveal';
import { ArrowLeft, Play } from 'lucide-react';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('give');
  return {
    title: t('allPostsTitle'),
    robots: { index: false, follow: false },
  };
}

export default async function GivePostsPage() {
  const t = await getTranslations('give');
  const igId = process.env.IG_PERSONAL_ID!;
  const posts = await fetchInstagramPosts(igId, 48).catch(() => []);

  return (
    <div className="bg-zinc-950 min-h-screen pt-24 pb-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">

        <div className="flex items-center gap-4 mb-10">
          <Link
            href="/give"
            className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            {t('backTo')}
          </Link>
        </div>

        <h1 className="text-4xl font-bold text-white mb-8" style={{ letterSpacing: '-0.02em' }}>
          {t('allPostsTitle')}
        </h1>

        {posts.length === 0 && (
          <p className="text-center text-zinc-500 py-24">{t('noPostsAvailable')}</p>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {posts.map(post => {
            const img = getPostImage(post);
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
                      alt={post.caption?.slice(0, 80) || 'Daho Give'}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      unoptimized
                    />
                  ) : (
                    <div className="w-full h-full" style={{ background: 'linear-gradient(135deg, #6d28d9 0%, #4c1d95 100%)' }} />
                  )}
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

      </div>
    </div>
  );
}
