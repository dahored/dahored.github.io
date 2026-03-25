import PostForm, { type PostFormData } from '../../_components/PostForm';

interface Props {
  searchParams: Promise<{ slug?: string; locale?: string; id?: string }>;
}

export default async function NewPostPage({ searchParams }: Props) {
  const { slug, locale, id } = await searchParams;
  const initial: Partial<PostFormData> = {};
  if (slug) initial.slug = slug;
  if (locale === 'es' || locale === 'en') initial.locale = locale;
  if (id) initial.id = id;

  return <PostForm mode="new" initial={Object.keys(initial).length ? { ...getDefaults(), ...initial } : undefined} />;
}

function getDefaults(): PostFormData {
  return {
    id: '',
    locale: 'es',
    slug: '',
    title: '',
    description: '',
    date: (() => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; })(),
    category: 'ia',
    tags: '',
    readTime: 5,
    featured: false,
    content: '',
  };
}
