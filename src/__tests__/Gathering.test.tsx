import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import GatheringSection from '@/components/feature/gathering/GatheringSection';
import { getGatheringInfiniteList } from '@/services/gatherings/anonGatheringService';
import { normalizeFilters } from '@/utils/filters';

import { createGathering } from './factories/gathering';
import { renderWithProviders } from './setup/renderWithProviders';

jest.mock('react-intersection-observer', () => ({
  useInView: () => ({
    ref: jest.fn(),
    inView: false,
  }),
}));

type MotionDivProps = React.HTMLAttributes<HTMLDivElement> & {
  initial?: unknown;
  whileInView?: unknown;
  transition?: unknown;
  viewport?: unknown;
  animate?: unknown;
  exit?: unknown;
};

jest.mock('framer-motion', () => ({
  m: {
    div: ({ children, ...rest }: MotionDivProps) => {
      const { initial, whileInView, transition, viewport, animate, exit, ...cleanProps } = rest;
      return <div {...cleanProps}>{children}</div>;
    },
  },
}));

jest.mock('@/services/httpClient', () => ({
  __esModule: true,
  default: {
    getInstance: jest.fn(() => ({
      get: jest.fn(),
      post: jest.fn(),
      put: jest.fn(),
      delete: jest.fn(),
    })),
  },
}));

jest.mock('@/components/feature/group/GroupFilters', () => ({
  __esModule: true,
  default: () => null,
}));

jest.mock('@/components/feature/gathering/CreateGatheringButton', () => ({
  __esModule: true,
  default: () => null,
}));

jest.mock('@/components/feature/group/GroupCard', () => ({
  __esModule: true,
  default: ({ data }: { data: { name: string } }) => <div>{data.name}</div>,
}));

jest.mock('@/components/feature/favorites/FavoriteButton', () => ({
  __esModule: true,
  default: () => null,
}));

jest.mock('@/services/gatherings/anonGatheringService', () => ({
  __esModule: true,
  getGatheringInfiniteList: jest.fn(),
}));

const mockedGetGatheringInfiniteList = getGatheringInfiniteList as jest.MockedFunction<
  typeof getGatheringInfiniteList
>;

const defaultFilters = normalizeFilters({ main: '성장' });

const growthGatherings = [
  createGathering({
    id: 1,
    type: 'MINDFULNESS',
    name: '성장 모임 A',
    location: '건대입구',
    participantCount: 3,
    capacity: 10,
    createdBy: 100,
  }),
  createGathering({
    id: 2,
    type: 'OFFICE_STRETCHING',
    name: '성장 모임 B',
    location: '을지로3가',
    participantCount: 5,
    capacity: 12,
    createdBy: 101,
  }),
];

const networkingGatherings = [
  createGathering({
    id: 99,
    type: 'WORKATION',
    name: '네트워킹 모임 A',
    location: '홍대입구',
    participantCount: 4,
    capacity: 15,
    createdBy: 200,
  }),
];

function renderGatheringSection() {
  return renderWithProviders(<GatheringSection defaultFilters={defaultFilters} />);
}

beforeAll(() => {
  class ResizeObserverMock {
    observe() {}
    unobserve() {}
    disconnect() {}
  }

  Object.defineProperty(globalThis, 'ResizeObserver', {
    writable: true,
    value: ResizeObserverMock,
  });
});

beforeEach(() => {
  mockedGetGatheringInfiniteList.mockImplementation(async (_page, params) => {
    const isNetworking = params && 'type' in params && params.type === 'WORKATION';
    const response = isNetworking ? networkingGatherings : growthGatherings;
    return {
      data: response,
      nextPage: undefined,
    };
  });
});

afterEach(() => {
  jest.clearAllMocks();
});

