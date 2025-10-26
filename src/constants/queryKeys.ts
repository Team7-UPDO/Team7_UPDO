export const qk = {
  // 내가 참여한 모임
  myMeetings: () => ['gatherings', 'myMeetings'] as const,

  // 내가 만든 모임
  myCreatedGroups: (userId?: number) => ['gatherings', 'created', userId ?? ''] as const,

  // 내가 작성한/작성할 리뷰
  myReviews: (filter: 'writable' | 'written') => ['gatherings', 'myReviews', filter] as const,
};
