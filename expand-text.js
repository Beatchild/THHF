const fs = require('fs');
let code = fs.readFileSync('src/app/(public)/page.tsx', 'utf8');

// The text container is currently max-w-4xl inside the max-w-7xl mx-auto
code = code.replace('<div className="max-w-4xl">', '<div className="max-w-6xl">');

// Let's also increase the max-w-3xl on the excerpt text
code = code.replace('<p className="text-lg md:text-2xl text-white/90 font-medium line-clamp-2 md:line-clamp-3 max-w-3xl drop-shadow-lg">', '<p className="text-lg md:text-2xl text-white/90 font-medium line-clamp-2 md:line-clamp-3 max-w-5xl drop-shadow-lg">');

// Also make the title slightly larger or just allow it to spread
code = code.replace('text-4xl md:text-6xl lg:text-7xl font-black text-white mb-6 leading-[1.1]', 'text-5xl md:text-7xl lg:text-8xl font-black text-white mb-6 leading-[1.05]');

fs.writeFileSync('src/app/(public)/page.tsx', code);
