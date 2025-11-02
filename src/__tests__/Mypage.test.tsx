import React from 'react';

import { renderWithProviders } from './setup/renderWithProviders';
import { fireEvent } from '@testing-library/react';
import { screen, waitForElementToBeRemoved } from '@testing-library/react';

import MyMeeting from '@/components/feature/my/content/MyMeeting';
import MyCreatedGroup from '@/components/feature/my/content/MyCreatedGroup';

import { useUserStore } from '@/stores/useUserStore';
import { useAuthStore } from '@/stores/useAuthStore';

import type { UserState } from '@/stores/useUserStore';

import * as anonGatheringService from '@/services/gatherings/anonGatheringService';

// myMeeting 탭용 데이터 (참여한 모임)
const mockJoinedMeetings = [
  {
    id: 1,
    type: 'MINDFULNESS',
    name: '참여한 모임 A',
    dateTime: '2025-11-05T10:00:00Z',
    registrationEnd: '2025-11-05T01:00:00Z',
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
    dateTime: '2025-11-05T10:00:00Z',
    registrationEnd: '2025-11-05T01:00:00Z',
    location: '강남',
    participantCount: 3,
    capacity: 10,
    createdBy: 888, // 다른 사용자가 만든 모임
    isReviewed: false,
    isCompleted: false,
  },
];

// myCreated 탭용 데이터 (내가 만든 모임)
const mockCreatedMeetings = [
  {
    id: 3,
    type: 'OFFICE_STRETCHING',
    name: '내가 만든 모임 C',
    dateTime: '2025-11-06T10:00:00Z',
    registrationEnd: '2025-11-06T01:00:00Z',
    location: '판교',
    participantCount: 2,
    capacity: 8,
    createdBy: 1504, // 현재 사용자가 만든 모임
    isReviewed: false,
    isCompleted: false,
  },
  {
    id: 4,
    type: 'DALLAEMFIT',
    name: '내가 만든 모임 D',
    dateTime: '2025-11-07T10:00:00Z',
    registrationEnd: '2025-11-07T01:00:00Z',
    location: '홍대',
    participantCount: 5,
    capacity: 12,
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
          data: mockJoinedMeetings,
          nextPage: undefined,
        });
      }, 30);
    });
  }),
  getGatheringInfiniteList: jest.fn((pageParam, params) => {
    // createdBy 필터가 있으면 내가 만든 모임 데이터 반환
    if (params?.createdBy === 1504) {
      return Promise.resolve({
        data: mockCreatedMeetings,
        nextPage: undefined,
      });
    }
    return Promise.resolve({
      data: [],
      nextPage: undefined,
    });
  }),
}));

jest.mock('next/navigation', () => ({
  useParams: () => ({ tab: 'myMeeting' }),
  useRouter: () => ({ push: jest.fn(), replace: jest.fn(), prefetch: jest.fn() }),
  useSearchParams: () => new URLSearchParams(),
}));

// framer-motion 모킹
jest.mock('@/components/feature/favorites/FavoriteButton', () => ({
  __esModule: true,
  default: () => null,
}));

