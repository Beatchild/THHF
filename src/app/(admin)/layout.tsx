import Link from 'next/link';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  // In a real app with next-firebase-auth-edge, we would check the session cookie here.
  // For now, we trust the client-side guard if any, or just provide the wrapper.
  return (
    <div className="flex h-screen bg-zinc-950 text-white overflow-hidden">
      <aside className="w-64 bg-zinc-900 border-r border-zinc-800 flex flex-col">
        <div className="p-6 text-xl font-bold border-b border-zinc-800 text-lime-400">
          Admin Panel
        </div>
        <nav className="flex-grow p-4 flex flex-col gap-2">
          <Link href="/admin/dashboard" className="p-2 hover:bg-zinc-800 rounded transition-colors">Dashboard</Link>
          <Link href="/admin/posts/new" className="p-2 hover:bg-zinc-800 rounded transition-colors text-lime-300">Create Post</Link>
          <Link href="/blog" className="p-2 hover:bg-zinc-800 rounded transition-colors mt-auto text-zinc-400">View Public Site</Link>
        </nav>
      </aside>
      <main className="flex-grow overflow-y-auto p-8">
        {children}
      </main>
    </div>
  );
}
