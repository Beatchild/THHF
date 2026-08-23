import { adminDb } from '@/lib/firebase-admin';
import EditPostForm from './EditPostForm';
import { notFound } from 'next/navigation';

export default async function EditPostPage({ params }: { params: { id: string } }) {
  const postDoc = await adminDb.collection('posts').doc(params.id).get();
  
  if (!postDoc.exists) {
    notFound();
  }
  
  const rawData = postDoc.data() || {};
  
  // Safely serialize complex types (like Firestore Timestamps) before passing to Client Component
  const post = {
    id: postDoc.id,
    ...rawData,
    createdAt: rawData.createdAt?.toDate ? rawData.createdAt.toDate().toISOString() : rawData.createdAt,
    updatedAt: rawData.updatedAt?.toDate ? rawData.updatedAt.toDate().toISOString() : rawData.updatedAt,
  };
  
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Edit Post</h1>
      <EditPostForm post={post} />
    </div>
  );
}
