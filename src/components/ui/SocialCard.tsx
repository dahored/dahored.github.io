'use client';

import { Youtube, Instagram, Facebook, Twitter, Twitch, Zap, Linkedin, Github, ArrowUpRight } from 'lucide-react';

const iconMap: Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
  Youtube, Instagram, Facebook, Twitter, Twitch, Zap, Linkedin, Github,
  Music2: TikTokIcon,
};

function TikTokIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.32 6.32 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.76a4.85 4.85 0 0 1-1.01-.07z" />
    </svg>
  );
}

interface Props {
  href: string;
  label: string;
  iconName: string;
  color: string;
  description?: string;
  highlight?: string;
}

export default function SocialCard({ href, label, iconName, color, description, highlight }: Props) {
  const Icon = iconMap[iconName];
  const text = description ?? label;
  const parts = text.split('[[h]]');

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col gap-4 p-6 rounded-3xl h-full"
      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.07)'; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)'; }}
    >
      {Icon && <Icon className="w-11 h-11" style={{ color }} />}

      <p className="text-[#f5f5f7] font-semibold text-lg leading-snug flex-1">
        {parts.length > 1 ? (
          <>
            {parts[0]}
            <span style={{ color }}>{highlight}</span>
            {parts[1].split('[[/h]]')[1]}
          </>
        ) : text}
      </p>

      <div className="flex justify-end">
        <span
          className="w-11 h-11 rounded-full flex items-center justify-center opacity-50 group-hover:opacity-100 transition-opacity"
          style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.12)' }}
        >
          <ArrowUpRight className="w-5 h-5 text-[#f5f5f7]" />
        </span>
      </div>
    </a>
  );
}
