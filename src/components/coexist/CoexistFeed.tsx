'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';

interface Post {
  id: number;
  slug: string;
  topic: string;
  default_phrase?: string;
  meta_content: string;
  media_path_remote: string;
  post_type?: string;
  theme?: string;
  hashtags_instagram?: string[];
}

interface Props {
  posts: Post[];
  allTopics: string[];
  allLabel: string;
  closeLabel: string;
}

export default function CoexistFeed({ posts, allTopics, allLabel }: Props) {
  const [activeTopic, setActiveTopic] = useState<string | null>(null);

  const filtered = activeTopic ? posts.filter(p => p.topic === activeTopic) : posts;

  return (
    <>
      {/* Topic filters */}
      <div className="flex flex-wrap gap-2 justify-center mb-10">
        <button
          onClick={() => setActiveTopic(null)}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
            activeTopic === null
              ? 'bg-[#C8344A] text-white'
              : 'text-zinc-400 hover:text-white'
          }`}
          style={activeTopic !== null ? { border: '1px solid rgba(255,255,255,0.1)' } : {}}
        >
          {allLabel}
        </button>
        {allTopics.map(topic => (
          <button
            key={topic}
            onClick={() => setActiveTopic(activeTopic === topic ? null : topic)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              activeTopic === topic
                ? 'bg-[#C8344A] text-white'
                : 'text-zinc-400 hover:text-white'
            }`}
            style={activeTopic !== topic ? { border: '1px solid rgba(255,255,255,0.1)' } : {}}
          >
            {topic}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {filtered.map(post => (
          <Link
            key={post.id}
            href={`/coexist/${post.slug}`}
            className="group relative aspect-square rounded-2xl overflow-hidden"
          >
            {post.media_path_remote ? (
              <Image
                src={post.media_path_remote}
                alt={post.default_phrase || post.topic}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center p-4"
                style={{ background: 'linear-gradient(135deg, #C8344A 0%, #8B1A2E 100%)' }}>
                <p className="text-white text-xs text-center font-medium leading-snug line-clamp-5">
                  {post.default_phrase}
                </p>
              </div>
            )}
            {/* Overlay on hover */}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
              <p className="text-white text-xs text-left leading-snug line-clamp-4">
                {post.default_phrase}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
