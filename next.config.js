/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'mkbnqyhvaozqfpmcyoyw.supabase.co',
      },
    ],
  },
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/rss.xml',
        destination: '/api/rss/geral',
      },
      {
        source: '/rss-web-stories.xml',
        destination: '/api/rss/web-stories',
      },
      {
        source: '/rss-:slug.xml',
        destination: '/api/rss/:slug',
      },
    ];
  },
};

export default nextConfig;

