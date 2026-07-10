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
  },
  async redirects() {
    return [
      // Stari poddomen bloga -> novi blog (fira kad blog.banjavrujci.info bude uperen na Vercel).
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'blog.banjavrujci.info' }],
        destination: 'https://banjavrujci.info/blog/:path*',
        permanent: true
      },
      // Stara /english sekcija -> novi /en prefiks.
      { source: '/english', destination: '/en', permanent: true },
      { source: '/english/:path*', destination: '/en/:path*', permanent: true }
    ];
  }
};
export default nextConfig;
