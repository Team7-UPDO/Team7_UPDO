'use client';

import { useState, useRef } from 'react';

import { Input } from '@/components/ui/Input';
import Selectbox from '@/components/ui/Selectbox';
import SelectInput from '@/components/ui/SelectInput';
import DatetimeInput from '@/components/ui/DatetimeInput';
import { Button } from '@/components/ui/Button';

import { TAG_OPTIONS } from '@/constants/tags';
import { TAB_OPTIONS } from '@/constants/tabs';

import { CreateGroupForm } from './CreateGroupModal';
import type { SubmitErrors } from './CreateGroupModal';

type CreateGroupModalFormProps = {
  form: CreateGroupForm;
  setForm: React.Dispatch<React.SetStateAction<CreateGroupForm>>;
  submitErrors?: SubmitErrors | null;
};

export default function CreateGroupModalForm({
  form,
  setForm,
  submitErrors,
}: CreateGroupModalFormProps) {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(0);

  const labelClassName = 'block typo-body-bold text-gray-800 mb-3';
  const fileRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if (!file) return;

    const allowedTypes = ['image/png', 'image/jpeg', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      alert('png, jpg, jpeg, webp 파일만 업로드할 수 있어요.');
      return;
    }

    setForm(s => ({ ...s, image: file }));
  };

  return (
    <>
      <div>
        <label htmlFor="gathering-name" className={labelClassName}>
          모임 이름
        </label>
        <Input
          id="gathering-name"
          placeholder="모임 이름을 작성해주세요"
          value={form.name}
          onChange={e => setForm(s => ({ ...s, name: e.target.value }))}
        />
      </div>

      <div>
        <label className={labelClassName}>태그</label>
        <SelectInput
          items={TAG_OPTIONS}
          value={form.tag ?? null}
          onChange={nextValue =>
            setForm(s => ({
              ...s,
              tag: nextValue ?? null,
            }))
          }
          placeholder="태그를 선택해주세요"
        />
      </div>

      <div>
        <label className={labelClassName}>
          이미지 <span className="typo-xs text-gray-400">(선택)</span>
        </label>
        <input
          type="file"
          accept=".png,.jpg,.jpeg,.webp"
          ref={fileRef}
          onChange={handleFileChange}
          className="hidden"
          id="image-upload"
          aria-label="이미지 파일 선택"
        />

        <div className="flex items-center gap-3">
          <Input
            placeholder="이미지를 첨부해주세요 ex)png, wepb, jpg, jpeg"
            value={form.image ? form.image.name : ''}
            readOnly
            disableFocusStyle
            onClick={() => fileRef.current?.click()}
            className="cursor-pointer"
            inputClassName="cursor-pointer"
          />

          <Button
            type="button"
            variant="calendarOutline"
            size={'calendar_small'}
            className="min-w-[76px] cursor-pointer"
            onClick={() => fileRef.current?.click()}>
            파일 찾기
          </Button>
        </div>
      </div>

      <div className="grid gap-10 md:grid-cols-2">
        <div>
          <label className="label mb-2 block pl-1 text-gray-800">모임 날짜</label>

          <DatetimeInput
            value={form.date ?? ''}
            onChange={nextValue =>
              setForm(s => ({
                ...s,
                date: nextValue,
              }))
            }
            blockPast
          />
        </div>
        <div>
          <div className="flex justify-between">
            <label className="label mb-2 block pl-1 text-gray-800">모집 마감 날짜</label>
          </div>
          <DatetimeInput
            value={form.registrationEnd ?? ''}
            onChange={nextValue =>
              setForm(s => ({
                ...s,
                registrationEnd: nextValue,
              }))
            }
            blockPast
          />
          {submitErrors?.registrationEnd && (
            <span className="typo-body-sm md:typo-caption-bold text-red-500">
              {submitErrors.registrationEnd[0]}
            </span>
          )}
        </div>
      </div>

      <div>
        <label className={labelClassName}>선택 서비스</label>
        <div className="flex gap-3">
          {TAB_OPTIONS.filter(o => o.value !== '성장').map(({ title, subtitle, value }, idx) => (
            <Selectbox
              key={idx}
              title={title}
              subtitle={subtitle ?? ''}
              isSelected={selectedIdx === idx}
              onSelect={() => {
                setSelectedIdx(idx);
                setForm(s => ({
                  ...s,
                  tab: value,
                }));
              }}
            />
          ))}
        </div>
      </div>

      <div>
        <div className="label flex justify-between">
          <label className={labelClassName}>모집 인원</label>
          {submitErrors?.capacity && (
            <span className="typo-body-sm text-red-500">{submitErrors.capacity[0]}</span>
          )}
        </div>
        <Input
          type="number"
          placeholder="모집 인원을 입력해주세요"
          value={form.capacity ? String(form.capacity) : ''}
          onChange={e => {
            const val = e.target.value === '' ? null : Number(e.target.value);
            if (val !== null && val < 0) return; // prevent values above 20
            setForm(s => ({
              ...s,
              capacity: val,
            }));
          }}
        />
      </div>
    </>
  );
}
