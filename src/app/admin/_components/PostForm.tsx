'use client';

import { useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Sparkles, Save, ImagePlus, ExternalLink } from 'lucide-react';

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

const defaultForm = (overrides?: Partial<PostFormData>): PostFormData => ({
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
  ...overrides,
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
  const [brief, setBrief] = useState('');
  const [showBrief, setShowBrief] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [generating, setGenerating] = useState(false);
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

  const insertAtCursor = useCallback(
    (text: string) => {
      const textarea = contentRef.current;
      if (!textarea) {
        setForm((f) => ({ ...f, content: f.content + text }));
        return;
      }
      const start = textarea.selectionStart ?? form.content.length;
      const end = textarea.selectionEnd ?? start;
      const next = form.content.substring(0, start) + text + form.content.substring(end);
      setForm((f) => ({ ...f, content: next }));
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + text.length;
        textarea.focus();
      }, 0);
    },
    [form.content]
  );

  const handleInsertImage = () => {
    const url = imageUrl.trim();
    if (!url) return;
    insertAtCursor(`\n![imagen](${url})\n`);
    setImageUrl('');
    setStatus({ type: 'success', msg: 'Imagen insertada en el contenido' });
  };

  const handleGenerate = async () => {
    if (!form.title && !brief) {
      setStatus({ type: 'error', msg: 'Escribe un título o descripción para generar' });
      return;
    }
    setGenerating(true);
    setStatus(null);
    setShowBrief(false);
    try {
      const res = await fetch('/api/admin/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: form.title,
          brief,
          locale: form.locale,
          category: form.category,
        }),
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
        ...(mode === 'new' && data.title ? { slug: slugify(data.title) } : {}),
      }));
      setStatus({ type: 'success', msg: 'Artículo generado con AI' });
    } catch {
      setStatus({ type: 'error', msg: 'Error generando artículo' });
    } finally {
      setGenerating(false);
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
      setStatus({ type: 'success', msg: 'Post guardado' });
      if (mode === 'new') setTimeout(() => router.push('/admin/posts'), 1000);
    } catch {
      setStatus({ type: 'error', msg: 'Error guardando el post' });
    } finally {
      setSaving(false);
    }
  };

  const wordCount = form.content.split(/\s+/).filter(Boolean).length;

  return (
    <div className="bg-[#0a0a0a] text-white" style={{ height: 'calc(100vh - 49px)' }}>
      {/* Toolbar */}
      <div className="border-b border-zinc-800 px-5 py-2.5 flex items-center justify-between bg-[#0a0a0a]/95 backdrop-blur">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push('/admin/posts')}
            className="flex items-center gap-1.5 text-zinc-500 hover:text-white text-sm transition-colors"
          >
            <ArrowLeft size={14} /> Posts
          </button>
          <span className="text-zinc-800">|</span>
          <span className="text-sm text-zinc-400">
            {mode === 'new' ? 'Nuevo post' : form.slug}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {status && (
            <span
              className={`text-xs px-3 py-1 rounded-full ${
                status.type === 'error'
                  ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                  : 'bg-green-500/10 text-green-400 border border-green-500/20'
              }`}
            >
              {status.msg}
            </span>
          )}
          <div className="relative">
            <button
              onClick={() => setShowBrief((v) => !v)}
              disabled={generating}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-medium bg-violet-600 hover:bg-violet-500 disabled:opacity-40 transition-colors"
            >
              <Sparkles size={13} />
              {generating ? 'Generando...' : 'Generar con AI'}
            </button>
            {showBrief && (
              <div className="absolute right-0 top-full mt-2 w-96 bg-zinc-900 border border-zinc-700 rounded-xl p-4 shadow-2xl z-20">
                <p className="text-xs text-zinc-500 mb-2 font-medium">
                  ¿De qué trata el post? Describe el ángulo, puntos clave, tono.
                </p>
                <textarea
                  autoFocus
                  value={brief}
                  onChange={(e) => setBrief(e.target.value)}
                  rows={4}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-violet-500 resize-none mb-3"
                  placeholder={`Ej: "Quiero hablar sobre cómo los agentes de IA están cambiando el desarrollo de software en 2026. Incluir ejemplos reales, comparar con el pasado y dar una perspectiva crítica."`}
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleGenerate}
                    className="flex-1 py-2 rounded-lg text-sm font-medium bg-violet-600 hover:bg-violet-500 transition-colors"
                  >
                    Generar artículo
                  </button>
                  <button
                    onClick={() => setShowBrief(false)}
                    className="px-3 py-2 rounded-lg text-sm text-zinc-500 hover:text-white transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            )}
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-medium bg-white text-black hover:bg-zinc-100 disabled:opacity-40 transition-colors"
          >
            <Save size={13} />
            {saving ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] h-full">
        {/* Left: metadata */}
        <div className="border-r border-zinc-800 overflow-y-auto p-5 space-y-4 pb-16">
          {/* Locale + Slug */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-zinc-500 mb-1 font-medium">Idioma</label>
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
              <label className="block text-xs text-zinc-500 mb-1 font-medium">Slug</label>
              <input
                type="text"
                value={form.slug}
                onChange={(e) => set('slug', e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-violet-500 font-mono text-zinc-300"
                placeholder="mi-post"
              />
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs text-zinc-500 mb-1 font-medium">Título</label>
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
            <label className="block text-xs text-zinc-500 mb-1 font-medium">
              Descripción{' '}
              <span className="text-zinc-700 font-normal">SEO · max 160</span>
            </label>
            <textarea
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
              rows={2}
              maxLength={160}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-violet-500 resize-none"
              placeholder="Meta descripción para Google"
            />
            <p className="text-right text-xs text-zinc-700">{form.description.length}/160</p>
          </div>

          {/* Category + Date + ReadTime */}
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-xs text-zinc-500 mb-1 font-medium">Categoría</label>
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
              <label className="block text-xs text-zinc-500 mb-1 font-medium">Fecha</label>
              <input
                type="date"
                value={form.date}
                onChange={(e) => set('date', e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-violet-500 text-white"
              />
            </div>
            <div>
              <label className="block text-xs text-zinc-500 mb-1 font-medium">Min</label>
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
            <label className="block text-xs text-zinc-500 mb-1 font-medium">
              Tags{' '}
              <span className="text-zinc-700 font-normal">separados por coma</span>
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
            <span className="text-sm text-zinc-300">Post destacado</span>
          </label>

          {/* Insert image */}
          <div className="border-t border-zinc-800 pt-4">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs text-zinc-500 font-medium flex items-center gap-1.5">
                <ImagePlus size={12} /> Insertar imagen
              </label>
              <a
                href="/admin/media"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 text-xs text-zinc-600 hover:text-violet-400 transition-colors"
              >
                <ExternalLink size={10} /> Media
              </a>
            </div>
            <div className="flex gap-2">
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleInsertImage()}
                className="flex-1 bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-violet-500 font-mono"
                placeholder="https://res.cloudinary.com/..."
              />
              <button
                onClick={handleInsertImage}
                className="px-3 py-2 rounded-lg text-xs font-medium bg-zinc-800 hover:bg-zinc-700 transition-colors"
              >
                Insertar
              </button>
            </div>
          </div>
        </div>

        {/* Right: content editor */}
        <div className="flex flex-col overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2 border-b border-zinc-800 bg-zinc-900/30 shrink-0">
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
            className="flex-1 w-full bg-[#0d0d0d] px-6 py-5 text-sm font-mono text-zinc-300 focus:outline-none resize-none leading-7 placeholder-zinc-800 overflow-y-auto"
            placeholder={`## Título de sección\n\nEscribe el contenido aquí en markdown/MDX...\n\n**Texto en negrita** y _cursiva_\n\n- Item de lista\n- Otro item`}
          />
        </div>
      </div>
    </div>
  );
}
