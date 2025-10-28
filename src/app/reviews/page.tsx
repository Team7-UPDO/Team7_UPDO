'use client';

import { useReviewFilters } from '@/hooks/useReviewFilters';
import { useReviewScoresQuery } from '@/hooks/useReviewScoreQuery';
import type { GetReviewScoresParams } from '@/types/reviews';
import Tab from '@/components/ui/Tab';
import Category from '@/components/ui/Category';
import Dropdown from '@/components/ui/Dropdown';
import { Calendar } from '@/components/ui/Calendar';
import IconText from '@/components/ui/IconText';
import { SORT_OPTIONS, TAG_OPTIONS } from '@/constants';
import ReviewStatsCard from '@/components/feature/review/ReviewStatsCard';
import AllReviewList from '@/components/feature/review/AllReviewList';

export default function ReviewsPage() {
  const filter = useReviewFilters();

  const statsParams: GetReviewScoresParams = {};
  if ('type' in filter.queryParams && filter.queryParams.type) {
    statsParams.type = filter.queryParams.type;
  }

  const { data, isLoading } = useReviewScoresQuery(statsParams);
  const mainTabs = [
    { value: '성장', label: '성장' },
    { value: '네트워킹', label: '네트워킹' },
  ] as const;

  // 여러 타입의 데이터를 합산
  const aggregatedStats = data?.reduce(
    (acc, curr) => ({
      totalReviews:
        acc.totalReviews +
        curr.oneStar +
        curr.twoStars +
        curr.threeStars +
        curr.fourStars +
        curr.fiveStars,
      sumScores:
        acc.sumScores +
        (curr.oneStar * 1 +
          curr.twoStars * 2 +
          curr.threeStars * 3 +
          curr.fourStars * 4 +
          curr.fiveStars * 5),
      oneStar: acc.oneStar + curr.oneStar,
      twoStars: acc.twoStars + curr.twoStars,
      threeStars: acc.threeStars + curr.threeStars,
      fourStars: acc.fourStars + curr.fourStars,
      fiveStars: acc.fiveStars + curr.fiveStars,
    }),
    {
      totalReviews: 0,
      sumScores: 0,
      oneStar: 0,
      twoStars: 0,
      threeStars: 0,
      fourStars: 0,
      fiveStars: 0,
    },
  );

  const total = aggregatedStats?.totalReviews ?? 0;
  const average = total > 0 ? aggregatedStats!.sumScores / total : 0;
  const distribution = aggregatedStats
    ? [
        aggregatedStats.fiveStars,
        aggregatedStats.fourStars,
        aggregatedStats.threeStars,
        aggregatedStats.twoStars,
        aggregatedStats.oneStar,
      ]
    : [0, 0, 0, 0, 0];

  return (
    <div className="flex flex-col">
      <div className="sm:mt-8">
        <Tab items={mainTabs} value={filter.activeMain} onChange={filter.handleMainChange} />
      </div>

      <div className="mt-4 mb-4 flex flex-col gap-1.5 sm:mt-8 sm:flex-row sm:items-center">
        {filter.activeMain === '성장' && (
          <div>
            <Category
              mainCategory="성장"
              activeId={filter.activeSubId}
              activeType={filter.activeSubType}
              onChange={filter.handleCategoryChange}
            />
          </div>
        )}

        <div className="flex items-center font-medium text-gray-500 sm:ml-auto sm:h-[40px]">
          <div ref={filter.tagRef} className="relative">
            <IconText
              icon="arrow"
              iconPosition="trailing"
              className="cursor-pointer px-2 hover:text-gray-800"
              onClick={() => filter.setIsTagOpen(prev => !prev)}>
              {filter.selectedTag}
            </IconText>
            {filter.isTagOpen && (
              <div className="absolute z-10 mt-2 sm:top-full sm:right-0">
                <Dropdown
                  items={TAG_OPTIONS}
                  onChange={filter.handleTagSelect}
                  onOpenChange={filter.setIsTagOpen}
                  size="small"
                />
              </div>
            )}
          </div>

          <div ref={filter.calendarRef} className="relative">
            <IconText
              icon="arrow"
              iconPosition="trailing"
              className="cursor-pointer px-2 hover:text-gray-800"
              onClick={() => filter.setIsCalendarOpen(prev => !prev)}>
              {filter.selectedDate
                ? filter.selectedDate.toLocaleDateString('ko-KR', {
                    month: '2-digit',
                    day: '2-digit',
                  })
                : '날짜 전체'}
            </IconText>

            {filter.isCalendarOpen && (
              <div className="absolute z-10 mt-2 sm:top-full sm:right-0">
                <Calendar
                  cancelLabel="초기화"
                  value={filter.selectedDate}
                  onCancel={() => {
                    filter.setSelectedDate(undefined);
                    filter.setIsCalendarOpen(false);
                  }}
                  onConfirm={filter.handleDateConfirm}
                />
              </div>
            )}
          </div>

          <div ref={filter.filterRef} className="relative">
            <IconText
              icon="filter"
              iconColor="var(--color-gray-800)"
              className="cursor-pointer px-2 hover:text-gray-800"
              onClick={() => filter.setIsFilterOpen(prev => !prev)}>
              {filter.selectedFilter}
            </IconText>

            {filter.isFilterOpen && (
              <div className="absolute top-full right-0 z-10 mt-2">
                <Dropdown
                  items={SORT_OPTIONS}
                  onChange={filter.handleFilterSelect}
                  onOpenChange={filter.setIsFilterOpen}
                  size="small"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex h-40 items-center justify-center text-gray-500">로딩 중...</div>
      ) : (
        <>
          <ReviewStatsCard average={average} total={total} distribution={distribution} />
          <AllReviewList filters={filter.queryParams} />
        </>
      )}
    </div>
  );
}
