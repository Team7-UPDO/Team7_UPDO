'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

import Tab from '@/components/ui/Tab';
import MyPageContentControl from '@/components/feature/my/MyPageContentControl';

const TAB_VALUES = ['myMeeting', 'myCreated', 'myReview'] as const;
export type TabValue = (typeof TAB_VALUES)[number];

export default function MyPageContentPane() {
  const params = useParams();
  const router = useRouter();

  const raw = (params as Record<string, string | string[] | undefined>)?.tab;
  const tab = Array.isArray(raw) ? raw[0] : raw;

  const tabItems = [
    { label: '나의 모임', value: 'myMeeting' },
    { label: '나의 리뷰', value: 'myReview' },
    { label: '내가 만든 모임', value: 'myCreated' },
  ];

  // 잘못된 세그먼트나 누락 시 기본 탭으로 리다이렉트
  useEffect(() => {
    if (!tab || !TAB_VALUES.includes(tab as TabValue)) {
      router.replace('/mypage/myMeeting');
    }
  }, [tab, router]);

  if (!tab || !TAB_VALUES.includes(tab as TabValue)) return null;

  return (
    <div className="flex flex-col gap-6">
      <Tab
        key={1}
        items={tabItems}
        value={tab ?? 'myMeeting'}
        onChange={val => router.push(`/mypage/${val}`)}
      />
      <div>
        <MyPageContentControl />
      </div>
    </div>
  );
}
