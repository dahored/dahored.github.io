import Link from 'next/link';

function AdminNav() {
  return (
    <nav className="sticky top-0 z-50 border-b border-zinc-800 bg-[#0a0a0a]/95 backdrop-blur-sm">
      <div className="flex items-center gap-6 px-6 h-12">
        <Link href="/admin/posts" className="text-xs font-bold tracking-widest text-zinc-500 uppercase hover:text-white transition-colors">
          DAHO · CMS
        </Link>
        <div className="h-4 w-px bg-zinc-800" />
        <Link href="/admin/posts" className="text-sm text-zinc-400 hover:text-white transition-colors">
          Posts
        </Link>
        <Link href="/admin/media" className="text-sm text-zinc-400 hover:text-white transition-colors">
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
