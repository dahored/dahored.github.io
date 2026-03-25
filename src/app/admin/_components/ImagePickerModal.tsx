'use client';

import { useEffect, useState } from 'react';
import { X, Search, Copy, Check, ImageIcon, Loader2 } from 'lucide-react';

interface MediaItem {
  public_id: string;
  url: string;
  width: number;
  height: number;
  bytes: number;
  created_at: string;
  folder: string;
}

interface Props {
  onSelect: (url: string) => void;
  onClose: () => void;
}

function formatBytes(b: number) {
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(0)} KB`;
  return `${(b / 1024 / 1024).toFixed(1)} MB`;
}

export default function ImagePickerModal({ onSelect, onClose }: Props) {
  const [images, setImages] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [copied, setCopied] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/admin/media')
      .then((r) => r.json())
      .then((data) => {
        setImages(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const filtered = search
    ? images.filter((i) => i.public_id.toLowerCase().includes(search.toLowerCase()))
    : images;

  const handleCopy = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopied(url);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleInsert = (url: string) => {
    onSelect(url);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      {/* Modal */}
      <div className="relative bg-zinc-950 border border-zinc-800 rounded-2xl w-full max-w-3xl max-h-[80vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800 shrink-0">
          <div>
            <h2 className="text-sm font-semibold">Seleccionar imagen</h2>
            <p className="text-xs text-zinc-600 mt-0.5">
              {loading ? 'Cargando...' : `${filtered.length} imágenes`}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-1.5">
              <Search size={12} className="text-zinc-600" />
              <input
                autoFocus
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar..."
                className="bg-transparent text-sm focus:outline-none w-40 placeholder-zinc-700"
              />
            </div>
            <button
              onClick={onClose}
              className="text-zinc-500 hover:text-white transition-colors p-1 cursor-pointer"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Grid */}
        <div className="overflow-y-auto p-4 flex-1">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 size={20} className="text-zinc-600 animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-zinc-700">
              <ImageIcon size={28} className="mb-3" />
              <p className="text-sm">
                {search ? `Sin resultados para "${search}"` : 'Sin imágenes en Cloudinary'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
              {filtered.map((img) => {
                const isSelected = selected === img.url;
                return (
                  <div
                    key={img.public_id}
                    className={`group relative bg-zinc-900 border rounded-xl overflow-hidden cursor-pointer transition-all ${
                      isSelected
                        ? 'border-violet-500 ring-2 ring-violet-500/30'
                        : 'border-zinc-800 hover:border-zinc-600'
                    }`}
                    onClick={() => setSelected(img.url)}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={img.url}
                      alt={img.public_id}
                      className="w-full aspect-video object-cover"
                      loading="lazy"
                    />

                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 p-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleInsert(img.url);
                        }}
                        className="flex-1 py-1.5 rounded-lg text-xs font-semibold bg-violet-600 hover:bg-violet-500 text-white transition-colors cursor-pointer"
                      >
                        Insertar
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCopy(img.url);
                        }}
                        className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors cursor-pointer"
                      >
                        {copied === img.url ? <Check size={12} /> : <Copy size={12} />}
                      </button>
                    </div>

                    {/* Meta */}
                    <div className="px-2 py-1.5">
                      <p className="text-xs text-zinc-500 truncate font-mono">
                        {img.public_id.split('/').pop()}
                      </p>
                      <p className="text-xs text-zinc-700">{formatBytes(img.bytes)}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer — insert selected */}
        {selected && (
          <div className="border-t border-zinc-800 px-5 py-3 flex items-center justify-between gap-4 shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={selected}
              alt=""
              className="h-10 w-16 object-cover rounded-lg shrink-0"
            />
            <span className="text-xs text-zinc-500 font-mono truncate flex-1">{selected}</span>
            <button
              onClick={() => handleInsert(selected)}
              className="px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium rounded-lg transition-colors cursor-pointer shrink-0"
            >
              Insertar imagen
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
