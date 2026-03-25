import { Link } from '@/i18n/navigation';
import { ArrowRight } from 'lucide-react';
import type { PostMeta } from '@/lib/blog';

interface PostCardProps {
  post: PostMeta;
  locale: string;
  featured?: boolean;
}

const categoryColors: Record<string, { bg: string; text: string; label: string }> = {
  ia: {
    bg: 'bg-violet-500/10',
    text: 'text-violet-400',
    label: 'IA',
  },
  desarrollo: {
    bg: 'bg-sky-500/10',
    text: 'text-sky-400',
    label: 'Desarrollo',
  },
  herramientas: {
    bg: 'bg-amber-500/10',
    text: 'text-amber-400',
    label: 'Herramientas',
  },
};

function formatDate(date: string, locale: string): string {
  return new Date(date).toLocaleDateString(locale === 'es' ? 'es-ES' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default function PostCard({ post, locale, featured = false }: PostCardProps) {
  const category = categoryColors[post.category] ?? {
    bg: 'bg-zinc-500/10',
    text: 'text-zinc-400',
    label: post.category,
  };

  if (featured) {
    return (
      <Link
        href={`/blog/${post.slug}`}
        className="group block rounded-2xl p-8 transition-all hover:bg-white/[0.03]"
        style={{ border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.02)' }}
      >
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:gap-10">
          <div className="flex flex-col gap-4 flex-1">
            <div className="flex items-center gap-3">
              <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${category.bg} ${category.text}`}>
                {category.label}
              </span>
              <span className="text-xs text-[#6e6e73]">
                {formatDate(post.date, locale)}
              </span>
              <span className="text-xs text-[#6e6e73]">
                {post.readTime} min
              </span>
            </div>
            <h2 className="text-2xl font-bold text-[#f5f5f7] leading-tight group-hover:text-white transition-colors">
              {post.title}
            </h2>
            <p className="text-[#6e6e73] text-base leading-relaxed">
              {post.description}
            </p>
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
          </div>
          <div className="flex items-center gap-2 text-sm font-medium text-[#6366f1] group-hover:text-violet-400 transition-colors lg:mt-1 shrink-0">
            <span>Leer artículo</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex flex-col gap-4 rounded-2xl p-6 transition-all hover:bg-white/[0.03]"
      style={{ border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.02)' }}
    >
      <div className="flex items-center gap-2">
        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${category.bg} ${category.text}`}>
          {category.label}
        </span>
      </div>
      <h3 className="text-lg font-bold text-[#f5f5f7] leading-snug group-hover:text-white transition-colors">
        {post.title}
      </h3>
      <p className="text-sm text-[#6e6e73] leading-relaxed flex-1">
        {post.description}
      </p>
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-3 text-xs text-[#6e6e73]">
          <span>{formatDate(post.date, locale)}</span>
          <span>{post.readTime} min</span>
        </div>
        <ArrowRight className="w-4 h-4 text-[#6366f1] group-hover:translate-x-1 transition-transform" />
      </div>
    </Link>
  );
}
