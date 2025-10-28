'use client';

import React, { useState } from 'react';
import { cn } from '@/utils/cn';
import IconText, { type Topic } from '@/components/ui/IconText';
import Tag from '@/components/ui/Tag';
import Icon from '@/components/ui/Icon';
import { Button } from '@/components/ui/Button';
import { LocationToTag } from '@/utils/mapping';
import { TAG_OPTIONS } from '@/constants/tags';
import { useAuthStore } from '@/stores/useAuthStore';
import FavoriteButton from '../../favorites/FavoriteButton';

interface HeaderData {
  id: number;
  name: string;
  deadlineText: string;
  dateText: string;
  timeText: string;
  registrationEnd?: string | null;
  location: string;
  type: string;
}

interface GroupDetailCardProps {
  data: HeaderData;
  isHost?: boolean;
  joined?: boolean;
  isCompleted?: boolean;
  isReviewed?: boolean;
  isRegistrationClosed?: boolean;
  isOpenConfirmed?: boolean;
  isCanceled?: boolean;
  onJoin?: () => void;
  onLeave?: () => void;
  onCancel?: () => void;
  onShare?: () => void;
  onWriteReview?: () => void;
  isJoining?: boolean;
  isLeaving?: boolean;
  isCanceling?: boolean;
  isFull?: boolean;
}

