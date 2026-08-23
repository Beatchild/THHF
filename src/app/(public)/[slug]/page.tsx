import { adminDb } from '@/lib/firebase-admin';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import parse, { domToReact, Element } from 'html-react-parser';
import GalleryCarousel from '@/components/GalleryCarousel';
import ScrollProgress from '@/components/ScrollProgress';
import TableOfContents from '@/components/TableOfContents';
import HighlightShare from '@/components/HighlightShare';
import ClapButton from '@/components/ClapButton';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

type Props = { params: Promise<{ slug: string }> };

function slugify(text: string) {
  return text.toString().toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '').replace(/\-\-+/g, '-').replace(/^-+/, '').replace(/-+$/, '');
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const { slug } = resolvedParams;
  const postsQuery = await adminDb.collection('posts').where('slug', '==', slug).limit(1).get();
  if (postsQuery.empty) {
    return { title: 'Post Not Found' };
  }
  const post = postsQuery.docs[0].data();
  
  const ogUrl = new URL('https://thhf.ge/api/og');
  ogUrl.searchParams.set('title', post.metaTitle || post.title);
  ogUrl.searchParams.set('category', post.category || 'Editorial');
  if (post.coverImage) {
    ogUrl.searchParams.set('image', post.coverImage);
  }
  
  return {
    title: post.metaTitle || post.title,
    description: post.metaDesc || post.excerpt,
    openGraph: {
      title: post.metaTitle || post.title,
      description: post.metaDesc || post.excerpt,
      images: [
        {
          url: ogUrl.toString(),
          width: 1200,
          height: 630,
          alt: post.title,
        }
      ],
    },
    twitter: {
      card: 'summary_large_image',
      images: [ogUrl.toString()],
    },
  };
}

