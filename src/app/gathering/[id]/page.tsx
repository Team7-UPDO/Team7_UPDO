'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { useQuery, useQueryClient } from '@tanstack/react-query';

import GroupDetailCard from '@/components/feature/gathering/detail/GroupDetailCard';
import GroupDetailParticipation from '@/components/feature/gathering/detail/GroupDetailParticipationCard';
import GroupDetailReviewList from '@/components/feature/gathering/detail/GroupDetailReviewList';
import WriteReviewModal from '@/components/feature/review/WriteReviewModal';

import { useToast } from '@/components/ui/Toast';
import { useAuthStore } from '@/stores/useAuthStore';
import { useUserStore } from '@/stores/useUserStore';
import { gatheringService } from '@/services/gatherings/gatheringService';
import { reviewService } from '@/services/reviews/reviewService';
import { copyToClipboard } from '@/utils/clipboard';
import { IParticipant } from '@/types/gatherings';
import { mapGatheringToUI } from '@/utils/mapping';
import { isClosed } from '@/utils/date';

import GroupDetailCardSkeleton from '@/components/ui/Skeleton/GroupDetailCardSkeleton';
import GroupDetailParticipationSkeleton from '@/components/ui/Skeleton/GroupDetailParticipationSkeleton';
import GroupDetailReviewListSkeleton from '@/components/ui/Skeleton/GroupDetailReviewListSkeleton';

