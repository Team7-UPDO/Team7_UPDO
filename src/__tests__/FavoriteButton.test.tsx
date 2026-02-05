import { screen } from '@testing-library/react';
import { act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import FavoriteButton from '@/components/feature/favorites/FavoriteButton';
import { useFavoriteStore } from '@/stores/useFavoriteStore';
import { useUserStore } from '@/stores/useUserStore';
import type { IUser } from '@/types/auths';

import { renderWithProviders } from './setup/renderWithProviders';

type MotionButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  whileTap?: unknown;
  whileHover?: unknown;
  transition?: unknown;
};

type MotionDivProps = React.HTMLAttributes<HTMLDivElement> & {
  initial?: unknown;
  animate?: unknown;
  exit?: unknown;
  transition?: unknown;
};

jest.mock('framer-motion', () => ({
  m: {
    button: ({ children, whileTap, whileHover, transition, ...props }: MotionButtonProps) => (
      <button {...props}>{children}</button>
    ),
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

const mockUser = (id: number, name: string): IUser => ({
  id,
  name,
  email: `${name.toLowerCase()}@test.com`,
  companyName: 'Test Co',
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
});

beforeEach(() => {
  localStorage.clear();
  act(() => {
    useFavoriteStore.setState({ favorites: {}, _hasHydrated: false });
    useUserStore.setState({ user: null });
  });
});

describe('FavoriteButton', () => {
  test('하이드레이션 전에는 찜 버튼이 렌더링되지만 pressed 상태는 false이다', () => {
    // Given: 하이드레이션이 아직 완료되지 않은 상태
    renderWithProviders(<FavoriteButton itemId={1} />);

    // Then: 버튼이 렌더링되고 pressed=false
    const button = screen.getByLabelText('찜하기');
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute('aria-pressed', 'false');
  });

  test('하이드레이션 후 미찜 상태에서 pressed=false이다', () => {
    // Given: 하이드레이션이 완료되고 유저가 로그인한 상태
    act(() => {
      useUserStore.setState({ user: mockUser(1, 'User') });
      useFavoriteStore.setState({ _hasHydrated: true, favorites: {} });
    });

    renderWithProviders(<FavoriteButton itemId={1} />);

    // Then: pressed=false
    const button = screen.getByLabelText('찜하기');
    expect(button).toHaveAttribute('aria-pressed', 'false');
  });

  test('클릭하면 찜 상태가 토글된다', async () => {
    // Given: 하이드레이션 완료, 유저 로그인
    const user = userEvent.setup();
    act(() => {
      useUserStore.setState({ user: mockUser(1, 'User') });
      useFavoriteStore.setState({ _hasHydrated: true, favorites: {} });
    });

    renderWithProviders(<FavoriteButton itemId={42} />);

    // When: 찜 버튼 클릭
    const button = screen.getByLabelText('찜하기');
    await user.click(button);

    // Then: Store에서 찜 상태가 true
    expect(useFavoriteStore.getState().isFavorite(42)).toBe(true);
  });

  test('찜된 상태에서 다시 클릭하면 찜이 해제된다', async () => {
    // Given: 하이드레이션 완료, 유저 로그인
    const user = userEvent.setup();
    act(() => {
      useUserStore.setState({ user: mockUser(1, 'User') });
      useFavoriteStore.setState({ _hasHydrated: true, favorites: {} });
    });

    renderWithProviders(<FavoriteButton itemId={42} />);

    // When: 첫 번째 클릭으로 찜 추가
    await user.click(screen.getByLabelText('찜하기'));
    expect(useFavoriteStore.getState().isFavorite(42)).toBe(true);

    // And: 두 번째 클릭으로 찜 해제
    await user.click(screen.getByLabelText('찜하기'));

    // Then: Store에서 찜 상태가 false
    expect(useFavoriteStore.getState().isFavorite(42)).toBe(false);
  });

  test('onToggle 콜백이 올바른 boolean 값으로 호출된다', async () => {
    // Given: onToggle 콜백과 함께 렌더링
    const onToggle = jest.fn();
    const user = userEvent.setup();
    act(() => {
      useUserStore.setState({ user: mockUser(1, 'User') });
      useFavoriteStore.setState({ _hasHydrated: true, favorites: {} });
    });

    renderWithProviders(<FavoriteButton itemId={42} onToggle={onToggle} />);

    // When: 찜 버튼 클릭 (미찜 → 찜)
    await user.click(screen.getByLabelText('찜하기'));

    // Then: onToggle(true) 호출
    expect(onToggle).toHaveBeenCalledWith(true);
  });
});
