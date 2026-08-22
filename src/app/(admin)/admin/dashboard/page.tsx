import { adminDb } from '@/lib/firebase-admin';
import Link from 'next/link';
import DeleteButton from '@/components/admin/DeleteButton';

export default async function Dashboard() {
  const postsQuery = await adminDb.collection('posts').orderBy('updatedAt', 'desc').get();
  const posts = postsQuery.docs.map(doc => ({ id: doc.id, ...doc.data() } as any));

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Posts Management</h1>
        <Link href="/admin/posts/new" className="px-4 py-2 bg-lime-600 text-black font-bold rounded hover:bg-lime-500">
          + New Post
        </Link>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-zinc-800 border-b border-zinc-700">
            <tr>
              <th className="p-4 text-zinc-400">Title</th>
              <th className="p-4 text-zinc-400">Status</th>
              <th className="p-4 text-zinc-400">Date</th>
              <th className="p-4 text-zinc-400">Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts.map(post => (
              <tr key={post.id} className="border-b border-zinc-800 hover:bg-zinc-800/50">
                <td className="p-4">{post.title}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-xs ${post.status === 'published' ? 'bg-lime-900/50 text-lime-400' : 'bg-zinc-700 text-zinc-300'}`}>
                    {post.status}
                  </span>
                </td>
                <td className="p-4 text-zinc-400 text-sm">
                  {post.updatedAt?.toDate().toLocaleDateString()}
                </td>
                <td className="p-4">
                  <Link href={'/admin/posts/' + post.id} className="text-blue-400 hover:underline mr-4">
                    Edit
                  </Link>
                  <Link href={'/blog/' + post.slug} target="_blank" className="text-zinc-400 hover:underline mr-4">
                    View
                  </Link>
                  <DeleteButton id={post.id} />
                </td>
              </tr>
            ))}
            {posts.length === 0 && (
              <tr>
                <td colSpan={4} className="p-8 text-center text-zinc-500">No posts found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
export const dynamic = 'force-dynamic';
