import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { renderWithProviders } from './setup/renderWithProviders';

import GroupFilters from '@/components/feature/group/GroupFilters';
import { useGroupFilters } from '@/hooks/domain/useGroupFilters';

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

// Calendar 내부에서 사용하는 dayjs 의존성 이슈 방지를 위해 간소화 mock
jest.mock('@/components/ui/Calendar', () => ({
  __esModule: true,
  Calendar: ({
    onConfirm,
    onCancel,
  }: {
    onConfirm?: (date?: Date) => void;
    onCancel?: () => void;
  }) => (
    <div data-testid="calendar-mock">
      <button type="button" onClick={() => onConfirm?.(new Date(2025, 5, 15))}>
        날짜 선택
      </button>
      <button type="button" onClick={() => onCancel?.()}>
        초기화
      </button>
    </div>
  ),
}));

// useGroupFilters 훅과 GroupFilters를 통합 렌더링하는 래퍼
function TestGroupFilters() {
  const {
    filters: _filters,
    handleMainChange: _handleMainChange,
    selectedReviewFilter: _selectedReviewFilter,
    handleReviewFilterSelect: _handleReviewFilterSelect,
    ...filterProps
  } = useGroupFilters('gathering');

  return <GroupFilters {...filterProps} />;
}

function renderGroupFilters() {
  return renderWithProviders(<TestGroupFilters />);
}

describe('GroupFilters', () => {
  test('초기 렌더링 시 기본값이 표시된다', () => {
    renderGroupFilters();

    // 태그 기본값: "태그 전체"
    expect(screen.getByText('태그 전체')).toBeInTheDocument();
    // 정렬 기본값: "마감 여유순"
    expect(screen.getByText('마감 여유순')).toBeInTheDocument();
    // 날짜 기본값: "날짜 전체"
    expect(screen.getByText('날짜 전체')).toBeInTheDocument();
  });

  test('태그 버튼을 클릭하면 드롭다운이 열리고 옵션이 표시된다', async () => {
    const user = userEvent.setup();
    renderGroupFilters();

    // When: 태그 버튼 클릭
    await user.click(screen.getByText('태그 전체'));

    // Then: 드롭다운 옵션이 표시된다
    expect(screen.getByRole('option', { name: '성장' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: '배움' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: '도전' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: '연결' })).toBeInTheDocument();
  });

  test('태그 옵션을 선택하면 버튼 텍스트가 변경된다', async () => {
    const user = userEvent.setup();
    renderGroupFilters();

    // When: 태그 드롭다운 열고 "성장" 선택
    await user.click(screen.getByText('태그 전체'));
    await user.click(screen.getByRole('option', { name: '성장' }));

    // Then: 버튼 텍스트가 "성장"으로 변경
    await waitFor(() => {
      expect(screen.getByText('성장')).toBeInTheDocument();
      expect(screen.queryByText('태그 전체')).not.toBeInTheDocument();
    });
  });

  test('정렬 옵션을 선택하면 정렬 텍스트가 변경된다', async () => {
    const user = userEvent.setup();
    renderGroupFilters();

    // When: 정렬 드롭다운 열고 "마감 임박순" 선택
    await user.click(screen.getByText('마감 여유순'));
    await user.click(screen.getByRole('option', { name: '마감 임박순' }));

    // Then: 정렬 텍스트가 변경
    await waitFor(() => {
      expect(screen.getByText('마감 임박순')).toBeInTheDocument();
    });
  });

  test('캘린더에서 날짜를 선택하면 날짜 텍스트가 변경된다', async () => {
    const user = userEvent.setup();
    renderGroupFilters();

    // When: 날짜 버튼 클릭하여 캘린더 열기
    await user.click(screen.getByText('날짜 전체'));

    // Then: 캘린더가 표시됨
    expect(screen.getByTestId('calendar-mock')).toBeInTheDocument();

    // When: 날짜 선택 (mock에서 2025-06-15 반환)
    await user.click(screen.getByText('날짜 선택'));

    // Then: "날짜 전체"가 사라지고 날짜가 표시됨
    await waitFor(() => {
      expect(screen.queryByText('날짜 전체')).not.toBeInTheDocument();
    });
  });

  test('성장 탭에서는 카테고리(전체, 스킬업, 챌린지) 버튼이 표시된다', () => {
    // Given: 기본 activeMain='성장'
    renderGroupFilters();

    // Then: Category 탭이 표시된다
    expect(screen.getByRole('tab', { name: '전체' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: '스킬업' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: '챌린지' })).toBeInTheDocument();
  });
});
