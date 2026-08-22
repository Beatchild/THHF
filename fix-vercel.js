const fs = require('fs');

let config = fs.readFileSync('next.config.mjs', 'utf8');
// Remove output: 'standalone',
config = config.replace(/output:\s*'standalone',\s*/g, '');

// Fix serverActions
config = config.replace(/serverActions:\s*\{\s*bodySizeLimit:\s*'10mb',\s*\}/, 'experimental: { serverActions: { bodySizeLimit: "10mb" } }');

fs.writeFileSync('next.config.mjs', config, 'utf8');
