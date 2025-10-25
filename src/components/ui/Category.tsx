'use client';

import React from 'react';
import { cn } from '@/utils/cn';
import { MainCategory, TAB_OPTIONS } from '@/constants/tabs';

export interface CategoryItem {
  id: string;
  label: string;
  apiType: string;
}

export interface CategoryProps {
  mainCategory: MainCategory; // 대분류 (성장 | 네트워킹)
  activeId?: string; // 현재 선택된 중분류 (UI)
  activeType?: string; // 현재 선택된 중분류 (API)
  onChange: (id: string, apiType: string) => void;
  className?: string;
  items?: CategoryItem[];
  defaultActiveId?: string;
  ariaLabel?: string;
}

export default function Category({
  mainCategory,
  activeId,
  activeType,
  onChange,
  className,
  items,
  defaultActiveId,
  ariaLabel,
}: CategoryProps) {
  const filteredCategories: CategoryItem[] = React.useMemo(() => {
    return TAB_OPTIONS.filter(opt => opt.title === mainCategory).map(opt => ({
      id: opt.subtitle || opt.value,
      label: opt.subtitle || opt.value,
      apiType: opt.type,
    }));
  }, [mainCategory]);

  const categories = items ?? filteredCategories;

  if (categories.length === 0) return null;

  const currentId =
    activeId ||
    categories.find(c => c.apiType === activeType)?.id ||
    defaultActiveId ||
    categories[0].id;

  return (
    <div
      className={cn('flex justify-start gap-[10px]', className)}
      role="tablist"
      aria-label={ariaLabel ?? `${mainCategory} 카테고리`}>
      {categories.map(category => {
        const isActive = category.id === currentId;
        return (
          <button
            key={category.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(category.id, category.apiType)}
            className={cn(
              'typo-sm flex cursor-pointer items-center justify-center rounded-[16px] px-4 py-2 select-none hover:opacity-80',
              'md:typo-body text-white transition-all duration-200',
              isActive
                ? 'eyebrow sm:typo-body-bold bg-[var(--color-purple-500)]'
                : 'typo-body-sm sm:typo-body bg-[var(--color-gray-100)] text-gray-500',
            )}>
            {category.label}
          </button>
        );
      })}
    </div>
  );
}
