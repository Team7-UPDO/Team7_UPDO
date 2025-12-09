'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';

import GroupDetailCard from '@/components/feature/gathering/detail/GroupDetailCard';
import GroupDetailParticipation from '@/components/feature/gathering/detail/GroupDetailParticipationCard';
import GroupDetailReviewList from '@/components/feature/gathering/detail/GroupDetailReviewList';
import WriteReviewModal from '@/components/feature/review/WriteReviewModal';

import GroupDetailCardSkeleton from '@/components/ui/Skeleton/GroupDetailCardSkeleton';
import GroupDetailParticipationSkeleton from '@/components/ui/Skeleton/GroupDetailParticipationSkeleton';
import GroupDetailReviewListSkeleton from '@/components/ui/Skeleton/GroupDetailReviewListSkeleton';

import { ConfirmModal } from '@/components/ui/Modal';

import { useGatheringDetail } from '@/hooks/queries/gatherings/useGatheringDetail';
import { useGatheringParticipants } from '@/hooks/queries/gatherings/useGatheringParticipants';
import { useJoinedGatherings } from '@/hooks/queries/gatherings/useJoinedGatherings';
import { useGatheringHandlers } from '@/hooks/mutations/useGatheringHandler';
import { useGatheringRedirect } from '@/hooks/domain/useGatheringRedirect';
import { useGatheringReview } from '@/hooks/mutations/useGatheringReview';

import { useAuthStore } from '@/stores/useAuthStore';
import { useUserStore } from '@/stores/useUserStore';

export default function GroupDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const { isAuthenticated } = useAuthStore();
  const { user } = useUserStore();
  const userId = user?.id ?? null;

  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const { gathering, uiData, isLoading, isError } = useGatheringDetail(id, userId);
  const { data: participantsData, participants } = useGatheringParticipants(id);
  const { data: joinedGatherings } = useJoinedGatherings();

  const {
    myReviews,
    isReviewModalOpen,
    handleOpenReviewModal,
    handleReviewSuccess,
    setIsReviewModalOpen,
  } = useGatheringReview({ gatheringId: id, userId });

  const { handleJoin, handleLeave, handleCancel, handleShare, isJoining, isLeaving, isCanceling } =
    useGatheringHandlers({
      gatheringId: id,
      userId,
      isAuthenticated,
    });

  const handleRequireLogin = () => {
    setLoginModalOpen(true);
  };

  const handleConfirmDelete = () => {
    setIsDeleteModalOpen(false);
    handleCancel();
  };
  // 여기서 isCanceled, currentParticipantCount만 직접 계산
  const isCanceled = !!gathering?.canceledAt;

  const currentParticipantCount =
    participantsData?.length ?? gathering?.participantCount ?? uiData?.participantCount ?? 0;

  // 삭제된 모임 리다이렉트
  useGatheringRedirect(isCanceled, isLoading);

  // 로딩/에러 처리
  if (isLoading)
    return (
      <main aria-busy="true">
        <span className="sr-only">모임 정보 로딩 중</span>
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
    return (
      <div className="p-10 text-red-500" role="alert">
        모임 정보를 불러올 수 없습니다.
      </div>
    );

  // 삭제된 모임
  if (isCanceled) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center justify-center gap-3 py-12" role="alert">
          <Image src="/images/empty.webp" alt="" width={171} height={115} className="opacity-70" />
          <p className="text-sm text-gray-400 md:text-base">
            삭제된 모임입니다. 모임 찾기 페이지로 이동합니다.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="px-0 py-10">
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2">
        <div className="relative h-60 w-full overflow-hidden rounded-md bg-white shadow-sm sm:h-auto sm:rounded-md md:rounded-2xl">
          <Image
            src={uiData?.image || '/images/detail_empty.webp'}
            alt={uiData?.name ? `${uiData.name} 모임 대표 이미지` : '모임 대표 이미지'}
            fill
            className="object-cover"
            priority
          />
        </div>

        <div className="flex flex-col justify-between gap-4">
          <GroupDetailCard
            data={uiData}
            isHost={uiData.isHost}
            userId={userId}
            participantsData={participantsData}
            joinedGatherings={joinedGatherings}
            myReviews={myReviews}
            onJoin={handleJoin}
            onLeave={handleLeave}
            onCancel={() => setIsDeleteModalOpen(true)}
            onShare={handleShare}
            onWriteReview={handleOpenReviewModal}
            onRequireLogin={handleRequireLogin}
            isJoining={isJoining}
            isLeaving={isLeaving}
            isCanceling={isCanceling}
          />

          <GroupDetailParticipation
            current={currentParticipantCount}
            max={uiData.capacity}
            min={uiData.minParticipants}
            participants={participants}
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

      {/* 로그인 유도 모달 */}
      {loginModalOpen && (
        <ConfirmModal
          open={loginModalOpen}
          onOpenChange={setLoginModalOpen}
          content={`로그인이 필요한 서비스입니다.
            로그인 페이지로 이동할까요?`}
          onConfirm={() => {
            setLoginModalOpen(false);
            router.push('/login');
          }}
        />
      )}
      {/* 삭제 확인 모달 */}
      {isDeleteModalOpen && (
        <ConfirmModal
          open={isDeleteModalOpen}
          onOpenChange={setIsDeleteModalOpen}
          content={`모임을 삭제하시겠습니까?
삭제 후에는 되돌릴 수 없습니다.`}
          onConfirm={handleConfirmDelete}
        />
      )}
    </main>
  );
}
