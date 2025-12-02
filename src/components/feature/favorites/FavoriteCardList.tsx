'use client';

import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import { FilterState } from '@/utils/mapping';
import GroupCard from '../group/GroupCard';
import { motion } from 'framer-motion';
import GroupCardSkeleton from '@/components/ui/Skeleton/GroupCardSkeleton';
import { useFavoriteStore } from '@/stores/useFavoriteStore';
import { useUserStore } from '@/stores/useUserStore';
import { getFavoriteList } from '@/services/gatherings/anonGatheringService';
import { IGathering } from '@/types/gatherings';
import { useMounted } from '@/hooks/ui/useMounted';
import { useEffect, useState } from 'react';

interface GroupCardListProps {
  filters: FilterState;
}

export default function FavoriteCardList({ filters }: GroupCardListProps) {
  const mounted = useMounted();
  const hasHydrated = useFavoriteStore(state => state._hasHydrated);
  const userId = useUserStore(state => state.user?.id ?? null);
  const [favoriteIds, setFavoriteIds] = useState<number[]>([]);
  useEffect(() => {
    if (mounted && hasHydrated) {
      setFavoriteIds(useFavoriteStore.getState().getFavorites());
    }
  }, [mounted, hasHydrated]);

  const hasFavorites = favoriteIds.length > 0;

  const queryParams = hasFavorites ? { id: favoriteIds } : null;
  const {
    data: favoriteGatherings = [],
    isLoading,
    isError,
    refetch,
  } = useQuery<IGathering[]>({
    queryKey: ['favoriteGatherings', userId, queryParams],
    queryFn: () => getFavoriteList(queryParams!),
    enabled: hasFavorites,
  });
  if (!mounted) return null;

  if (isLoading)
    return (
      <div
        className="mx-auto mb-8 flex flex-col items-center gap-6 md:grid md:grid-cols-2"
        aria-busy="true"
        aria-label="찜한 모임 로딩 중">
        {Array.from({ length: 6 }).map((_, i) => (
          <GroupCardSkeleton key={i} />
        ))}
      </div>
    );

  if (isError)
    return (
      <div
        className="flex h-[300px] flex-col items-center justify-center text-gray-500"
        role="alert">
        데이터를 불러오는 중 오류가 발생했습니다.
        <button
          onClick={() => refetch()}
          className="mt-2 rounded-md bg-purple-500 px-4 py-2 text-white hover:bg-purple-600">
          다시 시도
        </button>
      </div>
    );

  const isGrowthAll =
    filters.main === '성장' && (!filters.subType || filters.subType === 'DALLAEMFIT');

  const gatherings = favoriteGatherings.filter(item => {
    if (filters.subType && filters.subType !== 'DALLAEMFIT' && item.type !== filters.subType) {
      return false;
    }
    if (isGrowthAll && item.type === 'WORKATION') {
      return false;
    }
    return true;
  });

  return (
    <>
      {gatherings.length === 0 ? (
        <div className="mt-16 flex flex-col items-center text-gray-400">
          <Image
            src="/images/empty.webp"
            alt=""
            style={{ width: 'auto', height: 'auto' }}
            width={180}
            height={100}
          />
          <p>현재 찜한 모임이 없습니다.</p>
        </div>
      ) : (
        <div className="mx-auto mb-8 flex flex-col gap-6 md:grid md:grid-cols-2">
          {gatherings.map(item => (
            <motion.div
              key={item.id}
              className="h-full w-full"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ type: 'tween', ease: 'easeOut', duration: 0.4 }}>
              <GroupCard data={item} />
            </motion.div>
          ))}
        </div>
      )}
    </>
  );
}
