'use client';

import { useState, useEffect } from 'react';
import AnimatedTagline from '@/components/ui/AnimatedTagline';

interface HeroTaglineProps {
  lines: string[];
  className?: string;
}

// Renders first tagline as plain <p> until hydration is complete,
// then swaps to AnimatedTagline. The initial <p> is the SSR LCP element
// and is identical between server and client (no hydration mismatch).
export default function HeroTagline({ lines, className = '' }: HeroTaglineProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Delay swap so LCP is already measured on the static <p>
    const t = setTimeout(() => setMounted(true), 500);
    return () => clearTimeout(t);
  }, []);

  if (!mounted) {
    return <p className={className}>{lines[0]}</p>;
  }

  return <AnimatedTagline lines={lines} className={className} />;
}
