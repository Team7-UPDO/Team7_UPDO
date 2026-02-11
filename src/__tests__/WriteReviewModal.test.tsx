import { act, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import WriteReviewModal from '@/components/feature/review/WriteReviewModal';
import { useToast } from '@/components/ui/Toast';
import { createReview } from '@/services/reviews/reviewService';

import { renderWithProviders } from './setup/renderWithProviders';

// framer-motion mock — 버튼과 div를 순수 HTML로 렌더링
type MotionButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  whileTap?: unknown;
  whileHover?: unknown;
  transition?: unknown;
  onHoverStart?: unknown;
  onHoverEnd?: unknown;
};

type MotionDivProps = React.HTMLAttributes<HTMLDivElement> & {
  initial?: unknown;
  animate?: unknown;
  exit?: unknown;
  transition?: unknown;
};

jest.mock('framer-motion', () => ({
  m: {
    button: ({
      children,
      whileTap,
      whileHover,
      transition,
      onHoverStart,
      onHoverEnd,
      ...props
    }: MotionButtonProps) => <button {...props}>{children}</button>,
    div: ({ children, initial, animate, exit, transition, ...props }: MotionDivProps) => (
      <div {...props}>{children}</div>
    ),
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
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

jest.mock('@/services/reviews/reviewService', () => ({
  __esModule: true,
  createReview: jest.fn(),
}));

const mockedCreateReview = createReview as jest.MockedFunction<typeof createReview>;

// Modal의 Portal을 DOM 내에서 직접 렌더링하도록 mock
jest.mock('react-dom', () => {
  const original = jest.requireActual('react-dom');
  return {
    ...original,
    createPortal: (children: React.ReactNode) => children,
  };
});

function renderModal(overrides?: {
  onSuccess?: () => void;
  onOpenChange?: (open: boolean) => void;
}) {
  const defaultProps = {
    open: true,
    onOpenChange: overrides?.onOpenChange ?? jest.fn(),
    ApiRequestProps: { gatheringId: 1 },
    onSuccess: overrides?.onSuccess,
  };

  return renderWithProviders(<WriteReviewModal {...defaultProps} />);
}

beforeEach(() => {
  mockedCreateReview.mockReset();
  useToast.setState({ message: '', type: 'info', isOpen: false });
});

describe('WriteReviewModal', () => {
  test('초기 상태에서 제목이 표시되고 등록 버튼이 비활성화된다', () => {
    renderModal();

    expect(screen.getByText('리뷰 쓰기')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '등록' })).toBeDisabled();
    expect(screen.getByRole('button', { name: '취소' })).toBeInTheDocument();
  });

  test('별점만 선택하고 리뷰를 입력하지 않으면 등록 버튼이 비활성 상태이다', async () => {
    const user = userEvent.setup();
    renderModal();

    // When: 4점 선택
    await user.click(screen.getByRole('radio', { name: '4점 평가' }));

    // Then: 등록 버튼은 여전히 비활성 (comment가 비어있으므로)
    expect(screen.getByRole('button', { name: '등록' })).toBeDisabled();
  });

  test('별점과 리뷰를 모두 입력하면 등록 버튼이 활성화된다', async () => {
    const user = userEvent.setup();
    renderModal();

    // When: 4점 선택 + 리뷰 입력
    await user.click(screen.getByRole('radio', { name: '4점 평가' }));
    await user.type(screen.getByLabelText('경험에 대해 남겨주세요.'), '좋은 모임이었습니다');

    // Then: 등록 버튼 활성화
    await waitFor(() => {
      expect(screen.getByRole('button', { name: '등록' })).toBeEnabled();
    });
  });

  test('폼 제출 성공 시 createReview가 호출되고 성공 Toast가 표시된다', async () => {
    const user = userEvent.setup();
    const onSuccess = jest.fn();
    mockedCreateReview.mockResolvedValue(undefined as never);

    renderModal({ onSuccess });

    // When: 별점 + 리뷰 입력 후 등록
    await user.click(screen.getByRole('radio', { name: '4점 평가' }));
    await user.type(screen.getByLabelText('경험에 대해 남겨주세요.'), '좋은 모임이었습니다');

    await waitFor(() => {
      expect(screen.getByRole('button', { name: '등록' })).toBeEnabled();
    });

    await user.click(screen.getByRole('button', { name: '등록' }));

    // Then: API 호출 확인
    await waitFor(() => {
      expect(mockedCreateReview).toHaveBeenCalledWith({
        gatheringId: 1,
        score: 4,
        comment: '좋은 모임이었습니다',
      });
    });

    // And: 성공 Toast 및 onSuccess 콜백
    await waitFor(() => {
      expect(useToast.getState().message).toBe('리뷰가 성공적으로 등록되었습니다');
      expect(onSuccess).toHaveBeenCalled();
    });
  });

  test('제출 중에는 등록 버튼이 "등록 중…"으로 표시되고 비활성화된다', async () => {
    const user = userEvent.setup();
    // API 응답을 지연시킴
    let resolveApi: () => void;
    mockedCreateReview.mockImplementation(
      () =>
        new Promise<never>(resolve => {
          resolveApi = resolve as () => void;
        }),
    );

    renderModal();

    await user.click(screen.getByRole('radio', { name: '4점 평가' }));
    await user.type(screen.getByLabelText('경험에 대해 남겨주세요.'), '좋은 모임이었습니다');

    await waitFor(() => {
      expect(screen.getByRole('button', { name: '등록' })).toBeEnabled();
    });

    await user.click(screen.getByRole('button', { name: '등록' }));

    // Then: 로딩 상태 확인
    await waitFor(() => {
      expect(screen.getByRole('button', { name: '등록 중…' })).toBeDisabled();
    });

    // cleanup: act로 감싸서 상태 업데이트를 flush
    await act(async () => {
      resolveApi!();
    });
  });

  test('제출 실패 시 에러 Toast가 표시된다', async () => {
    const user = userEvent.setup();
    mockedCreateReview.mockRejectedValue(new Error(''));

    renderModal();

    await user.click(screen.getByRole('radio', { name: '4점 평가' }));
    await user.type(screen.getByLabelText('경험에 대해 남겨주세요.'), '좋은 모임이었습니다');

    await waitFor(() => {
      expect(screen.getByRole('button', { name: '등록' })).toBeEnabled();
    });

    await user.click(screen.getByRole('button', { name: '등록' }));

    // Then: 에러 Toast 표시
    await waitFor(() => {
      expect(useToast.getState().message).toBe('리뷰 등록 중 오류가 발생했습니다.');
      expect(useToast.getState().type).toBe('error');
    });
  });

  test('취소 버튼을 클릭하면 모달이 닫힌다', async () => {
    const user = userEvent.setup();
    const onOpenChange = jest.fn();

    renderModal({ onOpenChange });

    // When: 취소 버튼 클릭
    await user.click(screen.getByRole('button', { name: '취소' }));

    // Then: onOpenChange(false) 호출
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});
