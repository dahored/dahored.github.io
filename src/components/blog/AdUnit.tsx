'use client';

interface AdUnitProps {
  slot?: string;
  className?: string;
  format?: 'horizontal' | 'rectangle' | 'vertical';
}

const sizes: Record<string, string> = {
  horizontal: 'h-24 w-full',
  rectangle:  'h-64 w-full max-w-sm mx-auto',
  vertical:   'h-[600px] w-36',
};

export default function AdUnit({ slot, className = '', format = 'horizontal' }: AdUnitProps) {
  return (
    <div
      className={`${sizes[format]} ${className} flex items-center justify-center rounded-xl text-xs text-white/60 font-mono`}
      style={{ border: '2px dashed #ef4444', background: 'rgba(239,68,68,0.08)' }}
    >
      AD · {format} {slot ? `· slot ${slot}` : ''}
    </div>
  );
}
