'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { ProgressBar } from '@/components/ui/ProgressBar';
import Icon from '@/components/ui/Icon';
import { IGathering } from '@/types/gatherings/models';
import Tag from '@/components/ui/Tag';
import IconText from '@/components/ui/IconText';
import { formatTime, formatDate, formatDeadline, isClosed as checkClosed } from '@/utils/date';
import { LocationToTag } from '@/utils/mapping';
import { TAG_OPTIONS } from '@/constants';
import { useEffect, useState } from 'react';
import SaveButton from '@/components/ui/SaveButton';
import Link from 'next/link';
import { ConfirmModal } from '@/components/ui/Modal';
import { useAuthStore } from '@/stores/useAuthStore';
import {
  getJoinedGatherings,
  joinGathering,
  leaveGathering,
} from '@/services/gatherings/gatheringService';
import { useRouter } from 'next/navigation';
interface GroupCardProps {
  data: IGathering;
}

export default function GroupCard({ data }: GroupCardProps) {
  const { name, location, dateTime, registrationEnd, participantCount, capacity, image } = data;
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isJoined, setIsJoined] = useState(false);
  const [currentCount, setCurrentCount] = useState(participantCount);
  const onToggle = () => setIsSaved(prev => !prev);

  const isFull = currentCount >= capacity;
  const isClosed = checkClosed(registrationEnd) || isFull;
  const topic = LocationToTag(location) as 'growth' | 'learn' | 'challenge' | 'connect' | 'default';
  const safeCapacity = Math.max(1, capacity);
  const category = TAG_OPTIONS.find(option => option.value === topic)?.label ?? '';

  useEffect(() => {
    const checkJoinedStatus = async () => {
      if (!isAuthenticated) return;
      try {
        const res = await getJoinedGatherings();
        const joined = res.some(g => g.id === data.id);
        setIsJoined(joined);
      } catch (error) {
        console.log('참여여부 확인에러', error);
      }
    };
    checkJoinedStatus();
  }, [isAuthenticated, data.id]);

  const handleJoinClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    if (!isAuthenticated) {
      setModalOpen(true);
      return;
    }
    setLoading(true);
    try {
      if (isJoined) {
        await leaveGathering(data.id);
        setIsJoined(false);
        setCurrentCount(prev => Math.max(0, prev - 1));
      } else {
        await joinGathering(data.id);
        setIsJoined(true);
        setCurrentCount(prev => prev + 1);
      }
    } catch (error) {
      console.log('참여변경 실패', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Link
        href={`/gathering/${data.id}`}
        className="contents"
        role="link"
        aria-label={`${name} 상세 페이지로 이동`}>
        <article className="relative flex h-[346px] w-full max-w-[460px] flex-col overflow-hidden rounded-xl bg-white shadow-md transition-all sm:h-[219px] sm:max-w-[1280px] sm:flex-row sm:rounded-2xl sm:p-6 md:max-w-[640px]">
          <div className="relative h-[160px] w-full sm:h-[170px] sm:w-[170px] md:h-auto">
            {!image ? (
              <div className="flex h-full w-full items-center justify-center bg-gray-100 text-gray-400 sm:rounded-xl"></div>
            ) : (
              <>
                <Image
                  src={image}
                  alt={name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover sm:rounded-xl"
                />
                {isClosed && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/70 sm:rounded-xl">
                    <span className="bg-grad-500 bg-clip-text text-3xl leading-[1.1] font-bold text-transparent">
                      {isFull ? '정원 마감' : '모집 마감'}
                    </span>
                  </div>
                )}
              </>
            )}
          </div>
          <div className="absolute top-5 right-5">
            {isClosed ? (
              <div role="img" aria-label="모집 마감됨" className="cursor-not-allowed">
                <Icon name="save" size={48} />
              </div>
            ) : (
              <SaveButton isSaved={isSaved} onToggle={onToggle} size={48} />
            )}
          </div>
          <div className="flex flex-1 flex-col justify-between p-4 sm:pt-4 sm:pl-4 md:pr-0">
            <header className="flex flex-col gap-2 sm:order-1">
              <div className="flex flex-col items-start gap-1.5">
                <div className="flex items-center">
                  <h3 className="h5Semibold max-w-[200px] truncate">{name}</h3>
                  {currentCount >= 5 && (
                    <IconText
                      tone="none"
                      icon="check"
                      typo="tag"
                      className="border-purple-400 pl-1 text-purple-600">
                      개설 확정
                    </IconText>
                  )}
                </div>
                <Tag topic={topic} label={category} />
              </div>
            </header>

            <div className="flex flex-col gap-2 sm:order-2 sm:gap-0">
              <section className="flex flex-nowrap items-center gap-2 sm:mt-8">
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
                        {formatDate(dateTime)}
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
                        {formatTime(dateTime)}
                      </IconText>
                    </span>
                    <span>
                      {registrationEnd && (
                        <IconText
                          icon="alarm"
                          tone="topicSolid"
                          topic={topic}
                          size="sm"
                          radius="rounded"
                          density="tight"
                          typo="captionBold">
                          {formatDeadline(registrationEnd)}
                        </IconText>
                      )}
                    </span>
                  </>
                )}
              </section>

              <footer className="flex w-full items-center gap-3 sm:justify-between">
                <div className="flex w-full items-center gap-1 sm:max-w-[800px] md:max-w-[230px]">
                  <Icon name="person" size={18} />
                  <ProgressBar current={currentCount} max={safeCapacity} min={5} />
                  <span
                    className="label ml-2 text-[var(--color-purple-500)]"
                    aria-label={`현재 ${currentCount}명 참여, 정원 ${capacity}명`}>
                    {currentCount}/{capacity}
                  </span>
                </div>
                <Button
                  size="small"
                  variant="primary"
                  className="h-[44px] sm:ml-4"
                  disabled={loading || (isClosed && !isJoined)}
                  onClick={handleJoinClick}>
                  {!isAuthenticated ? '참여하기' : isJoined ? '참여취소' : '참여하기'}
                </Button>
              </footer>
            </div>
          </div>
        </article>
      </Link>
      <ConfirmModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        content="로그인 페이지로 이동할까요?"
        onConfirm={() => {
          setModalOpen(false);
          router.push('/login');
        }}
        onCancel={() => setModalOpen(false)}
      />
    </>
  );
}
