import Link from 'next/link';
import { FileText, Image, Sparkles } from 'lucide-react';

function AdminNav() {
  return (
    <nav className="sticky top-0 z-50 border-b border-zinc-800 bg-[#0a0a0a]/95 backdrop-blur-sm">
      <div className="flex items-center gap-6 px-5 h-12">
        <Link
          href="/admin/posts"
          className="flex items-center gap-1.5 text-xs font-bold tracking-widest text-zinc-500 uppercase hover:text-white transition-colors"
        >
          <Sparkles size={12} />
          DAHO · CMS
        </Link>
        <div className="h-4 w-px bg-zinc-800" />
        <Link
          href="/admin/posts"
          className="flex items-center gap-1.5 text-sm text-zinc-400 hover:text-white transition-colors"
        >
          <FileText size={14} />
          Posts
        </Link>
        <Link
          href="/admin/media"
          className="flex items-center gap-1.5 text-sm text-zinc-400 hover:text-white transition-colors"
        >
          <Image size={14} />
          Media
        </Link>
      </div>
    </nav>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AdminNav />
      {children}
    </>
  );
}
