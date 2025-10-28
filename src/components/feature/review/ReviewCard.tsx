import Image from 'next/image';
import Link from 'next/link';

import ReviewScore from '@/components/ui/ReviewScore';

import { formatReviewDate } from '@/utils/date';
import { LocationToTag, TypeToTab } from '@/utils/mapping';
import { tagEngToKr } from '@/utils/mapping';

import { IReviewWithRelations } from '@/types/reviews';

interface ReviewCardProps {
  variant: 'my' | 'all';
  item: IReviewWithRelations;
}

export default function ReviewCard({ variant, item }: ReviewCardProps) {
  const { score, comment, createdAt } = item;
  const { id, type, location, image: gatheringImage, name: gatheringName } = item.Gathering;
  const { name: userName, image: userImage } = item.User;

  const date = formatReviewDate(createdAt); // 리뷰작성날짜 fotmatting
  const tab = TypeToTab(type);
  const tag = tagEngToKr(LocationToTag(location));

  const mdCols = variant === 'all' ? 'md:grid-cols-[300px_1fr]' : 'md:grid-cols-[200px_1fr]';

  return (
    <Link
      href={`/gathering/${id}`}
      aria-label={`${gatheringName} 상세 보기`}
      className="block w-full border-b-2 border-gray-100 sm:border-none">
      <div className="w-full border-2 border-b border-gray-100 pb-6 last:border-none sm:mb-10 sm:border-none sm:pb-0">
        <article className="w-full cursor-pointer rounded-xl border-0 hover:shadow-md">
          <div
            className={`grid grid-cols-[80px_1fr] items-start gap-3 sm:grid-cols-[200px_1fr] ${mdCols} overflow-x-hidden md:items-stretch md:gap-6`}>
            {/* 작성자 이미지(왼쪽), 이름/별점/날짜(오른쪽) */}
            <header className="col-span-2 flex items-center gap-3 sm:col-start-2 sm:row-start-1 md:col-start-2 md:row-start-1">
              {/* 왼쪽: 사용자 이미지 */}
              <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-full bg-gray-100">
                <Image
                  src={userImage || '/images/avatar-default.png'}
                  alt={userName || '기본 프로필'}
                  width={40}
                  height={40}
                  className="h-full w-full object-cover"
                />
              </div>

              {/* 오른쪽: 사용자 이름 (위) + 별점/작성일자 (아래) */}
              <div className="flex min-w-0 flex-col">
                <span className="typo-body-sm max-w-[160px] truncate text-gray-500 sm:max-w-[220px]">
                  {userName}
                </span>
                <div className="mt-0.5 flex items-center gap-2">
                  <ReviewScore value={score} disabled size={'sm'} label="" />
                  <time className="typo-sm text-gray-400">{date}</time>
                </div>
              </div>
            </header>

            {/* 모바일(sm 이하)에서는 작성자 아래, 이미지 위에 위치 */}
            <div className="typo-sm col-span-2 row-start-2 mt-1 text-gray-500 sm:hidden">
              <span className="text-gray-300">|</span>
              <span className="ml-2">
                {tab} 이용 · # {tag}
              </span>
            </div>

            {/* 모임 썸네일 이미지 */}
            <figure
              className={`relative col-start-1 row-start-3 h-[80px] overflow-hidden rounded-lg bg-gray-100 sm:row-span-2 sm:row-start-1 sm:h-[200px] md:row-span-2 md:row-start-1 md:h-[200px]`}>
              {gatheringImage && (
                <Image
                  src={gatheringImage}
                  alt={gatheringName}
                  width={400}
                  height={260}
                  className="h-full w-full object-cover"
                />
              )}
            </figure>

            {/* 모임 정보 및 리뷰 본문 */}
            <section className="col-start-2 row-start-3 flex min-w-0 flex-col justify-center sm:row-start-2 sm:mt-0 md:row-span-1 md:row-start-2">
              {/* 모임 유형 및 위치 */}
              <div className="typo-sm hidden text-gray-500 sm:block">
                <span className="text-gray-300">|</span>
                <span className="ml-2">
                  {tab} 이용 · # {tag}
                </span>
              </div>

              {/* 리뷰 내용 */}
              <p className="line-clamp-3 text-gray-700 sm:mt-2 sm:line-clamp-4">{comment}</p>
              {/* Desktop/Tablet only divider under content column */}
              <div className="col-start-2 mt-4 hidden border-b border-gray-100 sm:block" />
            </section>
          </div>
        </article>
      </div>
    </Link>
  );
}
