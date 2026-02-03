import type { Metadata } from 'next';
import HeroSection from '@/components/feature/landing/HeroSection';
import HowItWorksSection from '@/components/feature/landing/HowItWorksSection';
import FeaturesSection from '@/components/feature/landing/FeaturesSection';
import TestimonialsSection from '@/components/feature/landing/TestimonialsSection';
import CTASection from '@/components/feature/landing/CTASection';
import LandingFooter from '@/components/feature/landing/LandingFooter';
import FloatingShapes from '@/components/feature/landing/FloatingShapes';

export const metadata: Metadata = {
  title: 'UPDO - 함께 성장하는 커뮤니티',
  description:
    '관심사를 공유하고, 목표를 달성하고, 함께 성장하세요. UPDO에서 나에게 맞는 모임을 찾아보세요.',
  keywords: ['UPDO', '성장', '모임', '커뮤니티', '자기계발', '네트워킹', '챌린지', '배움'],
  openGraph: {
    title: 'UPDO - 함께 성장하는 커뮤니티',
    description: '관심사를 공유하고, 목표를 달성하고, 함께 성장하세요',
    url: 'https://updo.site',
    images: [
      {
        url: '/images/og_default.webp',
        width: 600,
        height: 315,
        alt: 'UPDO 메인 이미지',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'UPDO - 함께 성장하는 커뮤니티',
    description: '관심사를 공유하고, 목표를 달성하고, 함께 성장하세요',
    images: ['/images/og_default.webp'],
  },
};

export default function HomePage() {
  return (
    <main className="relative right-[50%] left-[50%] -mr-[50vw] -ml-[50vw] min-h-screen w-screen overflow-hidden">
      <div className="relative z-10">
        <FloatingShapes />
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <TestimonialsSection />
        <CTASection />
      </div>
      <LandingFooter />
    </main>
  );
}
