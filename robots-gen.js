const fs = require('fs');
const robots = `User-Agent: *
Allow: /

Sitemap: https://thhf.ge/sitemap.xml
`;
fs.writeFileSync('src/app/robots.txt', robots, 'utf8');
