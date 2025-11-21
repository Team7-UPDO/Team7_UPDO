'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal, ModalProps } from '@/components/ui/Modal/Modal';
import ReviewScore from '@/components/ui/ReviewScore';
import { useToast } from '@/components/ui/Toast';

import { ReviewFormSchema, type ReviewFormType } from '@/schemas/reviewsSchema';
import { createReview } from '@/services/reviews/reviewService';

const TOAST_MESSAGE = {
  successReview: '리뷰가 성공적으로 등록되었습니다',
  submitError: '리뷰 등록 중 오류가 발생했습니다.',
} as const;

interface ApiRequestProps {
  gatheringId: number;
}

export default function WriteReviewModal({
  open,
  onOpenChange,
  ApiRequestProps,
  onSuccess,
}: ModalProps & { ApiRequestProps: ApiRequestProps; onSuccess?: () => void }) {
  const {
    register,
    control,
    handleSubmit,
    formState: { isSubmitting, isValid },
  } = useForm<ReviewFormType>({
    resolver: zodResolver(ReviewFormSchema),
    defaultValues: {
      score: 0,
      comment: '',
      gatheringId: ApiRequestProps.gatheringId,
    },
    mode: 'onChange',
  });

  const FooterButtonClassName = 'typo-body-bold h-[48px] rounded-md min-w-0 flex-1 basis-0';

  const onSubmit = async (data: ReviewFormType) => {
    try {
      await createReview(data);

      const toast = useToast.getState();
      toast.showToast(TOAST_MESSAGE.successReview, 'success');
      if (onSuccess) {
        onSuccess();
      } else {
        onOpenChange(false);
      }
    } catch (error: unknown) {
      const toast = useToast.getState();
      const rawMessage =
        typeof (error as { message?: unknown })?.message === 'string'
          ? (error as { message: string }).message.trim()
          : '';
      const message = rawMessage || TOAST_MESSAGE.submitError; // 서버 메시지가 없을 때만 공통 폴백 사용
      toast.showToast(message, 'error');
    }
  };

  return (
    <>
      <Modal
        open={open}
        onOpenChange={onOpenChange}
        className="rounded-xl p-6 pt-8 md:rounded-3xl md:p-12 md:pb-11"
        ResponsiveClassName="w-[342px] h-[584px] md:w-[616px] md:h-[644px]">
        <Modal.Header
          title="리뷰 쓰기"
          onClose={() => onOpenChange(false)}
          className="mb-11 p-0 sm:mb-13"
        />
        <Modal.Body className="p-0">
          <div>
            <Controller
              control={control}
              name="score"
              render={({ field: { onChange, value } }) => (
                <ReviewScore value={value} onChange={onChange} aria-label="평점 선택" />
              )}
            />
          </div>

          <div className="mt-12 flex flex-col gap-3">
            <label htmlFor="review-comment" className="typo-lg indent-1 font-medium text-gray-800">
              경험에 대해 남겨주세요.
            </label>
            <Input
              id="review-comment"
              multiline
              placeholder="남겨주신 리뷰는 프로그램 운영 및 다른 회원 분들께 큰 도움이 됩니다."
              {...register('comment')}
              aria-required="true"
            />
          </div>
        </Modal.Body>
        <Modal.Footer className="mt-6 p-0">
          <div className="flex w-full gap-4">
            <Button
              size={'responsive_full'}
              className={`min-w-0 flex-1 basis-0 ${FooterButtonClassName}`}
              variant={'calendarOutline'}
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}>
              취소
            </Button>
            <Button
              size={'responsive_full'}
              className={`min-w-0 flex-1 basis-0 ${FooterButtonClassName}`}
              variant={'calendarSolid'}
              onClick={handleSubmit(onSubmit)}
              // 입력값이 부족하거나 이미 버튼을 눌렀다면 disabled
              disabled={!isValid || isSubmitting}>
              {isSubmitting ? '등록 중…' : '등록'}
            </Button>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
}
