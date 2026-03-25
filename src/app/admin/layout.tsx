export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className="dark">
      <body className="bg-[#0a0a0a] text-white antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
