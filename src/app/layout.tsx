import './globals.css';

import { domAnimation, LazyMotion } from 'framer-motion';
import type { Metadata } from 'next';

import AuthSessionWatcher from '@/components/feature/auth/AuthSessionWatcher';
import Header from '@/components/layout/Header';
import QueryProvider from '@/components/providers/QueryProvider';
import ScrollWrapper from '@/components/ui/ScrollVisibility';
import { Toast } from '@/components/ui/Toast';

import AuthProvider from './AuthProvider';

export const metadata: Metadata = {
  title: {
    default: 'UPDO - 함께 성장하는 커뮤니티',
    template: '%s | UPDO',
  },
  description: '함께 배우고 성장하는 사람들의 커뮤니티, UPDO.',
  icons: {
    icon: '/favicon.ico',
  },
  keywords: ['UPDO', '자기계발', '성장', '모임', '커뮤니티', '네트워킹', '챌린지'],
  authors: [{ name: 'UPDO', url: 'https://updo.site' }],
  metadataBase: new URL('https://updo.site'),
  openGraph: {
    title: 'UPDO',
    description: '함께 배우고 성장하는 사람들의 커뮤니티, UPDO',
    url: 'https://updo.site',
    siteName: 'UPDO',
    images: [
      {
        url: '/images/og_default.webp',
        width: 600,
        height: 315,
        alt: 'UP DO 대표 이미지',
      },
    ],
    locale: 'ko_KR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'UPDO',
    description: '함께 배우고 성장하는 사람들의 커뮤니티, UPDO',
    images: ['/images/og_default.webp'],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <link rel="preconnect" href="https://sprint-fe-project.s3.ap-northeast-2.amazonaws.com" />
        <link rel="preconnect" href="https://updo.site" />
        <link rel="preconnect" href="https://cdn.jsdelivr.net" crossOrigin="anonymous" />
        <link
          rel="preload"
          as="style"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
          crossOrigin="anonymous"
        />
        <link
          rel="stylesheet"
          crossOrigin="anonymous"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
      </head>
      <body>
        <QueryProvider>
          <AuthProvider>
            <LazyMotion features={domAnimation}>
              <AuthSessionWatcher /> {/* 전역 토큰 만료 감시 (항상 활성화됨) */}
              <ScrollWrapper />
              <Header />
              <Toast />
              <main className="layout-container font-sans">{children}</main>
            </LazyMotion>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
