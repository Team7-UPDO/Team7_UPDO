'use client';

import Image from 'next/image';
import { useState } from 'react';
import { cn } from '@/utils/cn';
import ReviewCard from './GroupDetailReview';
import { Pagination } from '@/components/ui/Pagination';
import { useReviewsQuery } from '@/hooks/queries/reviews/useReviewsQuery';

interface GroupDetailReviewListProps {
  gatheringId: number;
}

export default function GroupDetailReviewList({ gatheringId }: GroupDetailReviewListProps) {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError } = useReviewsQuery(gatheringId, page);
  const reviews = data?.data ?? [];
  const totalPages = data?.totalPages ?? 1;

  if (isLoading) {
    return (
      <div
        className="flex h-48 items-center justify-center text-gray-500"
        aria-busy="true"
        aria-live="polite">
        <span className="sr-only">리뷰 목록을 불러오는 중입니다</span>
        로딩 중...
      </div>
    );
  }

  return (
    <section aria-labelledby="reviews-heading">
      <h3
        id="reviews-heading"
        className="md:typo-title text-lg font-semibold text-[var(--color-gray-900)]">
        리뷰 모아보기
      </h3>

      <div
        className={cn(
          'bg-surface rounded-md px-5 pt-[2px] pb-8 sm:mt-4 sm:rounded-md sm:px-10 md:mt-6 md:rounded-2xl md:px-12 md:pb-10',
        )}>
        {reviews.length === 0 || isError ? (
          <div className="flex flex-col items-center justify-center gap-3 py-12">
            <Image
              src="/images/empty.webp"
              alt=""
              width={171}
              height={115}
              className="opacity-70"
            />
            <p className="text-sm text-gray-400 md:text-base">
              {isError ? '리뷰를 불러올 수 없어요.' : '아직 작성된 리뷰가 없어요.'}
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {reviews.map(item => (
              <ReviewCard key={item.id} {...item} />
            ))}
          </ul>
        )}
      </div>

      {totalPages > 1 && (
        <div className="mt-4 flex justify-center md:mt-6">
          <Pagination totalPages={totalPages} currentPage={page} onPageChange={setPage} />
        </div>
      )}
    </section>
  );
}