export default function GroupDetailCard({
  data,
  isHost = false,
  joined = false,
  isCompleted = false,
  isReviewed = false,
  isRegistrationClosed = false,
  isOpenConfirmed = false,
  isFull = false,
  isCanceled = false,
  onJoin,
  onLeave,
  onCancel,
  onShare,
  onWriteReview,
  isJoining = false,
  isLeaving = false,
  isCanceling = false,
}: GroupDetailCardProps) {
  const { name, deadlineText, dateText, timeText, location } = data;
  const { isAuthenticated } = useAuthStore();
  const topic = LocationToTag(location) as 'growth' | 'learn' | 'challenge' | 'connect' | 'default';
  const category = TAG_OPTIONS.find(option => option.value === topic)?.label ?? '';

  // 마감 여부 계산
  const isClosed = isRegistrationClosed || isFull || isCompleted || isCanceled;

  // 버튼 상태 계산
  const getButtonProps = () => {
    // 삭제된 모임 처리
    if (isCanceled) {
      return {
        text: '삭제된 모임',
        onClick: undefined,
        disabled: true,
        variant: 'primary' as const,
      };
    }

    // 비로그인 사용자 - 일부 로직
    if (!isAuthenticated) {
      // 1. 모집 마감 + 개설 미확정
      if (isRegistrationClosed && !isOpenConfirmed) {
        return {
          text: '개설 취소',
          onClick: undefined,
          disabled: true,
          variant: 'primary' as const,
        };
      }

      // 2. 모집 마감
      if (isRegistrationClosed || isCompleted) {
        return {
          text: '참여 기간 만료',
          onClick: undefined,
          disabled: true,
          variant: 'primary' as const,
        };
      }

      // 3. 정원 마감
      if (isFull) {
        return {
          text: '정원 마감',
          onClick: undefined,
          disabled: true,
          variant: 'primary' as const,
        };
      }

      // 4. 참여하기 (클릭 시 로그인 유도)
      return {
        text: '참여하기',
        onClick: onJoin,
        disabled: false,
        variant: 'primary' as const,
      };
    }

    // 로그인 사용자 - 전체 로직
    // 1. 모집 마감 + 개설 미확정
    if (isRegistrationClosed && !isOpenConfirmed) {
      return {
        text: '개설 취소',
        onClick: undefined,
        disabled: true,
        variant: 'primary' as const,
      };
    }

    // 2. 모임 완료
    if (isCompleted) {
      if (!joined) {
        return {
          text: '참여 기간 만료',
          onClick: undefined,
          disabled: true,
          variant: 'primary' as const,
        };
      }
      if (isReviewed) {
        return {
          text: '참여 완료',
          onClick: undefined,
          disabled: true,
          variant: 'primary' as const,
        };
      }
      return {
        text: '리뷰 작성하기',
        onClick: onWriteReview,
        disabled: false,
        variant: 'primary' as const,
      };
    }

    // 3. 모집 마감
    if (isRegistrationClosed) {
      return {
        text: '참여 기간 만료',
        onClick: undefined,
        disabled: true,
        variant: 'primary' as const,
      };
    }

    // 4. 정원 마감 (참여 안 한 경우)
    if (isFull && !joined) {
      return {
        text: '정원 마감',
        onClick: undefined,
        disabled: true,
        variant: 'primary' as const,
      };
    }

    // 5. 참여 취소하기
    if (joined) {
      return {
        text: '참여 취소하기',
        onClick: onLeave,
        disabled: isLeaving,
        variant: 'secondary' as const,
      };
    }

    // 6. 참여하기
    return {
      text: '참여하기',
      onClick: onJoin,
      disabled: isJoining,
      variant: 'primary' as const,
    };
  };

  const { text, onClick, disabled, variant } = getButtonProps();

  return (
    <section
      className={cn(
        'bg-surface isolate flex flex-col gap-6 rounded-md p-5 shadow-md sm:rounded-md md:rounded-2xl md:p-10 lg:p-10',
      )}>
      {/* 상단: 태그 + 주최자 아이콘 */}
      <div className="flex items-start justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <IconText
            icon="alarm"
            size="sm"
            density="tight"
            tone="topicSolid"
            topic={topic}
            typo="tag"
            radius="rounded"
            className="pr-2 pl-1">
            {deadlineText}
          </IconText>
          <IconText
            tone="outline"
            size="sm"
            density="tight"
            radius="rounded"
            typo="tag"
            className="text-gray-500">
            {dateText}
          </IconText>
          <IconText
            tone="outline"
            size="sm"
            density="tight"
            radius="rounded"
            typo="tag"
            className="text-gray-500">
            {timeText}
          </IconText>
        </div>

        {isHost && (
          <div className="text-[var(--color-purple-600)]">
            <Icon name="crown" size={32} />
          </div>
        )}
      </div>

      {/* 타이틀 + 주제 태그 */}
      <div>
        <h1 className="typo-title text-[var(--color-gray-900)]">{name}</h1>
        <div className="mt-3">
          <Tag label={category} topic={topic} />
        </div>
      </div>

      {/* 하단: 버튼 영역 */}
      <div className="flex w-full items-center justify-between gap-4 sm:gap-2 md:gap-4">
        {/* 왼쪽: 찜 버튼 또는 마감 아이콘 */}
        {isClosed ? (
          <div
            role="img"
            aria-label="모집 마감됨"
            className="flex h-10 w-10 cursor-not-allowed items-center justify-center sm:h-12 sm:w-12 md:h-15 md:w-15">
            <Icon name="save" className="h-full w-full" />
          </div>
        ) : (
          <FavoriteButton itemId={data.id} size="responsive" />
        )}

        {/* 오른쪽: 버튼 그룹 */}
        <div className="flex flex-1 items-center gap-2 sm:gap-3">
          {isHost ? (
            <>
              {/* 삭제하기 */}
              <Button
                onClick={onCancel}
                disabled={isCanceling}
                variant="secondary"
                size="responsive_full"
                className="typo-xl h-10 rounded-md border border-gray-400 font-medium sm:h-12 sm:rounded-md md:h-15 md:rounded-xl">
                삭제하기
              </Button>

              {/* 공유하기 */}
              <Button
                onClick={onShare}
                variant="primary"
                size="responsive_full"
                className="typo-xl h-10 rounded-md font-bold sm:h-12 sm:rounded-md md:h-15 md:rounded-xl">
                공유하기
              </Button>
            </>
          ) : (
            <Button
              onClick={onClick}
              disabled={disabled}
              variant={variant}
              size="responsive_full"
              className={cn(
                'typo-xl h-10 rounded-md font-bold transition-all duration-200 sm:h-12 sm:rounded-md md:h-15 md:rounded-xl',
                variant === 'secondary' &&
                  'border border-purple-600 bg-white text-purple-600 hover:bg-purple-50',
                disabled && 'pointer-events-none cursor-not-allowed opacity-50',
              )}>
              {text}
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}
