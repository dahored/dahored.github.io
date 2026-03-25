'use client';

import { useState } from 'react';
import PostCard from '@/components/blog/PostCard';
import type { PostMeta } from '@/lib/blog';

interface BlogFilterProps {
  posts: PostMeta[];
  locale: string;
  labels: {
    all: string;
    ia: string;
    desarrollo: string;
    herramientas: string;
    allPostsCount: string;
  };
}

const CATEGORIES = ['all', 'ia', 'desarrollo', 'herramientas'] as const;
type Category = (typeof CATEGORIES)[number];

export default function BlogFilter({ posts, locale, labels }: BlogFilterProps) {
  const [active, setActive] = useState<Category>('all');

  const filtered = active === 'all' ? posts : posts.filter((p) => p.category === active);

  const categoryLabel: Record<Category, string> = {
    all: labels.all,
    ia: labels.ia,
    desarrollo: labels.desarrollo,
    herramientas: labels.herramientas,
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActive(cat)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
              active === cat
                ? 'text-white'
                : 'text-[#6e6e73] hover:text-[#f5f5f7]'
            }`}
            style={
              active === cat
                ? { background: '#6366f1', border: '1px solid #6366f1' }
                : { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }
            }
          >
            {categoryLabel[cat]}
          </button>
        ))}
      </div>

      {/* Post count */}
      <p className="text-sm text-[#6e6e73]">
        {labels.allPostsCount.replace('{n}', String(filtered.length))}
      </p>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((post) => (
          <PostCard key={post.slug} post={post} locale={locale} />
        ))}
      </div>
    </div>
  );
}
