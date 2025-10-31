'use client';

import { useState } from 'react';

import { Modal } from '@/components/ui/Modal';
import { ModalProps } from '@/components/ui/Modal/Modal';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';
import CreateGroupModalForm from './CreateGroupModalForm';

import { Option } from '@/constants/tags';
import { TabOption } from '@/constants/tabs';
import { Type, Location, TabToType, TagToLocation } from '@/utils/mapping';
import { toUTCFromKST } from '@/utils/date';

import { CreateGatheringFormSchema } from '@/schemas/gatheringsSchema';
import { createGathering } from '@/services/gatherings/gatheringService';
import { useQueryClient } from '@tanstack/react-query';
import { queryKey } from '@/constants/queryKeys';

export type CreateGroupForm = {
  name: string;
  tab: TabOption['value']; // 스킬업 챌린지 네트워킹
  type: Type | null; // 없으면 tab에서 mapping
  tag: Option['value'] | null; // default growth Learn challenge connect
  location?: Location | null; // 없으면 tag에서 mapping
  date?: string | null;
  registrationEnd?: string | null;
  capacity?: number | null;
  image?: File | null | undefined;
};

const InitialForm = {
  name: '',
  tag: null,
  tab: '스킬업',
  type: null,
  location: null,
  date: null,
  registrationEnd: null,
  capacity: 5,
};

export type SubmitErrors = Record<string, string[]>; // key: field name, value: messages

export default function CreateGroupModal({ open, onOpenChange }: ModalProps) {
  const toast = useToast();
  const queryClient = useQueryClient();
  const [submitErrors, setSubmitErrors] = useState<SubmitErrors | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState<CreateGroupForm>(InitialForm);

  const handleSubmit = async () => {
    const payload = {
      name: form.name.trim(),
      type: form.tab && TabToType(form.tab),
      location: form.tag && TagToLocation(form.tag),
      dateTime: form.date && toUTCFromKST(new Date(form.date)),
      registrationEnd: form.registrationEnd && toUTCFromKST(new Date(form.registrationEnd)),
      capacity: form.capacity ? Number(form.capacity) : 0,
      image: form.image instanceof File ? form.image : undefined,
    };

    const validation = CreateGatheringFormSchema.safeParse(payload);

    if (!validation.success) {
      const grouped: SubmitErrors = {};
      for (const issue of validation.error.issues) {
        const key = String(issue.path[0] ?? 'form');
        if (!grouped[key]) grouped[key] = [];
        grouped[key].push(issue.message);
      }
      setSubmitErrors(grouped);
      return;
    }
    // 성공 시 이전 에러 초기화
    setSubmitErrors(null);

    const validData = validation.data;

    try {
      setSubmitting(true);
      await createGathering(validData);
      toast.showToast('모임이 생성되었습니다.', 'success');
      onOpenChange(false); // 모달 닫기
      queryClient.invalidateQueries({ queryKey: queryKey.gatherings() });
      setForm(InitialForm);
    } catch (error) {
      const msg =
        error &&
        typeof error === 'object' &&
        'message' in error &&
        typeof (error as { message?: string }).message === 'string'
          ? (error as { message: string }).message
          : '모임 생성에 실패했습니다. 잠시 후 다시 시도해주세요.';
      toast.showToast(String(msg), 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const isFormComplete =
    !!form.name && !!form.tag && !!form.date && !!form.registrationEnd && !!form.capacity;

  return (
    <Modal
      id="create-group-modal"
      open={open}
      onOpenChange={onOpenChange}
      className="p-4 pb-12 sm:rounded-xl md:rounded-2xl md:p-12"
      ResponsiveClassName="w-full sm:w-[570px] max-h-[100dvh] h-[min(876px,100dvh-32px)]">
      <Modal.Header
        title="모임 만들기"
        onClose={() => {
          onOpenChange(false);
          setForm(InitialForm);
        }}
        className="p-0 pb-6"
      />
      <Modal.Body className="mb-5 flex flex-col gap-6 p-0 sm:mb-10">
        <CreateGroupModalForm form={form} setForm={setForm} submitErrors={submitErrors} />
      </Modal.Body>
      <Modal.Footer className="h-15 p-0">
        <div>
          <Button
            size={'responsive_full'}
            className="h5Semibold h-[60px] rounded-xl md:w-[474px]"
            onClick={handleSubmit}
            disabled={!isFormComplete || submitting}>
            {submitting ? '생성 중…' : '확인'}
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
}
