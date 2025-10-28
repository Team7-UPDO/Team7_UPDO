'use client';

import React from 'react';
import Image from 'next/image';

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
  const filtered =
    variant === 'myReviews' && reviewFilter
      ? items.filter(item => {
          const completed = (item.isCompleted ?? false) || isClosed(item.dateTime);
          const reviewed = !!item.isReviewed;
          if (reviewFilter === 'writable') return completed && !reviewed;
          if (reviewFilter === 'written') return completed && reviewed;
          return true;
        })
      : items;

  if (isLoading) {
    return (
      <div className="mx-auto mt-6 flex w-full flex-col items-center gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <MyGroupCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex h-[300px] flex-col items-center justify-center text-gray-500">
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
        <Image src="/images/empty.png" alt="모임 빈화면 이미지" width={171} height={115} />
        <span className="card-title text-gray-400">{emptyMsg}</span>
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
      <div ref={sentinelRef} className="my-4 text-gray-500">
        {isFetchingNextPage ? '불러오는 중...' : hasNextPage ? '' : ''}
      </div>
    </div>
  );
}
