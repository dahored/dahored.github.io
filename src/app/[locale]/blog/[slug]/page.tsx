import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { Link } from '@/i18n/navigation';
import { ArrowLeft, Brain, Code2, Wrench, Calendar, Clock } from 'lucide-react';
import AdUnit from '@/components/blog/AdUnit';
import { getAllSlugs, getPost } from '@/lib/blog';
import { routing } from '@/i18n/routing';

interface Props {
  params: Promise<{ locale: string; slug: string }>;
}

export function generateStaticParams() {
  const slugs = getAllSlugs();
  return routing.locales.flatMap((locale) =>
    slugs.map((slug) => ({ locale, slug }))
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = getPost(locale, slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      publishedTime: post.date,
      tags: post.tags,
    },
  };
}

const categoryColors: Record<string, { bg: string; text: string; label: string; Icon: React.ElementType }> = {
  ia:           { bg: 'bg-violet-500/10', text: 'text-violet-400', label: 'IA',           Icon: Brain  },
  desarrollo:   { bg: 'bg-sky-500/10',    text: 'text-sky-400',    label: 'Desarrollo',   Icon: Code2  },
  herramientas: { bg: 'bg-amber-500/10',  text: 'text-amber-400',  label: 'Herramientas', Icon: Wrench },
};

function formatDate(date: string, locale: string): string {
  return new Date(date).toLocaleDateString(locale === 'es' ? 'es-ES' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default async function BlogPostPage({ params }: Props) {
  const { locale, slug } = await params;
  const post = getPost(locale, slug);
  if (!post) notFound();

  const t = await getTranslations({ locale, namespace: 'blog' });
  const category = categoryColors[post.category] ?? {
    bg: 'bg-zinc-500/10',
    text: 'text-zinc-400',
    label: post.category,
    Icon: Wrench,
  };
  const { Icon: CategoryIcon } = category;

  return (
    <main className="min-h-screen bg-black text-[#f5f5f7]">
      {/* Back button */}
      <div className="pt-24 pb-6 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-sm text-[#6e6e73] hover:text-[#f5f5f7] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />{t('backToBlog')}
          </Link>
        </div>
      </div>

      {/* Post header */}
      <header className="px-4 sm:px-6 pb-12">
        <div className="max-w-3xl mx-auto flex flex-col gap-5">
          <div className="flex flex-wrap items-center gap-3">
            <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${category.bg} ${category.text}`}>
              <CategoryIcon className="w-3 h-3" />{category.label}
            </span>
            <span className="inline-flex items-center gap-1 text-sm text-[#6e6e73]"><Calendar className="w-3.5 h-3.5" />{formatDate(post.date, locale)}</span>
            <span className="inline-flex items-center gap-1 text-sm text-[#6e6e73]"><Clock className="w-3.5 h-3.5" />{post.readTime} min</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold text-white leading-tight">
            {post.title}
          </h1>
          <p className="text-lg text-[#6e6e73] leading-relaxed">
            {post.description}
          </p>

          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs text-[#6e6e73] px-2 py-0.5 rounded-md"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.06)' }}
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Divider */}
          <div style={{ height: '1px', background: 'rgba(255,255,255,0.08)' }} />
        </div>
      </header>

      {/* Ad — before content */}
      <div className="px-4 sm:px-6 pb-8">
        <div className="max-w-3xl mx-auto">
          <AdUnit format="horizontal" slot="post-top" />
        </div>
      </div>

      {/* MDX content */}
      <article className="px-4 sm:px-6 pb-12">
        <div className="max-w-3xl mx-auto prose-blog">
          <MDXRemote source={post.content} />
        </div>
      </article>

      {/* Ad — after content */}
      <div className="px-4 sm:px-6 pb-12">
        <div className="max-w-3xl mx-auto">
          <AdUnit format="horizontal" slot="post-bottom" />
        </div>
      </div>

      {/* Bottom back link */}
      <div className="px-4 sm:px-6 pb-24">
        <div className="max-w-3xl mx-auto" style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '2rem' }}>
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-sm text-[#6e6e73] hover:text-[#f5f5f7] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />{t('backToBlog')}
          </Link>
        </div>
      </div>
    </main>
  );
}
