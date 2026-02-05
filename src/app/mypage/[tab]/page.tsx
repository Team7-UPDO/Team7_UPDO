import { redirect } from 'next/navigation';

import MyCreatedGroup from '@/components/feature/my/content/MyCreatedGroup';
import MyMeeting from '@/components/feature/my/content/MyMeeting';
import MyReview from '@/components/feature/my/content/MyReview';

const TAB_VALUES = ['myMeeting', 'myCreated', 'myReview'] as const;
type TabValue = (typeof TAB_VALUES)[number];

function isValidTab(tab: string): tab is TabValue {
  return TAB_VALUES.includes(tab as TabValue);
}

const TAB_LABELS: Record<TabValue, string> = {
  myMeeting: '참여한 모임',
  myCreated: '생성한 모임',
  myReview: '작성한 리뷰',
};

export default async function MyPageTabPage({ params }: { params: Promise<{ tab: string }> }) {
  const { tab } = await params;

  if (!isValidTab(tab)) redirect('/mypage/myMeeting');

  return (
    <div className="flex flex-col gap-6" role="tabpanel" aria-label={TAB_LABELS[tab]}>
      {tab === 'myMeeting' && <MyMeeting />}
      {tab === 'myCreated' && <MyCreatedGroup />}
      {tab === 'myReview' && <MyReview />}
    </div>
  );
}