export default function GroupDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const { isAuthenticated } = useAuthStore();
  const { user } = useUserStore();

  const userId = user?.id ?? null;

  const [isJoining, setIsJoining] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  const [isCanceling, setIsCanceling] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  // 모임 상세 조회
  const {
    data: gathering,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['gatheringDetail', id],
    queryFn: async () => {
      const res = await gatheringService.getGatheringDetail(Number(id));
      return res;
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 3,
  });

  const uiData = gathering ? mapGatheringToUI(gathering, userId) : null;

  // 참가자 목록 조회
  const { data: participantsData } = useQuery({
    queryKey: ['gatheringParticipants', id],
    queryFn: () => gatheringService.getParticipants(Number(id)),
    enabled: !!id,
  });

  // 내가 참여한 모임 목록 조회
  const { data: joinedGatherings } = useQuery({
    queryKey: ['joinedGatherings', userId],
    queryFn: () => gatheringService.getJoinedGatherings(),
    enabled: !!userId && isAuthenticated,
    staleTime: 1000 * 60 * 3,
  });

  // 내 리뷰 조회
  const { data: myReviews } = useQuery({
    queryKey: ['myReview', id, userId],
    queryFn: () =>
      reviewService.getReviews({
        gatheringId: Number(id),
        userId: userId!,
      }),
    enabled: !!id && !!userId,
  });

  // 참가 여부 확인
  const joined = joinedGatherings?.some(g => g.id === Number(id)) ?? false;

  // 버튼 상태 계산
  const currentParticipantCount = participantsData?.length ?? gathering?.participantCount ?? 0;
  const minRequired = uiData?.minParticipants ?? 5;
  const isOpenConfirmed = currentParticipantCount >= minRequired;
  const isReviewed = (myReviews?.data?.length ?? 0) > 0;
  const isCompleted = isClosed(gathering?.dateTime);
  const isRegistrationClosed = isClosed(gathering?.registrationEnd);

  // 참여하기
  const handleJoin = async () => {
    if (!isAuthenticated) {
      showToast('로그인 후 이용 가능합니다.', 'error');
      setTimeout(() => {
        router.push('/login');
      }, 1000);
      return;
    }
    setIsJoining(true);
    try {
      await gatheringService.joinGathering(Number(id));
      showToast('모임에 참여했습니다!', 'success');
      queryClient.invalidateQueries({ queryKey: ['gatheringParticipants', id] });
      queryClient.invalidateQueries({ queryKey: ['joinedGatherings', userId] });
    } catch {
      showToast('모임 참여 요청에 실패했습니다.', 'error');
    } finally {
      setIsJoining(false);
    }
  };

  // 참여 취소하기
  const handleLeave = async () => {
    setIsLeaving(true);
    try {
      await gatheringService.leaveGathering(Number(id));
      showToast('모임 참여를 취소했습니다.', 'info');
      queryClient.invalidateQueries({ queryKey: ['gatheringParticipants', id] });
      queryClient.invalidateQueries({ queryKey: ['joinedGatherings', userId] });
    } catch {
      showToast('모임 참여 취소가 실패했습니다.', 'error');
    } finally {
      setIsLeaving(false);
    }
  };

  // 모임 삭제 (주최자인 경우)
  const handleCancel = async () => {
    setIsCanceling(true);
    try {
      await gatheringService.cancelGathering(Number(id));
      showToast('모임이 삭제되었습니다.', 'success');

      // 삭제 후: 관련 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ['gatherings'] });
      setTimeout(() => router.replace('/gathering'), 1000);
    } catch {
      showToast('모임이 삭제되지 않았습니다.', 'error');
    } finally {
      setIsCanceling(false);
    }
  };

  // 공유하기
  const handleShare = async () => {
    const ok = await copyToClipboard(window.location.href);
    showToast(
      ok ? '링크가 복사되었습니다!' : '링크가 복사되지 않았습니다!',
      ok ? 'success' : 'error',
    );
  };

  // 리뷰 작성하기
  const handleWriteReview = () => {
    setIsReviewModalOpen(true);
  };

  // 리뷰 작성 성공 시 콜백 추가
  const handleReviewSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['myReview', id, userId] });
    queryClient.invalidateQueries({ queryKey: ['reviews', Number(id)] });
    setIsReviewModalOpen(false);
  };

  // 로딩/에러 처리
  if (isLoading)
    return (
      <main className="space-y-8 px-0 py-10">
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2">
          <div className="relative h-60 w-full overflow-hidden rounded-md bg-gray-100 shadow-sm sm:h-auto sm:rounded-md md:rounded-2xl" />
          <div className="flex flex-col justify-between gap-4">
            <GroupDetailCardSkeleton />
            <GroupDetailParticipationSkeleton />
          </div>
        </section>

        <section className="mt-6 sm:mt-12 md:mt-16">
          <GroupDetailReviewListSkeleton />
        </section>
      </main>
    );

  if (isError || !uiData)
    return <div className="p-10 text-red-500">모임 정보를 불러올 수 없습니다.</div>;

  return (
    <main className="px-0 py-10">
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2">
        <div className="relative h-60 w-full overflow-hidden rounded-md bg-amber-50 shadow-sm sm:h-auto sm:rounded-md md:rounded-2xl">
          <Image
            src={uiData?.image ?? '/images/find_banner.png'}
            alt={'모임 대표이미지'}
            fill
            className="object-cover"
          />
        </div>

        {/* 상세 헤더 */}
        <div className="flex flex-col justify-between gap-4">
          <GroupDetailCard
            data={uiData}
            isHost={uiData.isHost}
            joined={joined}
            isCompleted={isCompleted}
            isReviewed={isReviewed}
            isRegistrationClosed={isRegistrationClosed}
            isOpenConfirmed={isOpenConfirmed}
            onJoin={handleJoin}
            onLeave={handleLeave}
            onCancel={handleCancel}
            onShare={handleShare}
            onWriteReview={handleWriteReview}
            isJoining={isJoining}
            isLeaving={isLeaving}
            isCanceling={isCanceling}
          />

          <GroupDetailParticipation
            current={currentParticipantCount}
            max={uiData.capacity}
            min={uiData.minParticipants}
            participants={
              participantsData?.map((p: IParticipant) => ({
                id: p.User.id,
                image: p.User.image || '/images/avatar-default.png',
              })) ?? []
            }
            showConfirm
          />
        </div>
      </section>

      {/* 리뷰 섹션 */}
      <section className="mt-6 sm:mt-12 md:mt-16">
        {uiData && <GroupDetailReviewList gatheringId={uiData.id} />}
      </section>

      {/* 리뷰 작성 모달 */}
      {isReviewModalOpen && (
        <WriteReviewModal
          open={isReviewModalOpen}
          onOpenChange={setIsReviewModalOpen}
          ApiRequestProps={{ gatheringId: Number(id) }}
          onSuccess={handleReviewSuccess}
        />
      )}
    </main>
  );
}
