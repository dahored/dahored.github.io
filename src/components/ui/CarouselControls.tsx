'use client';

import { Play, Pause } from 'lucide-react';

interface CarouselControlsProps {
  count: number;
  current: number;
  paused: boolean;
  onGoTo: (i: number) => void;
  onTogglePause: () => void;
  /** 'auto' adapts to light/dark mode; 'dark' forces dark styles */
  theme?: 'auto' | 'dark';
  showPause?: boolean;
  className?: string;
}

export default function CarouselControls({
  count,
  current,
  paused,
  onGoTo,
  onTogglePause,
  theme = 'auto',
  showPause = true,
  className = '',
}: CarouselControlsProps) {
  const isDark = theme === 'dark';

  const pillBg    = isDark ? 'bg-zinc-800'                            : 'bg-zinc-200 dark:bg-white/10 dark:backdrop-blur-md dark:border dark:border-white/15';
  const dotActive = isDark ? 'bg-zinc-100'                            : 'bg-zinc-800 dark:bg-zinc-100';
  const dotIdle   = isDark ? 'bg-zinc-500/70'                         : 'bg-zinc-500 dark:bg-zinc-400';
  const btnBg     = isDark ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300' : 'bg-zinc-200 dark:bg-white/10 dark:backdrop-blur-md dark:border dark:border-white/15 hover:bg-zinc-300 dark:hover:bg-white/20 text-zinc-700 dark:text-zinc-100';

  return (
    <div className={`flex items-center justify-center gap-3 ${className}`}>
      <div className={`flex items-center gap-2.5 px-8 h-13 rounded-full ${pillBg}`}>
        {Array.from({ length: count }).map((_, i) => (
          <button
            key={i}
            onClick={() => onGoTo(i)}
            aria-label={`Slide ${i + 1}`}
            className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
              i === current ? dotActive : dotIdle
            }`}
            style={{ width: i === current ? '28px' : '8px' }}
          />
        ))}
      </div>
      {showPause && (
        <button
          onClick={onTogglePause}
          aria-label={paused ? 'Play' : 'Pause'}
          className={`w-13 h-13 rounded-full flex items-center justify-center transition-colors cursor-pointer ${btnBg}`}
        >
          {paused
            ? <Play className="w-3.5 h-3.5 fill-current" />
            : <Pause className="w-3.5 h-3.5 fill-current" />
          }
        </button>
      )}
    </div>
  );
}
