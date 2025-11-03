import type { Metadata } from 'next';
import './globals.css';
import { Toast } from '@/components/ui/Toast';
import Header from '@/components/layout/Header';
import ScrollWrapper from '@/components/ui/ScrollVisibility';
import QueryProvider from '@/components/providers/QueryProvider';
import AuthSessionWatcher from '@/components/feature/auth/AuthSessionWatcher';
import AuthProvider from './AuthProvider';
import { LazyMotion, domAnimation } from 'framer-motion';

export const metadata: Metadata = {
  title: {
    default: 'UPDO - 성장 커뮤니티',
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
        url: '/images/og-default.png',
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
    images: ['/images/og-default.png'],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
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
