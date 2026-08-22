const fs = require('fs');
let file = fs.readFileSync('src/app/(public)/layout.tsx', 'utf8');

file = file.replace(/<div className="flex gap-4">[\s\S]*?<\/div>/, '');

fs.writeFileSync('src/app/(public)/layout.tsx', file, 'utf8');