export default async function BlogPost({ params }: Props) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;
  const postsQuery = await adminDb.collection('posts').where('slug', '==', slug).limit(1).get();
  if (postsQuery.empty) {
    notFound();
  }
  const postDoc = postsQuery.docs[0];
  const post = postDoc.data();

  // Fetch "Up Next" post (latest published that is not this one)
  const upNextQuery = await adminDb.collection('posts')
    .where('status', '==', 'published')
    .orderBy('publishedAt', 'desc')
    .limit(2)
    .get();
    
  const upNextDoc = upNextQuery.docs.find(d => d.id !== postDoc.id);
  const upNext = upNextDoc ? upNextDoc.data() : null;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    image: post.coverImage ? [post.coverImage] : [],
    datePublished: post.publishedAt?.toDate?.()?.toISOString(),
    dateModified: post.updatedAt?.toDate?.()?.toISOString(),
    author: [{
      '@type': 'Person',
      name: post.author?.name || 'Admin',
    }]
  };
  
  const options = {
    replace: (domNode: any) => {
      if (domNode instanceof Element) {
        // Replace gallery
        if (domNode.attribs && domNode.attribs['data-type'] === 'gallery') {
          const imagesStr = domNode.attribs['data-images'];
          const images = imagesStr ? imagesStr.split(',') : [];
          return <GalleryCarousel images={images} />;
        }
        
        // Add IDs to H2 and H3 for Table of Contents
        if (domNode.tagName === 'h2' || domNode.tagName === 'h3') {
          // Extract text content safely
          const getText = (node: any): string => {
            if (node.type === 'text') return node.data;
            if (node.children) return node.children.map(getText).join('');
            return '';
          };
          
          const text = getText(domNode);
          const id = slugify(text) || `heading-${Math.random().toString(36).substr(2, 9)}`;
          
          const Tag = domNode.tagName as any;
          return (
            <Tag id={id} className={domNode.attribs?.class || ''}>
              {domToReact(domNode.children as any, options)}
            </Tag>
          );
        }
      }
    }
  };

  const parsedContent = parse(post.content, options);
  const isParallax = post.layoutStyle === 'parallax' && post.coverImage;

  return (
    <>
      <ScrollProgress />
      <HighlightShare />
      
      <article className="min-h-screen">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        
        {/* HERO SECTION */}
        {isParallax ? (
          <div className="relative w-full h-[80vh] md:h-screen flex items-end justify-center overflow-hidden mb-16">
            <div className="absolute inset-0 z-0">
              <Image src={post.coverImage} alt={post.title} fill className="object-cover" priority />
              <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-[#111111]/70 to-black/30" />
            </div>
            
            <div className="relative z-10 w-full max-w-5xl mx-auto px-4 pb-16 text-center">
              <div className="flex items-center justify-center gap-4 mb-6">
                <span className="px-3 py-1 bg-lime-500 text-black text-xs font-bold rounded-full uppercase tracking-wider">
                  {post.category || 'Editorial'}
                </span>
                <span className="text-zinc-300 text-sm font-medium">
                  {post.readingTime || 5} min read
                </span>
              </div>
              <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight tracking-tight text-white drop-shadow-lg">{post.title}</h1>
              {post.excerpt && <p className="text-xl md:text-2xl text-zinc-300 font-light max-w-3xl mx-auto">{post.excerpt}</p>}
            </div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto pt-16 px-4">
            <div className="flex items-center gap-4 mb-6">
              <span className="px-3 py-1 bg-lime-500 text-black text-xs font-bold rounded-full uppercase tracking-wider">
                {post.category || 'Editorial'}
              </span>
              <span className="text-zinc-500 text-sm font-medium">
                {post.readingTime || 5} min read
              </span>
            </div>
            <h1 className="text-5xl md:text-6xl font-black mb-8 leading-tight tracking-tight">{post.title}</h1>
            {post.coverImage && (
              <div className="relative w-full h-[300px] md:h-[500px] mb-12 rounded-xl overflow-hidden shadow-2xl">
                <Image src={post.coverImage} alt={post.title} fill className="object-cover" priority />
              </div>
            )}
          </div>
        )}
        
        {/* CONTENT & SIDEBAR */}
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row gap-12 pb-24">
          <div className="flex-1 w-full max-w-3xl">
            <div className="prose-editor drop-cap text-lg md:text-xl font-medium leading-relaxed text-zinc-300">
              {parsedContent}
            </div>
            
            {/* CLAP BUTTON */}
            <div className="mt-12 flex justify-center md:justify-start">
              <ClapButton postId={postDoc.id} initialClaps={post.claps || 0} />
            </div>
            
            {/* AUTHOR BIO */}
            <div className="mt-20 p-8 bg-zinc-900 border border-zinc-800 rounded-2xl flex items-center gap-6">
              <div className="w-20 h-20 rounded-full bg-zinc-800 flex items-center justify-center overflow-hidden shrink-0">
                <span className="text-3xl">??</span>
              </div>
              <div>
                <h4 className="text-white font-bold text-xl mb-1">{post.author?.name || 'Editorial Team'}</h4>
                <p className="text-zinc-400 text-sm mb-3">Written by our dedicated editorial team focusing on culture, music, and the underground.</p>
                <div className="flex gap-4 mt-4">
                  <a href={`https://twitter.com/intent/tweet?text=${post.title}&url=https://thhf.ge/blog/${post.slug}`} target="_blank" rel="noreferrer" className="text-lime-500 hover:text-lime-400 text-sm font-bold uppercase tracking-wide">Share on X</a>
                  <a href={`https://www.facebook.com/sharer/sharer.php?u=https://thhf.ge/blog/${post.slug}`} target="_blank" rel="noreferrer" className="text-lime-500 hover:text-lime-400 text-sm font-bold uppercase tracking-wide">Share on Facebook</a>
                </div>
              </div>
            </div>
          </div>
          
          {/* SIDEBAR TOC */}
          <div className="hidden md:block w-72 shrink-0">
            <TableOfContents />
          </div>
        </div>
        
        {/* UP NEXT */}
        {upNext && (
          <div className="border-t border-zinc-800 bg-[#0a0a0a]">
            <div className="max-w-6xl mx-auto px-4 py-24">
              <h3 className="text-zinc-500 font-bold uppercase tracking-widest text-sm mb-8">Up Next</h3>
              <Link href={`/blog/${upNext.slug}`} className="group flex flex-col md:flex-row gap-8 items-center">
                {upNext.coverImage && (
                  <div className="relative w-full md:w-1/2 h-[300px] md:h-[400px] rounded-xl overflow-hidden shrink-0">
                    <Image src={upNext.coverImage} alt={upNext.title} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                  </div>
                )}
                <div>
                  <div className="mb-4">
                    <span className="px-3 py-1 bg-lime-500 text-black text-xs font-bold rounded-full uppercase tracking-wider">
                      {upNext.category || 'Editorial'}
                    </span>
                  </div>
                  <h2 className="text-4xl md:text-5xl font-black text-white mb-6 group-hover:text-lime-400 transition-colors">{upNext.title}</h2>
                  <p className="text-xl text-zinc-400">{upNext.excerpt}</p>
                </div>
              </Link>
            </div>
          </div>
        )}
      </article>
    </>
  );
}
