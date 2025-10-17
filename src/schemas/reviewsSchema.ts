import { z } from 'zod';

// 리뷰 작성 폼
export const ReviewFormSchema = z.object({
  gatheringId: z.number(),
  score: z.number().min(1, '별점을 선택해주세요.').max(5, '별점은 5점 이하이어야 합니다.'),
  comment: z.string().min(1, '리뷰를 작성해주세요.'),
});

export type ReviewFormType = z.infer<typeof ReviewFormSchema>;
