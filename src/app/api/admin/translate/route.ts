import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const contentDir = path.join(process.cwd(), 'src', 'content', 'blog');

export async function POST(req: NextRequest) {
  const { slug, fromLocale, toLocale } = await req.json();

  if (!slug || !fromLocale || !toLocale) {
    return NextResponse.json({ error: 'slug, fromLocale y toLocale son requeridos' }, { status: 400 });
  }

  // Read source post
  const filePath = path.join(contentDir, fromLocale, `${slug}.mdx`);
  let raw: string;
  try {
    raw = await fs.readFile(filePath, 'utf-8');
  } catch {
    return NextResponse.json({ error: `Post no encontrado: ${fromLocale}/${slug}` }, { status: 404 });
  }

  const { data, content } = matter(raw);

  const langNames: Record<string, string> = { es: 'Spanish', en: 'English' };
  const from = langNames[fromLocale] ?? fromLocale;
  const to = langNames[toLocale] ?? toLocale;

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      {
        role: 'system',
        content: `You are a professional translator for a tech blog (dahoofficial.com). Translate from ${from} to ${to}.
Rules:
- Preserve ALL markdown/MDX formatting exactly: ##, ###, **bold**, _italic_, - lists, > blockquotes, \`code\`, etc.
- Keep technical terms, brand names, and code snippets untranslated
- Match the same tone and style as the original
- Return valid JSON only, no markdown fences`,
      },
      {
        role: 'user',
        content: `Translate this blog post from ${from} to ${to}.

Source title: ${data.title}
Source description: ${data.description}
Source content:
${content}

Return a JSON object with:
{
  "title": "translated title",
  "description": "translated meta description (max 160 chars)",
  "content": "full translated MDX content, preserving all markdown formatting"
}`,
      },
    ],
    response_format: { type: 'json_object' },
    temperature: 0.3,
  });

  const result = JSON.parse(completion.choices[0].message.content!);

  return NextResponse.json({
    title: result.title,
    description: result.description,
    content: result.content,
    // Keep non-text fields from source
    category: data.category,
    tags: data.tags,
    readTime: data.readTime,
    featured: data.featured,
    date: data.date,
  });
}
