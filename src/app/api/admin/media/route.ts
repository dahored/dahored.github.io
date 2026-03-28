import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// GET - list all images (all folders) sorted by newest
export async function GET() {
  const result = await cloudinary.search
    .expression('resource_type:image')
    .sort_by('created_at', 'desc')
    .max_results(200)
    .with_field('tags')
    .execute();

  const images = (result.resources as Record<string, unknown>[]).map((r) => ({
    public_id: r.public_id as string,
    url: r.secure_url as string,
    width: r.width as number,
    height: r.height as number,
    bytes: r.bytes as number,
    created_at: r.created_at as string,
    format: r.format as string,
    folder: (r.folder as string) || '',
  }));

  return NextResponse.json(images);
}

// POST - upload image to Cloudinary
export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get('file') as File | null;
  if (!file) {
    return NextResponse.json({ error: 'file requerido' }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const base64 = `data:${file.type};base64,${buffer.toString('base64')}`;

  const result = await cloudinary.uploader.upload(base64, { folder: 'blog' });

  return NextResponse.json({
    public_id: result.public_id,
    url: result.secure_url,
    width: result.width,
    height: result.height,
    bytes: result.bytes,
    created_at: result.created_at,
    folder: result.folder || '',
  });
}

// DELETE - remove image from Cloudinary
export async function DELETE(req: NextRequest) {
  const { public_id } = await req.json();
  if (!public_id) {
    return NextResponse.json({ error: 'public_id requerido' }, { status: 400 });
  }
  await cloudinary.uploader.destroy(public_id);
  return NextResponse.json({ ok: true });
}
