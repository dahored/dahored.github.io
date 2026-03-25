'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface MediaItem {
  public_id: string;
  url: string;
  width: number;
  height: number;
  bytes: number;
  created_at: string;
  format: string;
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

export default function MediaPage() {
  const [images, setImages] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/admin/media')
      .then((r) => r.json())
      .then((data) => {
        setImages(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopied(url);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleDelete = async (item: MediaItem) => {
    if (!confirm(`¿Eliminar esta imagen de Cloudinary?\n${item.public_id}`)) return;
    setDeleting(item.public_id);
    await fetch('/api/admin/media', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ public_id: item.public_id }),
    });
    setImages((prev) => prev.filter((i) => i.public_id !== item.public_id));
    setDeleting(null);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-base font-semibold">Media</h1>
            <p className="text-xs text-zinc-600 mt-0.5">
              {loading ? '...' : `${images.length} imágenes en Cloudinary · blog/`}
            </p>
          </div>
          <Link
            href="/admin/media/new"
            className="px-4 py-2 bg-white text-black rounded-lg text-sm font-medium hover:bg-zinc-100 transition-colors"
          >
            + Generar / Subir
          </Link>
        </div>

        {loading ? (
          <p className="text-zinc-600 text-sm">Cargando imágenes...</p>
        ) : images.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-zinc-800 rounded-xl">
            <p className="text-zinc-600 text-sm mb-4">Sin imágenes en la carpeta blog/</p>
            <Link href="/admin/media/new" className="text-violet-400 hover:text-violet-300 text-sm transition-colors">
              Genera o sube la primera imagen →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {images.map((img) => (
              <div
                key={img.public_id}
                className={`group relative bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden transition-opacity ${
                  deleting === img.public_id ? 'opacity-40 pointer-events-none' : ''
                }`}
              >
                {/* Image */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img.url}
                  alt={img.public_id}
                  className="w-full aspect-video object-cover"
                  loading="lazy"
                />

                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-2">
                  <button
                    onClick={() => copyUrl(img.url)}
                    className="w-full py-1.5 rounded-lg text-xs font-medium bg-white text-black hover:bg-zinc-100 transition-colors"
                  >
                    {copied === img.url ? '✓ Copiado' : 'Copiar URL'}
                  </button>
                  <button
                    onClick={() => handleDelete(img)}
                    className="w-full py-1.5 rounded-lg text-xs font-medium bg-red-600/20 border border-red-600/40 text-red-400 hover:bg-red-600/30 transition-colors"
                  >
                    Eliminar
                  </button>
                </div>

                {/* Meta */}
                <div className="px-2 py-1.5">
                  <p className="text-xs text-zinc-600 truncate font-mono">
                    {img.public_id.replace('blog/', '')}
                  </p>
                  <p className="text-xs text-zinc-700">
                    {img.width}×{img.height} · {formatBytes(img.bytes)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
