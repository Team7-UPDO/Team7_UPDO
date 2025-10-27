'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { FilterState } from '@/utils/mapping';
import GroupCard from '../group/GroupCard';
import { motion } from 'framer-motion';
import GroupCardSkeleton from '@/components/ui/Skeleton/GroupCardSkeleton';
import { useFavoriteStore } from '@/stores/useFavoriteStore';
import { getFavoriteList } from '@/services/gatherings/anonGatheringService';
import { IGathering } from '@/types/gatherings';

interface GroupCardListProps {
  filters: FilterState;
}

const EMPTY_FAVORITE_IDS: number[] = [];

export default function FavoriteCardList({ filters }: GroupCardListProps) {
  const [gatherings, setGatherings] = useState<IGathering[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const favoriteIds = useFavoriteStore(state => {
    const ids = state.getFavorites();
    return ids.length ? ids : EMPTY_FAVORITE_IDS;
  });

  useEffect(() => {
    const loadFavorites = async () => {
      if (favoriteIds.length === 0) {
        setGatherings([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const res = await getFavoriteList({ id: favoriteIds });
        setGatherings(res);
      } catch (err) {
        setGatherings([]);
      } finally {
        setLoading(false);
      }
    };

    loadFavorites();
  }, [favoriteIds]);

  const isGrowthAll =
    filters.main === '성장' && (!filters.subType || filters.subType === 'DALLAEMFIT');
  const subTypeFilter =
    filters.subType && filters.subType !== 'DALLAEMFIT' ? filters.subType : undefined;

  const filteredGatherings = gatherings.filter(item => {
    if (subTypeFilter && item.type !== subTypeFilter) {
      return false;
    }

    if (isGrowthAll && item.type === 'WORKATION') {
      return false;
    }

    if (filters.location && item.location !== filters.location) {
      return false;
    }

    return true;
  });

  if (loading)
    return (
      <div className="mx-auto flex flex-col items-center gap-6 md:grid md:grid-cols-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <GroupCardSkeleton key={i} />
        ))}
      </div>
    );

  if (error)
    return (
      <div className="flex h-[300px] flex-col items-center justify-center text-gray-500">
        데이터를 불러오는 중 오류가 발생했습니다.
        <button
          onClick={() => window.location.reload()}
          className="mt-2 rounded-md bg-purple-500 px-4 py-2 text-white hover:bg-purple-600">
          다시 시도
        </button>
      </div>
    );

  return (
    <>
      {filteredGatherings.length === 0 ? (
        <span className="mt-16 flex flex-col items-center text-gray-400">
          <Image
            src="/images/empty.png"
            alt="emptyImage"
            style={{ width: 'auto', height: 'auto' }}
            width={180}
            height={100}
          />
          현재 찜한 모임이 없습니다.
        </span>
      ) : (
        <div className="mx-auto flex flex-col gap-6 md:grid md:grid-cols-2">
          {filteredGatherings.map(item => (
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
