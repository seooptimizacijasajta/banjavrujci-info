/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Automatska konverzija u AVIF pa WebP (Next/Vercel optimizacija) za sve slike kroz next/image.
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      { protocol: 'https', hostname: '**' }
    ]
  }
};
export default nextConfig;
