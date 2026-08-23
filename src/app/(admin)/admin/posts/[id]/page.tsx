import { adminDb } from '@/lib/firebase-admin';
import EditPostForm from './EditPostForm';
import { notFound } from 'next/navigation';

export default async function EditPostPage({ params }: { params: { id: string } }) {
  const postDoc = await adminDb.collection('posts').doc(params.id).get();
  
  if (!postDoc.exists) {
    notFound();
  }
  
  const rawData = postDoc.data() || {};
  
  // Create a 100% plain object to pass to the Client Component
  const post = {
    id: postDoc.id,
    title: rawData.title || '',
    slug: rawData.slug || '',
    category: rawData.category || '',
    status: rawData.status || 'draft',
    layoutStyle: rawData.layoutStyle || 'parallax',
    coverImage: rawData.coverImage || '',
    excerpt: rawData.excerpt || '',
    content: rawData.content || '',
    createdAt: rawData.createdAt?.toDate ? rawData.createdAt.toDate().toISOString() : (typeof rawData.createdAt === 'string' ? rawData.createdAt : null),
    updatedAt: rawData.updatedAt?.toDate ? rawData.updatedAt.toDate().toISOString() : (typeof rawData.updatedAt === 'string' ? rawData.updatedAt : null),
  };
  
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Edit Post</h1>
      <EditPostForm post={post as any} />
    </div>
  );
}
