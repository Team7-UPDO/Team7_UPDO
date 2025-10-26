'use client';

export default function GroupDetailCardSkeleton() {
  return (
    <section className="bg-surface isolate flex animate-pulse flex-col gap-6 rounded-md p-5 shadow-md sm:rounded-md md:rounded-2xl md:p-10 lg:p-10">
      {/* 상단 */}
      <div className="flex items-start justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <div className="h-[26px] w-[72px] rounded bg-gray-50" />
          <div className="h-[26px] w-[58px] rounded bg-gray-50" />
          <div className="h-[26px] w-[58px] rounded bg-gray-50" />
        </div>
        <div className="h-8 w-8 rounded-full bg-gray-50" />
      </div>
      <div>
        <div className="mb-3 h-[32px] w-3/4 rounded bg-gray-50" />
        <div className="h-[26px] w-[90px] rounded bg-gray-50" />
      </div>

      {/* 하단 */}
      <div className="flex w-full items-center justify-between gap-4 sm:gap-2 md:gap-4">
        <div className="h-10 w-[60px] rounded-md bg-gray-50 sm:h-12 md:h-[60px]" />

        <div className="flex flex-1">
          <div className="h-10 w-full rounded-md bg-gray-50 sm:h-12 md:h-[60px]" />
        </div>
      </div>
    </section>
  );
}
