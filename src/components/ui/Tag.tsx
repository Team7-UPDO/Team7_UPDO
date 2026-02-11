import React from 'react';

import { cn } from '@/utils/cn';

type TagProps = {
  topic?: 'growth' | 'learn' | 'challenge' | 'connect' | 'default';
  label: string;
  className?: string;
};

const topicColors = {
  growth: 'text-[var(--color-mint-600)]',
  learn: 'text-[var(--color-yellow-600)]',
  challenge: 'text-[var(--color-pink-600)]',
  connect: 'text-[var(--color-blue-600)]',
  default: 'text-[var(--color-purple-500)]',
};

export const Tag: React.FC<TagProps> = ({ topic = 'default', label, className }) => {
  return (
    <span className={cn('tag inline-flex items-center gap-1', className)}>
      <span className="text-[var(--color-gray-400)]">#</span>
      <span className={cn(topicColors[topic])}>{label}</span>
    </span>
  );
};

export default Tag;
