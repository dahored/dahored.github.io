import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { ArrowLeft } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import postsData from '@/data/coexist-posts.json';
import { site } from '@/config/site';

interface Post {
  id: number;
  slug: string;
  topic: string;
  default_phrase?: string;
  meta_content: string;
  media_path_remote: string;
  hashtags_instagram?: string[];
}

interface Props {
  params: Promise<{ slug: string; locale: string }>;
}

function getPost(slug: string): Post | null {
  return (postsData.posts as Post[]).find(p => p.slug === slug) ?? null;
}

export async function generateStaticParams() {
  return (postsData.posts as Post[]).map(p => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, locale } = await params;
  const post = getPost(slug);
  if (!post) return {};

  const title = post.default_phrase?.slice(0, 60) ?? post.topic;
  const description = post.meta_content?.slice(0, 155) ?? '';
  const url = `${site.siteUrl}/${locale}/coexist/${slug}`;

  return {
    title: `${title} | Coexist by Daho`,
    description,
    openGraph: {
      title,
      description,
      url,
      images: post.media_path_remote ? [{ url: post.media_path_remote }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: post.media_path_remote ? [post.media_path_remote] : [],
    },
  };
}

export default async function CoexistPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const t = await getTranslations('coexist');

  return (
    <div className="bg-zinc-950 min-h-screen pt-20">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">

        <Link
          href="/coexist"
          className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-white transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          {t('backToFeed')}
        </Link>

        {post.media_path_remote && (
          <div className="relative w-full aspect-square rounded-3xl overflow-hidden mb-8">
            <Image
              src={post.media_path_remote}
              alt={post.default_phrase || post.topic}
              fill
              className="object-cover"
              sizes="672px"
              priority
            />
          </div>
        )}

        <span className="text-xs font-semibold tracking-widest uppercase text-[#C8344A]">
          {post.topic}
        </span>

        {post.default_phrase && (
          <h1 className="mt-3 text-2xl sm:text-3xl font-bold text-white leading-snug" style={{ letterSpacing: '-0.02em' }}>
            {post.default_phrase}
          </h1>
        )}

        <p className="mt-6 text-base text-zinc-400 leading-relaxed">
          {post.meta_content}
        </p>

        {post.hashtags_instagram && post.hashtags_instagram.length > 0 && (
          <p className="mt-6 text-xs text-zinc-600 leading-relaxed">
            {post.hashtags_instagram.join(' ')}
          </p>
        )}

      </div>
    </div>
  );
}
