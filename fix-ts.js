const fs = require('fs');

// Fix GridExtension.ts
let f1 = fs.readFileSync('src/components/admin/GridExtension.ts', 'utf8');
f1 = f1.replace('...imgTags.map(img =>', '...imgTags.map((img: any) =>');
fs.writeFileSync('src/components/admin/GridExtension.ts', f1, 'utf8');

// Fix PullQuoteExtension.ts
let f2 = fs.readFileSync('src/components/admin/PullQuoteExtension.ts', 'utf8');
f2 = f2.replace('declare module \'@tiptap/core\' {', `
declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    pullQuote: {
      togglePullQuote: () => ReturnType,
    }
  }
`);
f2 = f2.replace('setPullQuote:', 'togglePullQuote:'); // just in case
f2 = f2.replace('({ commands })', '({ commands }: any)');
fs.writeFileSync('src/components/admin/PullQuoteExtension.ts', f2, 'utf8');

