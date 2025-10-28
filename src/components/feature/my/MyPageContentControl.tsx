'use client';

import { useParams } from 'next/navigation';

import MyMeeting from '@/components/feature/my/content/MyMeeting';
import MyCreatedGroup from '@/components/feature/my/content/MyCreatedGroup';
import MyReview from '@/components/feature/my/content/MyReview';

const TAB_VALUES = ['myMeeting', 'myCreated', 'myReview'] as const;
export type TabValue = (typeof TAB_VALUES)[number];

export default function MyPageContentControl() {
  const params = useParams();
  const raw = (params as Record<string, string | string[] | undefined>)?.tab;
  const tab = Array.isArray(raw) ? raw[0] : raw;

  if (!tab || !TAB_VALUES.includes(tab as TabValue)) return null;

  return (
    <div className="flex flex-col gap-6">
      {tab === 'myMeeting' && <MyMeeting />}
      {tab === 'myCreated' && <MyCreatedGroup />}
      {tab === 'myReview' && <MyReview />}
    </div>
  );
}
