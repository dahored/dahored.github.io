import {
  Brain, Code2, Wrench, Gamepad2, Newspaper, Compass,
  Users, Palette, Cpu, Briefcase, FlaskConical, Lightbulb,
  type LucideIcon,
} from 'lucide-react';

export interface CategoryDef {
  icon: LucideIcon;
  bg: string;
  text: string;
  color: string; // hex for inline styles (filter buttons)
  label: { es: string; en: string };
}

export const CATEGORY_REGISTRY: Record<string, CategoryDef> = {
  ia:           { icon: Brain,        bg: 'bg-violet-500/10', text: 'text-violet-400', color: '#7c3aed', label: { es: 'IA',           en: 'AI'          } },
  ai:           { icon: Brain,        bg: 'bg-violet-500/10', text: 'text-violet-400', color: '#7c3aed', label: { es: 'IA',           en: 'AI'          } },
  desarrollo:   { icon: Code2,        bg: 'bg-sky-500/10',    text: 'text-sky-400',    color: '#0284c7', label: { es: 'Desarrollo',   en: 'Development' } },
  development:  { icon: Code2,        bg: 'bg-sky-500/10',    text: 'text-sky-400',    color: '#0284c7', label: { es: 'Desarrollo',   en: 'Development' } },
  herramientas: { icon: Wrench,       bg: 'bg-amber-500/10',  text: 'text-amber-400',  color: '#d97706', label: { es: 'Herramientas', en: 'Tools'       } },
  tools:        { icon: Wrench,       bg: 'bg-amber-500/10',  text: 'text-amber-400',  color: '#d97706', label: { es: 'Herramientas', en: 'Tools'       } },
  gaming:       { icon: Gamepad2,     bg: 'bg-green-500/10',  text: 'text-green-400',  color: '#16a34a', label: { es: 'Gaming',       en: 'Gaming'      } },
  noticias:     { icon: Newspaper,    bg: 'bg-orange-500/10', text: 'text-orange-400', color: '#ea580c', label: { es: 'Noticias',     en: 'News'        } },
  news:         { icon: Newspaper,    bg: 'bg-orange-500/10', text: 'text-orange-400', color: '#ea580c', label: { es: 'Noticias',     en: 'News'        } },
  aventura:     { icon: Compass,      bg: 'bg-rose-500/10',   text: 'text-rose-400',   color: '#e11d48', label: { es: 'Aventura',     en: 'Adventure'   } },
  adventure:    { icon: Compass,      bg: 'bg-rose-500/10',   text: 'text-rose-400',   color: '#e11d48', label: { es: 'Aventura',     en: 'Adventure'   } },
  coexist:      { icon: Users,        bg: 'bg-pink-500/10',   text: 'text-pink-400',   color: '#db2777', label: { es: 'Coexist',      en: 'Coexist'     } },
  'diseño':     { icon: Palette,      bg: 'bg-purple-500/10', text: 'text-purple-400', color: '#9333ea', label: { es: 'Diseño',       en: 'Design'      } },
  design:       { icon: Palette,      bg: 'bg-purple-500/10', text: 'text-purple-400', color: '#9333ea', label: { es: 'Diseño',       en: 'Design'      } },
  'tecnología': { icon: Cpu,          bg: 'bg-cyan-500/10',   text: 'text-cyan-400',   color: '#0891b2', label: { es: 'Tecnología',   en: 'Technology'  } },
  technology:   { icon: Cpu,          bg: 'bg-cyan-500/10',   text: 'text-cyan-400',   color: '#0891b2', label: { es: 'Tecnología',   en: 'Technology'  } },
  negocios:     { icon: Briefcase,    bg: 'bg-yellow-500/10', text: 'text-yellow-400', color: '#ca8a04', label: { es: 'Negocios',     en: 'Business'    } },
  business:     { icon: Briefcase,    bg: 'bg-yellow-500/10', text: 'text-yellow-400', color: '#ca8a04', label: { es: 'Negocios',     en: 'Business'    } },
  ciencia:      { icon: FlaskConical, bg: 'bg-teal-500/10',   text: 'text-teal-400',   color: '#0d9488', label: { es: 'Ciencia',      en: 'Science'     } },
  science:      { icon: FlaskConical, bg: 'bg-teal-500/10',   text: 'text-teal-400',   color: '#0d9488', label: { es: 'Ciencia',      en: 'Science'     } },
  consejos:     { icon: Lightbulb,    bg: 'bg-lime-500/10',   text: 'text-lime-400',   color: '#65a30d', label: { es: 'Consejos',     en: 'Tips'        } },
  tips:         { icon: Lightbulb,    bg: 'bg-lime-500/10',   text: 'text-lime-400',   color: '#65a30d', label: { es: 'Consejos',     en: 'Tips'        } },
};

const FALLBACK: CategoryDef = {
  icon: Wrench,
  bg: 'bg-zinc-500/10',
  text: 'text-zinc-400',
  color: '#71717a',
  label: { es: '', en: '' },
};

export function getCategory(slug: string, locale = 'es'): CategoryDef & { displayLabel: string } {
  const def = CATEGORY_REGISTRY[slug] ?? { ...FALLBACK, label: { es: slug, en: slug } };
  return { ...def, displayLabel: def.label[locale === 'en' ? 'en' : 'es'] };
}
