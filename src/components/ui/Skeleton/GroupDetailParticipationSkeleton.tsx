'use client';

export default function GroupDetailParticipationSkeleton() {
  return (
    <section className="bg-purple-10 flex w-full animate-pulse flex-col gap-3 rounded-md px-5 pt-[14px] pb-5 shadow-sm sm:rounded-md sm:px-6 sm:py-5 sm:pt-5 sm:pb-[22px] md:rounded-2xl md:px-10 md:pt-7 md:pb-[34px] lg:mt-4 lg:rounded-2xl lg:pt-7 lg:pb-8">
      {/* 상단: 참여자 수 + 프로필 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-5 w-20 rounded bg-gray-50" />
          <div className="relative flex items-center overflow-visible">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className={`h-[29px] w-[29px] rounded-full border border-transparent bg-gray-50 ${
                  i !== 0 ? '-ml-[10px]' : ''
                }`}
                style={{ zIndex: 4 - i }}
              />
            ))}
            <div className="caption-bold relative z-[5] -ml-[10px] flex h-[29px] w-[29px] shrink-0 items-center justify-center rounded-full bg-gray-50" />
          </div>
        </div>
        <div className="h-5 w-14 rounded bg-gray-50" />
      </div>

      {/* progress bar */}
      <div className="flex flex-col gap-1.5">
        <div className="flex justify-between text-xs">
          <div className="h-4 w-16 rounded bg-gray-50" />
          <div className="h-4 w-16 rounded bg-gray-50" />
        </div>
        <div className="h-[6px] w-full rounded bg-gray-50" />
      </div>
    </section>
  );
}
