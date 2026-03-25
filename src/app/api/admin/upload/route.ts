import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// POST - upload a local file to Cloudinary
export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get('file') as File | null;

  if (!file) {
    return NextResponse.json({ error: 'No se recibió ningún archivo' }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const result = await new Promise<Record<string, unknown>>((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder: 'blog',
          resource_type: 'image',
        },
        (error, res) => {
          if (error) reject(error);
          else resolve(res as Record<string, unknown>);
        }
      )
      .end(buffer);
  });

  return NextResponse.json({
    url: result.secure_url,
    public_id: result.public_id,
    width: result.width,
    height: result.height,
  });
}
