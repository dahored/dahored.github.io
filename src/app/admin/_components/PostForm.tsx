'use client';

import { useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';

const CATEGORIES = ['ia', 'desarrollo', 'herramientas'];

export interface PostFormData {
  locale: 'es' | 'en';
  slug: string;
  title: string;
  description: string;
  date: string;
  category: string;
  tags: string;
  readTime: number;
  featured: boolean;
  content: string;
}

function slugify(str: string) {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

const defaultForm = (): PostFormData => ({
  locale: 'es',
  slug: '',
  title: '',
  description: '',
  date: new Date().toISOString().split('T')[0],
  category: 'ia',
  tags: '',
  readTime: 5,
  featured: false,
  content: '',
});

export default function PostForm({
  initial,
  mode,
}: {
  initial?: PostFormData;
  mode: 'new' | 'edit';
}) {
  const router = useRouter();
  const contentRef = useRef<HTMLTextAreaElement>(null);

  const [form, setForm] = useState<PostFormData>(initial ?? defaultForm());
  const [imagePrompt, setImagePrompt] = useState('');
  const [previewImage, setPreviewImage] = useState('');
  const [manualUrl, setManualUrl] = useState('');
  const [generating, setGenerating] = useState(false);
  const [generatingImage, setGeneratingImage] = useState(false);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{ type: 'error' | 'success'; msg: string } | null>(null);

  const set = useCallback((key: keyof PostFormData, value: unknown) => {
    setForm((f) => ({ ...f, [key]: value }));
  }, []);

  const handleTitleChange = (title: string) => {
    setForm((f) => ({
      ...f,
      title,
      ...(mode === 'new' ? { slug: slugify(title) } : {}),
    }));
  };

  const insertImageMarkdown = useCallback(
    (url: string, alt?: string) => {
      const textarea = contentRef.current;
      if (!textarea) return;
      const start = textarea.selectionStart ?? form.content.length;
      const end = textarea.selectionEnd ?? start;
      const md = `\n![${alt ?? form.title ?? 'imagen'}](${url})\n`;
      const next = form.content.substring(0, start) + md + form.content.substring(end);
      setForm((f) => ({ ...f, content: next }));
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + md.length;
        textarea.focus();
      }, 0);
    },
    [form.content, form.title]
  );

  const handleGenerate = async () => {
    if (!form.title) {
      setStatus({ type: 'error', msg: 'Escribe un título antes de generar' });
      return;
    }
    setGenerating(true);
    setStatus(null);
    try {
      const res = await fetch('/api/admin/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: form.title, locale: form.locale, category: form.category }),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setForm((f) => ({
        ...f,
        title: data.title ?? f.title,
        description: data.description ?? f.description,
        category: data.category ?? f.category,
        tags: Array.isArray(data.tags) ? data.tags.join(', ') : f.tags,
        readTime: data.readTime ?? f.readTime,
        content: data.content ?? f.content,
      }));
      setStatus({ type: 'success', msg: 'Artículo generado' });
    } catch {
      setStatus({ type: 'error', msg: 'Error generando artículo con AI' });
    } finally {
      setGenerating(false);
    }
  };

  const handleGenerateImage = async () => {
    if (!imagePrompt) {
      setStatus({ type: 'error', msg: 'Escribe un prompt para la imagen' });
      return;
    }
    setGeneratingImage(true);
    setStatus(null);
    try {
      const res = await fetch('/api/admin/image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: imagePrompt, slug: form.slug }),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setPreviewImage(data.url);
      setStatus({ type: 'success', msg: 'Imagen generada y subida a Cloudinary' });
    } catch {
      setStatus({ type: 'error', msg: 'Error generando imagen' });
    } finally {
      setGeneratingImage(false);
    }
  };

  const handleSave = async () => {
    if (!form.slug || !form.title || !form.content) {
      setStatus({ type: 'error', msg: 'Slug, título y contenido son requeridos' });
      return;
    }
    setSaving(true);
    setStatus(null);
    try {
      const res = await fetch('/api/admin/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      setStatus({ type: 'success', msg: 'Post guardado exitosamente' });
      if (mode === 'new') setTimeout(() => router.push('/admin'), 1200);
    } catch {
      setStatus({ type: 'error', msg: 'Error guardando el post' });
    } finally {
      setSaving(false);
    }
  };

  const wordCount = form.content.split(/\s+/).filter(Boolean).length;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Top bar */}
      <div className="sticky top-0 z-10 bg-[#0a0a0a]/95 backdrop-blur border-b border-zinc-800 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push('/admin')}
            className="text-zinc-500 hover:text-white text-sm transition-colors"
          >
            ← Admin
          </button>
          <span className="text-zinc-700">|</span>
          <span className="text-sm font-medium text-zinc-300">
            {mode === 'new' ? 'Nuevo post' : `Editando: ${form.slug}`}
          </span>
        </div>
        <div className="flex items-center gap-3">
          {status && (
            <span
              className={`text-xs px-3 py-1 rounded-full ${
                status.type === 'error'
                  ? 'bg-red-500/10 text-red-400'
                  : 'bg-green-500/10 text-green-400'
              }`}
            >
              {status.msg}
            </span>
          )}
          <button
            onClick={handleGenerate}
            disabled={generating}
            className="px-4 py-1.5 rounded-lg text-sm font-medium bg-violet-600 hover:bg-violet-500 disabled:opacity-40 transition-colors"
          >
            {generating ? 'Generando...' : '✨ Generar con AI'}
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-1.5 rounded-lg text-sm font-medium bg-white text-black hover:bg-zinc-100 disabled:opacity-40 transition-colors"
          >
            {saving ? 'Guardando...' : 'Guardar post'}
          </button>
        </div>
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-0 h-[calc(100vh-57px)]">
        {/* Left panel: metadata */}
        <div className="border-r border-zinc-800 overflow-y-auto p-6 space-y-5">
          {/* Locale + Slug */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-zinc-500 mb-1.5 font-medium">Idioma</label>
              <select
                value={form.locale}
                onChange={(e) => set('locale', e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-violet-500 text-white"
              >
                <option value="es">Español</option>
                <option value="en">English</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-zinc-500 mb-1.5 font-medium">Slug</label>
              <input
                type="text"
                value={form.slug}
                onChange={(e) => set('slug', e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-violet-500 font-mono text-zinc-300"
                placeholder="mi-post-slug"
              />
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs text-zinc-500 mb-1.5 font-medium">Título</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-violet-500"
              placeholder="Título del post"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs text-zinc-500 mb-1.5 font-medium">
              Descripción{' '}
              <span className="text-zinc-700 font-normal">(meta, max 160 chars)</span>
            </label>
            <textarea
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
              rows={2}
              maxLength={160}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-violet-500 resize-none"
              placeholder="Descripción corta para SEO"
            />
            <p className="text-right text-xs text-zinc-700 mt-0.5">{form.description.length}/160</p>
          </div>

          {/* Category + Date + ReadTime */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs text-zinc-500 mb-1.5 font-medium">Categoría</label>
              <select
                value={form.category}
                onChange={(e) => set('category', e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-violet-500 text-white"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-zinc-500 mb-1.5 font-medium">Fecha</label>
              <input
                type="date"
                value={form.date}
                onChange={(e) => set('date', e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-violet-500 text-white"
              />
            </div>
            <div>
              <label className="block text-xs text-zinc-500 mb-1.5 font-medium">Min lectura</label>
              <input
                type="number"
                value={form.readTime}
                onChange={(e) => set('readTime', Number(e.target.value))}
                min={1}
                max={60}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-violet-500"
              />
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-xs text-zinc-500 mb-1.5 font-medium">
              Tags{' '}
              <span className="text-zinc-700 font-normal">(separados por coma)</span>
            </label>
            <input
              type="text"
              value={form.tags}
              onChange={(e) => set('tags', e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-violet-500"
              placeholder="ia, programacion, herramientas"
            />
          </div>

          {/* Featured */}
          <label className="flex items-center gap-2.5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(e) => set('featured', e.target.checked)}
              className="w-4 h-4 accent-violet-500 rounded"
            />
            <span className="text-sm text-zinc-300">Post destacado (featured)</span>
          </label>

          {/* Divider */}
          <div className="border-t border-zinc-800 pt-5">
            <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-4">
              Imagen con DALL-E 3
            </p>

            {/* Prompt input */}
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={imagePrompt}
                onChange={(e) => setImagePrompt(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleGenerateImage()}
                className="flex-1 bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-violet-500"
                placeholder="Describe la imagen en inglés..."
              />
              <button
                onClick={handleGenerateImage}
                disabled={generatingImage}
                className="px-3 py-2 rounded-lg text-sm font-medium bg-zinc-800 hover:bg-zinc-700 disabled:opacity-40 transition-colors whitespace-nowrap"
              >
                {generatingImage ? '...' : 'Generar'}
              </button>
            </div>

            {/* Preview */}
            {previewImage && (
              <div className="space-y-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={previewImage}
                  alt="Preview"
                  className="w-full rounded-lg object-cover aspect-video"
                />
                <button
                  onClick={() => insertImageMarkdown(previewImage)}
                  className="w-full py-2 rounded-lg text-xs font-medium bg-violet-600/15 border border-violet-600/30 hover:bg-violet-600/25 text-violet-300 transition-colors"
                >
                  Insertar en contenido
                </button>
                <p className="text-xs text-zinc-700 break-all">{previewImage}</p>
              </div>
            )}

            {/* Manual URL */}
            <div className="mt-4">
              <p className="text-xs text-zinc-600 mb-2">O inserta una URL de Cloudinary manualmente:</p>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={manualUrl}
                  onChange={(e) => setManualUrl(e.target.value)}
                  className="flex-1 bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-violet-500 font-mono"
                  placeholder="https://res.cloudinary.com/..."
                />
                <button
                  onClick={() => {
                    if (manualUrl) {
                      insertImageMarkdown(manualUrl);
                      setManualUrl('');
                    }
                  }}
                  className="px-3 py-2 rounded-lg text-xs font-medium bg-zinc-800 hover:bg-zinc-700 transition-colors"
                >
                  Insertar
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right panel: content editor */}
        <div className="flex flex-col overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2 border-b border-zinc-800 bg-zinc-900/50">
            <span className="text-xs text-zinc-600 font-mono">contenido.mdx</span>
            <span className="text-xs text-zinc-700">
              {wordCount} palabras · {form.content.length} chars
            </span>
          </div>
          <textarea
            ref={contentRef}
            value={form.content}
            onChange={(e) => set('content', e.target.value)}
            spellCheck={false}
            className="flex-1 w-full bg-[#0d0d0d] px-6 py-5 text-sm font-mono text-zinc-300 focus:outline-none resize-none leading-7 placeholder-zinc-800"
            placeholder={`## Título de sección\n\nEscribe el contenido aquí en markdown/MDX...\n\n**Texto en negrita** y _cursiva_\n\n- Item de lista\n- Otro item`}
          />
        </div>
      </div>
    </div>
  );
}
