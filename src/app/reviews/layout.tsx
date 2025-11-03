import { Banner } from '@/components/ui/common/Banner';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '모든 리뷰 | UPDO',
  description: 'UPDO 이용자들은 이렇게 느꼈어요 🌟',
  openGraph: {
    title: '모든 리뷰 | UPDO',
    description: 'UPDO 이용자들이 남긴 생생한 리뷰를 만나보세요!',
    url: 'https://updo.site/reviews',
    siteName: 'UPDO',
    images: [
      {
        url: '/images/reviews_banner.webp',
        width: 1200,
        height: 630,
        alt: 'UPDO 리뷰 대표 이미지',
      },
    ],
    locale: 'ko_KR',
    type: 'website',
  },
  alternates: {
    canonical: 'https://updo.site/reviews',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Banner
        title="모든 리뷰"
        description="UPDO 이용자들은 이렇게 느꼈어요 🌟"
        imageSrc="/images/reviews_banner.webp"
      />
      <main>{children}</main>
    </>
  );
}