describe('UI 렌더링 확인', () => {
  test('성장 탭으로 진입하면 로딩 후 성장 모임 목록이 표시된다', async () => {
    // Given: 성장 모임 데이터가 준비되어 있고
    renderGatheringSection();

    // Then: 데이터 로딩 완료 후 모임 목록이 렌더링된다
    expect(await screen.findByText('성장 모임 A')).toBeInTheDocument();
    expect(screen.getByText('성장 모임 B')).toBeInTheDocument();
  });

  test('캐싱된 탭으로 재진입하면 스켈레톤 없이 즉시 데이터가 표시된다', async () => {
    // Given: 성장 탭 데이터가 이미 로드되어 있고
    renderGatheringSection();

    expect(await screen.findByText('성장 모임 A')).toBeInTheDocument();

    // When: 네트워킹 탭으로 이동했다가
    const user = userEvent.setup();
    await user.click(screen.getByRole('tab', { name: '네트워킹' }));

    expect(await screen.findByText('네트워킹 모임 A')).toBeInTheDocument();
    expect(screen.queryByText('성장 모임 A')).not.toBeInTheDocument();

    // Then: 성장 탭으로 다시 돌아오면 스켈레톤 없이 즉시 표시된다
    await user.click(screen.getByRole('tab', { name: '성장' }));

    await waitFor(() => {
      expect(screen.getByText('성장 모임 A')).toBeInTheDocument();
      expect(screen.queryByTestId('group-card-skeleton')).not.toBeInTheDocument();
    });
  });
});

describe('빈 데이터 및 에러 상태', () => {
  test('모임이 없을 때 빈 상태 메시지가 표시된다', async () => {
    // Given: API가 빈 배열을 반환하도록 설정하고
    mockedGetGatheringInfiniteList.mockResolvedValue({
      data: [],
      nextPage: undefined,
    });

    // When: 컴포넌트를 렌더링하면
    renderGatheringSection();

    // Then: 빈 상태 메시지가 표시된다
    expect(await screen.findByText('현재 등록된 모임이 없습니다.')).toBeInTheDocument();
  });

  test('탭을 전환해도 데이터가 없으면 빈 상태가 유지된다', async () => {
    // Given: 모든 탭에서 빈 데이터를 반환하도록 설정하고
    mockedGetGatheringInfiniteList.mockResolvedValue({
      data: [],
      nextPage: undefined,
    });

    const user = userEvent.setup();
    renderGatheringSection();

    // When: 성장 탭에서 빈 상태를 확인하고
    expect(await screen.findByText('현재 등록된 모임이 없습니다.')).toBeInTheDocument();

    // Then: 네트워킹 탭으로 전환해도 빈 상태가 표시된다
    await user.click(screen.getByRole('tab', { name: '네트워킹' }));

    await waitFor(() =>
      expect(screen.getByText('현재 등록된 모임이 없습니다.')).toBeInTheDocument(),
    );
  });

  test('API 호출 실패 시 에러 메시지와 재시도 버튼이 표시된다', async () => {
    // Given: API가 에러를 반환하도록 설정하고
    mockedGetGatheringInfiniteList.mockRejectedValue(new Error('Network error'));

    // When: 컴포넌트를 렌더링하면
    renderGatheringSection();

    // Then: 에러 메시지와 재시도 버튼이 표시된다
    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
      expect(screen.getByText('데이터를 불러오는 중 오류가 발생했습니다.')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: '다시 시도' })).toBeInTheDocument();
    });
  });
});

describe('사용자 상호작용', () => {
  test('여러 탭을 연속으로 전환해도 올바른 데이터가 표시된다', async () => {
    // Given: 사용자가 탭을 빠르게 전환하는 시나리오
    const user = userEvent.setup();
    renderGatheringSection();

    await waitFor(() => expect(screen.getByText('성장 모임 A')).toBeInTheDocument());

    // When: 네트워킹 → 성장 → 네트워킹 순으로 빠르게 전환
    await user.click(screen.getByRole('tab', { name: '네트워킹' }));
    await waitFor(() => expect(screen.getByText('네트워킹 모임 A')).toBeInTheDocument());

    await user.click(screen.getByRole('tab', { name: '성장' }));
    await waitFor(() => expect(screen.getByText('성장 모임 A')).toBeInTheDocument());

    await user.click(screen.getByRole('tab', { name: '네트워킹' }));

    // Then: 마지막 선택한 탭의 데이터가 올바르게 표시된다
    await waitFor(() => {
      expect(screen.getByText('네트워킹 모임 A')).toBeInTheDocument();
      expect(screen.queryByText('성장 모임 A')).not.toBeInTheDocument();
    });
  });
});
