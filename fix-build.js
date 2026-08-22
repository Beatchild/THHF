const fs = require('fs');

// Fix GalleryCarousel.tsx
let f1 = fs.readFileSync('src/components/GalleryCarousel.tsx', 'utf8');
f1 = f1.replace('alt={Gallery image  + (index + 1)}', 'alt={`Gallery image ${index + 1}`}');
fs.writeFileSync('src/components/GalleryCarousel.tsx', f1, 'utf8');

// Fix og/route.tsx
let f2 = fs.readFileSync('src/app/api/og/route.tsx', 'utf8');
f2 = f2.replace('return new Response(\\Failed to generate image\\', 'return new Response(`Failed to generate image`');
fs.writeFileSync('src/app/api/og/route.tsx', f2, 'utf8');

// Fix ScrollProgress.tsx
let f3 = fs.readFileSync('src/components/ScrollProgress.tsx', 'utf8');
f3 = f3.replace('style={{ width: \\\\%\\ }}', 'style={{ width: `${progress}%` }}');
fs.writeFileSync('src/components/ScrollProgress.tsx', f3, 'utf8');

// Fix HighlightShare.tsx
let f4 = fs.readFileSync('src/components/HighlightShare.tsx', 'utf8');
f4 = f4.replace('import { Twitter } from \'lucide-react\'', 'import { MessageCircle as Twitter } from \'lucide-react\'');
fs.writeFileSync('src/components/HighlightShare.tsx', f4, 'utf8');
