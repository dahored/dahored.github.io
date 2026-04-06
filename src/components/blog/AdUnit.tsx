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
  horizontal:  { style: { display: 'block', minHeight: 0, overflow: 'hidden' }, dataAdFormat: 'auto', dataFullWidthResponsive: 'true' },
  rectangle:   { style: { display: 'inline-block', width: '300px', height: '250px' }, dataAdFormat: 'rectangle' },
  vertical:    { style: { display: 'inline-block', width: '160px', height: '600px' }, dataAdFormat: 'vertical' },
  auto:        { style: { display: 'block', minHeight: 0, overflow: 'hidden' }, dataAdFormat: 'auto', dataFullWidthResponsive: 'true' },
};

function AdUnitInner({ slot, className = '', format = 'horizontal' }: AdUnitProps) {
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
    <div className={`min-h-0 overflow-hidden ${className}`}>
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

export default function AdUnit(props: AdUnitProps) {
  if (process.env.NEXT_PUBLIC_ADSENSE_ACTIVE !== 'true') return null;
  return <AdUnitInner {...props} />;
}
