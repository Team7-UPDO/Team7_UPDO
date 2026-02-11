'use client';
import * as React from 'react';

import { cn } from '@/utils/cn';

export interface DropdownProps<T extends { label: string; value: string }> {
  items: ReadonlyArray<T>;
  onChange?: (value: T['value']) => void;
  onOpenChange?: (open: boolean) => void;
  size?: 'full' | 'large' | 'medium' | 'small';
  emptyText?: string;
  id?: string;
  ariaLabel?: string;
  className?: string;
}

const PanelBase = 'z-50 overflow-hidden rounded-md border border-gray-200 bg-white shadow-xl';

export default function Dropdown<T extends { label: string; value: string }>({
  items,
  onChange,
  onOpenChange,
  size = 'full',
  emptyText = '항목이 없습니다',
  id,
  ariaLabel,
  className,
}: DropdownProps<T>) {
  const widthClass =
    size === 'full'
      ? 'w-full'
      : size === 'large'
        ? 'w-[520px]'
        : size === 'small'
          ? 'w-[110px]'
          : 'w-[142px]';

  return (
    <div
      role="listbox"
      id={id}
      aria-label={ariaLabel}
      className={cn(PanelBase, widthClass, className)}>
      {items.length === 0 ? (
        <div className="px-3 py-3 text-base text-gray-500">{emptyText}</div>
      ) : (
        items.map(item => (
          <button
            key={item.value}
            type="button"
            role="option"
            aria-selected={false}
            className="relative flex h-11 w-full cursor-pointer items-center rounded-sm px-3 py-[6px] text-base outline-none select-none hover:bg-purple-50"
            onClick={() => {
              onChange?.(item.value);
              onOpenChange?.(false);
            }}>
            <span className="block truncate">{item.label}</span>
          </button>
        ))
      )}
    </div>
  );
}
