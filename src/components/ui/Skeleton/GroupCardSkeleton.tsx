'use client';

export default function GroupCardSkeleton() {
  return (
    <article className="relative flex h-[346px] w-full max-w-[460px] animate-pulse flex-col overflow-hidden rounded-xl bg-white shadow-md sm:h-[219px] sm:max-w-full sm:flex-row sm:rounded-2xl sm:p-6">
      <div className="h-[160px] w-full bg-gray-50 sm:h-[170px] sm:w-[170px] sm:rounded-xl" />
      <div className="flex flex-1 flex-col justify-between p-4 sm:pt-4 sm:pl-4 md:pr-0">
        <div className="flex flex-col gap-3 sm:order-1">
          <div className="h-5 w-3/4 rounded-md bg-gray-50" />
          <div className="h-4 w-1/3 rounded-md bg-gray-50" />
        </div>
        <div className="flex flex-col gap-2 sm:order-2 sm:mt-6 sm:gap-0">
          <div className="flex gap-2">
            <div className="h-4 w-16 rounded bg-gray-50" />
            <div className="h-4 w-10 rounded bg-gray-50" />
            <div className="h-4 w-24 rounded bg-gray-50" />
          </div>
          <div className="mt-3 flex items-center justify-between">
            <div className="h-4 w-1/2 rounded bg-gray-50" />
            <div className="h-10 w-20 rounded-md bg-gray-50" />
          </div>
        </div>
      </div>
    </article>
  );
}
