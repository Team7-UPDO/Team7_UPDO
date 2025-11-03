'use client';

import React from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { cn } from '@/utils/cn';
import SaveFilled from './Icon/Icons/SaveFilled';
import SaveOutline from './Icon/Icons/SaveOutline';

export interface SaveButtonProps {
  isSaved: boolean;
  onToggle: () => void;
  size?: number | 'responsive';
  className?: string;
  ariaLabel?: string;
}

export default function SaveButton({
  isSaved,
  onToggle,
  size = 48,
  className,
  ariaLabel = '찜하기',
}: SaveButtonProps) {
  const isResponsive = size === 'responsive';
  const buttonSize = isResponsive ? undefined : (size as number);

  return (
    <m.button
      type="button"
      onClick={e => {
        e.stopPropagation();
        e.preventDefault();
        onToggle();
      }}
      aria-label={ariaLabel}
      aria-pressed={isSaved}
      className={cn(
        'relative inline-flex cursor-pointer items-center justify-center',
        isResponsive && 'h-10 w-10 sm:h-12 sm:w-12 md:h-15 md:w-15',
        className,
      )}
      style={
        !isResponsive
          ? {
              width: buttonSize,
              height: buttonSize,
              background: 'none',
              border: 'none',
              padding: 0,
              outline: 'none',
            }
          : {
              background: 'none',
              border: 'none',
              padding: 0,
              outline: 'none',
            }
      }
      whileTap={{ scale: 0.9 }}
      whileHover={{ scale: 1.05 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}>
      {/* Default (Outline) */}
      <div
        className={cn(
          'absolute inset-0 flex items-center justify-center',
          isResponsive && '[&>svg]:h-full [&>svg]:w-full',
        )}>
        <SaveOutline size={isResponsive ? undefined : buttonSize} />
      </div>

      {/* Active (Filled) */}
      <AnimatePresence>
        {isSaved && (
          <m.div
            key="filled"
            className={cn(
              'absolute inset-0 flex items-center justify-center',
              isResponsive && '[&>svg]:h-full [&>svg]:w-full',
            )}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{
              type: 'spring',
              stiffness: 500,
              damping: 25,
              mass: 0.5,
            }}>
            <SaveFilled size={isResponsive ? undefined : buttonSize} />
          </m.div>
        )}
      </AnimatePresence>

      {/* 반짝임 효과 */}
      {isSaved && (
        <m.div
          className="pointer-events-none absolute inset-0"
          initial={{ scale: 1, opacity: 0 }}
          animate={{ scale: 1.3, opacity: [0, 0.4, 0] }}
          transition={{ duration: 0.5, ease: 'easeOut' }}>
          <div
            className="h-full w-full rounded-full"
            style={{
              background:
                'radial-gradient(circle, color-mix(in srgb, var(--color-purple-400) 30%, transparent) 0%, transparent 70%)',
            }}
          />
        </m.div>
      )}
    </m.button>
  );
}
