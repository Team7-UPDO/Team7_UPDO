import { ProgressBar } from '@/components/ui/ProgressBar';
import ReviewScore from '@/components/ui/ReviewScore';

interface ReviewStatsCardProps {
  average?: number;
  total?: number;
  distribution?: number[];
}

const REVIEW_SCORES = [5, 4, 3, 2, 1] as const;

export default function ReviewStatsCard({
  average = 0,
  total = 0,
  distribution = [0, 0, 0, 0, 0],
}: ReviewStatsCardProps) {
  const maxCount = Math.max(...distribution, 1);
  const roundedAverage = Math.round(average);

  return (
    <section className="flex w-full flex-col items-center rounded-xl bg-[var(--color-purple-10)] px-[19px] py-6 shadow-sm sm:flex-row sm:items-stretch sm:justify-center sm:gap-[28px] sm:rounded-2xl sm:px-6 sm:py-10 md:justify-between md:gap-0 md:pr-[150px] md:pl-[240px]">
      <div className="flex w-full flex-col items-center justify-center gap-2 sm:flex-1 md:w-[409px] md:flex-none md:items-start md:border-r md:border-gray-100">
        <div className="flex items-baseline gap-1">
          <h3 className="text-[40px] leading-[1] font-bold text-gray-900 sm:text-[48px]">
            {average.toFixed(1)}
          </h3>
          <p className="typo-sm sm:typo-body-sm pb-[2px] text-gray-500">(총 {total}명 참여)</p>
        </div>

        <div className="mt-2 sm:mt-3">
          <ReviewScore value={roundedAverage} disabled size="sm" className="sm:!hidden" label="" />
          <ReviewScore
            value={roundedAverage}
            disabled
            size="lg"
            className="!hidden sm:!flex"
            label=""
          />
        </div>
      </div>

      <div className="hidden sm:block sm:w-[1px] sm:flex-shrink-0 sm:self-stretch sm:border-r sm:border-gray-100 md:hidden" />

      <div className="mt-8 flex w-full flex-col justify-center gap-[3px] sm:mt-0 sm:flex-1 md:max-w-[409px] md:items-end md:gap-[6px]">
        {REVIEW_SCORES.map((score, index) => {
          const count = distribution[index];
          const is5Point = score === 5;

          return (
            <div key={score} className="flex w-full items-center gap-2 sm:gap-4">
              <span
                className={`typo-xs min-w-[28px] flex-shrink-0 text-right sm:min-w-[40px] ${
                  is5Point
                    ? 'sm:typo-body-bold font-semibold text-[var(--color-purple-600)]'
                    : 'sm:typo-body text-gray-500'
                }`}>
                {score}점
              </span>

              <div className="min-w-0 flex-1">
                <ProgressBar
                  current={count}
                  max={maxCount}
                  min={0}
                  height="8px"
                  showLabel={false}
                />
              </div>

              <span
                className={`typo-xs min-w-[20px] flex-shrink-0 text-left sm:min-w-[32px] ${
                  is5Point
                    ? 'sm:typo-body-bold text-[var(--color-purple-600)]'
                    : 'sm:typo-body text-gray-500'
                }`}>
                {count}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
