'use client';

import { useState, useEffect } from 'react';

interface AnimatedTaglineProps {
  lines: string[];
  className?: string;
}

export default function AnimatedTagline({ lines, className = '' }: AnimatedTaglineProps) {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIndex((i) => (i + 1) % lines.length);
        setVisible(true);
      }, 400);
    }, 3000);
    return () => clearInterval(interval);
  }, [lines.length]);

  return (
    <p
      className={`transition-all duration-400 ease-in-out ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
      } ${className}`}
    >
      {lines[index]}
    </p>
  );
}
