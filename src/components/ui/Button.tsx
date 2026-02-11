import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '@/utils/cn';

const buttonVariants = cva(
  'inline-flex items-center justify-center transition-colors focus:outline-none disabled:cursor-not-allowed cursor-pointer',
  {
    variants: {
      variant: {
        primary: [
          // default
          'text-white bg-[var(--color-primary)]',
          // hover / active
          'hover:bg-[var(--color-primary-hover)] active:bg-[var(--color-primary-active)]',
          // disabled
          'disabled:bg-[var(--color-disabled-1)] disabled:text-[var(--color-disabled-3)]',
        ].join(' '),

        secondary: [
          'text-[var(--gray-500)] bg-white',
          'hover:bg-[var(--gray-100)]',
          'active:text-[var(--gray-100)] active:bg-[var(--gray-500)]',
        ].join(' '),

        calendarOutline: [
          'text-[var(--color-purple-500)] border border-[var(--color-purple-500] bg-[#FAFAF8]',
          'hover:bg-[var(--color-purple-50)] active:bg-[var(--color-purple-100)]',
          'disabled:text-[var(--color-gray-400)] disabled:border-[var(--color-gray-400)] disabled:bg-[#FAFAF8]',
        ].join(' '),

        calendarSolid: [
          'text-white bg-[var(--color-purple-500)]',
          'hover:bg-[var(--color-primary-hover)] active:bg-[var(--color-primary-active)]',
          'disabled:bg-[var(--color-gray-400)] disabled:text-white',
        ].join(' '),
      },
      size: {
        small: 'w-[102px] h-[48px] typo-body-bold rounded-lg',
        medium: 'w-[311px] h-[48px] typo-body-bold rounded-lg',
        large: 'w-[232px] h-[60px] h5Semibold rounded-xl',
        xlarge: 'w-[474px] h-[60px] h5Semibold rounded-xl',
        calendar: 'w-full md:w-[122px] md:h-[40px] eyebrow rounded-md',
        calendar_small: 'w-[100px] h-[44px] typo-body-bold rounded-md',
        secondary: 'w-[232px] h-[60px] typo-subtitle rounded-xl',
        responsive_full: 'w-full',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'medium',
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props} />
    );
  },
);

Button.displayName = 'Button';

export { buttonVariants };
