'use client';

import Image from 'next/image';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

import Icon from '@/components/ui/Icon';
import { Button } from '@/components/ui/Button';
import SaveButton from '@/components/ui/SaveButton';
import IconText from '@/components/ui/IconText';

import WriteReviewModal from '../review/WriteReviewModal';

import { TabVariant } from '@/app/mypage/page';
import { IJoinedGathering } from '@/types/gatherings';
import { IGathering } from '@/types/gatherings';

import { LocationToTag, tagEngToKr } from '@/utils/mapping';
import { formatDate, formatTime, isClosed } from '@/utils/date';

type Item = IJoinedGathering | IGathering;

interface MyGroupCardProps {
  variant: TabVariant;
  item: Item;
  currentUserId?: string | number | null;
  onLeave?: () => void;
  isLeaving?: boolean;
}

export default function MyGroupCard({ variant, item, onLeave, isLeaving }: MyGroupCardProps) {
  const { name, id, dateTime, location, participantCount: participantCnt, capacity, image } = item;
  const { registrationEnd } = item as Item;

  // 데이터 포맷팅
  const tag = tagEngToKr(LocationToTag(location));
  const formattedDate = formatDate(dateTime);
  const formattedTime = formatTime(dateTime);

  // 상태데이터
  const isMyMeetings = variant === 'myMeetings'; // 나의 모임 탭
  const isMyReviews = variant === 'myReviews'; // 나의 리뷰 탭

  const inMyContext = isMyMeetings || isMyReviews; // '나의 모임', '나의 리뷰' 탭

  const isCompleted = (item as IJoinedGathering).isCompleted;
  const isReviewed = (item as IJoinedGathering).isReviewed;

  const canCancelJoin = (isMyMeetings || isMyReviews) && !isCompleted;
  const showReviewCTA = inMyContext && isCompleted;
  const canWriteReview = showReviewCTA && !isReviewed;
  const hasWrittenReview = showReviewCTA && isReviewed;

  const isRecruitmentClosed = registrationEnd ? isClosed(registrationEnd) : false;
  const isOpenConfirmed = (participantCnt ?? 0) >= 5;
  const failedToOpen = isRecruitmentClosed && !isOpenConfirmed && !isCompleted; // 모집 마감 + 미확정 + 미이용

  // 그 외 헬퍼 변수
  const [isSaved, setIsSaved] = useState<boolean>(false);

  const [isWritereviewModalOpen, setIsWritereviewModalOpen] = useState(false);

  const buttonClassname = 'h-[44px] w-[132px] sm:h-[48px] sm:w-[120px] md:h-[48px] md:w-[156px]';

  const ApiRequestProps = {
    gatheringId: id,
  };

  const router = useRouter();

  return (
    <>
      {/* 리뷰 작성 모달 */}
      {isWritereviewModalOpen && (
        <WriteReviewModal
          open={isWritereviewModalOpen}
          onOpenChange={setIsWritereviewModalOpen}
          ApiRequestProps={ApiRequestProps}
        />
      )}

      <div
        key={id}
        role="link"
        tabIndex={0}
        aria-label={`${name ?? '모임'} 상세로 이동`}
        onKeyDown={e => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            router.push(`/gathering/${id}`);
          }
        }}
        onClick={e => {
          const target = e.target as HTMLElement;
          if (target.closest('button, [role="button"], [data-no-nav="true"]')) return;
          router.push(`/gathering/${id}`);
        }}
        className="relative flex h-[390px] w-full cursor-pointer flex-col gap-4 rounded-lg bg-white hover:shadow-md sm:h-[236px] sm:flex-row sm:p-6 md:gap-6">
        {/* 찜하기 버튼 */}
        {inMyContext && (
          <div className="absolute top-5 right-5">
            <SaveButton isSaved={isSaved} onToggle={() => setIsSaved(prev => !prev)} size={48} />
          </div>
        )}

        {/* 사진 */}
        <div className="relative h-[156px] w-full overflow-hidden rounded-t-lg sm:h-[188px] sm:w-[188px] sm:rounded-xl">
          <Image
            src={image ?? '/images/empty.png'}
            alt={name ? `${name} 이미지` : '모임 사진'}
            fill
            sizes="(min-width:1280px) 188px, (min-width:650px) 188px, 100vw"
            className="object-cover"
            priority={false}
          />
        </div>

        {/* 사진 제외 컨텐츠 */}
        <div className="flex h-full min-w-0 flex-1 flex-col justify-between px-4 pb-5 sm:p-0">
          {/* 나의 모임 탭 (IconText), 제목 */}
          <div>
            {isMyMeetings && (
              <div className="mb-4 flex items-center gap-2">
                {isCompleted ? (
                  <IconText
                    tone="fill"
                    className="typo-body-sm h-8 bg-gray-50 py-[6px] text-gray-500">
                    이용 완료
                  </IconText>
                ) : (
                  !failedToOpen && (
                    <IconText
                      tone="fill"
                      className="typo-body-sm h-8 bg-purple-50 py-[6px] text-purple-600">
                      이용 예정
                    </IconText>
                  )
                )}

                {!isCompleted &&
                  (failedToOpen ? (
                    <IconText
                      tone="fill"
                      className="typo-body-sm h-8 bg-red-50 py-[6px] text-red-500">
                      개설 실패
                    </IconText>
                  ) : participantCnt >= 5 ? (
                    <IconText
                      tone="outline"
                      icon="check"
                      className="typo-body-sm h-8 border-purple-400 py-[6px] pr-2 pl-1 text-purple-600">
                      개설 확정
                    </IconText>
                  ) : (
                    <IconText
                      tone="outline"
                      className="typo-body-sm h-8 border-gray-500 py-[6px] text-gray-500">
                      개설 대기
                    </IconText>
                  ))}
              </div>
            )}

            {/* 제목 */}
            <div className="h5Semibold mt-4 truncate text-gray-800 sm:mt-2">{name}</div>
          </div>

          {/* 참여 인원, 위치/날짜/시간, 버튼 */}
          <div className="flex w-full flex-col items-end justify-between sm:flex-row sm:items-center">
            {/* 참여 인원, 위치/날짜/시간 */}
            <div className="tag flex w-full flex-col gap-[6px] sm:gap-[10px]">
              <div className="flex h-4 items-center gap-1">
                <Icon name="person" size={16} />
                <div>
                  {participantCnt}/{capacity}
                </div>
              </div>

              {/* tag, formattedDate, formattedTime  */}
              <section className="flex flex-nowrap items-center gap-2">
                {dateTime && (
                  <>
                    <span>
                      <IconText
                        tone="outline"
                        size="sm"
                        radius="rounded"
                        density="tight"
                        typo="tag"
                        className="text-gray-500">
                        # {tag}
                      </IconText>
                    </span>
                    <span>
                      <IconText
                        tone="outline"
                        size="sm"
                        radius="rounded"
                        density="tight"
                        typo="tag"
                        className="text-gray-500">
                        {formattedDate}
                      </IconText>
                    </span>
                    <span>
                      <IconText
                        icon="alarm"
                        tone="topicSolid"
                        size="sm"
                        radius="rounded"
                        density="tight"
                        typo="captionBold">
                        {formattedTime}
                      </IconText>
                    </span>
                  </>
                )}
              </section>
            </div>

            {/* 버튼 */}
            {canCancelJoin && (
              <Button
                className={buttonClassname}
                onClick={onLeave}
                disabled={isLeaving || failedToOpen}
                aria-disabled={isLeaving || failedToOpen}>
                {isLeaving ? '취소 중…' : '참여 취소하기'}
              </Button>
            )}
            {canWriteReview && (
              <Button
                className={buttonClassname}
                onClick={() => {
                  setIsWritereviewModalOpen(true);
                }}>
                리뷰 작성하기
              </Button>
            )}
            {hasWrittenReview && (
              <Button className={buttonClassname} disabled aria-disabled="true">
                리뷰 작성완료
              </Button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
