'use client';
import * as React from 'react';
import { useEffect } from 'react';

/** 스크롤 락 */
export function useBodyScrollLock(lock: boolean) {
  useEffect(() => {
    if (!lock) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [lock]);
}

/** ESC 키로 닫기 */
export function useEscape(open: boolean, onClose: () => void) {
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);
}

/** 포커스 트랩 */
export function useFocusTrap(
  open: boolean,
  containerRef: React.RefObject<HTMLDivElement>,
  initialFocusRef?: React.RefObject<HTMLElement>,
) {
  useEffect(() => {
    if (!open) return;
    const container = containerRef.current;
    if (!container) return;

    const focusables = container.querySelectorAll<HTMLElement>(
      'a[href],button:not([disabled]),textarea,input,select,[tabindex]:not([tabindex=\"-1\"])',
    );

    const first = (initialFocusRef?.current ?? focusables[0]) as HTMLElement | undefined;
    const last = focusables[focusables.length - 1] as HTMLElement | undefined;

    const prev = document.activeElement as HTMLElement | null;
    first?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      if (focusables.length === 0) {
        e.preventDefault();
        (container as HTMLElement).focus();
        return;
      }
      const active = document.activeElement as HTMLElement | null;
      if (e.shiftKey) {
        if (active === first || active === container) {
          e.preventDefault();
          (last ?? first)?.focus();
        }
      } else {
        if (active === last) {
          e.preventDefault();
          (first ?? last)?.focus();
        }
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      prev?.focus();
    };
  }, [open, containerRef, initialFocusRef]);
}
