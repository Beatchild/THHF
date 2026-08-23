const fs = require('fs');
let file = fs.readFileSync('src/components/Navigation.tsx', 'utf8');

file = file.replace(/"ABOUT"/g, '"ჩვენ შესახებ"');
file = file.replace(/"LINEUP"/g, '"ლაინ-აფი"');
file = file.replace(/"MAP"/g, '"რუკა"');
file = file.replace(/"RADIO"/g, '"რადიო"');
file = file.replace(/"INFO"/g, '"ინფო"');
file = file.replace(/>\s*TICKETS\s*</g, '>ბილეთები<');

fs.writeFileSync('src/components/Navigation.tsx', file, 'utf8');
