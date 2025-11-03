import { Banner } from '@/components/ui/common/Banner';

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
