'use client';

import { cn } from '@/utils/cn';
import { Button } from '@/components/ui/Button';
import Icon from '@/components/ui/Icon';
import FavoriteButton from '../../favorites/FavoriteButton';
import { ButtonState } from '@/utils/gatheringState';

interface ActionProps {
  isHost?: boolean;
  isClosed: boolean;
  buttonState: ButtonState | null;
  onCancel?: () => void;
  onShare?: () => void;
  isCanceling?: boolean;
  itemId: number;
}

export default function GroupDetailCardAction({
  isHost = false,
  isClosed,
  buttonState,
  onCancel,
  onShare,
  isCanceling = false,
  itemId,
}: ActionProps) {
  return (
    <div className="flex w-full items-center justify-between gap-4 sm:gap-2 md:gap-4">
      {isClosed ? (
        <div
          className="flex h-10 w-10 cursor-not-allowed items-center justify-center sm:h-12 sm:w-12 md:h-15 md:w-15"
          aria-disabled="true">
          <Icon name="save" className="h-full w-full" aria-hidden />
          <span className="sr-only">모집 마감됨</span>
        </div>
      ) : (
        <FavoriteButton itemId={itemId} size="responsive" />
      )}

      <div className="flex flex-1 items-center gap-2 sm:gap-3">
        {isHost ? (
          <>
            <Button
              onClick={onCancel}
              disabled={isCanceling}
              variant="secondary"
              size="responsive_full"
              className="typo-xl h-10 rounded-md border border-gray-400 font-medium sm:h-12 sm:rounded-md md:h-15 md:rounded-xl">
              삭제하기
            </Button>

            <Button
              onClick={onShare}
              variant="primary"
              size="responsive_full"
              className="typo-xl h-10 rounded-md font-bold sm:h-12 sm:rounded-md md:h-15 md:rounded-xl">
              공유하기
            </Button>
          </>
        ) : buttonState ? (
          <Button
            onClick={buttonState.onClick}
            disabled={buttonState.disabled}
            variant={buttonState.variant}
            size="responsive_full"
            className={cn(
              'typo-xl h-10 rounded-md font-bold transition-all duration-200 sm:h-12 sm:rounded-md md:h-15 md:rounded-xl',
              buttonState.variant === 'secondary' &&
                'border border-purple-600 bg-white text-purple-600 hover:bg-purple-50',
              buttonState.disabled && 'pointer-events-none cursor-not-allowed opacity-50',
            )}>
            {buttonState.text}
          </Button>
        ) : null}
      </div>
    </div>
  );
}
