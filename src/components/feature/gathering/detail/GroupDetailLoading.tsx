import GroupDetailCardSkeleton from '@/components/ui/Skeleton/GroupDetailCardSkeleton';
import GroupDetailParticipationSkeleton from '@/components/ui/Skeleton/GroupDetailParticipationSkeleton';
import GroupDetailReviewListSkeleton from '@/components/ui/Skeleton/GroupDetailReviewListSkeleton';

export default function GroupDetailLoading() {
  return (
    <>
      <span className="sr-only">모임 정보 로딩 중</span>
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2">
        <div className="relative h-60 w-full overflow-hidden rounded-md bg-gray-100 shadow-sm sm:h-auto sm:rounded-md md:rounded-2xl" />
        <div className="flex flex-col justify-between gap-4">
          <GroupDetailCardSkeleton />
          <GroupDetailParticipationSkeleton />
        </div>
      </section>

      <section className="mt-6 sm:mt-12 md:mt-16">
        <GroupDetailReviewListSkeleton />
      </section>
    </>
  );
}
