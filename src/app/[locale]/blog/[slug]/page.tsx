import { getTranslations } from 'next-intl/server';
import { site } from '@/config/site';
import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { Link } from '@/i18n/navigation';
import { ArrowLeft, Calendar, Clock } from 'lucide-react';
import { getCategory, CATEGORY_REGISTRY } from '@/lib/categories';
import AdUnit from '@/components/blog/AdUnit';
import { getAllSlugs, getAllPosts, getPost, getPostById, getPostIdBySlug } from '@/lib/blog';
import { routing } from '@/i18n/routing';
import PostCard from '@/components/blog/PostCard';

// Custom MDX image component
function BlogImage({ src, alt, title }: React.ImgHTMLAttributes<HTMLImageElement>) {
  const rawAlt = alt ?? '';
  const isFull = rawAlt.startsWith('full|');
  const isWide = rawAlt.startsWith('wide|');
  const cleanAlt = rawAlt.replace(/^(full|wide)\|\s*/, '');
  const imgClass = isFull ? 'img-full' : isWide ? 'img-wide' : '';
  // eslint-disable-next-line @next/next/no-img-element
  const imgEl = <img src={src} alt={cleanAlt} className={imgClass} />;
  if (title) {
    return (
      <span style={{ display: 'block' }}>
        {imgEl}
        <span style={{ display: 'block' }} className="text-center text-[0.8125rem] text-[#6e6e73] italic -mt-4 mb-7">
          {title}
        </span>
      </span>
    );
  }
  return imgEl;
}

const mdxComponents = { img: BlogImage };

interface Props {
  params: Promise<{ locale: string; slug: string }>;
}

