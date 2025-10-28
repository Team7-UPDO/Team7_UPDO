'use client';

import { useState } from 'react';

import Category from '@/components/ui/Category';

import MyReviewWritableList from '@/components/feature/my/ui/MyReviewWritableList';
import MyReviewWrittenList from '@/components/feature/my/ui/MyReviewWrittenList';

export default function MyReview() {
  // '작성 가능한 리뷰' / '작성한 리뷰' 토글
  const [reviewFilter, setReviewFilter] = useState<'writable' | 'written'>('writable');

  return (
    <div className="flex w-full flex-col">
      <Category
        mainCategory="리뷰"
        items={[
          { id: 'writable', label: '작성 가능한 리뷰', apiType: 'writable' },
          { id: 'written', label: '작성한 리뷰', apiType: 'written' },
        ]}
        activeId={reviewFilter}
        defaultActiveId="writable"
        onChange={id => setReviewFilter(id as 'writable' | 'written')}
        className="mt-4 mb-3"
        ariaLabel="리뷰 필터"
      />

      {/* 모임 리스트 or 리뷰 리스트 */}
      {reviewFilter === 'writable' ? <MyReviewWritableList /> : <MyReviewWrittenList />}
    </div>
  );
}
