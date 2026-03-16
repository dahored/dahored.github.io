'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Gamepad2, Leaf, Mountain, Heart, Plus, X, Youtube, Instagram, Twitter, Twitch, Facebook, Music2, Zap, type LucideIcon } from 'lucide-react';

const ICON_MAP: Record<string, LucideIcon> = {
  Gamepad2, Leaf, Mountain, Heart,
  Youtube, Instagram, Twitter, Twitch, Facebook, Music2, Zap,
};

interface SocialLink {
  label: string;
  href: string;
  iconName: string;
  color: string;
}

interface WorldCardProps {
  iconName: string;
  accent: string;
  name: string;
  description: string;
  highlight: string;
  socials: SocialLink[];
}

export default function WorldCard({ iconName, accent, name, description, highlight, socials }: WorldCardProps) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const BrandIcon = ICON_MAP[iconName];
  const parts = description.split('[[h]]');

  const openModal = () => {
    setMounted(true);
    document.body.style.overflow = 'hidden';
    requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)));
    setOpen(true);
  };

  const closeModal = () => {
    setVisible(false);
    setOpen(false);
    const t = setTimeout(() => {
      setMounted(false);
      document.body.style.overflow = '';
    }, 350);
    return () => clearTimeout(t);
  };

  useEffect(() => () => { document.body.style.overflow = ''; }, []);

  return (
    <>
      <div
        className="group flex flex-col gap-4 p-6 rounded-3xl h-full"
        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
      >
        {BrandIcon && (
          <BrandIcon className="w-11 h-11" style={{ color: accent }} aria-hidden="true" />
        )}

        <p className="text-[#f5f5f7] font-semibold text-lg leading-snug flex-1">
          {parts[0]}
          <span style={{ color: accent }}>{highlight}</span>
          {parts[1]}
        </p>

        <div className="flex justify-end">
          <button
            onClick={openModal}
            aria-label={`Ver ${name}`}
            className="w-11 h-11 rounded-full flex items-center justify-center transition-opacity duration-200 opacity-50 group-hover:opacity-100 cursor-pointer"
            style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.12)' }}
          >
            <Plus className="w-5 h-5 text-[#f5f5f7]" />
          </button>
        </div>
      </div>

      {/* Modal overlay — rendered via portal to escape stacking context */}
      {mounted && createPortal(
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6"
          style={{
            background: `rgba(0,0,0,${visible ? '0.6' : '0'})`,
            backdropFilter: visible ? 'blur(12px)' : 'blur(0px)',
            transition: 'background 0.3s ease, backdrop-filter 0.3s ease',
          }}
          onClick={closeModal}
        >
          <div
            className="relative w-full sm:max-w-sm rounded-t-3xl sm:rounded-3xl overflow-hidden"
            style={{
              background: '#1c1c1e',
              border: '1px solid rgba(255,255,255,0.1)',
              transform: visible ? 'translateY(0) scale(1)' : 'translateY(40px) scale(0.96)',
              opacity: visible ? 1 : 0,
              transition: 'transform 0.35s cubic-bezier(0.34,1.56,0.64,1), opacity 0.25s ease',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Handle bar (mobile) */}
            <div className="flex justify-center pt-3 pb-1 sm:hidden">
              <div className="w-10 h-1 rounded-full bg-[#3a3a3c]" />
            </div>

            <div className="px-6 pb-8 pt-4 sm:pt-6 flex flex-col gap-6">
              {/* Header */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  {BrandIcon && <BrandIcon className="w-6 h-6 shrink-0" style={{ color: accent }} />}
                  <h3 className="font-bold text-xl text-[#f5f5f7] leading-tight">{name}</h3>
                </div>
                <button
                  onClick={closeModal}
                  className="shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-[#6e6e73] hover:text-[#f5f5f7] transition-colors cursor-pointer"
                  style={{ background: 'rgba(255,255,255,0.08)' }}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Divider */}
              <div style={{ height: '1px', background: 'rgba(255,255,255,0.06)' }} />

              {/* Social links */}
              <div className="flex flex-col gap-2">
                {socials.map(({ label, href, iconName: sIcon, color }) => {
                  const Icon = ICON_MAP[sIcon];
                  return (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-colors group/link"
                      style={{ background: 'rgba(255,255,255,0.05)' }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.09)'; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.05)'; }}
                    >
                      {Icon && (
                        <span className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${color}22` }}>
                          <Icon className="w-4 h-4" style={{ color }} />
                        </span>
                      )}
                      <span className="text-sm font-medium text-[#f5f5f7]">{label}</span>
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
