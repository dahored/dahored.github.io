'use client';

import { useState, useEffect } from 'react';
import Script from 'next/script';

const GA_ID = 'G-FDPG9H95RT';

// Defers GA loading until the first user interaction (scroll, click, keydown).
// This removes the 150 KiB GA script from the initial page load entirely.
export default function GoogleAnalytics() {
  const [load, setLoad] = useState(false);

  useEffect(() => {
    const trigger = () => setLoad(true);
    window.addEventListener('scroll', trigger, { once: true, passive: true });
    window.addEventListener('click', trigger, { once: true });
    window.addEventListener('keydown', trigger, { once: true });
  }, []);

  if (!load) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga-init" strategy="afterInteractive">{`
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${GA_ID}');
      `}</Script>
    </>
  );
}