// authService 모킹 (useUserStore의 fetchMe에서 사용)
jest.mock('@/services/auths/authService', () => ({
  authService: {
    getUser: jest.fn(),
  },
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
  });

  test('MyPage 진입하면 Card에 데이터가 제대로 렌더링되는지 확인', async () => {
    renderWithProviders(<MyMeeting />);

    // 1) 초기 로딩 스켈레톤이 나타난다
    await screen.findByTestId('mypage-skeleton');

    // 2) 로딩이 끝나면 스켈레톤이 사라진다
    await waitForElementToBeRemoved(() => screen.queryByTestId('mypage-skeleton'));

    // 3) 카드 타이틀이 잘 렌더링된다 (mock 데이터와 비교)
    expect(await screen.findByText('참여한 모임 A')).toBeInTheDocument();
    expect(await screen.findByText('참여한 모임 B')).toBeInTheDocument();
  });

  test('탭 전환하면 Card에 데이터가 캐시로 즉시 렌더링되고 추가 호출이 발생하지 않는다', async () => {
    renderWithProviders(<TabsHarness />);

    // 첫 번째 진입에서 데이터 로드 완료될 때까지 대기 (캐시 생성)
    await waitForElementToBeRemoved(() => screen.queryByTestId('mypage-skeleton'));
    await screen.findByText('참여한 모임 A');

    // 첫 번째 호출 확인
    expect(anonGatheringService.getJoinedGatherings).toHaveBeenCalledTimes(1);

    // 2) 다른 탭으로 전환 (언마운트 시뮬레이션)
    fireEvent.click(screen.getByTestId('to-created'));
    expect(screen.queryByText('참여한 모임 A')).not.toBeInTheDocument();

    // 3) 다시 myMeeting으로 전환 → 캐시로 즉시 렌더되어야 함
    fireEvent.click(screen.getByTestId('to-meeting'));

    // 스켈레톤이 다시 나타나지 않고 즉시 데이터가 보여야 함
    expect(screen.queryByTestId('mypage-skeleton')).not.toBeInTheDocument();
    expect(await screen.findByText('참여한 모임 A')).toBeInTheDocument();
    expect(await screen.findByText('참여한 모임 B')).toBeInTheDocument();

    // 추가 호출이 없는지 확인 (여전히 1회)
    expect(anonGatheringService.getJoinedGatherings).toHaveBeenCalledTimes(1);
  });

  test('탭 전환 시 각 탭에 맞는 데이터가 올바르게 표시된다', async () => {
    renderWithProviders(<TabsHarness />);

    // 1) myMeeting 탭: 참여한 모임 데이터 확인
    await waitForElementToBeRemoved(() => screen.queryByTestId('mypage-skeleton'));
    expect(await screen.findByText('참여한 모임 A')).toBeInTheDocument();
    expect(await screen.findByText('참여한 모임 B')).toBeInTheDocument();
    expect(screen.queryByText('내가 만든 모임 C')).not.toBeInTheDocument();
    expect(screen.queryByText('내가 만든 모임 D')).not.toBeInTheDocument();

    // getJoinedGatherings가 호출되었는지 확인
    expect(anonGatheringService.getJoinedGatherings).toHaveBeenCalled();

    // 2) myCreated 탭으로 전환: 내가 만든 모임 데이터 확인
    fireEvent.click(screen.getByTestId('to-created'));

    // 스켈레톤 표시 후 데이터 로드
    await waitForElementToBeRemoved(() => screen.queryByTestId('mypage-skeleton'));
    expect(await screen.findByText('내가 만든 모임 C')).toBeInTheDocument();
    expect(await screen.findByText('내가 만든 모임 D')).toBeInTheDocument();
    expect(screen.queryByText('참여한 모임 A')).not.toBeInTheDocument();
    expect(screen.queryByText('참여한 모임 B')).not.toBeInTheDocument();

    // getGatheringInfiniteList가 createdBy 필터와 함께 호출되었는지 확인
    expect(anonGatheringService.getGatheringInfiniteList).toHaveBeenCalledWith(1, {
      createdBy: 1504,
      sortBy: 'dateTime',
      sortOrder: 'asc',
    });

    // 3) 다시 myMeeting 탭으로 전환: 참여한 모임 데이터가 다시 표시되는지 확인
    fireEvent.click(screen.getByTestId('to-meeting'));

    // 캐시된 데이터가 즉시 표시되어야 함 (스켈레톤 없이)
    expect(screen.queryByTestId('mypage-skeleton')).not.toBeInTheDocument();
    expect(await screen.findByText('참여한 모임 A')).toBeInTheDocument();
    expect(await screen.findByText('참여한 모임 B')).toBeInTheDocument();
    expect(screen.queryByText('내가 만든 모임 C')).not.toBeInTheDocument();
    expect(screen.queryByText('내가 만든 모임 D')).not.toBeInTheDocument();
  });
});

describe('에러 상태 유효성 검증', () => {
  // - Given : 비로그인 상태에서 /mypage/myMeeting 진입
  // - When : 페이지 렌더
  // - Then : toast가 ‘로그인이 필요한 서비스입니다’가 뜨고, / 페이지로 리다이렉트되고, 마이페이지 본문은 보이지 않는지
  test('비로그인 접근 시 리다이렉트와 마이페이지 본문은 잘 보이지 않는지 확인, ', () => {});

  // - Given : 나의 모임/나의 리뷰/ 내가 만든 모임 각각 mockingData가 0개일 때
  // - When : 탭 별로 진입하면
  // - Then : 스켈레톤 대신 정확한 빈 화면 이미지와 안내 문구가 뜨는지
  test('빈 데이터일 때 Empty 화면이 잘 렌더링되는지 확인', () => {});
});
