'use client';

import { useRef, useState } from 'react';
import {
  Control,
  Controller,
  FieldErrors,
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
} from 'react-hook-form';

import { Button } from '@/components/ui/Button';
import DatetimeInput from '@/components/ui/DatetimeInput';
import { Input } from '@/components/ui/Input';
import Selectbox from '@/components/ui/Selectbox';
import SelectInput from '@/components/ui/SelectInput';
import { TAB_OPTIONS } from '@/constants/tabs';
import { TAG_OPTIONS } from '@/constants/tags';
import { CreateGatheringFormType } from '@/schemas/gatheringsSchema';

type CreateGroupModalFormProps = {
  control: Control<CreateGatheringFormType>;
  register: UseFormRegister<CreateGatheringFormType>;
  setValue: UseFormSetValue<CreateGatheringFormType>;
  watch: UseFormWatch<CreateGatheringFormType>;
  errors: FieldErrors<CreateGatheringFormType>;
};

export default function CreateGroupModalForm({
  control,
  register,
  setValue,
  watch,
  errors,
}: CreateGroupModalFormProps) {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(0);

  const labelClassName = 'block typo-body-bold text-gray-800 mb-3';
  const fileRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ['image/png', 'image/jpeg', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      alert('png, jpg, jpeg, webp 파일만 업로드할 수 있어요.');
      return;
    }

    setValue('image', file, { shouldValidate: true });
  };

  const imageFile = watch('image');

  return (
    <>
      <div>
        <label htmlFor="gathering-name" className={labelClassName}>
          모임 이름
        </label>
        <Input
          id="gathering-name"
          placeholder="모임 이름을 작성해주세요"
          {...register('name')}
          aria-invalid={!!errors.name}
        />
        {errors.name && <span className="text-sm text-red-500">{errors.name.message}</span>}
      </div>

      <div>
        <label className={labelClassName}>태그</label>
        <Controller
          control={control}
          name="location"
          render={({ field: { onChange, value } }) => {
            const selectedValue = TAG_OPTIONS.find(opt => opt.location === value)?.value;
            return (
              <SelectInput
                items={TAG_OPTIONS}
                value={selectedValue ?? null}
                onChange={val => {
                  const selectedLocation = TAG_OPTIONS.find(opt => opt.value === val)?.location;
                  onChange(selectedLocation);
                }}
                placeholder="태그를 선택해주세요"
              />
            );
          }}
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
            value={imageFile ? imageFile.name : ''}
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

          <Controller
            control={control}
            name="dateTime"
            render={({ field: { onChange, value } }) => (
              <DatetimeInput value={value} onChange={onChange} blockPast />
            )}
          />
        </div>
        <div>
          <div className="flex justify-between">
            <label className="label mb-2 block pl-1 text-gray-800">모집 마감 날짜</label>
          </div>
          <Controller
            control={control}
            name="registrationEnd"
            render={({ field: { onChange, value } }) => (
              <DatetimeInput value={value} onChange={onChange} blockPast />
            )}
          />
          {errors.registrationEnd && (
            <span className="text-sm text-red-500">{errors.registrationEnd.message}</span>
          )}
        </div>
      </div>

      <div>
        <label className={labelClassName}>선택 서비스</label>
        <div className="flex gap-3">
          {TAB_OPTIONS.filter(o => o.value !== '성장').map(
            ({ title, subtitle, value, type }, idx) => (
              <Selectbox
                key={idx}
                title={title}
                subtitle={subtitle ?? ''}
                isSelected={selectedIdx === idx}
                onSelect={() => {
                  setSelectedIdx(idx);
                  setValue('type', type as CreateGatheringFormType['type'], {
                    shouldValidate: true,
                  });
                }}
              />
            ),
          )}
        </div>
      </div>

      <div>
        <div className="label flex justify-between">
          <label className={labelClassName}>모집 인원</label>
          {errors?.capacity && (
            <span className="typo-body-sm text-red-500">{errors.capacity?.message}</span>
          )}
        </div>
        <Input
          type="number"
          placeholder="모집 인원을 입력해주세요"
          {...register('capacity', { valueAsNumber: true })}
        />
      </div>
    </>
  );
}
