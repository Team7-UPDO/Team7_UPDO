'use client';

import { useState } from 'react';
import { useMutation, useQueryClient, type InfiniteData } from '@tanstack/react-query';

import { useToast } from '@/components/ui/Toast';

import { leaveGathering } from '@/services/gatherings/gatheringService';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function hasPages(value: unknown): value is InfiniteData<unknown> {
  return isRecord(value) && Array.isArray((value as { pages?: unknown }).pages);
}

type UseLeaveControlOptions = {
  onSuccess?: () => void;
  onError?: () => void;
  onSettled?: () => void;

  extraInvalidateKeys?: (string | number | object)[][];
};

function removeItemById<T extends { id?: number }>(data: unknown, targetId: number): unknown {
  if (!data) return data;

  // 1) 단순 배열 데이터
  if (Array.isArray(data)) {
    return (data as T[]).filter(item => item?.id !== targetId);
  }

  // 2) TanStack InfiniteData<Page>
  if (hasPages(data)) {
    const inf = data; // typed as InfiniteData<unknown>
    return {
      ...inf,
      pages: inf.pages.map(page => {
        // 페이지가 배열이면 그대로 처리
        if (Array.isArray(page)) {
          return (page as T[]).filter(it => it?.id !== targetId);
        }
        // 객체 페이지인 경우: id를 가진 배열 필드를 찾아서 제거
        if (isRecord(page)) {
          const clone: Record<string, unknown> = { ...page };
          Object.keys(clone).forEach(k => {
            const v = clone[k];
            if (
              Array.isArray(v) &&
              v.length > 0 &&
              typeof v[0] === 'object' &&
              v[0] !== null &&
              'id' in (v[0] as object)
            ) {
              clone[k] = (v as T[]).filter(x => x?.id !== targetId);
            }
          });
          return clone;
        }
        return page;
      }),
    };
  }

  // 3) 객체 리스트(관례적으로 items 필드를 가정)
  if (isRecord(data)) {
    const obj: Record<string, unknown> = { ...data };
    const items = obj['items'];
    if (Array.isArray(items)) {
      obj['items'] = (items as T[]).filter(item => item?.id !== targetId);
      return obj;
    }
  }

  return data;
}

// 마이페이지 관련 리스트 키 판별
function isMyPageListKey(queryKey: unknown): boolean {
  if (!Array.isArray(queryKey)) return false;
  return (queryKey as (string | number | object)[]).some(key =>
    ['myMeetings', 'myGroups', 'joinedGatherings'].includes(typeof key === 'string' ? key : ''),
  );
}

export function useLeaveControl(options: UseLeaveControlOptions = {}) {
  const [leavingId, setLeavingId] = useState<number | null>(null);
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const leaveMutation = useMutation({
    mutationFn: (gatheringId: number) => leaveGathering(gatheringId),
    onMutate: async (gatheringId: number) => {
      setLeavingId(gatheringId);

      // 낙관적 업데이트: 마이페이지 관련 리스트들에서 해당 카드 제거
      queryClient.setQueriesData(
        { predicate: q => isMyPageListKey(q.queryKey) },
        (oldData: unknown) => removeItemById(oldData, gatheringId),
      );
    },
    onError: () => {
      showToast('모임 참여 취소가 실패했습니다.', 'error');
      options.onError?.();

      // 롤백 느낌: 서버 상태로 다시 동기화
      queryClient.invalidateQueries({
        predicate: q => isMyPageListKey(q.queryKey),
        refetchType: 'active',
      });
    },
    onSuccess: (_data, gatheringId) => {
      showToast('모임 참여를 취소했습니다.', 'info');
      options.onSuccess?.();

      // 상세 / 참가자 정보 캐시 무효화로 정확한 숫자/상태 반영
      queryClient.invalidateQueries({ queryKey: ['gatheringDetail', gatheringId] });
      queryClient.invalidateQueries({ queryKey: ['gatheringParticipants', gatheringId] });
    },
    onSettled: (_data, _error, gatheringId) => {
      setLeavingId(null);

      // 안정성 보강: 마이페이지 리스트 전반 재검증
      queryClient.invalidateQueries({
        predicate: q => isMyPageListKey(q.queryKey),
        refetchType: 'active',
      });

      // 추가로 전달된 키 무효화
      options.extraInvalidateKeys?.forEach(k => queryClient.invalidateQueries({ queryKey: k }));

      // 상세/참가자 재무효화 보강
      if (typeof gatheringId === 'number') {
        queryClient.invalidateQueries({ queryKey: ['gatheringDetail', gatheringId] });
        queryClient.invalidateQueries({ queryKey: ['gatheringParticipants', gatheringId] });
      }

      options.onSettled?.();
    },
  });

  const leave = (gatheringId: number) => leaveMutation.mutate(gatheringId);
  const isLeaving = (id: number) => leavingId === id;

  return {
    leave,
    leavingId,
    isLeaving,
    isPending: leaveMutation.isPending,
  };
}
