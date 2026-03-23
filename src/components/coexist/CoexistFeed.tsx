'use client';

import { useState } from 'react';
import Image from 'next/image';
import { X } from 'lucide-react';

interface Post {
  id: number;
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

export default function CoexistFeed({ posts, allTopics, allLabel, closeLabel }: Props) {
  const [activeTopic, setActiveTopic] = useState<string | null>(null);
  const [selected, setSelected] = useState<Post | null>(null);

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
          <button
            key={post.id}
            onClick={() => setSelected(post)}
            className="group relative aspect-square rounded-2xl overflow-hidden focus:outline-none cursor-pointer"
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
          </button>
        ))}
      </div>

      {/* Modal */}
      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)' }}
          onClick={() => setSelected(null)}
        >
          <div
            className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl"
            style={{ background: '#111', border: '1px solid rgba(255,255,255,0.1)' }}
            onClick={e => e.stopPropagation()}
          >
            {/* Image */}
            {selected.media_path_remote && (
              <div className="relative w-full aspect-square">
                <Image
                  src={selected.media_path_remote}
                  alt={selected.default_phrase || selected.topic}
                  fill
                  className="object-cover rounded-t-3xl"
                  sizes="672px"
                />
              </div>
            )}

            {/* Content */}
            <div className="p-6 flex flex-col gap-4">
              <span className="text-xs font-semibold tracking-widest uppercase text-[#C8344A]">
                {selected.topic}
              </span>
              <p className="text-lg font-semibold text-white leading-snug">
                {selected.default_phrase}
              </p>
              <p className="text-sm text-zinc-400 leading-relaxed">
                {selected.meta_content}
              </p>
              {(selected.hashtags_instagram?.length ?? 0) > 0 && (
                <p className="text-xs text-zinc-600 leading-relaxed">
                  {selected.hashtags_instagram?.join(' ')}
                </p>
              )}
            </div>

            {/* Close */}
            <button
              onClick={() => setSelected(null)}
              className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center transition-colors"
              style={{ background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.2)' }}
              aria-label={closeLabel}
            >
              <X className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
