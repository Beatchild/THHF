const fs = require('fs');
let code = fs.readFileSync('src/app/(public)/[slug]/page.tsx', 'utf8');

const regex = /\{\/\* AUTHOR BIO \*\/\}\s*<div className="mt-20 p-8 bg-zinc-900 border border-zinc-800 rounded-2xl flex items-center gap-6">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/;

code = code.replace(regex, '');

fs.writeFileSync('src/app/(public)/[slug]/page.tsx', code);
