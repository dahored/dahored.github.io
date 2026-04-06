'use client';

import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

interface AdUnitProps {
  slot: string;
  className?: string;
  format?: 'horizontal' | 'rectangle' | 'vertical' | 'auto';
}

const formatMap: Record<string, { style: React.CSSProperties; dataAdFormat: string; dataFullWidthResponsive?: string }> = {
  horizontal:  { style: { display: 'block' }, dataAdFormat: 'auto', dataFullWidthResponsive: 'true' },
  rectangle:   { style: { display: 'inline-block', width: '300px', height: '250px' }, dataAdFormat: 'rectangle' },
  vertical:    { style: { display: 'inline-block', width: '160px', height: '600px' }, dataAdFormat: 'vertical' },
  auto:        { style: { display: 'block' }, dataAdFormat: 'auto', dataFullWidthResponsive: 'true' },
};

export default function AdUnit({ slot, className = '', format = 'horizontal' }: AdUnitProps) {
  const ref = useRef<HTMLModElement>(null);
  const pushed = useRef(false);

  useEffect(() => {
    if (pushed.current) return;
    try {
      if (typeof window !== 'undefined') {
        window.adsbygoogle = window.adsbygoogle || [];
        window.adsbygoogle.push({});
        pushed.current = true;
      }
    } catch {
      // adsbygoogle not loaded yet
    }
  }, []);

  const { style, dataAdFormat, dataFullWidthResponsive } = formatMap[format] ?? formatMap.horizontal;

  return (
    <div className={className}>
      <ins
        ref={ref}
        className="adsbygoogle"
        style={style}
        data-ad-client="ca-pub-5119314285197382"
        data-ad-slot={slot}
        data-ad-format={dataAdFormat}
        {...(dataFullWidthResponsive ? { 'data-full-width-responsive': dataFullWidthResponsive } : {})}
      />
    </div>
  );
}
