import Image from 'next/image';
import ReviewScore from '@/components/ui/ReviewScore';
import { IReviewWithRelations } from '@/types/reviews';
import { formatReviewDate } from '@/utils/date';

export default function ReviewCard({ User, score, comment, createdAt }: IReviewWithRelations) {
  return (
    <li className="pt-6 md:pt-8">
      <div className="flex items-center gap-2">
        <div className="relative h-8 w-8 flex-shrink-0 md:h-10 md:w-10">
          <Image
            src={User.image ?? '/images/profile.webp'}
            alt={User.name ? `${User.name} 프로필` : ''}
            fill
            quality={80}
            className="rounded-full object-cover"
            sizes="(max-width: 768px) 64px, 80px"
          />
        </div>
        <div className="min-w-0 flex-1">
          <span className="text-sm text-[var(--color-gray-500)]">{User.name}</span>
          <div className="flex items-center justify-start">
            <ReviewScore
              value={score}
              disabled
              label=""
              size="sm"
              aria-label={`별점 ${score}점`}
              className="w-32"
            />
            <time dateTime={createdAt} className="text-sm text-gray-400">
              {formatReviewDate(createdAt)}
            </time>
          </div>
        </div>
      </div>
      <p className="typo-sm md:typo-base mt-4 mb-5 font-medium text-[var(--color-gray-700)] md:mt-6 md:mb-7">
        {comment}
      </p>
    </li>
  );
}
