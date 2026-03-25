'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Pencil, Trash2, Star, ChevronDown, FileText } from 'lucide-react';

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
    if (p.date > map[p.slug].date) map[p.slug].date = p.date;
  }
  return Object.values(map).sort((a, b) => b.date.localeCompare(a.date));
}

const CATEGORY_COLOR: Record<string, string> = {
  ia: 'text-violet-400 bg-violet-500/10 border-violet-500/20',
  desarrollo: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
  herramientas: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
};

export default function PostsPage() {
  const [pairs, setPairs] = useState<PairedPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingSlug, setDeletingSlug] = useState<string | null>(null);
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/admin/posts')
      .then((r) => r.json())
      .then((data) => {
        setPairs(pair(data));
        setLoading(false);
      });
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = () => setOpenMenu(null);
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, []);

  const handleDelete = async (slug: string, locale?: 'es' | 'en') => {
    const label = locale ? `"${slug}" (${locale.toUpperCase()})` : `"${slug}" (ES + EN)`;
    if (!confirm(`¿Eliminar ${label}?`)) return;

    setDeletingSlug(slug);
    setOpenMenu(null);
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
          if (!updated.es && !updated.en) return null;
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
            <p className="text-xs text-zinc-600 mt-0.5">
              {loading ? '...' : `${pairs.length} publicaciones`}
            </p>
          </div>
          <Link
            href="/admin/posts/new"
            className="flex items-center gap-1.5 px-4 py-2 bg-white text-black rounded-lg text-sm font-medium hover:bg-zinc-100 transition-colors"
          >
            <Plus size={14} />
            Nuevo post
          </Link>
        </div>

        {loading ? (
          <div className="space-y-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-16 bg-zinc-900/40 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : pairs.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-zinc-800 rounded-xl">
            <FileText size={32} className="mx-auto text-zinc-700 mb-3" />
            <p className="text-zinc-600 text-sm mb-4">Sin posts todavía</p>
            <Link
              href="/admin/posts/new"
              className="text-violet-400 hover:text-violet-300 text-sm transition-colors"
            >
              Crea el primero →
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            {pairs.map((p) => (
              <div
                key={p.slug}
                className={`bg-zinc-900/50 hover:bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 transition-colors ${
                  deletingSlug === p.slug ? 'opacity-40 pointer-events-none' : ''
                }`}
              >
                <div className="flex items-center justify-between gap-4">
                  {/* Info */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                      <span className="text-sm font-medium truncate max-w-[280px]">
                        {p.es?.title ?? p.en?.title ?? p.slug}
                      </span>
                      {(p.es?.featured || p.en?.featured) && (
                        <Star size={11} className="text-yellow-500 shrink-0" fill="currentColor" />
                      )}
                      <span
                        className={`text-xs px-1.5 py-0.5 rounded border font-mono ${
                          CATEGORY_COLOR[p.category] ?? 'text-zinc-500 bg-zinc-800 border-zinc-700'
                        }`}
                      >
                        {p.category}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-zinc-600">
                      <span className="font-mono">{p.slug}</span>
                      <span>·</span>
                      <span>{p.date}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    {/* Locale edit pills */}
                    {(['es', 'en'] as const).map((loc) =>
                      p[loc] ? (
                        <Link
                          key={loc}
                          href={`/admin/posts/edit/${loc}/${p.slug}`}
                          className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors font-medium"
                        >
                          <Pencil size={10} />
                          {loc.toUpperCase()}
                        </Link>
                      ) : (
                        <Link
                          key={loc}
                          href={`/admin/posts/new?slug=${p.slug}&locale=${loc}`}
                          className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg border border-dashed border-zinc-700 text-zinc-600 hover:border-violet-600/50 hover:text-violet-400 transition-colors font-medium"
                          title={`Crear en ${loc.toUpperCase()}`}
                        >
                          <Plus size={10} />
                          {loc.toUpperCase()}
                        </Link>
                      )
                    )}

                    {/* Delete dropdown */}
                    <div className="relative">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenMenu(openMenu === p.slug ? null : p.slug);
                        }}
                        className="flex items-center gap-0.5 text-zinc-600 hover:text-red-400 px-2 py-1.5 rounded-lg hover:bg-red-500/5 transition-colors"
                      >
                        <Trash2 size={13} />
                        <ChevronDown size={10} />
                      </button>

                      {openMenu === p.slug && (
                        <div
                          className="absolute right-0 top-full mt-1 bg-zinc-900 border border-zinc-700 rounded-xl overflow-hidden shadow-2xl z-20 min-w-[148px]"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {p.es && (
                            <button
                              onClick={() => handleDelete(p.slug, 'es')}
                              className="w-full text-left text-xs px-3 py-2.5 text-zinc-400 hover:bg-zinc-800 hover:text-red-400 transition-colors flex items-center gap-2"
                            >
                              <Trash2 size={11} /> Eliminar ES
                            </button>
                          )}
                          {p.en && (
                            <button
                              onClick={() => handleDelete(p.slug, 'en')}
                              className="w-full text-left text-xs px-3 py-2.5 text-zinc-400 hover:bg-zinc-800 hover:text-red-400 transition-colors flex items-center gap-2"
                            >
                              <Trash2 size={11} /> Eliminar EN
                            </button>
                          )}
                          {p.es && p.en && (
                            <>
                              <div className="border-t border-zinc-800" />
                              <button
                                onClick={() => handleDelete(p.slug)}
                                className="w-full text-left text-xs px-3 py-2.5 text-red-500 hover:bg-red-500/10 transition-colors flex items-center gap-2"
                              >
                                <Trash2 size={11} /> Eliminar ambos
                              </button>
                            </>
                          )}
                        </div>
                      )}
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

