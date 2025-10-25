'use client';

import { useEffect } from 'react';
import * as React from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/utils/cn';

import { useBodyScrollLock, useEscape, useFocusTrap } from './useModal';
import Icon from '../Icon';

export interface ModalProps {
  id?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void; // ESC 키, 바깥 클릭 등의 이벤트로 Modal 닫기 구현용
  initialFocusRef?: React.RefObject<HTMLElement>; // Modal이 열릴 때 초기에 포커스가 적용될 HTMLElement
  className?: string;
  ResponsiveClassName?: string;
  modalClassName?: string; // 모달 전체 컨테이너 (화면 중앙 정렬 등)
  children?: React.ReactNode; // Modal 내부 실제 내용
}

function Portal({ children }: { children: React.ReactNode }) {
  // [state] 클라이언트 렌더링이 완료된 후에만 true로 변경되어 Portal 생성 가능하도록
  const [mounted, setMounted] = React.useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return createPortal(children, document.body);
}

function Overlay({ onClick }: { onClick?: (e: React.MouseEvent<HTMLDivElement>) => void }) {
  return <div className="fixed inset-0 bg-black/40" onClick={onClick} />;
}

interface HeaderProps {
  title?: string;
  onClose?: () => void;
  className?: string;
  titleClassName?: string;
}
function Header({ title, onClose, className, titleClassName }: HeaderProps) {
  return (
    <header
      className={cn(
        'sticky top-0 z-10 flex items-start justify-between bg-white px-6 py-4',
        className,
      )}>
      <div>
        {title && (
          <h2 id="modal-title" className={cn('card-title text-gray-900', titleClassName)}>
            {title}
          </h2>
        )}
      </div>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="-m-1 cursor-pointer rounded p-1 text-gray-500 hover:text-gray-700"
          aria-label="닫기">
          <Icon name="delete" />
        </button>
      )}
    </header>
  );
}

function Body({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('min-h-0 flex-1 overflow-y-auto px-6 py-5', className)}>{children}</div>
  );
}

function Footer({
  children,
  className,
  childrenClassName,
}: {
  children: React.ReactNode;
  className?: string;
  childrenClassName?: string;
}) {
  return (
    <footer className={cn('sticky bottom-0 z-10 bg-white px-6 py-4', className)}>
      <div className={cn('h-full w-full', childrenClassName)}>{children}</div>
    </footer>
  );
}

function ModalRoot({
  id,
  open,
  onOpenChange,
  initialFocusRef,
  className,
  children,
  ResponsiveClassName,
  modalClassName,
}: ModalProps) {
  const contentRef = React.useRef<HTMLDivElement>(null) as React.RefObject<HTMLDivElement>;

  useBodyScrollLock(open);
  useEscape(open, () => onOpenChange(false));
  useFocusTrap(open, contentRef, initialFocusRef);

  if (!open) return null;

  const handleOutside = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onOpenChange(false);
  };

  return (
    <Portal>
      <div className="fixed inset-0 z-[1000]">
        <Overlay onClick={handleOutside} />
        <div
          className={cn(
            'pointer-events-none fixed inset-0 flex items-center justify-center overflow-y-auto',
            modalClassName,
          )}>
          <div
            className={cn('pointer-events-auto', ResponsiveClassName)}
            aria-modal="true"
            role="dialog"
            aria-labelledby="modal-title"
            aria-describedby="modal-desc">
            <div
              id={id}
              ref={contentRef}
              className={cn('mx-auto flex flex-col overflow-hidden bg-white shadow-xl', className)}>
              {children}
            </div>
          </div>
        </div>
      </div>
    </Portal>
  );
}

export const Modal = Object.assign(ModalRoot, {
  Header,
  Body,
  Footer,
  Overlay,
});

export default Modal;
