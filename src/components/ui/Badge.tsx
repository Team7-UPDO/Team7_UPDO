import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '@/utils/cn';

const badgeStyles = cva(
  'inline-flex items-center justify-center select-none tabular-nums rounded-full bg-[var(--color-purple-250)] text-white',
  {
    variants: {
      size: {
        responsive:
          'h-[12px] min-w-[12px] px-[2px] text-[10px] ' + // 기본: 모바일
          'md:h-[16px] md:min-w-[16px] md:px-[7px] md:text-[12px]', // 태블릿/PC
      },
    },
    defaultVariants: { size: 'responsive' },
  },
);

export type BadgeStyleProps = VariantProps<typeof badgeStyles>;

export type BadgeProps = React.ComponentPropsWithoutRef<'span'> &
  BadgeStyleProps & {
    as?: 'span' | 'div' | 'a' | 'button';
    value: number; // 0이면 렌더링 안 됨
    max?: number; // 기본 99, 초과 시 "99+"
    formatter?: (n: number, max: number) => React.ReactNode;
    ariaLive?: 'off' | 'polite' | 'assertive';
  };

export default function Badge({
  as = 'span',
  value,
  max = 99,
  formatter,
  ariaLive = 'polite',
  size = 'responsive',
  className,
  ...rest
}: BadgeProps) {
  if (value === 0) return null; // 업데이트 0이면 숨김

  const Comp = as as React.ElementType;
  const display =
    typeof formatter === 'function'
      ? formatter(value, max)
      : value > max
        ? `${max}+`
        : String(value);

  return (
    <Comp
      role="status"
      aria-live={ariaLive}
      aria-label={`${value}개의 업데이트`}
      className={cn(badgeStyles({ size }), className)}
      {...rest}>
      {display}
    </Comp>
  );
}
