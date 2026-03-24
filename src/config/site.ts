export const site = {
  name: 'DAHO',
  fullName: 'Diego Hernández',
  alternateName: 'DAHO',
  siteUrl: 'https://www.dahoofficial.com',
  email: 'dahoreddiegohernandez+dahoofficial@gmail.com',
  jobTitle: 'Senior Front End Developer',
  description:
    'Senior Front End Developer with 10+ years of experience. Gamer, Content Creator & Coexister. Creator of myappcube.',
  keywords: [
    'Diego Hernandez',
    'Diego Hernández',
    'Daho',
    'DAHO',
    'dahored',
    'dahoofficial',
    'frontend developer',
    'Senior Front End Developer',
    'developer Colombia',
    'React developer',
    'Next.js developer',
    'TypeScript developer',
    'gaming',
    'content creator',
    'Daho Gaming',
    'Daho Adventures',
    'Daho Coexist',
    'myappcube',
    'El Infiltrado',
    'Oculto',
    'coexister',
  ],
  socials: {
    github: 'https://github.com/dahored',
    linkedin: 'https://www.linkedin.com/in/dahored/',
    youtube: 'https://www.youtube.com/@dahogaming',
    twitch: 'https://www.twitch.tv/dahored',
  },

  // ── Per-world social links (single source of truth) ───────────────────────
  worldSocials: {
    gaming: [
      { label: 'YouTube',   href: 'https://www.youtube.com/@dahogaming',          iconName: 'Youtube',   color: '#ff0000', description: 'Videos de gameplay, reviews y contenido gaming.' },
      { label: 'Twitch',    href: 'https://www.twitch.tv/dahored',                iconName: 'Twitch',    color: '#9146ff', description: 'Streams en vivo de videojuegos.' },
      { label: 'TikTok',    href: 'https://www.tiktok.com/@dahored',              iconName: 'Music2',    color: '#69c9d0', description: 'Clips cortos de los mejores momentos.' },
      { label: 'Instagram', href: 'https://www.instagram.com/daho.gaming/',       iconName: 'Instagram', color: '#e1306c', description: 'Fotos y highlights del mundo gaming.' },
      { label: 'Twitter/X', href: 'https://x.com/daho_gaming',                   iconName: 'Twitter',   color: '#e7e7e7', description: 'Opiniones y novedades del mundo gamer.' },
      { label: 'Kick',      href: 'https://kick.com/dahored',                     iconName: 'Kick',      color: '#53fc18', description: 'Streams alternativos en vivo.' },
      { label: 'Facebook',  href: 'https://www.facebook.com/dahored',             iconName: 'Facebook',  color: '#1877f2', description: 'Comunidad y eventos gaming.' },
    ],
    coexist: [
      { label: 'TikTok',    href: 'https://www.tiktok.com/@daho.coexist',         iconName: 'Music2',    color: '#69c9d0', description: 'Videos cortos de [[h]]motivación[[/h]] y bienestar.',        highlight: 'motivación' },
      { label: 'YouTube',   href: 'https://www.youtube.com/@daho.coexist',        iconName: 'Youtube',   color: '#ff0000', description: '[[h]]Videos largos[[/h]] y episodios del canal.',            highlight: 'Videos largos' },
      { label: 'Instagram', href: 'https://www.instagram.com/daho.coexist/',      iconName: 'Instagram', color: '#e1306c', description: 'Reflexiones visuales para [[h]]crecer juntos[[/h]].',        highlight: 'crecer juntos' },
      { label: 'Facebook',  href: 'https://www.facebook.com/daho.coexist/',       iconName: 'Facebook',  color: '#1877f2', description: 'Comunidad de [[h]]coexistencia[[/h]] y crecimiento.',        highlight: 'coexistencia' },
      { label: 'X / Twitter', href: 'https://x.com/daho_coexist',                iconName: 'Twitter',   color: '#e7e7e7', description: '[[h]]Pensamientos y frases[[/h]] para el día a día.',        highlight: 'Pensamientos y frases' },
    ],
    adventures: [
      { label: 'Instagram', href: 'https://www.instagram.com/daho.adventures/',   iconName: 'Instagram', color: '#e1306c', description: 'Fotos y videos de mis [[h]]aventuras[[/h]] por el mundo.', highlight: 'aventuras' },
      { label: 'Facebook',  href: 'https://www.facebook.com/daho.adventures/',    iconName: 'Facebook',  color: '#1877f2', description: 'Comunidad y [[h]]últimas noticias[[/h]] de mis viajes.', highlight: 'últimas noticias' },
    ],
    developer: [
      { label: 'LinkedIn',  href: 'https://www.linkedin.com/in/dahored/',          iconName: 'Linkedin',  color: '#0a66c2', description: 'Mi [[h]]perfil profesional[[/h]] y experiencia laboral.', highlight: 'perfil profesional' },
      { label: 'GitHub',    href: 'https://github.com/dahored',                    iconName: 'Github',    color: '#e7e7e7', description: 'Proyectos [[h]]open source[[/h]] y código en producción.', highlight: 'open source' },
      { label: 'Instagram', href: 'https://www.instagram.com/daho.developer/',     iconName: 'Instagram', color: '#e1306c', description: 'El lado [[h]]visual del desarrollo[[/h]] y la tech.', highlight: 'visual del desarrollo' },
      { label: 'Facebook',  href: 'https://www.facebook.com/daho.developer/',      iconName: 'Facebook',  color: '#1877f2', description: '[[h]]Actualizaciones[[/h]] y noticias de mis proyectos.', highlight: 'Actualizaciones' },
    ],
    give: [
      { label: 'Instagram', href: 'https://www.instagram.com/daho.give/',       iconName: 'Instagram', color: '#e1306c', description: 'Gestos simples que [[h]]cambian vidas[[/h]].',        highlight: 'cambian vidas' },
      { label: 'Facebook',  href: 'https://www.facebook.com/daho.give/',        iconName: 'Facebook',  color: '#1877f2', description: 'Comunidad de [[h]]ayuda real[[/h]] sin filtros.',       highlight: 'ayuda real' },
      { label: 'YouTube',   href: 'https://www.youtube.com/@dahogive',          iconName: 'Youtube',   color: '#ff0000', description: '[[h]]Videos largos[[/h]] de gestos que transforman.',   highlight: 'Videos largos' },
    ],
  },

  get sameAs() {
    return [
      this.socials.github,
      this.socials.linkedin,
      ...this.worldSocials.gaming.map(s => s.href),
      ...this.worldSocials.coexist.map(s => s.href),
      ...this.worldSocials.adventures.map(s => s.href),
    ];
  },
};
