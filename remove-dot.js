const fs = require('fs');
let file = fs.readFileSync('src/app/(public)/page.tsx', 'utf8');

file = file.replace(/<span className="text-lime-500">\.<\/span>/g, '');

fs.writeFileSync('src/app/(public)/page.tsx', file, 'utf8');
