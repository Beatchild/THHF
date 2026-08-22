import { MetadataRoute } from 'next'
import { adminDb } from '@/lib/firebase-admin'

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://thhf.ge'

  let posts: any[] = [];
  try {
    const postsQuery = await adminDb.collection('posts')
      .where('status', '==', 'published')
      .orderBy('publishedAt', 'desc')
      .get();

    posts = postsQuery.docs.map((doc) => {
      const post = doc.data();
      return {
        url: `${baseUrl}/blog/${post.slug}`,
        lastModified: post.updatedAt?.toDate() || new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
      };
    });
  } catch (e) {
    console.error('Error fetching posts for sitemap', e);
  }

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    ...posts,
  ]
}

