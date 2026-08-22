const fs = require('fs');
let config = fs.readFileSync('next.config.mjs', 'utf8');

// Replace serverComponentsExternalPackages with serverExternalPackages (Next.js 15)
config = config.replace(/serverComponentsExternalPackages/g, 'serverExternalPackages');

// Add jose and jwks-rsa to the array just in case
config = config.replace(/'firebase-admin'/, "'firebase-admin', 'jose', 'jwks-rsa'");
config = config.replace(/"firebase-admin"/, '"firebase-admin", "jose", "jwks-rsa"');

fs.writeFileSync('next.config.mjs', config, 'utf8');
