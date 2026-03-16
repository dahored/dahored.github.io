'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

interface PhotoZoomSectionProps {
  src: string;
  alt: string;
  label?: string;
  heading?: string;
  badge?: string;
}

export default function PhotoZoomSection({ src, alt, label, heading, badge }: PhotoZoomSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const section = sectionRef.current;
      if (!section) return;
      const rect = section.getBoundingClientRect();
      const p = (window.innerHeight - rect.top) / window.innerHeight;
      setProgress(Math.max(0, Math.min(1, p)));
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scale = 0.38 + progress * 0.62;
  const radius = Math.round(40 * (1 - progress));
  // Overlay darkens from 0 → 0.55 as image grows
  const overlayOpacity = progress * 0.55;
  // Text fades in during the last 35% of the zoom
  const textOpacity = Math.max(0, (progress - 0.65) / 0.35);

  return (
    <div
      ref={sectionRef}
      className="relative bg-black"
      style={{ height: '100vh' }}
    >
      <div className="sticky top-0 h-screen w-full flex items-center justify-center bg-black overflow-hidden">
        <div
          className="relative w-full h-full overflow-hidden"
          style={{ transform: `scale(${scale})`, borderRadius: `${radius}px` }}
        >
          <Image
            src={src}
            alt={alt}
            fill
            className="object-cover object-center"
            sizes="100vw"
            priority
          />

          {/* Dark overlay — grows with zoom */}
          <div
            className="absolute inset-0"
            style={{ background: `rgba(0,0,0,${overlayOpacity})` }}
          />

          {/* Bottom gradient */}
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.6) 100%)' }}
          />

          {/* Centered text — fades in at end of zoom */}
          <div
            className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-center px-6"
            style={{ opacity: textOpacity }}
          >
            {label && (
              <p className="text-sm font-medium tracking-widest uppercase text-white/60">
                {label}
              </p>
            )}
            {heading && (
              <h2
                className="font-bold text-white"
                style={{ fontSize: 'clamp(2rem, 5vw, 4.5rem)', letterSpacing: '-0.03em', lineHeight: 1.1 }}
              >
                {heading}
              </h2>
            )}
          </div>

          {/* Badge bottom */}
          {badge && (
            <div
              className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-2"
              style={{ opacity: textOpacity }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
              <span className="text-sm font-medium text-emerald-400">{badge}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
