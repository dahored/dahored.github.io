'use client';

import { useState, useRef } from 'react';
import { Sparkles, Monitor, Square, Smartphone, Cpu, Wand2, Brain, X, Upload, Loader2, type LucideIcon } from 'lucide-react';

export interface GenerateResult {
  url: string;
  public_id: string;
}

interface Props {
  onGenerated?: (result: GenerateResult) => void;
  /** Render the result inline (standalone page) or emit via onGenerated only (modal) */
  showResult?: boolean;
}

type AspectRatio = '16:9' | '1:1' | '9:16';
type ImageModel = 'dalle-2' | 'dalle-3' | 'gpt-4o';

const RATIOS: { value: AspectRatio; Icon: LucideIcon }[] = [
  { value: '16:9', Icon: Monitor },
  { value: '1:1',  Icon: Square },
  { value: '9:16', Icon: Smartphone },
];

const MODELS: { value: ImageModel; label: string; note: string; Icon: LucideIcon }[] = [
  { value: 'dalle-2', label: 'DALL-E 2', note: 'Solo 1:1',          Icon: Cpu   },
  { value: 'dalle-3', label: 'DALL-E 3', note: '16:9 · 1:1 · 9:16', Icon: Wand2 },
  { value: 'gpt-4o',  label: 'GPT-4o',   note: 'Con referencia',     Icon: Brain },
];

