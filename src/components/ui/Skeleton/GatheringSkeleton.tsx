'use client';

import React from 'react';

import GroupCardSkeleton from '@/components/ui/Skeleton/GroupCardSkeleton';

export default function GatheringSkeleton() {
  return (
    <section aria-label="모임 목록 로딩 중" className="mt-6 animate-pulse">
      <div className="mb-4 flex justify-start gap-3 sm:mb-6">
        <div className="h-8 w-20 rounded-lg bg-gray-50" />
        <div className="h-8 w-20 rounded-lg bg-gray-50" />
      </div>

      <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-3">
          <div className="h-6 w-24 rounded-md bg-gray-50" />
          <div className="h-6 w-24 rounded-md bg-gray-50" />
          <div className="h-6 w-24 rounded-md bg-gray-50" />
        </div>
        <div className="h-6 w-20 rounded-md bg-gray-50 sm:ml-auto" />
      </div>

      <div className="mx-auto mb-8 flex flex-col gap-6 md:grid md:grid-cols-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <GroupCardSkeleton key={i} />
        ))}
      </div>
    </section>
  );
}
