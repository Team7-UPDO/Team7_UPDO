import Image from 'next/image';
import { cn } from '@/utils/cn';
import IconText from '@/components/ui/IconText';
import { ProgressBar } from '@/components/ui/ProgressBar';

interface Participant {
  id: number;
  image: string;
}

interface Props {
  current: number;
  min: number;
  max: number;
  participants: Participant[];
  showConfirm?: boolean;
}

const GroupDetailParticipation = ({
  current,
  min,
  max,
  participants,
  showConfirm = true,
}: Props) => {
  const confirmed = current >= min;
  const last4 = participants.slice(-4);
  const remain = Math.max(0, current - 4);

  const statusText =
    current >= max ? `정원 ${max}명 모두 참여 완료` : `현재 ${current}명 참여 중, 정원 ${max}명`;

  return (
    <section
      aria-label="참여 현황"
      className={cn(
        'bg-purple-10 flex w-full flex-col gap-3 rounded-md px-5 pt-[14px] pb-5 shadow-sm sm:rounded-md sm:px-6 sm:py-5 sm:pt-5 sm:pb-[22px] md:rounded-2xl md:px-10 md:pt-7 md:pb-[34px] lg:mt-4 lg:rounded-2xl lg:pt-7 lg:pb-8',
      )}>
      <p className="sr-only" aria-live="polite">
        {statusText}
        {remain > 0 && ` 외 ${remain}명`}
        {confirmed && ', 최소 인원 달성으로 개설 확정'}
      </p>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <p className="typo-body-lg font-medium text-[var(--color-gray-800)]">
            <span className="typo-body-lg font-bold text-[var(--color-purple-600)]">{current}</span>
            명 참여
          </p>

          <div className="relative flex items-center overflow-visible">
            {last4.map((p, i) => (
              <div
                key={p.id}
                className={cn('relative shrink-0', i !== 0 && '-ml-[10px]')}
                style={{ zIndex: i }}>
                <div className="relative h-[29px] w-[29px]">
                  <Image
                    src={p.image}
                    alt=""
                    fill
                    quality={80}
                    sizes="58px"
                    className="rounded-full border border-[var(--surface-card)] object-cover"
                    aria-hidden="true"
                  />
                </div>
              </div>
            ))}

            {remain > 0 && (
              <div
                className="caption-bold relative z-[5] -ml-[10px] flex h-[29px] w-[29px] shrink-0 items-center justify-center rounded-full bg-white font-medium text-[var(--color-gray-500)]"
                aria-hidden="true">
                +{remain}
              </div>
            )}
          </div>
        </div>

        {showConfirm && confirmed && (
          <IconText
            icon="check"
            size="sm"
            density="tight"
            iconPosition="leading"
            className="typo-body-bold text-[var(--color-purple-600)]">
            개설확정
          </IconText>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <div className="flex justify-between text-xs text-[var(--color-gray-500)]">
          <span>최소 {min}명</span>
          <span>최대 {max}명</span>
        </div>

        <ProgressBar current={current} max={max} min={min} height="6px" />
      </div>
    </section>
  );
};

export default GroupDetailParticipation;
