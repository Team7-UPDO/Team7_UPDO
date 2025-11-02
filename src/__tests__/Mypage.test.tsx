import React from 'react';

import { renderWithProviders } from './setup/renderWithProviders';
import { fireEvent } from '@testing-library/react';
import { screen, waitForElementToBeRemoved, waitFor } from '@testing-library/react';

import MyMeeting from '@/components/feature/my/content/MyMeeting';
import MyCreatedGroup from '@/components/feature/my/content/MyCreatedGroup';
import AuthGuard from '@/components/feature/my/AuthGuard';

import { useUserStore } from '@/stores/useUserStore';
import { useAuthStore } from '@/stores/useAuthStore';
import type { UserState } from '@/stores/useUserStore';

import gatheringService from '@/services/gatherings/anonGatheringService';

const mypageSkeleton = 'mypage-skeleton';

// myMeeting 탭용 데이터 (나의 모임)
const mockMyMeetings = [
  {
    id: 1,
    type: 'MINDFULNESS',
    name: '참여한 모임 A',
    dateTime: '2099-11-06T10:00:00Z',
    registrationEnd: '2099-11-06T01:00:00Z',
    location: '건대입구',
    participantCount: 1,
    capacity: 5,
    createdBy: 1504,
    isReviewed: false,
    isCompleted: false,
  },
  {
    id: 2,
    type: 'WORKATION',
    name: '참여한 모임 B',
    dateTime: '2099-11-06T10:00:00Z',
    registrationEnd: '2099-11-06T01:00:00Z',
    location: '강남',
    participantCount: 3,
    capacity: 10,
    createdBy: 888, // 다른 사용자가 만든 모임
    isReviewed: false,
    isCompleted: false,
  },
];

// myCreated 탭용 데이터 (내가 만든 모임)
const mockCreated = [
  {
    id: 3,
    type: 'OFFICE_STRETCHING',
    name: '내가 만든 모임 C',
    dateTime: '2099-11-06T10:00:00Z',
    registrationEnd: '2099-11-06T01:00:00Z',
    location: '판교',
    participantCount: 2,
    capacity: 8,
    createdBy: 1504, // 현재 사용자가 만든 모임
    isReviewed: false,
    isCompleted: false,
  },
];

// 서비스 레이어 모킹
jest.mock('@/services/gatherings/anonGatheringService', () => ({
  getJoinedGatherings: jest.fn(() => {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({
          data: mockMyMeetings,
          nextPage: undefined,
        });
      }, 30);
    });
  }),
  getGatheringInfiniteList: jest.fn((pageParam, params) => {
    // createdBy 필터가 있으면 내가 만든 모임 데이터 반환
    if (params?.createdBy === 1504) {
      return Promise.resolve({
        data: mockCreated,
        nextPage: undefined,
      });
    }
    return Promise.resolve({
      data: [],
      nextPage: undefined,
    });
  }),
}));

const mockRouter = {
  push: jest.fn((path: string) => {
    // 실제 라우팅처럼 JSDOM의 location을 갱신
    window.history.pushState({}, '', path);
  }),
  replace: jest.fn((path: string) => {
    window.history.replaceState({}, '', path);
  }),
};

// Toast hook 모킹: 토스트 DOM을 찾지 않고 호출 인자만 검증하기 위함
const mockShowToast = jest.fn();
jest.mock('@/components/ui/Toast', () => ({
  useToast: () => ({ showToast: mockShowToast }),
}));

jest.mock('next/navigation', () => ({
  useParams: () => ({ tab: 'myMeeting' }),
  useRouter: () => mockRouter,
  useSearchParams: () => new URLSearchParams(),
}));

// framer-motion 모킹
jest.mock('@/components/feature/favorites/FavoriteButton', () => ({
  __esModule: true,
  default: () => null,
}));

// Tab 이동을 위한 Harness 설정
function TabsHarness() {
  const [tab, setTab] = React.useState<'myMeeting' | 'created'>('myMeeting');
  return (
    <div>
      <button data-testid="to-created" onClick={() => setTab('created')}>
        toCreated
      </button>
      <button data-testid="to-meeting" onClick={() => setTab('myMeeting')}>
        toMeeting
      </button>
      {tab === 'myMeeting' ? <MyMeeting /> : <MyCreatedGroup />}
    </div>
  );
}

