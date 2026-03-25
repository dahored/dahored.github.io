import { NextRequest, NextResponse } from 'next/server';
import OpenAI, { toFile } from 'openai';
import { v2 as cloudinary } from 'cloudinary';
import { translatePromptToEnglish } from '@/lib/gemini';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const geminiEnabled = process.env.USE_GEMINI === 'true';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const DALLE3_SIZES: Record<string, '1024x1024' | '1792x1024' | '1024x1792'> = {
  '16:9': '1792x1024',
  '1:1':  '1024x1024',
  '9:16': '1024x1792',
};

const GPT_IMAGE_SIZES: Record<string, '1024x1024' | '1536x1024' | '1024x1536'> = {
  '16:9': '1536x1024',
  '1:1':  '1024x1024',
  '9:16': '1024x1536',
};

async function toEnglish(prompt: string): Promise<string> {
  if (geminiEnabled) return translatePromptToEnglish(prompt);
  const res = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: 'Translate the following image generation prompt to English. Return only the translated prompt, no explanations.' },
      { role: 'user', content: prompt },
    ],
    temperature: 0.1,
  });
  return res.choices[0].message.content?.trim() ?? prompt;
}

export async function POST(req: NextRequest) {
  const { prompt, slug, aspectRatio = '16:9', imageModel = 'dalle-3', referenceImage } = await req.json();

  if (!prompt) {
    return NextResponse.json({ error: 'prompt es requerido' }, { status: 400 });
  }

  const englishPrompt = await toEnglish(prompt);
  const folder = 'blog';
  const publicId = slug ? `${slug}-${Date.now()}` : undefined;

  // With reference image → gpt-image-1
  if (referenceImage) {
    const size = GPT_IMAGE_SIZES[aspectRatio] ?? '1024x1024';
    const buffer = Buffer.from(referenceImage as string, 'base64');
    const imageFile = await toFile(buffer, 'reference.png', { type: 'image/png' });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const imageResponse = await (openai.images.edit as any)({
      model: 'gpt-image-1',
      image: imageFile,
      prompt: englishPrompt,
      size,
      n: 1,
    });

    const item = imageResponse.data?.[0];
    const b64 = item?.b64_json;
    const tempUrl = item?.url;

    if (!b64 && !tempUrl) {
      return NextResponse.json({ error: 'gpt-image-1 no devolvió imagen' }, { status: 500 });
    }

    const source = b64 ? `data:image/png;base64,${b64}` : tempUrl;
    const uploaded = await cloudinary.uploader.upload(source, { folder, public_id: publicId, overwrite: false });
    return NextResponse.json({ url: uploaded.secure_url, public_id: uploaded.public_id });
  }

  // DALL-E 2
  if (imageModel === 'dalle-2') {
    const imageResponse = await openai.images.generate({
      model: 'dall-e-2',
      prompt: englishPrompt,
      size: '1024x1024',
      n: 1,
    });

    const tempUrl = imageResponse.data?.[0]?.url;
    if (!tempUrl) return NextResponse.json({ error: 'DALL-E 2 no devolvió imagen' }, { status: 500 });

    const uploaded = await cloudinary.uploader.upload(tempUrl, { folder, public_id: publicId, overwrite: false });
    return NextResponse.json({ url: uploaded.secure_url, public_id: uploaded.public_id, width: uploaded.width, height: uploaded.height });
  }

  // DALL-E 3 (default)
  const size = DALLE3_SIZES[aspectRatio] ?? '1792x1024';
  const imageResponse = await openai.images.generate({
    model: 'dall-e-3',
    prompt: englishPrompt,
    size,
    quality: 'standard',
    n: 1,
  });

  const tempUrl = imageResponse.data?.[0]?.url;
  if (!tempUrl) return NextResponse.json({ error: 'DALL-E 3 no devolvió imagen' }, { status: 500 });

  const uploaded = await cloudinary.uploader.upload(tempUrl, { folder, public_id: publicId, overwrite: false });
  return NextResponse.json({ url: uploaded.secure_url, public_id: uploaded.public_id, width: uploaded.width, height: uploaded.height });
}
