import PostForm, { type PostFormData } from '../../../_components/PostForm';

interface Props {
  params: Promise<{ locale: string; slug: string }>;
}

async function fetchPost(locale: string, slug: string): Promise<PostFormData | null> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000';
  const res = await fetch(`${baseUrl}/api/admin/posts?slug=${slug}&locale=${locale}`, {
    cache: 'no-store',
  });
  if (!res.ok) return null;
  const data = await res.json();
  return {
    locale: data.locale as 'es' | 'en',
    slug: data.slug,
    title: data.title ?? '',
    description: data.description ?? '',
    date: data.date ?? new Date().toISOString().split('T')[0],
    category: data.category ?? 'ia',
    tags: Array.isArray(data.tags) ? data.tags.join(', ') : (data.tags ?? ''),
    readTime: data.readTime ?? 5,
    featured: data.featured ?? false,
    content: data.content ?? '',
  };
}

export default async function EditPostPage({ params }: Props) {
  const { locale, slug } = await params;
  const initial = await fetchPost(locale, slug);

  if (!initial) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center">
        <p className="text-zinc-500">Post no encontrado: {locale}/{slug}</p>
      </div>
    );
  }

  return <PostForm mode="edit" initial={initial} />;
}
