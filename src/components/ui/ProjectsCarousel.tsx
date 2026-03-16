'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import CarouselControls from '@/components/ui/CarouselControls';

export interface ProjectSlide {
  id: string;
  name: string;
  tagline: string;
  banner: string;
  logo: string;
  href: string;
  exploreLabel: string;
  comingSoon?: boolean;
  comingSoonLabel?: string;
}

const GAP = 20;
const DRAG_THRESHOLD = 50;

export default function ProjectsCarousel({ projects }: { projects: ProjectSlide[] }) {
  const [current, setCurrent] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [userPaused, setUserPaused] = useState(false);
  const paused = hovered || userPaused;
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [trackOffset, setTrackOffset] = useState(0);

  const dragStartX = useRef<number | null>(null);
  const dragDelta = useRef(0);
  const isDragging = useRef(false);
  const [dragOffset, setDragOffset] = useState(0);

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

  const next = useCallback(() => setCurrent((c) => (c + 1) % projects.length), [projects.length]);
  const goTo = (i: number) => setCurrent(i);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(next, 5000);
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
      if (delta < 0) setCurrent((c) => (c + 1) % projects.length);
      else setCurrent((c) => (c - 1 + projects.length) % projects.length);
    }
    dragStartX.current = null;
    dragDelta.current = 0;
    setDragOffset(0);
    setTimeout(() => { isDragging.current = false; }, 0);
  };

  return (
    <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      {/* Track */}
      <div ref={containerRef} className="relative overflow-hidden">
        {/* Edge fades */}
        <div className="hidden sm:block absolute left-0 inset-y-0 w-[12%] bg-linear-to-r from-black to-transparent z-10 pointer-events-none" />
        <div className="hidden sm:block absolute right-0 inset-y-0 w-[12%] bg-linear-to-l from-black to-transparent z-10 pointer-events-none" />

        <div
          className="flex py-4 select-none"
          style={{
            transform: `translateX(${trackOffset + dragOffset}px)`,
            gap: `${GAP}px`,
            transition: dragOffset !== 0 ? 'none' : 'transform 500ms ease-in-out',
            touchAction: 'pan-y',
          }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        >
          {projects.map((project, i) => (
            <div
              key={project.id}
              ref={i === 0 ? cardRef : undefined}
              className="shrink-0 w-[85vw] max-w-3xl transition-all duration-500 cursor-pointer"
              style={{ opacity: i === current ? 1 : 0.45, scale: i === current ? '1' : '0.97' }}
              onClick={() => { if (!isDragging.current) goTo(i); }}
            >
              <div className="relative rounded-2xl overflow-hidden md:aspect-video min-h-90 border border-zinc-800/60">
                {project.comingSoon ? (
                  <div className="absolute inset-0 bg-zinc-900 flex flex-col items-center justify-center gap-5">
                    <Image
                      src={project.logo}
                      alt={project.name}
                      width={80}
                      height={80}
                      className="rounded-2xl opacity-60"
                    />
                    <span className="px-4 py-1.5 rounded-full bg-zinc-800 border border-zinc-700/60 text-zinc-400 text-sm font-semibold tracking-widest uppercase">
                      {project.comingSoonLabel}
                    </span>
                  </div>
                ) : (
                  <>
                    <Image
                      src={project.banner}
                      alt={project.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 85vw, 768px"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-zinc-950/80 via-zinc-950/10 to-transparent" />
                  </>
                )}

                {/* Info overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6 flex items-end justify-between gap-4 pointer-events-none">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold text-white leading-tight">
                      {project.name}
                    </h3>
                    <p className="text-sm text-zinc-400 mt-0.5">{project.tagline}</p>
                  </div>
                  {!project.comingSoon && (
                    <a
                      href={project.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="pointer-events-auto flex items-center gap-1.5 px-6 py-2 h-13 rounded-full bg-white/15 border border-white/20 backdrop-blur-sm text-white text-base font-semibold hover:bg-white/25 transition-colors shrink-0"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {project.exploreLabel}
                      <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <CarouselControls
        count={projects.length}
        current={current}
        paused={userPaused}
        onGoTo={goTo}
        onTogglePause={() => setUserPaused((p) => !p)}
        className="mt-6"
        theme="dark"
      />
    </div>
  );
}
