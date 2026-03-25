import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { generateBlogPost } from '@/lib/gemini';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const geminiEnabled = process.env.USE_GEMINI === 'true';

export async function POST(req: NextRequest) {
  const { title, brief, locale, category, model = 'gemini' } = await req.json();

  if (!title && !brief) {
    return NextResponse.json({ error: 'title o brief es requerido' }, { status: 400 });
  }

  // Gemini (free) — only when enabled
  if (model === 'gemini' && geminiEnabled) {
    try {
      const result = await generateBlogPost({ title, brief, locale, category });
      return NextResponse.json(result);
    } catch (err) {
      const msg = err instanceof Error ? err.message : '';
      const isQuota = msg.includes('429') || msg.includes('quota') || msg.includes('RESOURCE_EXHAUSTED');
      if (!isQuota) throw err;
      console.warn('[generate] Gemini quota exceeded, falling back to gpt-4o-mini');
    }
  }

  // OpenAI fallback
  const lang = locale === 'en' ? 'English' : 'Spanish';
  const catHint = category ?? 'ia';

  const userPrompt = [
    title ? `Title (working): "${title}"` : null,
    brief ? `Brief / angle: ${brief}` : null,
    `Category: ${catHint}`,
    '',
    `Return a JSON object with these exact keys:
{
  "title": "string — final polished title",
  "description": "string — 1-2 sentence meta description, max 160 chars",
  "content": "string — full MDX content, 600-900 words, use ## and ### headings, bold key terms with **text**, include bullet lists where relevant, NO frontmatter",
  "category": "string — one of: ia | desarrollo | herramientas",
  "tags": ["array", "of", "3-5", "tags"],
  "readTime": number
}`,
  ]
    .filter(Boolean)
    .join('\n');

  const completion = await openai.chat.completions.create({
    model: model === 'gpt-4o' ? 'gpt-4o' : 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: `You are a sharp tech blogger for dahoofficial.com — a personal brand site by Diego "Daho" Hernández, a Colombian full-stack developer and content creator. Write in ${lang}. Style: direct, no fluff, informed opinions, first-person perspective where natural. Return valid JSON only, no markdown fences.`,
      },
      { role: 'user', content: userPrompt },
    ],
    response_format: { type: 'json_object' },
    temperature: 0.75,
  });

  const result = JSON.parse(completion.choices[0].message.content!);
  return NextResponse.json(result);
}
