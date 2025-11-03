import type { NextConfig } from 'next';
import bundleAnalyzer from '@next/bundle-analyzer';

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
  openAnalyzer: false,
  analyzerMode: 'static',
});

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/gathering',
        permanent: true,
      },
      {
        source: '/mypage',
        destination: '/mypage/myMeeting',
        permanent: false,
      },
    ];
  },
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['framer-motion', '@tanstack/react-query'],
    esmExternals: true,
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  images: {
    minimumCacheTTL: 31536000,
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [360, 640, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'sprint-fe-project.s3.ap-northeast-2.amazonaws.com',
        pathname: '/**',
      },
    ],
    unoptimized: true,
  },
};

export default withBundleAnalyzer(nextConfig);
