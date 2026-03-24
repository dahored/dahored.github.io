export interface InstagramAccount {
  name: string;
  biography?: string;
  followers_count: number;
  media_count: number;
  profile_picture_url?: string;
}

export interface InstagramPost {
  id: string;
  caption?: string;
  media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
  media_url: string;
  thumbnail_url?: string;
  permalink: string;
  timestamp: string;
}

interface InstagramResponse {
  data: InstagramPost[];
  paging?: {
    cursors: { before: string; after: string };
    next?: string;
  };
}

const BASE = 'https://graph.facebook.com/v25.0';
const TOKEN = process.env.INSTAGRAM_ACCESS_TOKEN;

const IG_FIELDS = 'id,caption,media_type,media_url,thumbnail_url,permalink,timestamp';

export async function fetchInstagramPosts(
  igUserId: string,
  limit = 24
): Promise<InstagramPost[]> {
  if (!TOKEN) throw new Error('INSTAGRAM_ACCESS_TOKEN not set');

  const [mediaRes, reelsRes] = await Promise.allSettled([
    fetch(`${BASE}/${igUserId}/media?fields=${IG_FIELDS}&limit=${limit}&access_token=${TOKEN}`, { next: { revalidate: 3600 } }),
    fetch(`${BASE}/${igUserId}/reels?fields=${IG_FIELDS}&limit=${limit}&access_token=${TOKEN}`, { next: { revalidate: 3600 } }),
  ]);

  const media: InstagramPost[] = mediaRes.status === 'fulfilled' && mediaRes.value.ok
    ? ((await mediaRes.value.json()) as InstagramResponse).data
    : [];

  const reels: InstagramPost[] = reelsRes.status === 'fulfilled' && reelsRes.value.ok
    ? ((await reelsRes.value.json()) as InstagramResponse).data
    : [];

  // Merge, deduplicate by id, sort newest first, cap at limit
  const seen = new Set<string>();
  return [...media, ...reels]
    .filter(p => { if (seen.has(p.id)) return false; seen.add(p.id); return true; })
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, limit);
}

export async function fetchInstagramAccount(igUserId: string): Promise<InstagramAccount> {
  if (!TOKEN) throw new Error('INSTAGRAM_ACCESS_TOKEN not set');
  const fields = 'name,biography,followers_count,media_count,profile_picture_url';
  const url = `${BASE}/${igUserId}?fields=${fields}&access_token=${TOKEN}`;
  const res = await fetch(url, { next: { revalidate: 3600 } });
  if (!res.ok) throw new Error(`Instagram API error: ${res.status}`);
  return res.json();
}

export interface FacebookPage {
  fan_count: number;
  name: string;
}

export async function fetchFacebookPage(pageUsername: string): Promise<FacebookPage> {
  if (!TOKEN) throw new Error('INSTAGRAM_ACCESS_TOKEN not set');
  const url = `${BASE}/${pageUsername}?fields=name,fan_count&access_token=${TOKEN}`;
  const res = await fetch(url, { next: { revalidate: 3600 } });
  if (!res.ok) throw new Error(`Facebook API error: ${res.status}`);
  return res.json();
}

export function getPostImage(post: InstagramPost): string {
  // For videos/reels use thumbnail, for images use media_url
  return post.thumbnail_url ?? post.media_url;
}
