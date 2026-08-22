import Link from 'next/link';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <nav className="flex justify-between items-center p-6 bg-black/50 backdrop-blur-md fixed w-full top-0 z-50">
        <Link href="/" className="text-2xl font-bold tracking-wider uppercase" style={{ color: 'var(--color-accent-lime)' }}>
          THHF BLOG
        </Link>
        <div className="flex gap-4">
          <Link href="/" className="hover:text-lime-400 transition-colors">Blog</Link>
          <a href="https://tbilisihiphop.com" className="hover:text-lime-400 transition-colors">Main Site</a>
        </div>
      </nav>
      
      <main className="flex-grow pt-24">
        {children}
      </main>

      <footer className="p-8 text-center bg-black/80 mt-12">
        <p className="text-zinc-400">&copy; {new Date().getFullYear()} Tbilisi Hip Hop Festival. All rights reserved.</p>
      </footer>
    </div>
  );
}

