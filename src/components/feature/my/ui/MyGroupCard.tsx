'use client';

import Image from 'next/image';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

import Icon from '@/components/ui/Icon';
import { Button } from '@/components/ui/Button';
import SaveButton from '@/components/ui/SaveButton';
import IconText from '@/components/ui/IconText';

import { WriteReviewControl } from '@/components/feature/my/controls/WriteReviewControl';
import { LeaveControl } from '@/components/feature/my/controls/LeaveControl';

import { IJoinedGathering } from '@/types/gatherings';
import { IGathering } from '@/types/gatherings';

import { LocationToTag, tagEngToKr } from '@/utils/mapping';
import { formatDate, formatTime, isClosed } from '@/utils/date';

type Item = IJoinedGathering | IGathering;

interface MyGroupCardProps {
  variant: 'myMeetings' | 'created' | 'myReviews';
  item: Item;
}

export default function MyGroupCard({ variant, item }: MyGroupCardProps) {
  const { name, id, dateTime, location, participantCount: participantCnt, capacity, image } = item;
  const { isCompleted, isReviewed } = item as IJoinedGathering;
  const { registrationEnd } = item as Item;

  // 데이터 포맷팅
  const tag = tagEngToKr(LocationToTag(location));
  const formattedDate = formatDate(dateTime);
  const formattedTime = formatTime(dateTime);

  // 상태데이터
  const isMyMeetings = variant === 'myMeetings'; // 나의 모임 탭
  const isMyReviews = variant === 'myReviews'; // 나의 리뷰 탭

  const isRegistrationClosed = registrationEnd ? isClosed(registrationEnd) : false;

  const isOpenConfirmed = (participantCnt ?? 0) >= 5;
  const failedToOpen = (isCompleted || isRegistrationClosed) && !isOpenConfirmed; // 모집 마감 + 인원 부족

  // ── BtnState 결정 규칙 (단 하나만 노출)
  // leave : 참여 취소하기
  // reviewWrite : 리뷰 작성하기
  // reviewDone : 리뷰 작성완료
  type BtnState = 'leave' | 'reviewWrite' | 'reviewDone' | null;
  const BtnState: BtnState = (() => {
    if (isMyMeetings) {
      if (failedToOpen) return 'leave';
      if (!isCompleted) return 'leave';
      return isReviewed ? 'reviewDone' : 'reviewWrite';
    }
    if (isMyReviews) {
      return isReviewed ? 'reviewDone' : 'reviewWrite';
    }
    return null;
  })();

  // 그 외 헬퍼 변수
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const buttonClassname =
    'w-full h-[44px] sm:h-[48px] sm:w-[130px] md:h-[48px] md:w-[156px] rounded-lg';

  const router = useRouter();

  return (
    <>
      <div
        key={id}
        role="link"
        tabIndex={0}
        aria-label={`${name ?? '모임'} 상세로 이동`}
        onKeyDown={e => {
          // Modal 열림 감지
          const anyDialogOpen =
            typeof document !== 'undefined' &&
            document.querySelector('[role="dialog"][aria-modal="true"]');
          if (anyDialogOpen) return;

          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            router.push(`/gathering/${id}`);
          }
        }}
        onClick={e => {
          const target = e.target as HTMLElement;
          const isInteractive =
            target.closest(
              'button, [role="button"], a, input, textarea, select, [data-no-nav="true"]',
            ) || target.closest('[role="dialog"], [aria-modal="true"]');

          // Modal의 이벤트 위임 차단
          const anyDialogOpen =
            typeof document !== 'undefined' &&
            document.querySelector('[role="dialog"][aria-modal="true"]');

          if (isInteractive || anyDialogOpen) return;
          router.push(`/gathering/${id}`);
        }}
        className="relative flex h-[390px] w-full cursor-pointer flex-col gap-4 rounded-lg bg-white hover:shadow-md sm:h-[236px] sm:flex-row sm:p-6 md:gap-6">
        {/* 찜하기 버튼 */}
        {(isMyMeetings || isMyReviews) && (
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
                {failedToOpen ? (
                  <IconText
                    tone="fill"
                    className="typo-body-sm h-8 bg-red-50 py-[6px] text-red-500">
                    개설 실패
                  </IconText>
                ) : isCompleted ? (
                  <IconText
                    tone="fill"
                    className="typo-body-sm h-8 bg-gray-50 py-[6px] text-gray-500">
                    이용 완료
                  </IconText>
                ) : (
                  <IconText
                    tone="fill"
                    className="typo-body-sm h-8 bg-purple-50 py-[6px] text-purple-600">
                    이용 예정
                  </IconText>
                )}

                {!isCompleted &&
                  (participantCnt >= 5 ? (
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
            <div className="tag mb-4 flex w-full flex-col gap-[6px] sm:mb-0 sm:gap-[10px]">
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

            {/* 버튼 (단일 액션) */}
            {BtnState === 'leave' && (
              <LeaveControl
                gatheringId={Number(id)}
                className={buttonClassname}
                disabled={!!isCompleted || failedToOpen}
              />
            )}
            {BtnState === 'reviewWrite' && (
              <WriteReviewControl className={buttonClassname} gatheringId={id} />
            )}
            {BtnState === 'reviewDone' && (
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
