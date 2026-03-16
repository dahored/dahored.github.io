'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

interface PhotoZoomSectionProps {
  src: string;
  alt: string;
  badge?: string;
}

export default function PhotoZoomSection({ src, alt, badge }: PhotoZoomSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const section = sectionRef.current;
      if (!section) return;
      const rect = section.getBoundingClientRect();
      // Progress 0 → 1 as section enters from bottom until rect.top = 0
      // So zoom is complete exactly when the section hits the top of the viewport
      const p = (window.innerHeight - rect.top) / window.innerHeight;
      setProgress(Math.max(0, Math.min(1, p)));
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scale = 0.38 + progress * 0.62;
  const radius = Math.round(40 * (1 - progress));

  return (
    <div
      ref={sectionRef}
      className="relative bg-black"
      style={{ height: '130vh' }}
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
          {/* Bottom gradient */}
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.7) 100%)' }}
          />
          {/* Badge */}
          {badge && progress > 0.75 && (
            <div
              className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-2"
              style={{ opacity: (progress - 0.75) / 0.25, transition: 'opacity 0.2s' }}
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
