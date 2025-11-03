import GatheringSection from '@/components/feature/gathering/GatheringSection';
import { getGatheringInfiniteList } from '@/services/gatherings/anonGatheringService';
import { toGetGatheringsParams } from '@/utils/mapping';
import { normalizeFilters } from '@/hooks/usePrefetchInfiniteQuery';
import { HydrationBoundary, QueryClient, dehydrate } from '@tanstack/react-query';
import { prefetchInfiniteQueryKey } from '@/hooks/usePrefetchInfiniteQuery';
import Image from 'next/image';
import { Suspense } from 'react';
import GatheringSkeleton from '@/components/ui/Skeleton/GatheringSkeleton';
import Head from 'next/head';

export default async function GatheringPage() {
  const queryClient = new QueryClient();

  const defaultFilters = normalizeFilters({ main: '성장', subType: '전체' });
  const queryKey = prefetchInfiniteQueryKey(defaultFilters);

  await queryClient.prefetchInfiniteQuery({
    queryKey,
    queryFn: async ({ pageParam = 1 }) => {
      const data = await getGatheringInfiniteList(pageParam, toGetGatheringsParams(defaultFilters));
      return data;
    },
    initialPageParam: 1,
  });

  return (
    <>
      <Head>
        <link rel="preconnect" href="https://sprint-fe-project.s3.ap-northeast-2.amazonaws.com" />
        <link rel="preconnect" href="https://updo.site" />
      </Head>
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
            src="/images/find_banner.png"
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
