'use client';

import React, { useState, useCallback } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import Heart from '@/components/ui/Icon/Icons/Heart';

interface AnimatedHeartProps {
  isFilled: boolean;
  isHovered: boolean;
  onClick: () => void;
  onHoverStart: () => void;
  onHoverEnd: () => void;
  index: number;
  disabled: boolean;
  size: number;
}

const AnimatedHeart: React.FC<AnimatedHeartProps> = React.memo(
  ({ isFilled, isHovered, onClick, onHoverStart, onHoverEnd, index, disabled, size }) => {
    return (
      <m.button
        type="button"
        onClick={onClick}
        onHoverStart={onHoverStart}
        onHoverEnd={onHoverEnd}
        className="relative"
        style={{
          background: 'none',
          border: 'none',
          padding: 0,
          outline: 'none',
          boxShadow: 'none',
          cursor: disabled ? 'default' : 'pointer',
        }}
        role="radio"
        whileTap={disabled ? {} : { scale: 0.85 }}
        whileHover={disabled ? {} : { scale: 1.1 }}
        transition={{ type: 'spring', stiffness: 400, damping: 17 }}
        aria-label={`${index + 1}점 평가`}
        aria-checked={isFilled}
        aria-disabled={disabled}>
        <div className="relative" style={{ width: size, height: size }}>
          {/* Lined 하트 (기본 상태) */}
          <div className="absolute inset-0">
            <Heart size={size} fill="lined" />
          </div>

          {/* Full 하트 (애니메이션) */}
          <AnimatePresence>
            {(isFilled || isHovered) && (
              <m.div
                className="absolute inset-0"
                initial={{ scale: 0, opacity: 0 }}
                animate={{
                  scale: 1,
                  opacity: 1,
                }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{
                  type: 'spring',
                  stiffness: 500,
                  damping: 25,
                  mass: 0.5,
                }}>
                <Heart size={size} fill="full" />
              </m.div>
            )}
          </AnimatePresence>

          {/* 반짝임 효과 */}
          {isFilled && (
            <m.div
              className="pointer-events-none absolute inset-0"
              initial={{ scale: 1, opacity: 0 }}
              animate={{ scale: 1.5, opacity: [0, 0.5, 0] }}
              transition={{ duration: 0.6, ease: 'easeOut' }}>
              <div
                className="h-full w-full rounded-full"
                style={{
                  background:
                    'radial-gradient(circle, color-mix(in srgb, var(--color-purple-300) 30%, transparent) 0%, transparent 70%)',
                }}
              />
            </m.div>
          )}
        </div>
      </m.button>
    );
  },
);

AnimatedHeart.displayName = 'AnimatedHeart';

// ReviewScore 메인 컴포넌트
export interface ReviewScoreProps {
  value?: number;
  onChange?: (score: number) => void;
  disabled?: boolean;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const ReviewScore: React.FC<ReviewScoreProps> = ({
  value = 0,
  onChange,
  disabled = false,
  label = '만족스러운 경험이었나요?',
  size = 'md',
  className = '',
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const MAX_SCORE = 5; // 5점 만점 고정
  const HEART_SIZE = size === 'sm' ? 24 : size === 'lg' ? 40 : 32;

  const handleClick = useCallback(
    (index: number) => {
      if (disabled) return;
      const newScore = index + 1;
      onChange?.(newScore);
    },
    [disabled, onChange],
  );

  const handleHoverStart = useCallback(
    (index: number) => {
      if (disabled) return;
      setHoveredIndex(index);
    },
    [disabled],
  );

  const handleHoverEnd = useCallback(() => {
    setHoveredIndex(null);
  }, []);

  const hearts = Array.from({ length: MAX_SCORE }, (_, index) => {
    const isFilled = index < value;
    const isHovered = hoveredIndex !== null && index <= hoveredIndex;

    return (
      <AnimatedHeart
        key={index}
        index={index}
        isFilled={isFilled}
        isHovered={isHovered}
        onClick={() => handleClick(index)}
        onHoverStart={() => handleHoverStart(index)}
        onHoverEnd={handleHoverEnd}
        disabled={disabled}
        size={HEART_SIZE}
      />
    );
  });

  return (
    <div className={`flex flex-col gap-[10px] ${className}`}>
      {label && <p className="typo-lg indent-1 font-medium text-gray-800">{label}</p>}

      <div
        className="inline-flex items-center"
        role="radiogroup"
        aria-label="평점 선택"
        style={{
          height: HEART_SIZE,
        }}>
        {hearts}
      </div>
    </div>
  );
};

export default ReviewScore;
