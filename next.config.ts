import type { NextConfig } from 'next';

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
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'sprint-fe-project.s3.ap-northeast-2.amazonaws.com',
      },
    ],
  },
};

export default nextConfig;
