'use client';

import {
  useInfiniteQuery,
  type InfiniteData,
  type QueryKey,
  type UseInfiniteQueryResult,
} from '@tanstack/react-query';
import { useMounted } from '@/hooks/useMounted';

export interface InfinitePage<TData> {
  data: TData;
  nextPage?: number | null;
}

export interface UseInfiniteListQueryOptions<TPage> {
  queryKey: QueryKey;
  queryFn: (pageParam: number) => Promise<TPage>;
  enabled?: boolean;
  initialPageParam?: number;
  getNextPageParam?: (lastPage: TPage, allPages: TPage[]) => number | null | undefined;
  staleTime?: number;
  gcTime?: number;
  retry?: false | number;
  refetchOnWindowFocus?: boolean;
  select?: (data: InfiniteData<TPage>) => InfiniteData<TPage>;
}

export function useInfiniteListQuery<TPage>(
  opts: UseInfiniteListQueryOptions<TPage>,
): UseInfiniteQueryResult<InfiniteData<TPage>, Error> {
  const mounted = useMounted();

  const {
    queryKey,
    queryFn,
    enabled = true,
    initialPageParam = 1,
    getNextPageParam,
    staleTime = 1000 * 60 * 2, // 2m
    gcTime = 1000 * 60 * 5, // 5m
    retry = 1,
    refetchOnWindowFocus = false,
    select,
  } = opts;

  // useInfiniteQuery + getNextPageParam, enabled, useMounted 옵션 자동화
  return useInfiniteQuery<TPage, Error, InfiniteData<TPage>, QueryKey>({
    queryKey,
    queryFn: ({ pageParam = initialPageParam }) => queryFn(pageParam as number),
    initialPageParam,
    getNextPageParam: (lastPage, allPages) => {
      if (getNextPageParam) return getNextPageParam(lastPage, allPages);
      if (typeof lastPage === 'object' && lastPage !== null && 'nextPage' in lastPage) {
        const np = (lastPage as { nextPage?: number | null }).nextPage;
        return np ?? undefined;
      }
      return undefined;
    },
    enabled: mounted && enabled,
    staleTime,
    gcTime,
    retry,
    refetchOnWindowFocus,
    select,
  });
}
