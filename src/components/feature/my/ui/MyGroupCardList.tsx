'use client';

import Image from 'next/image';
import React, { useMemo } from 'react';

import MyGroupCard from '@/components/feature/my/ui/MyGroupCard';
import MyGroupCardSkeleton from '@/components/ui/Skeleton/MyGroupCardSkeleton';
import type { IJoinedGathering } from '@/types/gatherings';
import { isClosed } from '@/utils/date';

interface MyGroupCardListProps {
  variant: 'myMeetings' | 'created' | 'myReviews';
  items: IJoinedGathering[];

  isLoading?: boolean;
  isError?: boolean;
  isFetchingNextPage?: boolean;
  hasNextPage?: boolean;

  onRetry?: () => void;
  sentinelRef?: React.Ref<HTMLDivElement>;

  emptyMsg?: string;

  reviewFilter?: 'writable' | 'written';
}

export default function MyGroupCardList({
  items,
  isLoading = false,
  isError = false,
  isFetchingNextPage = false,
  hasNextPage = false,
  onRetry,
  sentinelRef,
  variant = 'myMeetings',
  emptyMsg = '표시할 모임이 없어요.',
  reviewFilter,
}: MyGroupCardListProps) {
  // 리뷰 탭일 경우 화면단 필터링 (완료 + 리뷰 작성 여부 기준)
  const filtered = useMemo(() => {
    if (!reviewFilter) return items; // <나의 리뷰> 탭이 아니라면, 원본 데이터 반환

    const isCompleted = (item: IJoinedGathering) => !!item.isCompleted || isClosed(item.dateTime);

    switch (reviewFilter) {
      case 'writable':
        return items.filter(item => isCompleted(item) && !item.isReviewed); // 완료된 모임 + 리뷰 미작성
      case 'written':
        return items.filter(item => isCompleted(item) && !!item.isReviewed); // 완료된 모임 + 리뷰 작성
    }
  }, [items, variant, reviewFilter]);

  // 주요 변경 부분만
  if (isLoading) {
    return (
      <div
        data-testid="mypage-skeleton"
        className="mx-auto mt-6 flex w-full flex-col items-center gap-6"
        aria-busy="true"
        aria-live="polite"
        aria-label="모임 목록을 불러오는 중입니다">
        {Array.from({ length: 6 }).map((_, i) => (
          <MyGroupCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div
        className="flex h-[300px] flex-col items-center justify-center text-gray-500"
        role="alert">
        데이터를 불러오는 중 오류가 발생했습니다.
        {onRetry && (
          <button
            onClick={onRetry}
            className="mt-2 rounded-md bg-purple-500 px-4 py-2 text-white hover:bg-purple-600">
            다시 시도
          </button>
        )}
      </div>
    );
  }

  if (!filtered || filtered.length === 0) {
    return (
      <div className="flex min-h-100 flex-col items-center justify-center" ref={sentinelRef}>
        <Image src="/images/empty.webp" alt="모임 빈화면 이미지" width={171} height={115} />
        <p className="card-title text-gray-400">{emptyMsg}</p>
      </div>
    );
  }

  return (
    <div className="mx-auto mt-6 flex w-full flex-col items-center gap-4 sm:mt-8 md:gap-6">
      {filtered.map(item => (
        <div key={item.id} className="w-full">
          <MyGroupCard variant={variant} item={item} />
        </div>
      ))}

      {/* sentinel + 상태 텍스트 */}
      <div ref={sentinelRef} className="my-4 text-gray-500" aria-live="polite">
        {isFetchingNextPage && '불러오는 중...'}
      </div>
    </div>
  );
}
