import type { Metadata } from 'next';
import GatheringSection from '@/components/feature/gathering/GatheringSection';
import { getGatheringInfiniteList } from '@/services/gatherings/anonGatheringService';
import { toGetGatheringsParams } from '@/utils/mapping';
import { normalizeFilters } from '@/hooks/queries/common/usePrefetchInfiniteQuery';
import { HydrationBoundary, QueryClient, dehydrate } from '@tanstack/react-query';
import { prefetchInfiniteQueryKey } from '@/hooks/queries/common/usePrefetchInfiniteQuery';
import Image from 'next/image';
import { Suspense } from 'react';
import GatheringSkeleton from '@/components/ui/Skeleton/GatheringSkeleton';

export const metadata: Metadata = {
  title: '모임 찾기',
  description: '성장형 커뮤니티 UPDO에서 관심사 기반 모임을 찾아보세요.',
  openGraph: {
    title: '모임 찾기 | UPDO',
    description: '함께 성장할 사람을 찾아보세요.',
    url: 'https://updo.site/gathering',
    images: [
      {
        url: '/images/og_default.webp',
        width: 600,
        height: 315,
        alt: 'UPDO 모임 찾기 대표 이미지',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '모임 찾기 | UPDO',
    description: '함께 성장할 사람을 찾아보세요.',
    images: ['/images/og_default.webp'],
  },
};

export default async function GatheringPage() {
  const queryClient = new QueryClient();

  const defaultFilters = normalizeFilters({ main: '성장', subType: '전체' });
  const queryKey = prefetchInfiniteQueryKey(defaultFilters);

  await queryClient.prefetchInfiniteQuery({
    queryKey,
    queryFn: ({ pageParam = 1 }) =>
      getGatheringInfiniteList(pageParam, toGetGatheringsParams(defaultFilters)),
    initialPageParam: 1,
  });

  return (
    <>
      <header
        aria-label="모임 찾기"
        className="flex h-[192px] w-full items-center justify-between rounded-3xl bg-white sm:h-[244px]">
        <div className="ml-5 flex flex-col justify-center text-nowrap sm:ml-24">
          <p className="typo-body-sm sm:typo-subtitle text-[var(--purple-550)]">
            함께 성장 할 사람을 찾고 계신가요?
          </p>
          <h1 className="card-title sm:h3Semibold">지금 모임에 참여해보세요</h1>
        </div>

        <div className="flex h-44 w-36 items-center justify-center sm:mr-16 sm:h-auto sm:w-[275px] md:mr-24 md:w-[316px]">
          <Image
            src="/images/find_banner.webp"
            alt=""
            width={310}
            height={70}
            fetchPriority="high"
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      </header>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <main>
          <Suspense fallback={<GatheringSkeleton />}>
            <GatheringSection defaultFilters={defaultFilters} />
          </Suspense>
        </main>
      </HydrationBoundary>
    </>
  );
}
