const fs = require('fs');
let code = fs.readFileSync('src/app/(public)/page.tsx', 'utf8');

const oldLogic = '  const heroPost = posts[0];\n  const secondaryPosts = posts.slice(1, 3);\n  const gridPosts = posts.slice(3);';

const newLogic =   // Find a pinned post, or fallback to the specific festival post
  let heroPostIndex = posts.findIndex(p => p.isPinned === true || p.slug === 'tbilisi-hip-hop-festival-2026-first-edition');
  
  if (heroPostIndex === -1 && posts.length > 0) {
    heroPostIndex = 0;
  }
  
  let heroPost = null;
  let remainingPosts = posts;
  
  if (heroPostIndex !== -1) {
    heroPost = posts[heroPostIndex];
    remainingPosts = posts.filter((_, i) => i !== heroPostIndex);
  }
  
  const secondaryPosts = remainingPosts.slice(0, 2);
  const gridPosts = remainingPosts.slice(2);;

code = code.replace(oldLogic, newLogic);
fs.writeFileSync('src/app/(public)/page.tsx', code);
