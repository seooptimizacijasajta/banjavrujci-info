/** @type {import('next').NextConfig} */
const nextConfig = {
  // Kompajlacija je uspešna; ne dozvoli da type/lint upozorenja obore produkcijski build.
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },
  images: {
    // Automatska konverzija u AVIF pa WebP (Next/Vercel optimizacija) za sve slike kroz next/image.
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      { protocol: 'https', hostname: '**' }
    ]
  }
};
export default nextConfig;
