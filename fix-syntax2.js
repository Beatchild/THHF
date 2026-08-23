const fs = require('fs');
let code = fs.readFileSync('src/app/(public)/page.tsx', 'utf8');

code = code.replace(/href=\{ \/ \+ heroPost\.slug\}/g, "href={'/' + heroPost.slug}");
code = code.replace(/href=\{ \/ \+ post\.slug\}/g, "href={'/' + post.slug}");
code = code.replaceAll('href={/ + heroPost.slug}', "href={'/' + heroPost.slug}");
code = code.replaceAll('href={/ + post.slug}', "href={'/' + post.slug}");

fs.writeFileSync('src/app/(public)/page.tsx', code);
