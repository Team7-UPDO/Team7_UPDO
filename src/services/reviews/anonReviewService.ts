import { GetReviewScoresResponse, GetReviewsResponse, IReviewWithRelations } from '@/types/reviews';

import Service from '../service';

class AnonReviewService extends Service {
  getReviewInfiniteList(
    pageParam = 1,
    params?: Record<string, string | number | boolean>,
    limit = 10,
  ): Promise<{ data: IReviewWithRelations[]; nextPage?: number }> {
    const offset = (pageParam - 1) * limit;
    const baseQs = new URLSearchParams({ limit: String(limit), offset: String(offset) });
    const extraQs = new URLSearchParams(stringifyParams(params ?? {}));
    const qs = [baseQs.toString(), extraQs.toString()].filter(Boolean).join('&'); // limit=10&offset=20&userId=2465

    return this.http.get<GetReviewsResponse>(`/reviews?${qs}`).then(res => {
      const items = res?.data as IReviewWithRelations[];
      const curr = res?.currentPage;
      const total = res?.totalPages;
      let nextPage: number | undefined; // 다음 페이지가 있으면 number, 없으면 undefined -> 무한스크롤 종료

      if (typeof curr === 'number' && typeof total === 'number') {
        const hasMore = curr + 1 < total || curr < total;
        nextPage = hasMore ? pageParam + 1 : undefined;
      } else nextPage = Array.isArray(items) && items.length === limit ? pageParam + 1 : undefined;

      return { data: items, nextPage };
    });
  }

  getReviewScore() {
    return this.http.get<GetReviewScoresResponse>('/reviews/scores');
  }

  getReviewsByGatheringId(searchParams: Record<string, string>) {
    const qs = new URLSearchParams(searchParams).toString();
    return this.http.get<GetReviewsResponse>(`/reviews?${qs}`);
  }
}

function stringifyParams(obj: Record<string, string | number | boolean>) {
  const out: Record<string, string> = {};
  Object.entries(obj).forEach(([k, v]) => {
    if (v == null) return;
    out[k] = Array.isArray(v) ? v.join(',') : String(v);
  });
  return out;
}

const anonReviewService = new AnonReviewService();
export default anonReviewService;
