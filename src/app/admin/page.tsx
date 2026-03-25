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

export default function AdminPage() {
  const [posts, setPosts] = useState<PostItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = () => {
    setLoading(true);
    fetch('/api/admin/posts')
      .then((r) => r.json())
      .then((data) => {
        setPosts(data);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleDelete = async (locale: string, slug: string, title: string) => {
    if (!confirm(`¿Eliminar "${title}" (${locale})?`)) return;
    await fetch('/api/admin/posts', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ locale, slug }),
    });
    setPosts((p) => p.filter((x) => !(x.slug === slug && x.locale === locale)));
  };

  const grouped = {
    es: posts.filter((p) => p.locale === 'es').sort((a, b) => b.date.localeCompare(a.date)),
    en: posts.filter((p) => p.locale === 'en').sort((a, b) => b.date.localeCompare(a.date)),
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header */}
      <div className="border-b border-zinc-800 px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold">dahoofficial.com · CMS</h1>
          <p className="text-xs text-zinc-600 mt-0.5">Solo disponible en local</p>
        </div>
        <Link
          href="/admin/new"
          className="px-4 py-2 bg-white text-black rounded-lg text-sm font-medium hover:bg-zinc-100 transition-colors"
        >
          + Nuevo post
        </Link>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-8">
        {loading ? (
          <p className="text-zinc-600 text-sm">Cargando posts...</p>
        ) : (
          <div className="space-y-10">
            {(['es', 'en'] as const).map((loc) => (
              <div key={loc}>
                <div className="flex items-center gap-3 mb-4">
                  <h2 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                    {loc === 'es' ? 'Español' : 'English'}
                  </h2>
                  <span className="text-xs text-zinc-700">
                    {grouped[loc].length} {grouped[loc].length === 1 ? 'post' : 'posts'}
                  </span>
                </div>

                {grouped[loc].length === 0 ? (
                  <p className="text-zinc-700 text-sm py-6 text-center border border-dashed border-zinc-800 rounded-xl">
                    Sin posts en {loc === 'es' ? 'español' : 'English'}
                  </p>
                ) : (
                  <div className="space-y-2">
                    {grouped[loc].map((post) => (
                      <div
                        key={post.slug}
                        className="flex items-center justify-between bg-zinc-900/60 hover:bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 transition-colors"
                      >
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium truncate max-w-[360px]">
                              {post.title}
                            </span>
                            {post.featured && (
                              <span className="shrink-0 text-xs px-1.5 py-0.5 bg-violet-500/15 text-violet-400 rounded border border-violet-500/20">
                                destacado
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 mt-0.5 text-xs text-zinc-600">
                            <span className="font-mono">{post.slug}</span>
                            <span>·</span>
                            <span>{post.date}</span>
                            <span>·</span>
                            <span>{post.category}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 ml-4 shrink-0">
                          <Link
                            href={`/admin/edit/${loc}/${post.slug}`}
                            className="text-xs text-zinc-500 hover:text-white px-3 py-1.5 rounded-lg hover:bg-zinc-800 transition-colors"
                          >
                            Editar
                          </Link>
                          <button
                            onClick={() => handleDelete(post.locale, post.slug, post.title)}
                            className="text-xs text-red-600 hover:text-red-400 px-3 py-1.5 rounded-lg hover:bg-red-500/10 transition-colors"
                          >
                            Eliminar
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
