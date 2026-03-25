import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';

const contentDir = path.join(process.cwd(), 'src', 'content', 'blog');

// GET all posts or a single post (?slug=X&locale=Y)
export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const slug = searchParams.get('slug');
  const locale = searchParams.get('locale');

  if (slug && locale) {
    const filePath = path.join(contentDir, locale, `${slug}.mdx`);
    try {
      const raw = await fs.readFile(filePath, 'utf-8');
      const { data, content } = matter(raw);
      return NextResponse.json({ slug, locale, content, ...data });
    } catch {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
  }

  // Find post by id + locale (for locale switching with different slugs)
  const id = searchParams.get('id');
  if (id && locale) {
    const dir = path.join(contentDir, locale);
    try {
      const files = await fs.readdir(dir);
      for (const file of files.filter((f) => f.endsWith('.mdx'))) {
        const raw = await fs.readFile(path.join(dir, file), 'utf-8');
        const { data, content } = matter(raw);
        if (data.id === id) {
          const fileSlug = file.replace('.mdx', '');
          return NextResponse.json({ slug: fileSlug, locale, content, ...data });
        }
      }
    } catch { /* dir doesn't exist */ }
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  // List all posts
  const locales = ['es', 'en'];
  const posts: Record<string, unknown>[] = [];

  for (const loc of locales) {
    const dir = path.join(contentDir, loc);
    try {
      const files = await fs.readdir(dir);
      for (const file of files.filter((f) => f.endsWith('.mdx'))) {
        const raw = await fs.readFile(path.join(dir, file), 'utf-8');
        const { data } = matter(raw);
        posts.push({ slug: file.replace('.mdx', ''), locale: loc, ...data });
      }
    } catch {
      // dir doesn't exist yet
    }
  }

  return NextResponse.json(posts);
}

// POST - create or update a post
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { locale, slug, originalSlug, id, title, description, date, category, tags, readTime, featured, content } = body;

  if (!locale || !slug || !title) {
    return NextResponse.json({ error: 'locale, slug y title son requeridos' }, { status: 400 });
  }

  const dir = path.join(contentDir, locale);
  await fs.mkdir(dir, { recursive: true });

  const fileContent = matter.stringify(content ?? '', {
    id: id || slug,
    title,
    description,
    date,
    category,
    tags: Array.isArray(tags) ? tags : (tags as string).split(',').map((t: string) => t.trim()).filter(Boolean),
    readTime: Number(readTime) || 5,
    featured: Boolean(featured),
  });

  await fs.writeFile(path.join(dir, `${slug}.mdx`), fileContent, 'utf-8');

  // If slug was renamed, delete the old file
  if (originalSlug && originalSlug !== slug) {
    const oldPath = path.join(dir, `${originalSlug}.mdx`);
    await fs.unlink(oldPath).catch(() => null);
  }

  return NextResponse.json({ ok: true });
}

// DELETE - remove a post
export async function DELETE(req: NextRequest) {
  const { locale, slug } = await req.json();
  const filePath = path.join(contentDir, locale, `${slug}.mdx`);
  try {
    await fs.unlink(filePath);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'No encontrado' }, { status: 404 });
  }
}
