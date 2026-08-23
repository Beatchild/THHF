import { adminDb } from '@/lib/firebase-admin';
import Link from 'next/link';
import Image from 'next/image';

export const revalidate = 60; // Revalidate every 60 seconds

export default async function HomePage() {
  const postsQuery = await adminDb
    .collection('posts')
    .where('status', '==', 'published')
    .orderBy('publishedAt', 'desc')
    .limit(10)
    .get();

  const posts = postsQuery.docs.map(doc => ({ id: doc.id, ...doc.data() } as any));
  
  const heroPost = posts[0];
  const secondaryPosts = posts.slice(1, 3);
  const gridPosts = posts.slice(3);

  return (
    <div className="min-h-screen">
      
      {/* Title area (visually hidden but good for SEO) */}
      <div className="sr-only">
        <h1>Tbilisi Hip-Hop Festival Blog</h1>
      </div>

      {posts.length === 0 ? (
        <div className="max-w-7xl mx-auto py-12 px-4"></div>
      ) : (
        <div className="flex flex-col">
          
          {/* FULL WIDTH HERO POST */}
          {heroPost && (
            <Link href={/ + heroPost.slug} className="group block w-full relative">
              <article className="relative w-full h-[65vh] md:h-[80vh] overflow-hidden bg-black flex items-end shadow-2xl">
                {heroPost.coverImage && (
                  <div className="absolute inset-0 z-0">
                    <Image src={heroPost.coverImage} alt={heroPost.title} fill className="object-cover group-hover:scale-105 transition-transform duration-1000" priority />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90" />
                  </div>
                )}
                
                {/* Ensure text doesn't touch the very edges of the screen by wrapping in max-w-7xl */}
                <div className="relative z-10 w-full max-w-7xl mx-auto p-6 md:p-12 md:pb-16 flex flex-col justify-end h-full">
                  <div className="max-w-4xl">
                    <div className="flex items-center gap-3 mb-6">
                      <span className="px-3 py-1 bg-lime-500 text-black text-xs font-black uppercase tracking-widest shadow-lg">
                        {heroPost.category || 'Featured'}
                      </span>
                      <span className="text-white/80 font-mono text-xs uppercase font-bold drop-shadow-md">
                        {heroPost.publishedAt ? new Date(heroPost.publishedAt.toDate()).toLocaleDateString('en-US', { month: 'long', day: 'numeric' }) : 'New'}
                      </span>
                    </div>
                    <h2 className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-6 leading-[1.1] group-hover:text-lime-400 transition-colors drop-shadow-2xl">
                      {heroPost.title}
                    </h2>
                    <p className="text-lg md:text-2xl text-white/90 font-medium line-clamp-2 md:line-clamp-3 max-w-3xl drop-shadow-lg">
                      {heroPost.excerpt}
                    </p>
                  </div>
                </div>
              </article>
            </Link>
          )}

          <div className="max-w-7xl mx-auto w-full py-16 px-4 flex flex-col gap-16">
            {/* SECONDARY POSTS - Split Screen */}
            {secondaryPosts.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-b border-white/10 pb-16">
                {secondaryPosts.map((post, index) => (
                  <Link href={/ + post.slug} key={post.id} className="group block">
                    <article className="flex flex-col h-full">
                      {post.coverImage ? (
                        <div className="relative h-64 md:h-80 w-full rounded-xl overflow-hidden mb-6 bg-black/30 border border-white/10 shadow-xl">
                          <Image src={post.coverImage} alt={post.title} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                          <div className="absolute top-4 left-4">
                            <span className="px-3 py-1 bg-white text-black text-[10px] font-black uppercase tracking-widest shadow-lg">
                              {post.category || 'News'}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className="h-64 md:h-80 w-full bg-black/30 backdrop-blur-md border border-white/10 rounded-xl mb-6 flex items-center justify-center shadow-xl">
                          <span className="text-white/50 font-mono">NO IMAGE</span>
                        </div>
                      )}
                      
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center gap-3 mb-3">
                            <span className="text-white/60 text-xs font-mono uppercase font-bold">
                              {post.publishedAt ? new Date(post.publishedAt.toDate()).toLocaleDateString() : 'Just now'}
                            </span>
                          </div>
                          <h2 className="text-3xl font-black text-white mb-4 leading-tight group-hover:text-lime-400 transition-colors drop-shadow-lg">
                            {post.title}
                          </h2>
                          <p className="text-white/80 line-clamp-3 font-medium text-lg drop-shadow-sm">
                            {post.excerpt}
                          </p>
                        </div>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
            )}

            {/* GRID POSTS - Masonry style standard grid */}
            {gridPosts.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-2xl font-black text-white uppercase tracking-wider drop-shadow-lg">More Stories</h3>
                  <div className="h-px flex-1 bg-white/10 mx-6"></div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {gridPosts.map((post) => (
                    <Link href={/ + post.slug} key={post.id} className="group block">
                      <article className="flex flex-col h-full bg-black/20 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden hover:border-lime-500/50 transition-colors shadow-lg hover:shadow-2xl">
                        {post.coverImage ? (
                          <div className="relative h-48 w-full overflow-hidden border-b border-white/10">
                            <Image src={post.coverImage} alt={post.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                          </div>
                        ) : (
                          <div className="h-48 w-full bg-black/40 border-b border-white/10 flex items-center justify-center">
                            <span className="text-white/40 text-sm font-mono">NO IMAGE</span>
                          </div>
                        )}
                        <div className="p-6 flex-1 flex flex-col">
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-lime-400 text-[10px] font-black uppercase tracking-widest drop-shadow-sm">
                              {post.category || 'Editorial'}
                            </span>
                            <span className="text-white/60 text-[10px] font-mono font-bold">
                              {post.publishedAt ? new Date(post.publishedAt.toDate()).toLocaleDateString() : ''}
                            </span>
                          </div>
                          <h2 className="text-xl font-bold text-white mb-3 group-hover:text-lime-400 transition-colors leading-snug drop-shadow-md">
                            {post.title}
                          </h2>
                          <p className="text-white/70 text-sm line-clamp-2 mt-auto font-medium">
                            {post.excerpt}
                          </p>
                        </div>
                      </article>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}