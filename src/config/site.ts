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
      { label: 'YouTube',   href: 'https://www.youtube.com/@dahogaming',          iconName: 'Youtube',   color: '#ff0000' },
      { label: 'Twitch',    href: 'https://www.twitch.tv/dahored',                iconName: 'Twitch',    color: '#9146ff' },
      { label: 'TikTok',    href: 'https://www.tiktok.com/@dahored',              iconName: 'Music2',    color: '#69c9d0' },
      { label: 'Instagram', href: 'https://www.instagram.com/daho.gaming/',       iconName: 'Instagram', color: '#e1306c' },
      { label: 'Twitter/X', href: 'https://x.com/daho_gaming',                   iconName: 'Twitter',   color: '#e7e7e7' },
      { label: 'Kick',      href: 'https://kick.com/dahored',                     iconName: 'Zap',       color: '#53fc18' },
      { label: 'Facebook',  href: 'https://www.facebook.com/dahored',             iconName: 'Facebook',  color: '#1877f2' },
    ],
    coexist: [
      { label: 'TikTok',    href: 'https://www.tiktok.com/@daho.coexist',         iconName: 'Music2',    color: '#69c9d0' },
      { label: 'YouTube',   href: 'https://www.youtube.com/@daho.coexist',        iconName: 'Youtube',   color: '#ff0000' },
      { label: 'Instagram', href: 'https://www.instagram.com/daho.coexist/',      iconName: 'Instagram', color: '#e1306c' },
      { label: 'Facebook',  href: 'https://www.facebook.com/daho.coexist/',       iconName: 'Facebook',  color: '#1877f2' },
      { label: 'X / Twitter', href: 'https://x.com/daho_coexist',                iconName: 'Twitter',   color: '#e7e7e7' },
    ],
    adventures: [
      { label: 'Instagram', href: 'https://www.instagram.com/daho.adventures/',   iconName: 'Instagram', color: '#e1306c' },
    ],
    personal: [
      { label: 'Instagram', href: 'https://www.instagram.com/diego.hernandezorrego/', iconName: 'Instagram', color: '#e1306c' },
      { label: 'Facebook',  href: 'https://www.facebook.com/diego.hernandezorrego/',  iconName: 'Facebook',  color: '#1877f2' },
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
