import { Youtube, Instagram, Facebook, Twitter, Twitch, Zap, Linkedin, Github } from 'lucide-react';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Youtube: Youtube,
  Instagram: Instagram,
  Facebook: Facebook,
  Twitter: Twitter,
  Twitch: Twitch,
  Zap: Zap,
  Linkedin: Linkedin,
  Github: Github,
  Music2: TikTokIcon,
};

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.32 6.32 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.76a4.85 4.85 0 0 1-1.01-.07z" />
    </svg>
  );
}

interface Props {
  href: string;
  label: string;
  iconName: string;
  accentColor: string;
}

export default function SocialButton({ href, label, iconName, accentColor }: Props) {
  const Icon = iconMap[iconName];
  const r = parseInt(accentColor.slice(1, 3), 16);
  const g = parseInt(accentColor.slice(3, 5), 16);
  const b = parseInt(accentColor.slice(5, 7), 16);

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-3 pl-4 pr-2 py-2 rounded-full text-sm font-semibold text-white transition-opacity hover:opacity-80"
      style={{
        background: 'rgba(255,255,255,0.06)',
        border: '1px solid rgba(255,255,255,0.1)',
      }}
    >
      <span className="text-[#f5f5f7]">{label}</span>
      <span
        className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
        style={{ background: `rgba(${r},${g},${b},0.25)` }}
      >
        {Icon && <Icon className="w-4 h-4" style={{ color: accentColor }} />}
      </span>
    </a>
  );
}
