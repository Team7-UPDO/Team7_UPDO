import FavoriteSection from '@/components/feature/favorites/FavoriteSection';
import { Banner } from '@/components/ui/common/Banner';

export default function FavoritesPage() {
  return (
    <>
      <header aria-label="찜한 모임">
        <Banner
          title="찜한 모임"
          description="마감되기 전에 지금 바로 참여해보세요 👀"
          imageSrc="/images/favorites_banner.webp"
        />
      </header>
      <main>
        <FavoriteSection />
      </main>
    </>
  );
}
