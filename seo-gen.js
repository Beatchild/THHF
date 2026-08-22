const fs = require('fs');

const sitemapCode = `import { MetadataRoute } from 'next'
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
        url: \`\${baseUrl}/blog/\${post.slug}\`,
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
      url: \`\${baseUrl}/blog\`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    ...posts,
  ]
}
`;

fs.writeFileSync('src/app/sitemap.ts', sitemapCode, 'utf8');

const rssCode = `import RSS from 'rss';
import { adminDb } from '@/lib/firebase-admin';

export const dynamic = 'force-dynamic';

export async function GET() {
  const feed = new RSS({
    title: 'THHF - Tbilisi Hip Hop Foundation',
    description: 'Street Culture, Hip Hop, and Music Editorial',
    site_url: 'https://thhf.ge',
    feed_url: 'https://thhf.ge/feed.xml',
    language: 'ka',
    pubDate: new Date(),
  });

  try {
    const postsQuery = await adminDb.collection('posts')
      .where('status', '==', 'published')
      .orderBy('publishedAt', 'desc')
      .limit(20)
      .get();

    postsQuery.docs.forEach((doc) => {
      const post = doc.data();
      feed.item({
        title: post.title,
        description: post.excerpt,
        url: \`https://thhf.ge/blog/\${post.slug}\`,
        date: post.publishedAt?.toDate() || new Date(),
        categories: [post.category || 'Editorial'],
        author: post.author?.name || 'THHF Editorial',
      });
    });
  } catch (e) {
    console.error('Error generating RSS', e);
  }

  return new Response(feed.xml({ indent: true }), {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
}
`;

fs.mkdirSync('src/app/feed.xml', { recursive: true });
fs.writeFileSync('src/app/feed.xml/route.ts', rssCode, 'utf8');