describe('UI 렌더링 확인 테스트', () => {
  beforeEach(() => {
    // 각 테스트 전에 스토어 초기 상태 설정
    useUserStore.getState().setUser({ id: 1504 } as UserState['user']);
    useAuthStore.getState().setToken('mock-token', 60 * 60 * 1000);
    jest.clearAllMocks();
    mockRouter.push.mockClear();
    mockRouter.replace.mockClear();
  });

  test('MyPage 진입하면 Card에 데이터가 제대로 렌더링되는지 확인', async () => {
    renderWithProviders(<MyMeeting />);

    // 1) 초기 로딩 스켈레톤이 나타난다
    await screen.findByTestId(mypageSkeleton);

    // 2) 로딩이 끝나면 스켈레톤이 사라진다
    await waitForElementToBeRemoved(() => screen.queryByTestId(mypageSkeleton));

    // 3) 카드 타이틀이 잘 렌더링된다 (mock 데이터와 비교)
    expect(await screen.findByText('참여한 모임 A')).toBeInTheDocument();
    expect(await screen.findByText('참여한 모임 B')).toBeInTheDocument();
  });

  test('탭 재진입 시 스켈레톤이 렌더링되지 않는지 확인', async () => {
    renderWithProviders(<TabsHarness />);

    // 1) 첫 진입 시 데이터 로드 완료
    await waitForElementToBeRemoved(() => screen.queryByTestId(mypageSkeleton));
    await screen.findByText('참여한 모임 A');

    // 2) 탭 전환 → 다시 돌아왔을 때 스켈레톤이 안 뜨고 데이터가 바로 보임
    fireEvent.click(screen.getByTestId('to-created'));
    fireEvent.click(screen.getByTestId('to-meeting'));

    expect(screen.queryByTestId(mypageSkeleton)).not.toBeInTheDocument();
    expect(await screen.findByText('참여한 모임 A')).toBeInTheDocument();
  });

  test('나의 모임 탭에서는 버튼이 보이고, 내가 만든 모임 탭에서는 버튼이 보이지 않는지 확인', async () => {
    renderWithProviders(<TabsHarness />);

    // 1) myMeeting 탭: 참여한 모임 데이터 확인
    await waitForElementToBeRemoved(() => screen.queryByTestId(mypageSkeleton));
    expect(await screen.findByText('참여한 모임 A')).toBeInTheDocument();

    // myMeeting 탭에서는 '참여 취소하기' 버튼이 보여야 한다
    const joinButtonsInMeeting = screen.getAllByRole('button', { name: '참여 취소하기' });
    expect(joinButtonsInMeeting.length).toBeGreaterThan(0);

    // 2) myCreated 탭으로 전환: 내가 만든 모임 데이터 확인
    fireEvent.click(screen.getByTestId('to-created'));

    // 스켈레톤 표시 후 데이터 로드
    await waitForElementToBeRemoved(() => screen.queryByTestId(mypageSkeleton));
    expect(await screen.findByText('내가 만든 모임 C')).toBeInTheDocument();

    // myCreated 탭에서는 '참여 취소하기' 버튼이 보이면 안 된다
    expect(screen.queryByRole('button', { name: '참여 취소하기' })).not.toBeInTheDocument();

    // 3) 다시 myMeeting 탭으로 전환: 참여한 모임 데이터가 다시 표시되는지 확인
    fireEvent.click(screen.getByTestId('to-meeting'));

    // 캐시된 데이터가 즉시 표시되어야 함 (스켈레톤 없이)
    expect(screen.queryByTestId(mypageSkeleton)).not.toBeInTheDocument();
    expect(await screen.findByText('참여한 모임 A')).toBeInTheDocument();

    // 다시 myMeeting 탭으로 돌아오면 '참여 취소하기' 버튼이 다시 보여야 한다
    expect(screen.getAllByRole('button', { name: '참여 취소하기' }).length).toBeGreaterThan(0);
  });
});

describe('에러 상태 유효성 검증', () => {
  test('비로그인 접근 시 리다이렉트와 마이페이지 본문은 잘 보이지 않는지 확인', async () => {
    // 1) 비로그인 상태로 스토어 초기화
    useUserStore.getState().setUser(null);
    useAuthStore.getState().logout();

    // 2) 페이지 렌더 (myMeeting 진입 시나리오 & AuthGuard)
    renderWithProviders(
      <AuthGuard>
        <MyMeeting />
      </AuthGuard>,
    );

    // 3) '/'으로 리다이렉트 되었는지 확인
    await waitFor(() => expect(window.location.pathname).toBe('/'));

    // 4) 토스트 호출 확인 (문자열 매칭 및 타입 확인)
    await waitFor(() =>
      expect(mockShowToast).toHaveBeenCalledWith(expect.stringMatching(/로그아웃/), 'error'),
    );

    // 5) 마이페이지 본문이 보이지 않는지 확인
    expect(screen.queryByText('참여한 모임 A')).not.toBeInTheDocument();
  });

  test('빈 데이터일 때 Empty 화면이 잘 렌더링되는지 확인', async () => {
    // 빈 데이터인 경우
    (gatheringService.getJoinedGatherings as jest.Mock).mockResolvedValueOnce({
      data: [],
      nextPage: undefined,
    });

    renderWithProviders(<MyMeeting />);

    // 로딩 스켈레톤이 사라진 뒤, 빈 화면(이미지+문구)이 보여야 함
    await waitForElementToBeRemoved(() => screen.queryByTestId(mypageSkeleton));
    expect(screen.getByAltText('모임 빈화면 이미지')).toBeInTheDocument();
    // 카드 타이틀이 없어야 함
    expect(screen.queryByText('참여한 모임 A')).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: '참여 취소하기' })).not.toBeInTheDocument();
  });
});
