import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { v2 as cloudinary } from 'cloudinary';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: NextRequest) {
  const { prompt, slug } = await req.json();

  if (!prompt) {
    return NextResponse.json({ error: 'prompt es requerido' }, { status: 400 });
  }

  // Generate with DALL-E 3
  const imageResponse = await openai.images.generate({
    model: 'dall-e-3',
    prompt,
    size: '1792x1024',
    quality: 'standard',
    n: 1,
  });

  const tempUrl = imageResponse.data?.[0]?.url;
  if (!tempUrl) {
    return NextResponse.json({ error: 'DALL-E no devolvió imagen' }, { status: 500 });
  }

  // Upload to Cloudinary (accepts public URLs directly)
  const uploaded = await cloudinary.uploader.upload(tempUrl, {
    folder: 'blog',
    public_id: slug ? `${slug}-${Date.now()}` : undefined,
    overwrite: false,
  });

  return NextResponse.json({
    url: uploaded.secure_url,
    public_id: uploaded.public_id,
    width: uploaded.width,
    height: uploaded.height,
  });
}
