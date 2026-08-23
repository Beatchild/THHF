const fs = require('fs');
let code = fs.readFileSync('src/app/(public)/page.tsx', 'utf8');

// 1. Remove 01
code = code.replace(/\{\/\* Decorative huge numbering \*\/\}\s*<div className="absolute top-8 right-8 z-10 hidden md:block">\s*<span className="text-8xl font-black text-white\/30 select-none drop-shadow-xl">01<\/span>\s*<\/div>/, '');

// 2. Remove 0{index + 2} //
code = code.replace(/<span className="text-lime-400 font-bold text-sm select-none drop-shadow-md">0\{index \+ 2\} \/\/<\/span>/, '');

// 3. Move heroPost out of max-w-7xl
// I will just replace the structure manually
