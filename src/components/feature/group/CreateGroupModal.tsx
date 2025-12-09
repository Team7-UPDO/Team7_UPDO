'use client';

import { Modal } from '@/components/ui/Modal';
import { ModalProps } from '@/components/ui/Modal/Modal';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';
import CreateGroupModalForm from './CreateGroupModalForm';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  CreateGatheringFormSchema,
  type CreateGatheringFormType,
} from '@/schemas/gatheringsSchema';

import { createGathering } from '@/services/gatherings/gatheringService';
import { useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/constants/queryKeys';

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

  const onSubmit = async (data: CreateGatheringFormType) => {
    try {
      await createGathering(data);
      toast.showToast('모임이 생성되었습니다.', 'success');
      onOpenChange(false); // 모달 닫기
      queryClient.invalidateQueries({ queryKey: queryKeys.gatherings.all() });
      reset(); // 폼 초기하ㅘ
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
