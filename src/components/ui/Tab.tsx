'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { twMerge } from 'tailwind-merge';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/utils/cn';
import Icon from './Icon';

const tabItem = cva(
  [
    'relative flex items-center justify-center',
    'transition-colors duration-200 cursor-pointer select-none',
    'focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-purple-500)] focus-visible:ring-offset-2',
  ],
  {
    variants: {
      active: {
        true: 'text-[var(--color-gray-800)]',
        false: 'text-[var(--color-gray-400)] hover:text-[var(--color-gray-600)]',
      },
      disabled: {
        true: 'cursor-not-allowed opacity-40 hover:text-[var(--color-gray-400)]',
        false: '',
      },
    },
    defaultVariants: {
      active: false,
      disabled: false,
    },
  },
);

export interface TabItem<T extends string> {
  value: T;
  label: string;
  icon?: 'category_tab1' | 'category_tab2' | undefined; // 아이콘 없는 경우
  disabled?: boolean;
  content?: React.ReactNode;
}

export interface TabProps<T extends string> extends VariantProps<typeof tabItem> {
  items: readonly TabItem<T>[];
  value: T;
  onChange: (value: T) => void;
  fullWidth?: boolean;
  className?: string;
}

const Tab = <T extends string>({
  items,
  value,
  onChange,
  fullWidth = true,
  className,
}: TabProps<T>) => {
  const [indicatorStyle, setIndicatorStyle] = React.useState({ width: 0, left: 0 });
  const tabRefs = React.useRef<Map<number, HTMLButtonElement>>(new Map());
  const containerRef = React.useRef<HTMLDivElement>(null);

  // 렌더링 시 기본적으로 첫 번째 탭이 활성화
  React.useEffect(() => {
    if (!value && items.length > 0) {
      onChange(items[0].value);
    }
    // cleanup 시 ref 초기화 (탭 배열이 변경될 경우 대비)
    return () => {
      tabRefs.current.clear();
    };
  }, [value, items, onChange]);

  // 인디케이터 위치 계산
  React.useLayoutEffect(() => {
    const activeIndex = items.findIndex(i => i.value === value);
    const activeTab = tabRefs.current.get(activeIndex);
    const container = containerRef.current;
    if (!activeTab || !container) return;

    const updateIndicator = () => {
      const width = activeTab.offsetWidth;
      const left =
        activeTab.getBoundingClientRect().left -
        container.getBoundingClientRect().left +
        container.scrollLeft;

      setIndicatorStyle(prev =>
        prev.width === width && prev.left === left ? prev : { width, left },
      );
    };

    updateIndicator();

    // 리사이즈(반응형 전환) + 스크롤 대응(탭이 많아질 경우 overflow-x-auto 상태일 때 정확한 위치로 인디케이터 재정렬)
    const handleScroll = () => updateIndicator();
    container.addEventListener('scroll', handleScroll, { passive: true });

    const observer = new ResizeObserver(updateIndicator);
    observer.observe(activeTab);
    observer.observe(container);

    return () => {
      container.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, [value, items]);

  const handleClick = (val: T, disabled?: boolean) => {
    if (!disabled) onChange(val);
  };

  const activeItem = items.find(i => i.value === value);

  return (
    <div className={twMerge('w-full', className)}>
      {/* ── Tab Header ── */}
      <div
        ref={containerRef}
        role="tablist"
        className={twMerge(
          'relative flex items-center border-b border-[var(--color-gray-200)]',
          'justify-center md:justify-start',
          'w-full overflow-x-hidden',
        )}>
        {items.map((item, i) => {
          const isActive = item.value === value;
          return (
            <button
              key={item.value ?? i}
              ref={el => {
                if (el) tabRefs.current.set(i, el);
                else tabRefs.current.delete(i);
              }}
              onClick={() => handleClick(item.value, item.disabled)}
              role="tab"
              aria-selected={isActive}
              aria-disabled={item.disabled}
              disabled={item.disabled}
              // 라벨(텍스트) 컬러 설정
              className={twMerge(
                tabItem({ active: isActive, disabled: !!item.disabled }),
                'flex flex-1 items-center justify-center gap-1 py-2 md:flex-none md:flex-row',
                'md:flex md:flex-row md:items-center md:justify-center md:gap-2 md:px-6 md:py-2',
                isActive
                  ? 'typo-body-bold md:typo-subtitle-bold text-[var(--color-gray-800)]'
                  : 'typo-body md:typo-subtitle text-[var(--color-gray-500)] hover:text-[var(--color-gray-700)]',
              )}>
              {/* 아이콘 설정 */}
              {item.icon && (
                <Icon
                  name={item.icon}
                  size={isActive ? 28 : 24}
                  className={cn(
                    // 아이콘 사이즈
                    'h-[32px] w-[32px] md:h-[45px] md:w-[45px]',
                    isActive
                      ? 'text-[var(--color-purple-600)]'
                      : 'text-[var(--color-purple-300)] hover:text-[var(--color-purple-400)]',
                  )}
                />
              )}
              {/* 라벨 설정 */}
              <span className={cn('text-center transition-all duration-150')}>{item.label}</span>
            </button>
          );
        })}

        {/* ── Sliding Indicator ── */}
        <motion.div
          className="absolute bottom-0 left-0 h-[2px] bg-[var(--color-purple-350)]"
          initial={false}
          animate={{ width: indicatorStyle.width, x: indicatorStyle.left }}
          transition={{
            type: 'spring',
            stiffness: 220, // 속도
            damping: 27, // 감속 정도 (튕김 정도)
          }}
        />
      </div>
    </div>
  );
};

export default Tab;
