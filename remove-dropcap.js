const fs = require('fs');
let code = fs.readFileSync('src/app/(public)/[slug]/page.tsx', 'utf8');

code = code.replace('className="prose-editor drop-cap text-lg md:text-xl font-medium leading-relaxed text-zinc-300"', 'className="prose-editor text-lg md:text-xl font-medium leading-relaxed text-zinc-300"');

fs.writeFileSync('src/app/(public)/[slug]/page.tsx', code);
