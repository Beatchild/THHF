'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createPost } from '@/actions/posts';
import TiptapEditor from '@/components/admin/TiptapEditor';
import { uploadImage } from '@/lib/firebase-client';

function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

export default function NewPost() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  const [coverImagePreview, setCoverImagePreview] = useState<string | null>(null);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    setSlug(slugify(e.target.value));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setCoverImageFile(file);
      setCoverImagePreview(URL.createObjectURL(file));
    }
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    
    try {
      const formData = new FormData(e.currentTarget);
      
      let coverImageUrl = '';
      if (coverImageFile) {
        coverImageUrl = await uploadImage(coverImageFile);
      }
      
      formData.set('coverImage', coverImageUrl);
      formData.append('content', content);
      
      const result = await createPost(formData);
      if (result.success) {
        router.push('/admin/dashboard');
      } else {
        alert(result.error);
        setLoading(false);
      }
    } catch (error) {
      alert('Error uploading post');
      setLoading(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <h1 className="text-3xl font-bold mb-8">Create New Post</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div>
          <label className="block mb-2 text-zinc-400 font-semibold">Title</label>
          <input name="title" value={title} onChange={handleTitleChange} required className="w-full bg-zinc-900 border border-zinc-700 focus:border-lime-500 focus:ring-1 focus:ring-lime-500 rounded p-3 text-white outline-none transition-all" placeholder="Enter post title..." />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-2 text-zinc-400 font-semibold">Slug (URL)</label>
            <input name="slug" value={slug} onChange={(e) => setSlug(e.target.value)} required className="w-full bg-zinc-900 border border-zinc-700 focus:border-lime-500 focus:ring-1 focus:ring-lime-500 rounded p-3 text-white outline-none transition-all" />
          </div>
          <div>
            <label className="block mb-2 text-zinc-400 font-semibold">Category</label>
            <select name="category" className="w-full bg-zinc-900 border border-zinc-700 focus:border-lime-500 focus:ring-1 focus:ring-lime-500 rounded p-3 text-white outline-none transition-all">
              <option value="Interview">Interview</option>
              <option value="Album Review">Album Review</option>
              <option value="News">News</option>
              <option value="Underground">Underground</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-2 text-zinc-400 font-semibold">Status</label>
            <select name="status" className="w-full bg-zinc-900 border border-zinc-700 focus:border-lime-500 focus:ring-1 focus:ring-lime-500 rounded p-3 text-white outline-none transition-all">
              <option value="draft">Draft (Hidden)</option>
              <option value="published">Published (Public)</option>
            </select>
          </div>
          <div>
            <label className="block mb-2 text-zinc-400 font-semibold">Layout Style</label>
            <select name="layoutStyle" className="w-full bg-zinc-900 border border-zinc-700 focus:border-lime-500 focus:ring-1 focus:ring-lime-500 rounded p-3 text-white outline-none transition-all">
              <option value="parallax">Parallax Full-Screen Cover</option>
              <option value="standard">Standard Header Image</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block mb-2 text-zinc-400 font-semibold">Cover Image</label>
          {coverImagePreview && (
            <img src={coverImagePreview} alt="Cover Preview" className="w-full h-48 object-cover rounded-lg mb-4 border border-zinc-700" />
          )}
          <input type="file" accept="image/*" onChange={handleImageChange} className="w-full bg-zinc-900 border border-zinc-700 rounded p-2 text-zinc-400 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-zinc-800 file:text-white hover:file:bg-zinc-700 cursor-pointer" />
        </div>

        <div>
          <label className="block mb-2 text-zinc-400 font-semibold">Excerpt</label>
          <textarea name="excerpt" required className="w-full bg-zinc-900 border border-zinc-700 focus:border-lime-500 focus:ring-1 focus:ring-lime-500 rounded p-3 text-white outline-none transition-all h-24" />
        </div>

        <div>
          <label className="block mb-2 text-zinc-400 font-semibold">Content</label>
          <TiptapEditor content={content} onChange={setContent} />
        </div>

        <button disabled={loading} className="w-full p-4 bg-lime-600 hover:bg-lime-500 text-black font-bold rounded-lg mt-4 transition-colors disabled:opacity-50">
          {loading ? 'Saving Post...' : 'Save Post'}
        </button>
      </form>
    </div>
  );
}
