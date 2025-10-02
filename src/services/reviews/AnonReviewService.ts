// src/services/reviews/AnonReviewService.ts

import Service from '../Service';
import { GetReviewsResponse, GetReviewScoresResponse } from '@/types/reviews';

class AnonReviewService extends Service {
  getReviewList(searchParams?: Record<string, string | number | boolean>) {
    const qs =
      searchParams && Object.keys(searchParams).length
        ? `?${new URLSearchParams(stringifyParams(searchParams)).toString()}`
        : '';
    return this.http.get<GetReviewsResponse>(`/reviews${qs}`);
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
