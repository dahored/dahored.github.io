import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export function getGeminiModel(model = 'gemini-1.5-flash') {
  return genAI.getGenerativeModel({ model });
}

/** Translate a short prompt to English (for image generation). */
export async function translatePromptToEnglish(prompt: string): Promise<string> {
  const model = getGeminiModel();
  const result = await model.generateContent(
    `Translate the following image generation prompt to English. Return only the translated prompt, no explanations.\n\n${prompt}`
  );
  return result.response.text().trim() || prompt;
}

/** Generate a full blog post using Gemini. Returns parsed JSON. */
export async function generateBlogPost(opts: {
  title?: string;
  brief?: string;
  locale: string;
  category?: string;
}): Promise<{ title: string; description: string; content: string; category: string; tags: string[]; readTime: number }> {
  const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
    generationConfig: { responseMimeType: 'application/json' },
  });

  const lang = opts.locale === 'en' ? 'English' : 'Spanish';
  const catHint = opts.category ?? 'ia';

  const parts = [
    opts.title ? `Title (working): "${opts.title}"` : null,
    opts.brief ? `Brief / angle: ${opts.brief}` : null,
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
  ].filter(Boolean).join('\n');

  const result = await model.generateContent(
    `You are a sharp tech blogger for dahoofficial.com — a personal brand site by Diego "Daho" Hernández, a Colombian full-stack developer and content creator. Write in ${lang}. Style: direct, no fluff, informed opinions, first-person perspective where natural. Return valid JSON only.\n\n${parts}`
  );

  return JSON.parse(result.response.text());
}

/** Translate a full blog post using Gemini. Returns parsed JSON. */
export async function translateBlogPost(
  content: string,
  title: string,
  description: string,
  from: string,
  to: string,
): Promise<{ title: string; description: string; content: string }> {
  const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
    generationConfig: { responseMimeType: 'application/json' },
  });

  const result = await model.generateContent(
    `You are a professional translator for a tech blog (dahoofficial.com). Translate from ${from} to ${to}.
Rules:
- Preserve ALL markdown/MDX formatting exactly: ##, ###, **bold**, _italic_, - lists, > blockquotes, \`code\`, etc.
- Keep technical terms, brand names, and code snippets untranslated
- Match the same tone and style as the original
- Return valid JSON only

Translate this blog post from ${from} to ${to}.

Source title: ${title}
Source description: ${description}
Source content:
${content}

Return a JSON object with:
{
  "title": "translated title",
  "description": "translated meta description (max 160 chars)",
  "content": "full translated MDX content, preserving all markdown formatting"
}`
  );

  return JSON.parse(result.response.text());
}
