'use client';

import Image from 'next/image';
import { useState, useEffect, useCallback, useRef } from 'react';
import { Play } from 'lucide-react';
import CarouselControls from '@/components/ui/CarouselControls';
import type { InstagramPost } from '@/lib/instagram';

function getPostImage(post: InstagramPost): string {
  return post.thumbnail_url ?? post.media_url;
}

const GAP = 16;
const DRAG_THRESHOLD = 50;
const CLONE_COUNT = 3;

interface AdventuresCarouselProps {
  posts: InstagramPost[];
  fallbackGradient?: string;
  brandName?: string;
}

export default function AdventuresCarousel({
  posts,
  fallbackGradient = 'linear-gradient(135deg, #0ea5e9 0%, #0369a1 100%)',
  brandName = 'Daho Adventures',
}: AdventuresCarouselProps) {
  // Cloned track: last CLONE_COUNT items + all posts + first CLONE_COUNT items
  const cloned = [
    ...posts.slice(-CLONE_COUNT),
    ...posts,
    ...posts.slice(0, CLONE_COUNT),
  ];

  const [current, setCurrent] = useState(CLONE_COUNT); // start at first real item
  const [hovered, setHovered] = useState(false);
  const [userPaused, setUserPaused] = useState(false);
  const [isSnapping, setIsSnapping] = useState(false);
  const paused = hovered || userPaused;

  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [trackOffset, setTrackOffset] = useState(0);

  const dragStartX = useRef<number | null>(null);
  const dragDelta = useRef(0);
  const isDragging = useRef(false);
  const [dragOffset, setDragOffset] = useState(0);

  // Real 0-based index within original posts (for dots)
  const realIndex = ((current - CLONE_COUNT) % posts.length + posts.length) % posts.length;

  const calcOffset = useCallback((idx: number) => {
    const container = containerRef.current;
    const card = cardRef.current;
    if (!container || !card) return;
    const center = container.offsetWidth / 2;
    const cardWidth = card.offsetWidth;
    setTrackOffset(center - idx * (cardWidth + GAP) - cardWidth / 2);
  }, []);

  useEffect(() => {
    const id = requestAnimationFrame(() => calcOffset(current));
    return () => cancelAnimationFrame(id);
  }, [current, calcOffset]);

  useEffect(() => {
    const onResize = () => calcOffset(current);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [current, calcOffset]);

  const next = useCallback(() => setCurrent(c => c + 1), []);
  const goTo = (i: number) => setCurrent(i + CLONE_COUNT);

  // After animation ends, silently snap from clone position back to real position
  const handleTransitionEnd = useCallback(() => {
    if (current < CLONE_COUNT) {
      setIsSnapping(true);
      setCurrent(current + posts.length);
    } else if (current >= CLONE_COUNT + posts.length) {
      setIsSnapping(true);
      setCurrent(current - posts.length);
    }
  }, [current, posts.length]);

  // Re-enable transition one frame after the silent snap
  useEffect(() => {
    if (!isSnapping) return;
    const id = requestAnimationFrame(() => requestAnimationFrame(() => setIsSnapping(false)));
    return () => cancelAnimationFrame(id);
  }, [isSnapping]);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(next, 4000);
    return () => clearInterval(t);
  }, [paused, next]);

  const onPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType === 'mouse') return;
    dragStartX.current = e.clientX;
    dragDelta.current = 0;
    isDragging.current = false;
    setDragOffset(0);
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (e.pointerType === 'mouse' || dragStartX.current === null) return;
    const delta = e.clientX - dragStartX.current;
    dragDelta.current = delta;
    if (Math.abs(delta) > 5) isDragging.current = true;
    setDragOffset(delta);
  };

  const onPointerUp = (e: React.PointerEvent) => {
    if (e.pointerType === 'mouse' || dragStartX.current === null) return;
    const delta = dragDelta.current;
    if (Math.abs(delta) >= DRAG_THRESHOLD) {
      if (delta < 0) setCurrent(c => c + 1);
      else setCurrent(c => c - 1);
    }
    dragStartX.current = null;
    dragDelta.current = 0;
    setDragOffset(0);
    setTimeout(() => { isDragging.current = false; }, 0);
  };

  return (
    <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      <div ref={containerRef} className="relative overflow-hidden">
        <div className="hidden sm:block absolute left-0 inset-y-0 w-[10%] bg-linear-to-r from-zinc-950 to-transparent z-10 pointer-events-none" />
        <div className="hidden sm:block absolute right-0 inset-y-0 w-[10%] bg-linear-to-l from-zinc-950 to-transparent z-10 pointer-events-none" />

        <div
          className="flex py-4 select-none"
          style={{
            transform: `translateX(${trackOffset + dragOffset}px)`,
            gap: `${GAP}px`,
            transition: isSnapping || dragOffset !== 0 ? 'none' : 'transform 500ms ease-in-out',
            touchAction: 'pan-y',
          }}
          onTransitionEnd={handleTransitionEnd}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        >
          {cloned.map((post, i) => {
            const img = getPostImage(post);
            return (
              <div
                key={`${post.id}-${i}`}
                ref={i === 0 ? cardRef : undefined}
                className="shrink-0 w-64 transition-all duration-500 cursor-pointer"
                style={{ opacity: i === current ? 1 : 0.45, scale: i === current ? '1' : '0.97' }}
                onClick={() => { if (!isDragging.current) setCurrent(i); }}
              >
                <a
                  href={post.permalink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative block h-80 rounded-3xl overflow-hidden border border-zinc-800/60"
                  onClick={(e) => { if (isDragging.current) e.preventDefault(); }}
                >
                  {img ? (
                    <Image
                      src={img}
                      alt={post.caption?.slice(0, 80) || brandName}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="256px"
                      unoptimized
                    />
                  ) : (
                    <div className="w-full h-full" style={{ background: fallbackGradient }} />
                  )}

                  {post.media_type === 'VIDEO' && (
                    <span className="absolute top-3 right-3 flex items-center gap-1 text-white text-xs bg-black/60 px-2 py-0.5 rounded-full">
                      <Play className="w-3 h-3 fill-white" />
                      Reel
                    </span>
                  )}

                  <div className="absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                    <p className="text-white text-xs leading-snug line-clamp-3">{post.caption}</p>
                  </div>
                </a>
              </div>
            );
          })}
        </div>
      </div>

      <CarouselControls
        count={posts.length}
        current={realIndex}
        paused={userPaused}
        onGoTo={goTo}
        onTogglePause={() => setUserPaused(p => !p)}
        className="mt-6"
        theme="dark"
      />
    </div>
  );
}
