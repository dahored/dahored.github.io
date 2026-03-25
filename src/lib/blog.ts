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
    content,
  };
}

export function getAllSlugs(): string[] {
  const dir = path.join(contentDir, 'es');
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.mdx'))
    .map((f) => f.replace(/\.mdx$/, ''));
}
