'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';

import Icon from '@/components/ui/Icon';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Modal, ModalProps } from '@/components/ui/Modal/Modal';
import { useToast } from '@/components/ui/Toast';

import { IUser } from '@/types/auths';
import { authService } from '@/services/auths/authService';

export default function EditProfileModal({
  open,
  onOpenChange,
  user,
  onSaved,
}: ModalProps & { user: IUser; onSaved?: (next: Partial<IUser>) => void }) {
  const { showToast } = useToast();

  const { image, name, companyName, email } = user;
  const DEFAULT_AVATAR_SRC = '/images/avatar-default.png';

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [previewDataUrl, setPreviewDataUrl] = useState<string | null>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [newCompanyName, setNewCompanyName] = useState(companyName || '');

  const handlePickImage = () => fileInputRef.current?.click();
  const handleFileChange: React.ChangeEventHandler<HTMLInputElement> = e => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setPreviewDataUrl(result);
    };
    reader.readAsDataURL(file);
  };

  const handleCancel = () => {
    setPreviewDataUrl(null);
    setSelectedFile(null);
    setNewCompanyName(companyName || '');
    onOpenChange(false);
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);

      const updatedUser = await authService.updateUser({
        companyName: newCompanyName || undefined,
        image: selectedFile ?? undefined,
      });

      onSaved?.({
        companyName: newCompanyName,
        image: updatedUser.image ?? image ?? undefined,
      });

      showToast('프로필 저장에 성공했습니다.', 'success');
      onOpenChange(false);
      setPreviewDataUrl(null);
      setSelectedFile(null);
    } catch (e) {
      console.error(e);
      showToast('프로필 저장에 실패했습니다. 다시 시도해주세요.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const labelClassname = 'typo-body md:typo-lg';
  const inputformClassname = 'flex flex-col gap-3';
  const btnClassname = 'min-w-0 flex-1 basis-0 rounded-lg h-12 md:h-15 typo-body-bold md:h5Bold';

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      className="rounded-xl p-6 pt-8 md:rounded-3xl md:p-12 md:pb-11"
      ResponsiveClassName="w-[342px] h-[579px] md:w-[616px] md:h-[758px]">
      <Modal.Header
        title="프로필 수정하기"
        onClose={() => onOpenChange(false)}
        className="mb-8 p-0"
        titleClassName="card-title md:h4Semibold text-gray-900"
      />
      <Modal.Body className="p-0">
        <div className="flex w-full flex-col gap-4">
          <div className="flex w-full flex-col items-center justify-center gap-[2px]">
            <div className="relative h-28 w-28">
              <Image
                src={previewDataUrl ?? image ?? DEFAULT_AVATAR_SRC}
                alt={`${name ?? '사용자'} 프로필 이미지`}
                width={112}
                height={112}
                className="h-28 w-28 rounded-full object-cover shadow ring-[1px] ring-gray-100"
                priority
              />
              <button
                type="button"
                onClick={handlePickImage}
                className="absolute right-0 bottom-0 cursor-pointer rounded-full"
                aria-label="프로필 이미지 변경">
                <Icon name="edit_btn" size={40} />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>
            <span className="typo-subtitle-bold mt-2 text-gray-900">{name}</span>
            <span className="label text-gray-600">{email}</span>
          </div>

          <div className={inputformClassname}>
            <label className={labelClassname}>직업</label>
            <Input value={newCompanyName} onChange={e => setNewCompanyName(e.target.value)} />
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer className="mt-8 p-0 md:mt-11">
        <div className="flex w-full gap-3">
          <Button
            size="responsive_full"
            variant={'calendarOutline'}
            className={btnClassname}
            onClick={handleCancel}
            disabled={isSaving}>
            취소
          </Button>
          <Button
            size="responsive_full"
            variant={'calendarSolid'}
            className={btnClassname}
            onClick={handleSave}
            disabled={isSaving}>
            {isSaving ? '저장 중…' : '수정'}
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
}
