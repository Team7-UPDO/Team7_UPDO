import { HydrationBoundary, QueryClient, dehydrate } from '@tanstack/react-query';
import ReviewsPage from '@/components/feature/review/ReviewsPage';
import { ENV } from '@/constants/env';
import type { GetReviewScoresResponse } from '@/types/reviews';

export default async function Page() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5,
      },
    },
  });

  try {
    await queryClient.prefetchQuery({
      queryKey: ['reviewScores', {}],
      queryFn: async (): Promise<GetReviewScoresResponse> => {
        const res = await fetch(`${ENV.API_BASE_URL}/${ENV.TEAM_ID}/reviews/scores`, {
          cache: 'no-store',
        });

        if (!res.ok) {
          throw new Error(`Failed to fetch review scores: ${res.status}`);
        }

        return res.json();
      },
    });
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[Prefetch Error]', error);
    }
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ReviewsPage />
    </HydrationBoundary>
  );
}
