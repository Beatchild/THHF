const fs = require('fs');

let fbAdmin = fs.readFileSync('src/lib/firebase-admin.ts', 'utf8');

// The safest way to handle private keys on Vercel is:
// process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
// Let's ensure this is exactly what we have, AND we remove any leading/trailing quotes

const newParsing = `
  let privateKey = process.env.FIREBASE_PRIVATE_KEY || '';
  if (privateKey.startsWith('"') && privateKey.endsWith('"')) {
    privateKey = privateKey.slice(1, -1);
  }
  if (privateKey.includes('\\\\n')) {
    privateKey = privateKey.replace(/\\\\n/g, '\\n');
  } else if (privateKey.includes('\\n')) {
    privateKey = privateKey.replace(/\\n/g, '\\n');
  }
`;

fbAdmin = fbAdmin.replace(/let privateKey = process\.env\.FIREBASE_PRIVATE_KEY \|\| '';\s*if \(privateKey\.includes\('\\n'\) \|\| privateKey\.includes\('\\\\n'\)\) \{\s*privateKey = privateKey\.replace\(\/\\\\n\/g, '\\n'\);\s*\}/, newParsing);

fs.writeFileSync('src/lib/firebase-admin.ts', fbAdmin, 'utf8');
