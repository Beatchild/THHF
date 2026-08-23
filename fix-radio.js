const fs = require('fs');
let file = fs.readFileSync('src/components/Navigation.tsx', 'utf8');

file = file.replace(/href: "https:\/\/tbilisihiphop\.com\/#radio"/g, 'href: "https://radio.tbilisihiphop.com"');

fs.writeFileSync('src/components/Navigation.tsx', file, 'utf8');