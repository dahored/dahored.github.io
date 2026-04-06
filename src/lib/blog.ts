import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export interface PostMeta {
  slug: string;
  title: string;
  description: string;
  date: string;
  category: string;
  tags: string[];
  readTime: number;
  featured: boolean;
  image?: string;
}

export interface Post extends PostMeta {
  content: string;
}

const contentDir = path.join(process.cwd(), 'src', 'content', 'blog');

export function getAllPosts(locale: string): PostMeta[] {
  const dir = path.join(contentDir, locale);
  if (!fs.existsSync(dir)) return [];

  const files = fs.readdirSync(dir).filter((f) => f.endsWith('.mdx'));

  const posts: PostMeta[] = files.map((filename) => {
    const slug = filename.replace(/\.mdx$/, '');
    const raw = fs.readFileSync(path.join(dir, filename), 'utf-8');
    const { data } = matter(raw);
    return {
      slug,
      title: data.title as string,
      description: data.description as string,
      date: data.date as string,
      category: data.category as string,
      tags: (data.tags as string[]) ?? [],
      readTime: (data.readTime as number) ?? 5,
      featured: (data.featured as boolean) ?? false,
      image: (data.image as string) ?? '',
    };
  });

  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getPost(locale: string, slug: string): Post | null {
  const filePath = path.join(contentDir, locale, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(raw);

  return {
    slug,
    title: data.title as string,
    description: data.description as string,
    date: data.date as string,
    category: data.category as string,
    tags: (data.tags as string[]) ?? [],
    readTime: (data.readTime as number) ?? 5,
    featured: (data.featured as boolean) ?? false,
    image: (data.image as string) ?? '',
    content,
  };
}

export function getAllSlugs(): string[] {
  const slugs = new Set<string>();
  for (const locale of ['es', 'en']) {
    const dir = path.join(contentDir, locale);
    if (!fs.existsSync(dir)) continue;
    fs.readdirSync(dir)
      .filter((f) => f.endsWith('.mdx'))
      .forEach((f) => slugs.add(f.replace(/\.mdx$/, '')));
  }
  return Array.from(slugs);
}

/** Get the frontmatter `id` of a post by slug, searching any locale. */
export function getPostIdBySlug(slug: string): string | null {
  for (const locale of ['es', 'en']) {
    const filePath = path.join(contentDir, locale, `${slug}.mdx`);
    if (fs.existsSync(filePath)) {
      const { data } = matter(fs.readFileSync(filePath, 'utf-8'));
      return (data.id as string) || null;
    }
  }
  return null;
}

/** Find a post in `locale` whose frontmatter `id` matches the given value. */
export function getPostById(locale: string, id: string): (Post & { slug: string }) | null {
  const dir = path.join(contentDir, locale);
  if (!fs.existsSync(dir)) return null;
  for (const file of fs.readdirSync(dir).filter((f) => f.endsWith('.mdx'))) {
    const raw = fs.readFileSync(path.join(dir, file), 'utf-8');
    const { data, content } = matter(raw);
    if (data.id === id) {
      const slug = file.replace(/\.mdx$/, '');
      return {
        slug,
        title: data.title as string,
        description: data.description as string,
        date: data.date as string,
        category: data.category as string,
        tags: (data.tags as string[]) ?? [],
        readTime: (data.readTime as number) ?? 5,
        featured: (data.featured as boolean) ?? false,
        image: (data.image as string) ?? '',
        content,
      };
    }
  }
  return null;
}