export default function GenerateImageForm({ onGenerated, showResult = true }: Props) {
  const refImgRef = useRef<HTMLInputElement>(null);

  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('16:9');
  const [imageModel, setImageModel] = useState<ImageModel>('dalle-3');
  const [referenceFile, setReferenceFile] = useState<File | null>(null);
  const [referencePreview, setReferencePreview] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState<GenerateResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleReferenceImage = (file: File) => {
    setReferenceFile(file);
    const reader = new FileReader();
    reader.onload = (e) => setReferencePreview(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const clearReference = () => {
    setReferenceFile(null);
    setReferencePreview(null);
    if (refImgRef.current) refImgRef.current.value = '';
  };

  const handleModelChange = (m: ImageModel) => {
    setImageModel(m);
    if (m === 'dalle-2') setAspectRatio('1:1');
  };

  const isRatioDisabled = (v: AspectRatio) => imageModel === 'dalle-2' && v !== '1:1';

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setGenerating(true);
    setError(null);
    setResult(null);

    let referenceBase64: string | undefined;
    if (referenceFile) {
      referenceBase64 = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve((e.target?.result as string).split(',')[1]);
        reader.readAsDataURL(referenceFile);
      });
    }

    try {
      const res = await fetch('/api/admin/image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, aspectRatio, imageModel, referenceImage: referenceBase64 }),
      });
      if (!res.ok) throw new Error();
      const data: GenerateResult = await res.json();
      setResult(data);
      onGenerated?.(data);
    } catch {
      setError('Error generando imagen. Verifica tu crédito de OpenAI.');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Prompt */}
      <div>
        <label className="block text-xs text-zinc-500 mb-1.5 font-medium">
          Prompt <span className="text-zinc-700 font-normal">— describe el estilo visual</span>
        </label>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && e.metaKey && handleGenerate()}
          rows={4}
          className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-violet-500 resize-none placeholder-zinc-700"
          placeholder={`"Dashboard futurista con acentos neón azul y morado, iluminación cinematográfica, render 8K"`}
        />
        <p className="text-xs text-zinc-700 mt-1 text-right">⌘ + Enter para generar</p>
      </div>

      {/* Model */}
      <div>
        <label className="block text-xs text-zinc-500 mb-1.5 font-medium">Modelo</label>
        <div className="flex gap-2">
          {MODELS.map((m) => {
            const active = imageModel === m.value;
            return (
              <button
                key={m.value}
                onClick={() => handleModelChange(m.value)}
                className={`flex-1 flex flex-col items-center gap-1 py-2.5 rounded-xl border text-xs font-medium transition-colors cursor-pointer ${
                  active ? 'border-violet-500 bg-violet-500/10 text-violet-300' : 'border-zinc-800 bg-zinc-900 text-zinc-500 hover:border-zinc-600 hover:text-zinc-300'
                }`}
              >
                <m.Icon size={14} />
                <span>{m.label}</span>
                <span className={`text-[10px] ${active ? 'text-violet-400/70' : 'text-zinc-700'}`}>{m.note}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Reference image — GPT-4o only */}
      {imageModel === 'gpt-4o' && (
        <div>
          <label className="block text-xs text-zinc-500 mb-1.5 font-medium">
            Imagen de referencia <span className="text-zinc-700 font-normal">— opcional</span>
          </label>
          {referencePreview ? (
            <div className="relative w-full rounded-xl overflow-hidden border border-zinc-800 bg-zinc-900">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={referencePreview} alt="Referencia" className="w-full max-h-40 object-cover" />
              <button onClick={clearReference} className="absolute top-2 right-2 p-1 rounded-lg bg-black/70 hover:bg-black text-zinc-300 hover:text-white transition-colors cursor-pointer">
                <X size={14} />
              </button>
              <p className="px-3 py-2 text-xs text-zinc-500 font-mono truncate">{referenceFile?.name}</p>
            </div>
          ) : (
            <div
              onClick={() => refImgRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f?.type.startsWith('image/')) handleReferenceImage(f); }}
              className="flex items-center justify-center gap-2 border border-dashed border-zinc-800 rounded-xl py-4 cursor-pointer hover:border-zinc-600 hover:bg-zinc-900/40 transition-colors text-zinc-600 hover:text-zinc-400 text-xs"
            >
              <Upload size={14} /> <span>Subir imagen de referencia</span>
            </div>
          )}
          <input ref={refImgRef} type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleReferenceImage(f); }} />
        </div>
      )}

      {/* Aspect ratio */}
      <div>
        <label className="block text-xs text-zinc-500 mb-1.5 font-medium">Proporción</label>
        <div className="flex gap-2">
          {RATIOS.map((r) => {
            const disabled = isRatioDisabled(r.value);
            const active = aspectRatio === r.value && !disabled;
            return (
              <button
                key={r.value}
                onClick={() => !disabled && setAspectRatio(r.value)}
                disabled={disabled}
                className={`flex-1 flex flex-col items-center justify-center gap-1.5 py-3 rounded-xl border text-xs font-medium transition-colors ${
                  disabled ? 'border-zinc-800/50 bg-zinc-900/30 text-zinc-700 cursor-not-allowed'
                  : active ? 'border-violet-500 bg-violet-500/10 text-violet-300 cursor-pointer'
                  : 'border-zinc-800 bg-zinc-900 text-zinc-500 hover:border-zinc-600 hover:text-zinc-300 cursor-pointer'
                }`}
              >
                <r.Icon size={16} />
                {r.value}
              </button>
            );
          })}
        </div>
      </div>

      {/* Error */}
      {error && (
        <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2">{error}</p>
      )}

      {/* Result (inline mode) */}
      {showResult && result && (
        <div className="border border-zinc-800 rounded-xl overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={result.url} alt="Resultado" className="w-full object-cover" />
          <div className="p-3 flex gap-2">
            <button
              onClick={() => { setResult(null); setPrompt(''); }}
              className="flex-1 py-2 rounded-lg text-xs text-zinc-500 hover:text-white border border-zinc-800 hover:border-zinc-600 transition-colors cursor-pointer"
            >
              Generar otra
            </button>
          </div>
        </div>
      )}

      {/* Generate button */}
      {!result && (
        <button
          onClick={handleGenerate}
          disabled={generating || !prompt.trim()}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium bg-violet-600 hover:bg-violet-500 disabled:opacity-40 transition-colors cursor-pointer mt-2"
        >
          {generating
            ? <><Loader2 size={14} className="animate-spin" /> Generando con {imageModel === 'gpt-4o' ? 'GPT-4o' : imageModel === 'dalle-3' ? 'DALL-E 3' : 'DALL-E 2'}...</>
            : <><Sparkles size={14} /> Generar imagen</>}
        </button>
      )}

      {!result && (
        <p className="text-xs text-zinc-700 text-center">
          {imageModel === 'gpt-4o' ? 'GPT-4o' : imageModel === 'dalle-3'
            ? `DALL-E 3 · ${aspectRatio === '16:9' ? '1792×1024' : aspectRatio === '9:16' ? '1024×1792' : '1024×1024'}`
            : 'DALL-E 2 · 1024×1024'
          } · sube a Cloudinary automáticamente
        </p>
      )}
    </div>
  );
}
