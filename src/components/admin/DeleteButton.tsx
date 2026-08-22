'use client';
import { deletePost } from '@/actions/posts';
import { useState } from 'react';

export default function DeleteButton({ id }: { id: string }) {
  const [loading, setLoading] = useState(false);
  return (
    <button
      onClick={async () => {
        if (confirm('Are you sure you want to delete this post?')) {
          setLoading(true);
          await deletePost(id);
        }
      }}
      disabled={loading}
      className="text-red-400 hover:underline"
    >
      {loading ? '...' : 'Delete'}
    </button>
  );
}
