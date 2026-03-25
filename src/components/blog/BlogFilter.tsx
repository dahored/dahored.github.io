'use client';

import { useState } from 'react';
import { LayoutGrid } from 'lucide-react';
import PostCard from '@/components/blog/PostCard';
import type { PostMeta } from '@/lib/blog';
import { CATEGORY_REGISTRY } from '@/lib/categories';

interface BlogFilterProps {
  posts: PostMeta[];
  locale: string;
  labels: {
    all: string;
    allPostsCount: string;
  };
}

export default function BlogFilter({ posts, locale, labels }: BlogFilterProps) {
  const [active, setActive] = useState<string>('all');

  // Collect unique categories present in posts, preserving first-seen order
  const presentCategories = Array.from(new Set(posts.map((p) => p.category).filter(Boolean)));

  const filtered = active === 'all' ? posts : posts.filter((p) => p.category === active);
  const lang = locale === 'en' ? 'en' : 'es';

  return (
    <div className="flex flex-col gap-8">
      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2">
        {/* All */}
        <button
          onClick={() => setActive('all')}
          className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium transition-all cursor-pointer"
          style={
            active === 'all'
              ? { background: '#6366f1', border: '1px solid #6366f1', color: '#fff' }
              : { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: '#6e6e73' }
          }
        >
          <LayoutGrid className="w-3.5 h-3.5" />
          {labels.all}
        </button>

        {/* Dynamic categories */}
        {presentCategories.map((cat) => {
          const def = CATEGORY_REGISTRY[cat];
          if (!def) return null;
          const { icon: Icon, label, color } = def;
          const displayLabel = label[lang];
          const isActive = active === cat;
          return (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium transition-all cursor-pointer"
              style={
                isActive
                  ? { background: color, border: `1px solid ${color}`, color: '#fff' }
                  : { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: '#6e6e73' }
              }
            >
              <Icon className="w-3.5 h-3.5" />
              {displayLabel}
            </button>
          );
        })}
      </div>

      {/* Post count */}
      <p className="text-sm text-[#6e6e73]">
        {filtered.length} {labels.allPostsCount}
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
