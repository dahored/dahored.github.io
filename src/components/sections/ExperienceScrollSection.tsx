'use client';

import { useEffect, useRef, useState } from 'react';

const experiences = [
  {
    company: 'NICE',
    role: 'Senior Software Engineer',
    period: 'Jul 2024 — Jan 2026',
    duration: '1 yr 7 mos',
    location: 'Manizales, Colombia',
    color: '#0066cc',  // NICE brand blue
  },
  {
    company: 'Playvox',
    role: 'Senior Front End Developer',
    period: 'Aug 2022 — Sep 2024',
    duration: '2 yrs 2 mos',
    location: 'Manizales, Colombia',
    color: '#00b37e',  // Playvox brand green
  },
  {
    company: 'Playvox',
    role: 'Front End Developer',
    period: 'Jul 2019 — Aug 2022',
    duration: '3 yrs 2 mos',
    location: 'Manizales, Colombia',
    color: '#00b37e',  // Playvox brand green
  },
  {
    company: 'CINNCO',
    role: 'Front End Developer',
    period: 'Apr 2019 — Jul 2019',
    duration: '4 mos',
    location: 'Manizales, Colombia',
    color: '#1a56db',  // CINNCO blue
  },
  {
    company: 'Torres Guarin y Cia',
    role: 'Software Developer',
    period: 'Jun 2018 — Apr 2019',
    duration: '11 mos',
    location: 'Manizales, Colombia',
    color: '#64748b',  // neutral slate
  },
  {
    company: 'Brandca',
    role: 'Web Application Developer',
    period: 'Feb 2016 — Apr 2019',
    duration: '3 yrs 3 mos',
    location: 'Bogotá, Colombia',
    color: '#e85d26',  // Brandca orange
  },
  {
    company: 'Mundo Creativo CO',
    role: 'CEO & Founder',
    period: 'Sep 2015 — Apr 2019',
    duration: '3 yrs 8 mos',
    location: 'Manizales, Colombia',
    color: '#f97316',  // creative orange
  },
  {
    company: 'MundoBots',
    role: 'Web Developer & Robotics Instructor',
    period: 'Aug 2017 — May 2018',
    duration: '10 mos',
    location: 'Manizales, Colombia',
    color: '#f59e0b',  // MundoBots amber
  },
  {
    company: 'SENA',
    role: 'Web Application Developer',
    period: 'Dec 2014 — Dec 2015',
    duration: '1 yr 1 mo',
    location: 'Manizales, Colombia',
    color: '#16a34a',  // SENA green
  },
];

export default function ExperienceScrollSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [current, setCurrent] = useState(0);
  const [displayIndex, setDisplayIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const section = sectionRef.current;
      if (!section) return;
      const rect = section.getBoundingClientRect();
      const scrollable = section.offsetHeight - window.innerHeight;
      if (scrollable <= 0) return;
      const progress = Math.max(0, Math.min(1, -rect.top / scrollable));
      setCurrent(Math.min(experiences.length - 1, Math.floor(progress * experiences.length)));
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fade out → swap content → fade in on index change
  useEffect(() => {
    if (current === displayIndex) return;
    setVisible(false);
    const t = setTimeout(() => {
      setDisplayIndex(current);
      setVisible(true);
    }, 180);
    return () => clearTimeout(t);
  }, [current, displayIndex]);

  const exp = experiences[displayIndex];
  const progress = (current + 1) / experiences.length;

  return (
    <div
      ref={sectionRef}
      className="relative"
      style={{ height: `${experiences.length * 60 + 100}vh` }}
    >
      {/* Sticky panel — needs its own bg to cover content above */}
      <div className="sticky top-0 h-screen w-full bg-black flex flex-col">

        {/* Animated gradient background */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse 70% 70% at 50% 50%, ${exp.color}18 0%, transparent 65%)`,
            transition: 'background 0.7s ease',
          }}
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse 40% 40% at 20% 80%, ${exp.color}0d 0%, transparent 60%)`,
            transition: 'background 0.7s ease',
          }}
          aria-hidden="true"
        />

        {/* Dot grid */}
        <div className="absolute inset-0 opacity-[0.06] dot-grid pointer-events-none" aria-hidden="true" />

        {/* Main content */}
        <div className="flex-1 flex items-center relative z-10">
          <div
            className="w-full px-6 sm:px-12 lg:px-20"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateY(0)' : 'translateY(16px)',
              transition: 'opacity 0.25s ease, transform 0.3s ease',
            }}
          >
            {/* Counter */}
            <p
              className="font-mono text-sm mb-10 lg:mb-14"
              style={{ color: `${exp.color}80` }}
            >
              {String(displayIndex + 1).padStart(2, '0')}&nbsp;&nbsp;/&nbsp;&nbsp;{String(experiences.length).padStart(2, '0')}
            </p>

            {/* Company name */}
            <h2
              className="font-bold leading-none mb-5"
              style={{
                fontSize: 'clamp(2.8rem, 9vw, 8.5rem)',
                letterSpacing: '-0.04em',
                color: exp.color,
                transition: 'color 0.6s ease',
              }}
            >
              {exp.company}
            </h2>

            {/* Role */}
            <p
              className="font-light text-[#f5f5f7] mb-6"
              style={{
                fontSize: 'clamp(1.25rem, 3vw, 2.25rem)',
                letterSpacing: '-0.01em',
              }}
            >
              {exp.role}
            </p>

            {/* Period · duration · location */}
            <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-[#6e6e73] text-base sm:text-lg">
              <span>{exp.period}</span>
              <span className="w-1 h-1 rounded-full bg-[#3a3a3c] shrink-0" />
              <span>{exp.duration}</span>
              <span className="w-1 h-1 rounded-full bg-[#3a3a3c] shrink-0" />
              <span>{exp.location}</span>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="shrink-0 px-6 sm:px-12 lg:px-20 pb-8 flex items-center gap-6 relative z-10">
          {/* Dot indicators */}
          <div className="flex items-center gap-1.5">
            {experiences.map((e, i) => (
              <div
                key={i}
                className="rounded-full"
                style={{
                  width: i === displayIndex ? '20px' : '5px',
                  height: '5px',
                  background: i === displayIndex ? exp.color : 'rgba(255,255,255,0.15)',
                  transition: 'width 0.4s ease, background 0.4s ease',
                }}
              />
            ))}
          </div>

          {/* Scroll hint on first item */}
          {displayIndex === 0 && (
            <p
              className="text-xs text-[#3a3a3c] ml-auto"
              style={{ opacity: visible ? 1 : 0, transition: 'opacity 0.3s' }}
            >
              scroll to explore
            </p>
          )}
        </div>

        {/* Progress line at very bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-[#111] z-10">
          <div
            className="h-full"
            style={{
              width: `${progress * 100}%`,
              background: exp.color,
              transition: 'width 0.1s linear, background 0.6s ease',
            }}
          />
        </div>
      </div>
    </div>
  );
}
