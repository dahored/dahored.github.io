'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';

type Tab = 'generate' | 'upload';

export default function MediaNewPage() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);

  const [tab, setTab] = useState<Tab>('generate');
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState<{ url: string; public_id: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'error' | 'success'; msg: string } | null>(null);
  const [copied, setCopied] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setStatus({ type: 'error', msg: 'Escribe un prompt' });
      return;
    }
    setLoading(true);
    setStatus(null);
    setResult(null);
    try {
      const res = await fetch('/api/admin/image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setResult(data);
      setStatus({ type: 'success', msg: 'Imagen generada y subida a Cloudinary' });
    } catch {
      setStatus({ type: 'error', msg: 'Error generando imagen con DALL-E' });
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (file: File) => {
    setLoading(true);
    setStatus(null);
    setResult(null);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/admin/upload', { method: 'POST', body: fd });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setResult(data);
      setStatus({ type: 'success', msg: 'Imagen subida a Cloudinary' });
    } catch {
      setStatus({ type: 'error', msg: 'Error subiendo imagen' });
    } finally {
      setLoading(false);
    }
  };

  const copyUrl = () => {
    if (!result) return;
    navigator.clipboard.writeText(result.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="max-w-2xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => router.push('/admin/media')}
            className="text-zinc-500 hover:text-white text-sm transition-colors"
          >
            ← Media
          </button>
          <h1 className="text-base font-semibold">Nueva imagen</h1>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-zinc-900 border border-zinc-800 rounded-xl p-1 mb-6">
          {(['generate', 'upload'] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                tab === t ? 'bg-zinc-700 text-white' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              {t === 'generate' ? '✨ Generar con DALL-E 3' : '↑ Subir imagen'}
            </button>
          ))}
        </div>

        {/* Status */}
        {status && (
          <div
            className={`mb-4 px-4 py-3 rounded-xl text-sm border ${
              status.type === 'error'
                ? 'bg-red-500/10 border-red-500/20 text-red-400'
                : 'bg-green-500/10 border-green-500/20 text-green-400'
            }`}
          >
            {status.msg}
          </div>
        )}

        {/* Generate tab */}
        {tab === 'generate' && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs text-zinc-500 mb-2 font-medium">
                Prompt en inglés{' '}
                <span className="text-zinc-700 font-normal">— sé descriptivo, menciona estilo visual</span>
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={4}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-violet-500 resize-none"
                placeholder={`Ej: "A futuristic dark UI dashboard with glowing neon blue and purple accents showing AI agent workflow graphs, minimal design, high contrast, 8K render style"`}
              />
            </div>
            <button
              onClick={handleGenerate}
              disabled={loading}
              className="w-full py-3 rounded-xl text-sm font-medium bg-violet-600 hover:bg-violet-500 disabled:opacity-40 transition-colors"
            >
              {loading ? 'Generando con DALL-E 3... (~15s)' : 'Generar imagen'}
            </button>
            <p className="text-xs text-zinc-700 text-center">
              Formato: 1792×1024 · Subida automática a Cloudinary
            </p>
          </div>
        )}

        {/* Upload tab */}
        {tab === 'upload' && (
          <div>
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragOver(false);
                const file = e.dataTransfer.files[0];
                if (file) handleUpload(file);
              }}
              onClick={() => fileRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-16 text-center cursor-pointer transition-colors ${
                dragOver
                  ? 'border-violet-500 bg-violet-500/5'
                  : 'border-zinc-700 hover:border-zinc-500'
              }`}
            >
              <p className="text-zinc-500 text-sm mb-1">
                {loading ? 'Subiendo...' : 'Arrastra una imagen o haz click'}
              </p>
              <p className="text-zinc-700 text-xs">PNG, JPG, WEBP · max 10MB</p>
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleUpload(file);
              }}
            />
          </div>
        )}

        {/* Result preview */}
        {result && (
          <div className="mt-6 border border-zinc-800 rounded-xl overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={result.url} alt="Resultado" className="w-full object-cover" />
            <div className="p-4 space-y-3">
              <div className="flex items-center gap-2">
                <input
                  readOnly
                  value={result.url}
                  className="flex-1 bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs font-mono text-zinc-400 focus:outline-none"
                />
                <button
                  onClick={copyUrl}
                  className="px-3 py-2 rounded-lg text-xs font-medium bg-zinc-800 hover:bg-zinc-700 transition-colors whitespace-nowrap"
                >
                  {copied ? '✓ Copiado' : 'Copiar URL'}
                </button>
              </div>
              <p className="text-xs text-zinc-600">
                <span className="font-mono">{result.public_id}</span>
              </p>
              <button
                onClick={() => router.push('/admin/media')}
                className="w-full py-2 rounded-lg text-xs text-zinc-500 hover:text-white border border-zinc-800 hover:border-zinc-600 transition-colors"
              >
                Ver en la galería →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
