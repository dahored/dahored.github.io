import AnimatedTagline from '@/components/ui/AnimatedTagline';

interface HeroTaglineProps {
  lines: string[];
  className?: string;
}

// Render AnimatedTagline directly — starts with visible=true and lines[0],
// matching SSR output exactly, so no hydration mismatch and no DOM swap
// that would trigger a late LCP re-evaluation.
export default function HeroTagline({ lines, className = '' }: HeroTaglineProps) {
  return <AnimatedTagline lines={lines} className={className} />;
}
