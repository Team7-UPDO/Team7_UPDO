'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { ModalProps } from '@/components/ui/Modal/Modal';
import { useToast } from '@/components/ui/Toast';
import { queryKeys } from '@/constants/queryKeys';
import {
  CreateGatheringFormSchema,
  type CreateGatheringFormType,
} from '@/schemas/gatheringsSchema';
import { createGathering } from '@/services/gatherings/gatheringService';
import { toUTCFromKST } from '@/utils/date';

import CreateGroupModalForm from './CreateGroupModalForm';

export default function CreateGroupModal({ open, onOpenChange }: ModalProps) {
  const toast = useToast();
  const queryClient = useQueryClient();

  const {
    control,
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { isSubmitting, isValid, errors },
  } = useForm<CreateGatheringFormType>({
    resolver: zodResolver(CreateGatheringFormSchema),
    defaultValues: {
      name: '',
      capacity: 5,
      type: 'OFFICE_STRETCHING', // 기본값 설정 (필수)
      location: '건대입구', // 기본값 설정 (필수)
      dateTime: '',
      registrationEnd: '',
    },
    mode: 'onChange',
  });

  const toISOString = (dateStr: string) => {
    const match = dateStr.match(/^(\d{4})-(\d{2})-(\d{2}) (\d{1,2}):(\d{2}) (AM|PM)$/);
    if (!match) return dateStr;

    const [, yy, mm, dd, hh, mi, ap] = match;
    let h = parseInt(hh, 10) % 12;
    if (ap === 'PM') h += 12;

    const date = new Date();
    date.setFullYear(parseInt(yy, 10), parseInt(mm, 10) - 1, parseInt(dd, 10));
    date.setHours(h, parseInt(mi, 10), 0, 0);

    return toUTCFromKST(date);
  };

  const onSubmit = async (data: CreateGatheringFormType) => {
    try {
      const requestData = {
        ...data,
        dateTime: toISOString(data.dateTime),
        registrationEnd: toISOString(data.registrationEnd),
      };

      await createGathering(requestData);
      toast.showToast('모임이 생성되었습니다.', 'success');
      onOpenChange(false); // 모달 닫기
      queryClient.invalidateQueries({ queryKey: queryKeys.gatherings.all() });
      reset(); // 폼 초기화
    } catch (error) {
      const msg =
        error &&
        typeof error === 'object' &&
        'message' in error &&
        typeof (error as { message?: string }).message === 'string'
          ? (error as { message: string }).message
          : '모임 생성에 실패했습니다. 잠시 후 다시 시도해주세요.';
      toast.showToast(String(msg), 'error');
    }
  };

  return (
    <Modal
      id="create-group-modal"
      open={open}
      onOpenChange={onOpenChange}
      className="p-4 pb-12 sm:rounded-xl md:rounded-2xl md:p-12"
      responsiveClassName="w-full sm:w-[570px] max-h-[100dvh] h-[min(876px,100dvh-32px)]">
      <Modal.Header
        title="모임 만들기"
        onClose={() => {
          onOpenChange(false);
          reset();
        }}
        className="p-0 pb-6"
      />
      <Modal.Body className="mb-5 flex flex-col gap-6 p-0 sm:mb-10">
        <CreateGroupModalForm
          control={control}
          register={register}
          setValue={setValue}
          watch={watch}
          errors={errors}
        />
      </Modal.Body>
      <Modal.Footer className="h-15 p-0">
        <div>
          <Button
            size={'responsive_full'}
            className="h5Semibold h-[60px] rounded-xl md:w-[474px]"
            onClick={handleSubmit(onSubmit)}
            disabled={!isValid || isSubmitting}>
            {isSubmitting ? '생성 중…' : '확인'}
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
}
