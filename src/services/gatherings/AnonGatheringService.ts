// src/services/gatherings/AnonGatheringService.ts

import Service from '../Service';
import { IGathering, IParticipant } from '@/types/gatherings';

class AnonGatheringService extends Service {
  getGatheringList(params?: Record<string, string | number | boolean>) {
    const qs = params ? '?' + new URLSearchParams(stringifyParams(params)).toString() : '';
    return this.http.get<IGathering[]>(`/gatherings${qs}`);
  }

  getGatheringInfiniteList(pageParam = 1, params?: Record<string, string | number | boolean>) {
    const ITEMS_PER_PAGE = 10;
    const offset = (pageParam - 1) * ITEMS_PER_PAGE;
    const limitParams = `limit=${ITEMS_PER_PAGE}&offset=${offset}`;
    const qs =
      params && Object.keys(params).length
        ? `${new URLSearchParams(stringifyParams(params)).toString()}&${limitParams}`
        : limitParams;
    return this.http.get<IGathering[]>(`/gatherings?${qs}`);
  }

  getFavoriteList(params: { id?: number[] }) {
    const ids = params?.id?.length ? params.id.join(',') : '';
    if (!ids) return Promise.resolve([] as IGathering[]);
    return this.http.get<IGathering[]>(`/gatherings?limit=50&id=${ids}`);
  }

  getGatheringDetail(id: string) {
    return this.http.get<IGathering>(`/gatherings/${id}`);
  }

  getGatheringParticipants(id: string) {
    return this.http.get<IParticipant[]>(`/gatherings/${id}/participants`);
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

const anonGatheringService = new AnonGatheringService();
export default anonGatheringService;