export function generateStaticParams() {
  const slugs = getAllSlugs();
  const categories = Object.keys(CATEGORY_REGISTRY);
  const all = Array.from(new Set([...slugs, ...categories]));
  return routing.locales.flatMap((locale) =>
    all.map((slug) => ({ locale, slug }))
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = getPost(locale, slug);
  if (post) {
    // Resolve EN and ES versions via the shared post ID
    const postId = post.id;
    const enPost = locale === 'en' ? post : (postId ? getPostById('en', postId) : null);
    const esPost = locale === 'es' ? post : (postId ? getPostById('es', postId) : null);

    // Canonical always points to the English version (primary language)
    const canonicalSlug = enPost?.slug ?? slug;
    const canonicalLocale = enPost ? 'en' : locale;
    const canonical = `${site.siteUrl}/${canonicalLocale}/blog/${canonicalSlug}`;

    const languages: Record<string, string> = {};
    if (enPost) languages['en'] = `${site.siteUrl}/en/blog/${enPost.slug}`;
    if (esPost) languages['es'] = `${site.siteUrl}/es/blog/${esPost.slug}`;

    const ogImage = post.image || `${site.siteUrl}/images/og/og-cover.png`;
    return {
      title: post.title,
      description: post.description,
      alternates: {
        canonical,
        languages: Object.keys(languages).length > 0 ? languages : undefined,
      },
      openGraph: {
        title: post.title,
        description: post.description,
        type: 'article',
        publishedTime: post.date,
        tags: post.tags,
        url: canonical,
        images: [{ url: ogImage, width: 1200, height: 630, alt: post.title }],
      },
      twitter: {
        card: 'summary_large_image',
        title: post.title,
        description: post.description,
        images: [ogImage],
      },
    };
  }
  const cat = getCategory(slug, locale);
  if (cat.displayLabel) return { title: cat.displayLabel };
  return {};
}

function formatDate(date: string, locale: string): string {
  return new Date(date).toLocaleDateString(locale === 'es' ? 'es-ES' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default async function BlogSlugPage({ params }: Props) {
  const { locale, slug } = await params;

  // ── Try post first ──────────────────────────────────────────────
  let post = getPost(locale, slug);
  if (!post) {
    const id = getPostIdBySlug(slug);
    if (id) {
      const alternate = getPostById(locale, id);
      if (alternate) redirect(`/${locale}/blog/${alternate.slug}`);
    }
  }

  if (post) {
    const t = await getTranslations({ locale, namespace: 'blog' });
    const category = getCategory(post.category, locale);
    const { icon: CategoryIcon } = category;
    const canonical = `${site.siteUrl}/${locale}/blog/${slug}`;
    const ogImage = post.image || `${site.siteUrl}/images/og/og-cover.png`;

    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: post.title,
      description: post.description,
      image: ogImage,
      datePublished: post.date,
      dateModified: post.date,
      url: canonical,
      author: {
        '@type': 'Person',
        name: site.fullName,
        url: site.siteUrl,
      },
      publisher: {
        '@type': 'Person',
        name: site.fullName,
        url: site.siteUrl,
      },
      keywords: post.tags.join(', '),
      inLanguage: locale === 'en' ? 'en-US' : 'es-ES',
    };

    return (
      <main className="min-h-screen bg-black text-[#f5f5f7]">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <div className="pt-24 pb-6 px-4 sm:px-6">
          <div className="max-w-3xl mx-auto">
            <Link href="/blog" className="inline-flex items-center gap-1.5 text-sm text-[#6e6e73] hover:text-[#f5f5f7] transition-colors">
              <ArrowLeft className="w-4 h-4" />{t('backToBlog')}
            </Link>
          </div>
        </div>

        <header className="px-4 sm:px-6 pb-12">
          <div className="max-w-3xl mx-auto flex flex-col gap-5">
            <div className="flex flex-wrap items-center gap-3">
              <Link href={`/blog/${post.category}`} className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${category.bg} ${category.text} hover:opacity-80 transition-opacity`}>
                <CategoryIcon className="w-3 h-3" />{category.displayLabel}
              </Link>
              <span className="inline-flex items-center gap-1 text-sm text-[#6e6e73]"><Calendar className="w-3.5 h-3.5" />{formatDate(post.date, locale)}</span>
              <span className="inline-flex items-center gap-1 text-sm text-[#6e6e73]"><Clock className="w-3.5 h-3.5" />{post.readTime} min</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white leading-tight">{post.title}</h1>
            <p className="text-lg text-[#6e6e73] leading-relaxed">{post.description}</p>
            {post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span key={tag} className="text-xs text-[#6e6e73] px-2 py-0.5 rounded-md" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    #{tag}
                  </span>
                ))}
              </div>
            )}
            <div style={{ height: '1px', background: 'rgba(255,255,255,0.08)' }} />
          </div>
        </header>

        <article className="px-4 sm:px-6 pb-12">
          <div className="max-w-3xl mx-auto prose-blog">
            <MDXRemote source={post.content} components={mdxComponents} />
          </div>
        </article>

        <div className="max-w-3xl mx-auto px-4 sm:px-6 pb-12">
          <AdUnit format="horizontal" slot="post-bottom" />
        </div>

        {/* ── RELATED POSTS ─────────────────────────────────────────────────── */}
        {(() => {
          const related = getAllPosts(locale)
            .filter((p) => p.slug !== post.slug && p.category === post.category)
            .slice(0, 3);
          if (related.length === 0) return null;
          return (
            <div className="px-4 sm:px-6 pb-16" style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '3rem' }}>
              <div className="max-w-6xl mx-auto">
                <p className="text-xs font-semibold tracking-widest uppercase text-[#6e6e73] mb-6">{t('relatedPosts')}</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {related.map((p) => (
                    <PostCard key={p.slug} post={p} locale={locale} />
                  ))}
                </div>
              </div>
            </div>
          );
        })()}

        <div className="px-4 sm:px-6 pb-24">
          <div className="max-w-3xl mx-auto" style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '2rem' }}>
            <Link href="/blog" className="inline-flex items-center gap-1.5 text-sm text-[#6e6e73] hover:text-[#f5f5f7] transition-colors">
              <ArrowLeft className="w-4 h-4" />{t('backToBlog')}
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // ── Try category ────────────────────────────────────────────────
  const cat = getCategory(slug, locale);
  if (!cat.displayLabel) notFound();

  const t = await getTranslations({ locale, namespace: 'blog' });
  const { icon: CategoryIcon } = cat;
  const posts = getAllPosts(locale).filter((p) => p.category === slug);

  return (
    <main className="min-h-screen bg-black text-[#f5f5f7]">
      <section className="pt-40 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <Link href="/blog" className="inline-flex items-center gap-1.5 text-sm text-[#6e6e73] hover:text-[#f5f5f7] transition-colors mb-8">
            <ArrowLeft className="w-4 h-4" /> {t('backToBlog')}
          </Link>
          <div className="flex flex-col gap-4 max-w-2xl mt-4">
            <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold w-fit ${cat.bg} ${cat.text}`}>
              <CategoryIcon className="w-3 h-3" />{cat.displayLabel}
            </span>
            <h1 className="text-4xl sm:text-5xl font-bold text-white leading-tight">{cat.displayLabel}</h1>
            <p className="text-lg text-[#6e6e73]">{posts.length} {t('allPostsCount')}</p>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-24 flex flex-col gap-16">
        <AdUnit format="horizontal" slot="category-top" />

        {posts.length === 0 ? (
          <p className="text-[#6e6e73] text-center py-16">No hay posts en esta categoría todavía.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {posts.map((p) => (
              <PostCard key={p.slug} post={p} locale={locale} />
            ))}
          </div>
        )}

        <AdUnit format="horizontal" slot="category-bottom" />
      </div>
    </main>
  );
}
