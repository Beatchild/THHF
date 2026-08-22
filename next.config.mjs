/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
      },
    ],
  },
  experimental: { serverActions: { bodySizeLimit: "10mb" }, serverExternalPackages: ["firebase-admin", "jose", "jwks-rsa"] },
};

export default nextConfig;
