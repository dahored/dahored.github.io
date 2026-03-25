'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, Upload, Copy, Check, ArrowLeft, ImageIcon } from 'lucide-react';
import GenerateImageForm, { type GenerateResult } from '@/app/admin/_components/GenerateImageForm';

type Tab = 'generate' | 'upload';

export default function MediaNewPage() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);

  const [tab, setTab] = useState<Tab>('generate');
  const [result, setResult] = useState<GenerateResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'error' | 'success'; msg: string } | null>(null);
  const [copied, setCopied] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const handleUpload = async (file: File) => {
    if (file.size > 10 * 1024 * 1024) {
      setStatus({ type: 'error', msg: 'Archivo demasiado grande (máx 10MB)' });
      return;
    }
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
      <div className="max-w-xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <button
            onClick={() => router.push('/admin/media')}
            className="flex items-center gap-1.5 text-zinc-500 hover:text-white text-sm transition-colors cursor-pointer"
          >
            <ArrowLeft size={14} /> Media
          </button>
          <span className="text-zinc-800">·</span>
          <h1 className="text-sm font-medium text-zinc-300">Nueva imagen</h1>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-zinc-900 border border-zinc-800 rounded-xl p-1 mb-6">
          <button
            onClick={() => setTab('generate')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
              tab === 'generate' ? 'bg-zinc-700 text-white' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <Sparkles size={13} /> Generar imagen
          </button>
          <button
            onClick={() => setTab('upload')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
              tab === 'upload' ? 'bg-zinc-700 text-white' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <Upload size={13} /> Subir imagen
          </button>
        </div>

        {/* Status (upload tab only) */}
        {status && tab === 'upload' && (
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
          <GenerateImageForm
            showResult={true}
            onGenerated={(r) => {
              setResult(r);
              setStatus({ type: 'success', msg: 'Generada y subida a Cloudinary' });
            }}
          />
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
              className={`flex flex-col items-center justify-center gap-3 border-2 border-dashed rounded-xl py-16 cursor-pointer transition-colors ${
                dragOver
                  ? 'border-violet-500 bg-violet-500/5'
                  : 'border-zinc-700 hover:border-zinc-500 hover:bg-zinc-900/40'
              }`}
            >
              {loading ? (
                <p className="text-zinc-500 text-sm">Subiendo a Cloudinary...</p>
              ) : (
                <>
                  <Upload size={24} className="text-zinc-600" />
                  <div className="text-center">
                    <p className="text-zinc-400 text-sm font-medium">Arrastra una imagen o haz click</p>
                    <p className="text-zinc-700 text-xs mt-1">PNG, JPG, WEBP · máx 10MB</p>
                  </div>
                </>
              )}
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

            {/* Upload result preview */}
            {result && tab === 'upload' && (
              <div className="mt-6 border border-zinc-800 rounded-xl overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={result.url} alt="Resultado" className="w-full object-cover" />
                <div className="p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5 flex-1 bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 min-w-0">
                      <ImageIcon size={12} className="text-zinc-600 shrink-0" />
                      <span className="text-xs font-mono text-zinc-400 truncate">{result.url}</span>
                    </div>
                    <button
                      onClick={copyUrl}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium bg-zinc-800 hover:bg-zinc-700 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      {copied ? <><Check size={12} /> Copiado</> : <><Copy size={12} /> Copiar</>}
                    </button>
                  </div>
                  <p className="text-xs text-zinc-600 font-mono">{result.public_id}</p>
                  <button
                    onClick={() => router.push('/admin/media')}
                    className="w-full py-2 rounded-lg text-xs text-zinc-500 hover:text-white border border-zinc-800 hover:border-zinc-600 transition-colors cursor-pointer"
                  >
                    Ver en la galería →
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
