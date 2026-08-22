'use server'

import { adminDb } from '../lib/firebase-admin';
import { PostSchema } from '../lib/types';
import { revalidatePath } from 'next/cache';
import { FieldValue } from 'firebase-admin/firestore';

function calculateReadTime(text: string) {
  const words = text.replace(/<[^>]*>?/gm, '').split(/\s+/).length;
  return Math.ceil(words / 200);
}

export async function createPost(formData: FormData) {
  try {
    const rawContent = formData.get('content') as string;
    const data = {
      title: formData.get('title') as string,
      slug: formData.get('slug') as string,
      content: rawContent,
      excerpt: formData.get('excerpt') as string,
      coverImage: formData.get('coverImage') as string,
      status: formData.get('status') as any,
      category: formData.get('category') as string || 'News',
      layoutStyle: formData.get('layoutStyle') as string || 'parallax',
      author: { id: 'admin' },
      readingTime: calculateReadTime(rawContent),
    };
    
    const validatedData = PostSchema.parse(data);
    
    const docRef = await adminDb.collection('posts').add({
      ...validatedData,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
      publishedAt: validatedData.status === 'published' ? FieldValue.serverTimestamp() : null,
    });
    
    revalidatePath('/blog');
    revalidatePath('/admin/dashboard');
    
    return { success: true, id: docRef.id };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updatePost(id: string, formData: FormData) {
  try {
    const rawContent = formData.get('content') as string;
    const data = {
      title: formData.get('title') as string,
      slug: formData.get('slug') as string,
      content: rawContent,
      excerpt: formData.get('excerpt') as string,
      coverImage: formData.get('coverImage') as string,
      status: formData.get('status') as any,
      category: formData.get('category') as string || 'News',
      layoutStyle: formData.get('layoutStyle') as string || 'parallax',
      author: { id: 'admin' },
      readingTime: calculateReadTime(rawContent),
    };
    
    const validatedData = PostSchema.parse(data);
    const postRef = adminDb.collection('posts').doc(id);
    
    await postRef.update({
      ...validatedData,
      updatedAt: FieldValue.serverTimestamp(),
      ...(validatedData.status === 'published' ? { publishedAt: FieldValue.serverTimestamp() } : {}),
    });
    
    revalidatePath('/blog');
    revalidatePath('/blog/' + validatedData.slug);
    revalidatePath('/admin/dashboard');
    
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function clapPost(id: string) {
  try {
    const postRef = adminDb.collection('posts').doc(id);
    await postRef.update({
      claps: FieldValue.increment(1)
    });
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deletePost(id: string) {
  await adminDb.collection('posts').doc(id).delete();
  revalidatePath('/blog');
  revalidatePath('/admin/dashboard');
}
