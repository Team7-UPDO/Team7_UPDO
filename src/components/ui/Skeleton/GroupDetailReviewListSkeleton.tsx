'use client';

export default function GroupDetailReviewListSkeleton() {
  const items = [1, 2, 3]; // 리뷰 더미 3개

  return (
    <section className="animate-pulse">
      <h3 className="mb-4 h-6 w-32 rounded bg-gray-50" />
      <div className="bg-surface rounded-md px-5 pt-[2px] pb-8 sm:mt-4 sm:rounded-md sm:px-10 md:mt-6 md:rounded-2xl md:px-12 md:pb-10">
        <ul className="divide-y divide-gray-100">
          {items.map(i => (
            <li key={i} className="py-6 md:py-8">
              <div className="mb-4 flex items-center gap-2">
                <div className="h-10 w-10 rounded-full bg-gray-50" />
                <div className="flex-1">
                  <div className="mb-2 h-4 w-20 rounded bg-gray-50" />
                  <div className="h-4 w-32 rounded bg-gray-50" />
                </div>
              </div>
              <div className="mb-2 h-5 w-full rounded bg-gray-50" />
              <div className="h-5 w-5/6 rounded bg-gray-50" />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
