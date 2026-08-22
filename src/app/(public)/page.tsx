import { adminDb } from '@/lib/firebase-admin';
import Link from 'next/link';
import Image from 'next/image';

export const revalidate = 60; // ISR every 60 seconds
export const dynamic = 'force-dynamic';

export default async function BlogHub() {
  let posts: any[] = [];
  try {
    const postsQuery = await adminDb.collection('posts')
      .where('status', '==', 'published')
      .orderBy('publishedAt', 'desc')
      .get();
      
    posts = postsQuery.docs.map(doc => ({ id: doc.id, ...doc.data() } as any));
  } catch (e) {
    console.error(e);
  }

  const heroPost = posts.length > 0 ? posts[0] : null;
  const secondaryPosts = posts.length > 1 ? posts.slice(1, 3) : [];
  const gridPosts = posts.length > 3 ? posts.slice(3) : [];

  return (
    <div className="min-h-screen">
      {/* Editorial Header */}
      <div className="pt-24 pb-12 px-4 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none" 
             style={{ backgroundImage: 'radial-gradient(#a3e01d 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
        </div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-1 w-12 bg-lime-500"></div>
            <span className="text-lime-500 font-mono text-sm tracking-widest uppercase font-bold drop-shadow-md">მთავარი</span>
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-8xl font-black tracking-tighter text-white leading-none drop-shadow-2xl">
            ცოდნის წყარო<span className="text-lime-500">.</span>
          </h1>
          
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-12 px-4">
        {posts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 border-2 border-dashed border-white/20 rounded-3xl bg-black/20 backdrop-blur-sm">
            <span className="text-6xl mb-6">??</span>
            <h2 className="text-2xl font-bold text-white mb-2">No Stories Yet</h2>
            <p className="text-white/70 mb-6 text-center max-w-md">მალე დაემატება...</p>
          </div>
        ) : (
          <div className="flex flex-col gap-12">
            
            {/* HERO POST - Asymmetric Massive Layout */}
            {heroPost && (
              <Link href={`/${heroPost.slug}`} className="group block">
                <article className="relative w-full h-[60vh] md:h-[80vh] rounded-2xl overflow-hidden bg-black/40 border border-white/10 flex items-end shadow-2xl backdrop-blur-sm hover:border-lime-500/50 transition-colors">
                  {heroPost.coverImage && (
                    <div className="absolute inset-0 z-0">
                      <Image src={heroPost.coverImage} alt={heroPost.title} fill className="object-cover group-hover:scale-105 transition-transform duration-1000" priority />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-90" />
                    </div>
                  )}
                  
                  <div className="relative z-10 w-full max-w-4xl p-6 md:p-12">
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
                  
                  {/* Decorative huge numbering */}
                  <div className="absolute top-8 right-8 z-10 hidden md:block">
                    <span className="text-8xl font-black text-white/30 select-none drop-shadow-xl">01</span>
                  </div>
                </article>
              </Link>
            )}

            {/* SECONDARY POSTS - Split Screen */}
            {secondaryPosts.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-b border-white/10 pb-12">
                {secondaryPosts.map((post, index) => (
                  <Link href={`/${post.slug}`} key={post.id} className="group block">
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
                            <span className="text-lime-400 font-bold text-sm select-none drop-shadow-md">0{index + 2} //</span>
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
                    <Link href={`/${post.slug}`} key={post.id} className="group block">
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
        )}
      </div>
    </div>
  );
}



