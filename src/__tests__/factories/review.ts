import type { IReviewWithRelations } from '@/types/reviews';

export function createReview(overrides?: Partial<IReviewWithRelations>): IReviewWithRelations {
  return {
    id: 1,
    userId: 1,
    gatheringId: 1,
    score: 4,
    comment: '좋은 모임이었습니다',
    createdAt: '2024-06-01T00:00:00Z',
    Gathering: {
      id: 1,
      type: 'DALLAEMFIT',
      name: '테스트 모임',
      dateTime: '2024-05-01T10:00:00Z',
      location: '건대입구',
      image: undefined,
    },
    User: {
      id: 1,
      name: '테스트 유저',
      image: undefined,
    },
    ...overrides,
  };
}
