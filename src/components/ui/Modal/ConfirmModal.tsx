'use client';
import { useRef, useState, RefObject } from 'react';

import Modal from './Modal';
import { Button } from '@/components/ui/Button';

import { cn } from '@/utils/cn';

type ConfirmTone = 'neutral' | 'brand' | 'danger';

interface ConfirmModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  content: string;

  tone?: ConfirmTone;

  onConfirm?: () => void | Promise<void>;
  onCancel?: () => void;

  className?: string;
  headerClassName?: string;
  bodyClassName?: string;
  footerClassName?: string;
}

export default function ConfirmModal({
  open,
  onOpenChange,
  content,
  tone,
  onConfirm,
  onCancel,
  className,
  headerClassName,
  bodyClassName,
  footerClassName,
}: ConfirmModalProps) {
  const confirmRef = useRef<HTMLButtonElement>(null);
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    if (!onConfirm) {
      onOpenChange(false);
      return;
    }
    try {
      setLoading(true);
      await onConfirm();
      onOpenChange(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      initialFocusRef={confirmRef as RefObject<HTMLElement>}
      className={cn(
        'h-[216px] w-[342px] rounded-xl p-6 md:h-[289px] md:w-[600px] md:rounded-3xl md:p-10 md:pt-12',
        className,
      )}>
      <Modal.Header
        onClose={() => {
          onOpenChange(false);
        }}
        className={cn('p-0', headerClassName)}
      />
      <Modal.Body
        className={cn(
          'card-title md:page-title flex flex-col items-center p-0 pt-6 text-center text-gray-700',
          bodyClassName,
        )}>
        <p>{content}</p>
      </Modal.Body>

      <Modal.Footer className={cn('h-12 gap-3 p-0 md:h-15', footerClassName)}>
        <div className="flex h-full w-full justify-between gap-3">
          {/* 취소 버튼 */}
          <Button
            variant="secondary"
            size="responsive_full"
            className="typo-body md:typo-subtitle h-full rounded-md border border-gray-300 text-gray-700"
            onClick={() => {
              onCancel?.();
              onOpenChange(false);
            }}
            disabled={loading}>
            취소
          </Button>

          {/* 확인 버튼 */}
          <Button
            ref={confirmRef}
            variant="primary" // 기본은 primary (보라색)
            size="responsive_full"
            className={cn(
              'typo-body-bold md:h5Bold h-full rounded-md',
              tone === 'danger' && 'bg-red-500 hover:bg-red-600', // tone이 danger일 때만 빨간색 덮어쓰기
            )}
            onClick={handleConfirm}
            disabled={loading}>
            {loading ? '처리 중...' : '확인'}
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
}
