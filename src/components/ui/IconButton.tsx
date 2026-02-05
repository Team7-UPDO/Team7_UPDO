import * as React from 'react';

import Icon from '@/components/ui/Icon';
import { cn } from '@/utils/cn';

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string;
}

export const IconButton = ({ label, className, ...props }: IconButtonProps) => {
  return (
    <button
      className={cn(
        'flex cursor-pointer items-center justify-center bg-[var(--color-primary)] text-white transition-colors focus:outline-none active:bg-[var(--color-primary-active)]',

        'h-[60px] w-[60px] rounded-full hover:bg-[var(--color-primary-hover)] sm:h-[64px] sm:w-[194px] sm:gap-1.5 sm:rounded-xl',
        className,
      )}
      {...props}>
      <Icon name="plus" size={36} className="shrink-0" />
      {label && <span className="h5Bold hidden sm:inline">{label}</span>}
    </button>
  );
};
