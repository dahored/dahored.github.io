'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Copy, Check, Trash2, FolderOpen, ImageIcon } from 'lucide-react';

interface MediaItem {
  public_id: string;
  url: string;
  width: number;
  height: number;
  bytes: number;
  created_at: string;
  format: string;
  folder: string;
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('es', { day: 'numeric', month: 'short', year: '2-digit' });
}

export default function MediaPage() {
  const [images, setImages] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch('/api/admin/media')
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setImages(data);
        } else {
          setError('Error cargando imágenes');
        }
        setLoading(false);
      })
      .catch(() => {
        setError('Error conectando con Cloudinary');
        setLoading(false);
      });
  }, []);

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopied(url);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleDelete = async (item: MediaItem) => {
    if (!confirm(`¿Eliminar esta imagen?\n${item.public_id}`)) return;
    setDeleting(item.public_id);
    await fetch('/api/admin/media', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ public_id: item.public_id }),
    });
    setImages((prev) => prev.filter((i) => i.public_id !== item.public_id));
    setDeleting(null);
  };

  const filtered = search
    ? images.filter((i) => i.public_id.toLowerCase().includes(search.toLowerCase()))
    : images;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-base font-semibold">Media</h1>
            <p className="text-xs text-zinc-600 mt-0.5">
              {loading ? 'Cargando...' : `${images.length} imágenes en Cloudinary`}
            </p>
          </div>
          <Link
            href="/admin/media/new"
            className="flex items-center gap-1.5 px-4 py-2 bg-white text-black rounded-lg text-sm font-medium hover:bg-zinc-100 transition-colors"
          >
            <Plus size={14} />
            Generar / Subir
          </Link>
        </div>

        {/* Search */}
        {!loading && images.length > 0 && (
          <div className="mb-5">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por nombre..."
              className="w-full max-w-xs bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-violet-500 text-white placeholder-zinc-600"
            />
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mb-4 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-sm text-red-400">
            {error}
          </div>
        )}

        {/* Loading skeleton */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="aspect-video bg-zinc-900 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-zinc-800 rounded-xl">
            <ImageIcon size={32} className="mx-auto text-zinc-700 mb-3" />
            <p className="text-zinc-600 text-sm mb-4">
              {search ? `Sin resultados para "${search}"` : 'Sin imágenes en Cloudinary'}
            </p>
            {!search && (
              <Link
                href="/admin/media/new"
                className="text-violet-400 hover:text-violet-300 text-sm transition-colors"
              >
                Genera o sube la primera →
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {filtered.map((img) => (
              <div
                key={img.public_id}
                className={`group relative bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden transition-opacity ${
                  deleting === img.public_id ? 'opacity-30 pointer-events-none' : ''
                }`}
              >
                {/* Thumbnail */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img.url}
                  alt={img.public_id}
                  className="w-full aspect-video object-cover bg-zinc-800"
                  loading="lazy"
                />

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/75 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-3">
                  <button
                    onClick={() => copyUrl(img.url)}
                    className="flex items-center gap-1.5 w-full py-2 rounded-lg text-xs font-medium bg-white text-black hover:bg-zinc-100 transition-colors justify-center"
                  >
                    {copied === img.url ? (
                      <>
                        <Check size={12} /> Copiado
                      </>
                    ) : (
                      <>
                        <Copy size={12} /> Copiar URL
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => handleDelete(img)}
                    className="flex items-center gap-1.5 w-full py-2 rounded-lg text-xs font-medium bg-red-600/20 border border-red-600/30 text-red-400 hover:bg-red-600/30 transition-colors justify-center"
                  >
                    <Trash2 size={12} /> Eliminar
                  </button>
                </div>

                {/* Meta */}
                <div className="px-2.5 py-2">
                  <p className="text-xs text-zinc-400 truncate font-mono leading-tight">
                    {img.public_id.split('/').pop()}
                  </p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    {img.folder && (
                      <span className="flex items-center gap-0.5 text-xs text-zinc-600">
                        <FolderOpen size={10} />
                        {img.folder}
                      </span>
                    )}
                    <span className="text-xs text-zinc-700">{formatBytes(img.bytes)}</span>
                    <span className="text-xs text-zinc-700">·</span>
                    <span className="text-xs text-zinc-700">{formatDate(img.created_at)}</span>
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
