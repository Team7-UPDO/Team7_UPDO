export type ReviewSortOrder = 'asc' | 'desc';

export type AllReviewFilters = {
  sort?: string;
  order?: ReviewSortOrder;
  ratingGte?: number;
  tagIds?: (number | string)[];
  period?: { from?: string; to?: string };
  query?: string;
  userId?: number;
};

export function normalizeReviewFilters(f?: AllReviewFilters) {
  if (!f) return {};
  const { sort, order, ratingGte, tagIds, period, query, userId } = f;

  const normTags = Array.isArray(tagIds)
    ? [...tagIds].map(String).sort((a, b) => (a > b ? 1 : a < b ? -1 : 0))
    : undefined;

  const normPeriod =
    period && (period.from || period.to)
      ? { from: period.from ?? '', to: period.to ?? '' }
      : undefined;

  return {
    sort: sort ?? undefined,
    order: order ?? undefined,
    ratingGte: typeof ratingGte === 'number' ? ratingGte : undefined,
    tagIds: normTags,
    period: normPeriod,
    query: query ?? undefined,
    userId: typeof userId === 'number' ? userId : undefined,
  };
}

export const qk = {
  // 내가 참여한 모임 (MyMeeting)
  myMeetings: () => ['gatherings', 'myMeetings'] as const,

  // 내가 만든 모임 (Created)
  myCreatedGroups: (userId?: number) => ['gatherings', 'created', userId ?? ''] as const,

  // 내가 작성 가능한 리뷰 (MyReview)
  myReviewsWritable: () => ['gatherings', 'myReviews', 'writable'] as const,

  // 내가 작성한 리뷰 (MyReview)
  myReviewsWritten: (userId?: number | null) =>
    ['reviews', 'my', 'written', userId ?? null] as const,

  // 모든 리뷰
  allReviews: (filters?: AllReviewFilters) =>
    ['reviews', 'all', normalizeReviewFilters(filters)] as const,
};
