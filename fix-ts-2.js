const fs = require('fs');
let f2 = fs.readFileSync('src/components/admin/PullQuoteExtension.ts', 'utf8');

if (!f2.includes('declare module')) {
  f2 = `
import { Node, mergeAttributes } from '@tiptap/core'

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    pullQuote: {
      togglePullQuote: () => ReturnType,
    }
  }
}

` + f2.replace(`import { Node, mergeAttributes } from '@tiptap/core'`, '');
  fs.writeFileSync('src/components/admin/PullQuoteExtension.ts', f2, 'utf8');
}
