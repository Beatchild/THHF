import Navigation from '@/components/Navigation';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navigation />
      
      <main className="flex-grow pt-24">
        {children}
      </main>

      <footer className="p-8 text-center bg-black/80 mt-12">
        <p className="text-zinc-400">&copy; {new Date().getFullYear()} Tbilisi Hip Hop Festival. All rights reserved.</p>
      </footer>
    </div>
  );
}
