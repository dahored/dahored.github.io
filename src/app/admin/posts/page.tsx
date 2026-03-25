'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface PostItem {
  slug: string;
  locale: string;
  title: string;
  date: string;
  category: string;
  featured?: boolean;
}

interface PairedPost {
  slug: string;
  date: string;
  category: string;
  es?: PostItem;
  en?: PostItem;
}

function pair(posts: PostItem[]): PairedPost[] {
  const map: Record<string, PairedPost> = {};
  for (const p of posts) {
    if (!map[p.slug]) map[p.slug] = { slug: p.slug, date: p.date, category: p.category };
    map[p.slug][p.locale as 'es' | 'en'] = p;
    // Keep latest date
    if (p.date > map[p.slug].date) map[p.slug].date = p.date;
  }
  return Object.values(map).sort((a, b) => b.date.localeCompare(a.date));
}

export default function PostsPage() {
  const [pairs, setPairs] = useState<PairedPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingSlug, setDeletingSlug] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/admin/posts')
      .then((r) => r.json())
      .then((data) => {
        setPairs(pair(data));
        setLoading(false);
      });
  }, []);

  const handleDelete = async (slug: string, locale?: 'es' | 'en') => {
    const label = locale ? `"${slug}" (${locale.toUpperCase()})` : `"${slug}" (ES + EN)`;
    if (!confirm(`¿Eliminar ${label}?`)) return;

    setDeletingSlug(slug);
    const localesToDelete = locale ? [locale] : (['es', 'en'] as const);

    for (const loc of localesToDelete) {
      await fetch('/api/admin/posts', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ locale: loc, slug }),
      }).catch(() => null);
    }

    setPairs((prev) =>
      prev
        .map((p) => {
          if (p.slug !== slug) return p;
          if (!locale) return null;
          const updated = { ...p };
          delete updated[locale];
          return updated;
        })
        .filter(Boolean) as PairedPost[]
    );
    setDeletingSlug(null);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="max-w-3xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-base font-semibold">Posts</h1>
            <p className="text-xs text-zinc-600 mt-0.5">{pairs.length} publicaciones</p>
          </div>
          <Link
            href="/admin/posts/new"
            className="px-4 py-2 bg-white text-black rounded-lg text-sm font-medium hover:bg-zinc-100 transition-colors"
          >
            + Nuevo post
          </Link>
        </div>

        {loading ? (
          <p className="text-zinc-600 text-sm">Cargando...</p>
        ) : pairs.length === 0 ? (
          <p className="text-zinc-700 text-sm text-center py-16 border border-dashed border-zinc-800 rounded-xl">
            Sin posts. Crea el primero.
          </p>
        ) : (
          <div className="space-y-2">
            {pairs.map((p) => (
              <div
                key={p.slug}
                className={`group bg-zinc-900/60 hover:bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 transition-colors ${
                  deletingSlug === p.slug ? 'opacity-40 pointer-events-none' : ''
                }`}
              >
                <div className="flex items-center justify-between gap-4">
                  {/* Title + meta */}
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-sm font-medium truncate max-w-[300px]">
                        {p.es?.title ?? p.en?.title ?? p.slug}
                      </span>
                      {(p.es?.featured || p.en?.featured) && (
                        <span className="shrink-0 text-xs px-1.5 py-0.5 bg-violet-500/15 text-violet-400 rounded border border-violet-500/20">
                          ★
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-zinc-600">
                      <span className="font-mono">{p.slug}</span>
                      <span>·</span>
                      <span>{p.date}</span>
                      <span>·</span>
                      <span>{p.category}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    {/* Locale pills */}
                    {(['es', 'en'] as const).map((loc) => {
                      const exists = !!p[loc];
                      return exists ? (
                        <Link
                          key={loc}
                          href={`/admin/posts/edit/${loc}/${p.slug}`}
                          className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors font-medium"
                        >
                          {loc.toUpperCase()}
                        </Link>
                      ) : (
                        <Link
                          key={loc}
                          href={`/admin/posts/new?slug=${p.slug}&locale=${loc}`}
                          className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg border border-dashed border-zinc-700 text-zinc-600 hover:border-zinc-500 hover:text-zinc-400 transition-colors font-medium"
                          title={`Crear versión en ${loc.toUpperCase()}`}
                        >
                          {loc.toUpperCase()} +
                        </Link>
                      );
                    })}

                    {/* Delete */}
                    <div className="relative group/del ml-1">
                      <button className="text-xs text-zinc-700 hover:text-red-400 px-2 py-1 rounded transition-colors">
                        ✕
                      </button>
                      {/* Dropdown on hover */}
                      <div className="absolute right-0 top-full mt-1 hidden group-hover/del:flex flex-col bg-zinc-900 border border-zinc-700 rounded-lg overflow-hidden shadow-xl z-10 min-w-[140px]">
                        {p.es && (
                          <button
                            onClick={() => handleDelete(p.slug, 'es')}
                            className="text-left text-xs px-3 py-2 text-zinc-400 hover:bg-zinc-800 hover:text-red-400 transition-colors"
                          >
                            Eliminar ES
                          </button>
                        )}
                        {p.en && (
                          <button
                            onClick={() => handleDelete(p.slug, 'en')}
                            className="text-left text-xs px-3 py-2 text-zinc-400 hover:bg-zinc-800 hover:text-red-400 transition-colors"
                          >
                            Eliminar EN
                          </button>
                        )}
                        {p.es && p.en && (
                          <>
                            <div className="border-t border-zinc-800" />
                            <button
                              onClick={() => handleDelete(p.slug)}
                              className="text-left text-xs px-3 py-2 text-red-600 hover:bg-red-500/10 hover:text-red-400 transition-colors"
                            >
                              Eliminar ambos
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
