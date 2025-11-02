import type { NextConfig } from 'next';
import bundleAnalyzer from '@next/bundle-analyzer';

// ⚙️ 1) Bundle Analyzer 설정
const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
  openAnalyzer: false,
  analyzerMode: 'static',
});

// ⚙️ 2) Next.js 설정 객체
const nextConfig: NextConfig = {
  productionBrowserSourceMaps: true,
  reactStrictMode: true,

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

  // ✅ 이미지 도메인 허용 설정
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'sprint-fe-project.s3.ap-northeast-2.amazonaws.com',
        pathname: '/**',
      },
    ],
    domains: ['sprint-fe-project.s3.ap-northeast-2.amazonaws.com'],
  },
};

// ⚙️ 3) withBundleAnalyzer로 래핑 후 export
export default withBundleAnalyzer(nextConfig);
