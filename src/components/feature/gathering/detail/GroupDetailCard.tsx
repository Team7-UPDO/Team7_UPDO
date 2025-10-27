'use client';

import React, { useState } from 'react';
import { cn } from '@/utils/cn';
import IconText, { type Topic } from '@/components/ui/IconText';
import Tag from '@/components/ui/Tag';
import Icon from '@/components/ui/Icon';
import { Button } from '@/components/ui/Button';
import { isClosed } from '@/utils/date';
import { LocationToTag } from '@/utils/mapping';
import { TAG_OPTIONS } from '@/constants/tags';
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
  onJoin?: () => void;
  onLeave?: () => void;
  onCancel?: () => void;
  onShare?: () => void;
  isJoining?: boolean;
  isLeaving?: boolean;
  isCanceling?: boolean;
}

export default function GroupDetailCard({
  data,
  isHost = false,
  joined = false,
  onJoin,
  onLeave,
  onCancel,
  onShare,
  isJoining = false,
  isLeaving = false,
  isCanceling = false,
}: GroupDetailCardProps) {
  const { name, deadlineText, dateText, timeText, registrationEnd, location } = data;
  const [isSaved, setIsSaved] = useState(false);
  const topic = LocationToTag(location) as 'growth' | 'learn' | 'challenge' | 'connect' | 'default';
  const category = TAG_OPTIONS.find(option => option.value === topic)?.label ?? '';

  const closed = isClosed(registrationEnd ?? undefined);

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
        {/* 왼쪽: 찜 버튼 */}
        <FavoriteButton itemId={data.id} size="responsive" />

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
              onClick={joined ? onLeave : onJoin}
              disabled={isJoining || isLeaving || closed}
              variant="primary"
              size="responsive_full"
              className={cn(
                'typo-xl h-10 rounded-md font-bold transition-all duration-200 sm:h-12 sm:rounded-md md:h-15 md:rounded-xl',
                joined
                  ? 'border border-purple-600 bg-white text-purple-600 hover:bg-purple-50'
                  : 'bg-purple-400 text-white hover:bg-purple-600',
                closed && 'pointer-events-none cursor-not-allowed opacity-50',
              )}>
              {joined ? '참여 취소하기' : '참여하기'}
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}
