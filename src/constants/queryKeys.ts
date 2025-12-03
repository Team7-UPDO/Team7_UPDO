import type { GetGatheringsParams } from '@/types/gatherings/params';
import type { GetReviewsParams } from '@/types/reviews/params';

export const queryKeys = {
  gatherings: {
    all: () => ['gatherings'] as const,
    lists: () => [...queryKeys.gatherings.all(), 'list'] as const,
    list: (filters?: GetGatheringsParams) =>
      [...queryKeys.gatherings.lists(), filters || {}] as const,

    // 상세
    details: () => [...queryKeys.gatherings.all(), 'detail'] as const,
    detail: (id: number | string) => [...queryKeys.gatherings.details(), Number(id)] as const,

    // 참가자
    participants: (id: number) => [...queryKeys.gatherings.detail(id), 'participants'] as const,

    my: {
      all: (userId: number | null) => [...queryKeys.gatherings.all(), 'my', userId] as const,

      // 내가 참여한 모임
      joinedGatherings: (userId: number | null) =>
        [...queryKeys.gatherings.my.all(userId), 'joined'] as const,

      // 내가 만든 모임
      createdGatherings: (userId: number) =>
        [...queryKeys.gatherings.my.all(userId), 'created'] as const,

      // 찜한 모임
      favoriteGatherings: (userId: number, ids?: number[]) =>
        [...queryKeys.gatherings.my.all(userId), 'favorites', ids || []] as const,
    },
  },

  reviews: {
    all: () => ['reviews'] as const,

    // 전체 리뷰 목록
    lists: () => [...queryKeys.reviews.all(), 'list'] as const,
    list: (params?: GetReviewsParams) => [...queryKeys.reviews.lists(), params || {}] as const,

    // 특정 모임의 리뷰
    byGathering: (gatheringId: number, page: number = 1) =>
      [...queryKeys.reviews.all(), 'gathering', gatheringId, 'page', page] as const,

    // 리뷰 점수 통계
    scores: (params?: { gatheringId?: string; type?: string }) =>
      [...queryKeys.reviews.all(), 'scores', params || {}] as const,

    my: {
      all: (userId: number) => [...queryKeys.reviews.all(), 'my', userId] as const,

      // 작성 가능한 리뷰
      writable: (userId: number) => [...queryKeys.reviews.my.all(userId), 'writable'] as const,

      // 작성한 리뷰
      written: (userId: number) => [...queryKeys.reviews.my.all(userId), 'written'] as const,

      // 특정 모임에 대한 내 리뷰
      byGathering: (gatheringId: number, userId: number) =>
        [...queryKeys.reviews.all(), 'my', 'gathering', gatheringId, userId] as const,
    },
  },
} as const;

export type ReviewSortOrder = 'asc' | 'desc';

export const queryKey = {
  gatherings: () => ['gatherings'] as const,
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
  allReviews: (params?: Record<string, string>) => ['reviews', 'all', params || {}] as const,

  participants: (id?: number | string | null) =>
    ['gatheringParticipants', id == null ? null : Number(id)] as const,

  joinedGatherings: (userId?: number | null) => ['joinedGatherings', userId ?? null] as const,
};
