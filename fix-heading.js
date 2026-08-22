const fs = require('fs');
let file = fs.readFileSync('src/app/(public)/page.tsx', 'utf8');

file = file.replace(/text-6xl md:text-8xl lg:text-\[10rem\]/g, 'text-5xl md:text-6xl lg:text-8xl');
file = file.replace(/ბოლო სიახლეები/g, 'ცოდნის წყარო');

fs.writeFileSync('src/app/(public)/page.tsx', file, 'utf8');
