const fs = require('fs');
let file = fs.readFileSync('src/app/(public)/page.tsx', 'utf8');

// The corrupted text looks like:
// "??????" or similar, but wait, if it was saved with ANSI it might actually contain question marks in the file, or maybe the file just got corrupted.
// Let's just replace the whole section.
file = file.replace(/<span className="text-lime-500 font-mono text-sm tracking-widest uppercase font-bold drop-shadow-md">[^<]+<\/span>/g, '<span className="text-lime-500 font-mono text-sm tracking-widest uppercase font-bold drop-shadow-md">მთავარი</span>');
file = file.replace(/<h1 className="text-6xl md:text-8xl lg:text-\[10rem\] font-black tracking-tighter text-white leading-none drop-shadow-2xl">\s*[^<]+\s*<span className="text-lime-500">\.<\/span>\s*<\/h1>/g, '<h1 className="text-6xl md:text-8xl lg:text-[10rem] font-black tracking-tighter text-white leading-none drop-shadow-2xl">\n            ბოლო სიახლეები<span className="text-lime-500">.</span>\n          </h1>');

// Also fix the "მალე დაემატება..." if it was corrupted
file = file.replace(/<p className="text-white\/70 mb-6 text-center max-w-md">[^<]+<\/p>/g, '<p className="text-white/70 mb-6 text-center max-w-md">მალე დაემატება...</p>');

fs.writeFileSync('src/app/(public)/page.tsx', file, 'utf8');
