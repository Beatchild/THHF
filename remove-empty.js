const fs = require('fs');
let file = fs.readFileSync('src/app/(public)/page.tsx', 'utf8');

file = file.replace(/<div className="flex flex-col items-center justify-center py-32 border-2 border-dashed border-white\/20 rounded-3xl bg-black\/20 backdrop-blur-sm">[\s\S]*?<\/div>/, '<div></div>');

fs.writeFileSync('src/app/(public)/page.tsx', file, 'utf8');
