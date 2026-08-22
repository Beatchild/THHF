const fs = require('fs');
let config = fs.readFileSync('next.config.mjs', 'utf8');

// If experimental block doesn't exist, this script will fail to replace properly, so let's rewrite it safely
config = config.replace('experimental: { serverActions: { bodySizeLimit: "10mb" } }', 'experimental: { serverActions: { bodySizeLimit: "10mb" }, serverComponentsExternalPackages: ["firebase-admin"] }');

if (!config.includes('serverComponentsExternalPackages')) {
  // Fallback if the replace failed
  config = config.replace('serverActions: {', 'experimental: { serverComponentsExternalPackages: ["firebase-admin"] },\n  serverActions: {');
}

fs.writeFileSync('next.config.mjs', config, 'utf8');
