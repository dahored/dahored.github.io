import PostForm, { type PostFormData } from '../../_components/PostForm';

interface Props {
  searchParams: Promise<{ slug?: string; locale?: string }>;
}

export default async function NewPostPage({ searchParams }: Props) {
  const { slug, locale } = await searchParams;
  const initial: Partial<PostFormData> = {};
  if (slug) initial.slug = slug;
  if (locale === 'es' || locale === 'en') initial.locale = locale;

  return <PostForm mode="new" initial={Object.keys(initial).length ? { ...getDefaults(), ...initial } : undefined} />;
}

function getDefaults(): PostFormData {
  return {
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
  };
}
