'use client';

import { useEffect, useRef, useState } from 'react';
import { X, Search, Copy, Check, ImageIcon, Loader2, Sparkles, Upload } from 'lucide-react';
import GenerateImageForm, { type GenerateResult } from '@/app/admin/_components/GenerateImageForm';

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

type Tab = 'gallery' | 'upload' | 'generate';

function formatBytes(b: number) {
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(0)} KB`;
  return `${(b / 1024 / 1024).toFixed(1)} MB`;
}

export default function ImagePickerModal({ onSelect, onClose }: Props) {
  const [tab, setTab] = useState<Tab>('gallery');

  // Gallery state
  const [images, setImages] = useState<MediaItem[]>([]);
  const [loadingGallery, setLoadingGallery] = useState(true);
  const [search, setSearch] = useState('');
  const [copied, setCopied] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(null);

  // Upload state
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  // Generate state
  const [genResult, setGenResult] = useState<GenerateResult | null>(null);

  useEffect(() => {
    fetch('/api/admin/media')
      .then((r) => r.json())
      .then((data) => { setImages(Array.isArray(data) ? data : []); setLoadingGallery(false); })
      .catch(() => setLoadingGallery(false));
  }, []);

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

  const handleInsert = (url: string) => { onSelect(url); onClose(); };

  const handleUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setUploadError('Solo se permiten imágenes');
      return;
    }
    setUploading(true);
    setUploadError(null);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/admin/media', { method: 'POST', body: fd });
      if (!res.ok) throw new Error();
      const data = await res.json() as MediaItem;
      setImages((prev) => [data, ...prev]);
      setSelected(data.url);
      setTab('gallery');
    } catch {
      setUploadError('Error al subir la imagen');
    } finally {
      setUploading(false);
    }
  };

  const handleGenerated = (r: GenerateResult) => {
    setGenResult(r);
    setImages((prev) => [{ public_id: r.public_id, url: r.url, width: 0, height: 0, bytes: 0, created_at: '', folder: '' }, ...prev]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      <div className="relative bg-zinc-950 border border-zinc-800 rounded-2xl w-full max-w-3xl max-h-[85vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-zinc-800 shrink-0">
          {/* Tabs */}
          <div className="flex gap-1 bg-zinc-900 border border-zinc-800 rounded-lg p-0.5">
            <button
              onClick={() => setTab('gallery')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${tab === 'gallery' ? 'bg-zinc-700 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
            >
              <ImageIcon size={11} /> Galería
              {!loadingGallery && <span className="text-zinc-600 font-normal">({filtered.length})</span>}
            </button>
            <button
              onClick={() => setTab('upload')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${tab === 'upload' ? 'bg-zinc-700 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
            >
              <Upload size={11} /> Subir
            </button>
            <button
              onClick={() => setTab('generate')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${tab === 'generate' ? 'bg-zinc-700 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
            >
              <Sparkles size={11} /> Generar
            </button>
          </div>

          <div className="flex items-center gap-2">
            {tab === 'gallery' && (
              <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-1.5">
                <Search size={12} className="text-zinc-600" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Buscar..."
                  className="bg-transparent text-sm focus:outline-none w-32 placeholder-zinc-700"
                />
              </div>
            )}
            <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors p-1 cursor-pointer">
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 p-4">
          {/* GALLERY TAB */}
          {tab === 'gallery' && (
            loadingGallery ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 size={20} className="text-zinc-600 animate-spin" />
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-zinc-700">
                <ImageIcon size={28} className="mb-3" />
                <p className="text-sm">{search ? `Sin resultados para "${search}"` : 'Sin imágenes en Cloudinary'}</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
                {filtered.map((img) => {
                  const isSelected = selected === img.url;
                  return (
                    <div
                      key={img.public_id}
                      className={`group relative bg-zinc-900 border rounded-xl overflow-hidden cursor-pointer transition-all ${isSelected ? 'border-violet-500 ring-2 ring-violet-500/30' : 'border-zinc-800 hover:border-zinc-600'}`}
                      onClick={() => setSelected(img.url)}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={img.url} alt={img.public_id} className="w-full aspect-video object-cover" loading="lazy" />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 p-2">
                        <button onClick={(e) => { e.stopPropagation(); handleInsert(img.url); }} className="flex-1 py-1.5 rounded-lg text-xs font-semibold bg-violet-600 hover:bg-violet-500 text-white transition-colors cursor-pointer">
                          Insertar
                        </button>
                        <button onClick={(e) => { e.stopPropagation(); handleCopy(img.url); }} className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors cursor-pointer">
                          {copied === img.url ? <Check size={12} /> : <Copy size={12} />}
                        </button>
                      </div>
                      <div className="px-2 py-1.5">
                        <p className="text-xs text-zinc-500 truncate font-mono">{img.public_id.split('/').pop()}</p>
                        {img.bytes > 0 && <p className="text-xs text-zinc-700">{formatBytes(img.bytes)}</p>}
                      </div>
                    </div>
                  );
                })}
              </div>
            )
          )}

          {/* UPLOAD TAB */}
          {tab === 'upload' && (
            <div className="max-w-lg mx-auto py-4">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => { const f = e.target.files?.[0]; if (f) handleUpload(f); }}
              />
              <div
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragOver(false);
                  const f = e.dataTransfer.files?.[0];
                  if (f) handleUpload(f);
                }}
                onClick={() => !uploading && fileInputRef.current?.click()}
                className={`flex flex-col items-center justify-center gap-4 border-2 border-dashed rounded-2xl p-12 transition-colors cursor-pointer ${
                  dragOver ? 'border-violet-500 bg-violet-500/5' : 'border-zinc-700 hover:border-zinc-500 hover:bg-zinc-900/50'
                } ${uploading ? 'pointer-events-none opacity-60' : ''}`}
              >
                {uploading ? (
                  <>
                    <Loader2 size={32} className="text-violet-400 animate-spin" />
                    <p className="text-sm text-zinc-400">Subiendo a Cloudinary...</p>
                  </>
                ) : (
                  <>
                    <Upload size={32} className="text-zinc-500" />
                    <div className="text-center">
                      <p className="text-sm text-zinc-300 font-medium">Arrastra una imagen aquí</p>
                      <p className="text-xs text-zinc-600 mt-1">o haz clic para seleccionar un archivo</p>
                      <p className="text-xs text-zinc-700 mt-3">PNG, JPG, WebP, GIF · máx. 10 MB</p>
                    </div>
                  </>
                )}
              </div>
              {uploadError && (
                <p className="mt-3 text-xs text-red-400 text-center">{uploadError}</p>
              )}
            </div>
          )}

          {/* GENERATE TAB */}
          {tab === 'generate' && (
            <div className="max-w-lg mx-auto py-2">
              <GenerateImageForm showResult={false} onGenerated={handleGenerated} />
              {genResult && (
                <div className="mt-4 rounded-xl overflow-hidden border border-zinc-800">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={genResult.url} alt="Generada" className="w-full object-cover" />
                  <div className="flex gap-2 p-3">
                    <button onClick={() => handleInsert(genResult.url)} className="flex-1 py-2 rounded-lg text-xs font-semibold bg-violet-600 hover:bg-violet-500 text-white transition-colors cursor-pointer">
                      Insertar imagen
                    </button>
                    <button onClick={() => setGenResult(null)} className="px-3 py-2 rounded-lg text-xs text-zinc-500 hover:text-white border border-zinc-800 hover:border-zinc-600 transition-colors cursor-pointer">
                      Nueva
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer — insert selected (gallery only) */}
        {tab === 'gallery' && selected && (
          <div className="border-t border-zinc-800 px-5 py-3 flex items-center justify-between gap-4 shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={selected} alt="" className="h-10 w-16 object-cover rounded-lg shrink-0" />
            <span className="text-xs text-zinc-500 font-mono truncate flex-1">{selected}</span>
            <button onClick={() => handleInsert(selected)} className="px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium rounded-lg transition-colors cursor-pointer shrink-0">
              Insertar imagen
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
