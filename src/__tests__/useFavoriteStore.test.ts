import { act } from '@testing-library/react';

import { useFavoriteStore } from '@/stores/useFavoriteStore';
import { useUserStore } from '@/stores/useUserStore';
import type { IUser } from '@/types/auths';

// useUserStore의 user 상태를 제어하기 위한 헬퍼
const mockUser = (id: number, name: string): IUser => ({
  id,
  name,
  email: `${name.toLowerCase()}@test.com`,
  companyName: 'Test Co',
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
});

function setMockUser(user: IUser | null) {
  useUserStore.setState({ user });
}

beforeEach(() => {
  localStorage.clear();

  // Store 초기화
  act(() => {
    useFavoriteStore.setState({ favorites: {}, _hasHydrated: false });
    useUserStore.setState({ user: null });
  });
});

// toggleFavorite
describe('toggleFavorite', () => {
  it('새로운 id를 추가한다', () => {
    setMockUser(mockUser(1, 'User'));

    act(() => {
      useFavoriteStore.getState().toggleFavorite(100);
    });

    expect(useFavoriteStore.getState().isFavorite(100)).toBe(true);
  });

  it('이미 있는 id를 제거한다', () => {
    setMockUser(mockUser(1, 'User'));

    act(() => {
      useFavoriteStore.getState().toggleFavorite(100);
    });
    expect(useFavoriteStore.getState().isFavorite(100)).toBe(true);

    act(() => {
      useFavoriteStore.getState().toggleFavorite(100);
    });
    expect(useFavoriteStore.getState().isFavorite(100)).toBe(false);
  });
});

// removeFavorite
describe('removeFavorite', () => {
  it('존재하는 id를 제거한다', () => {
    setMockUser(mockUser(1, 'User'));

    act(() => {
      useFavoriteStore.getState().toggleFavorite(100);
    });

    act(() => {
      useFavoriteStore.getState().removeFavorite(100);
    });

    expect(useFavoriteStore.getState().isFavorite(100)).toBe(false);
  });

  it('존재하지 않는 id를 제거해도 상태가 변하지 않는다', () => {
    setMockUser(mockUser(1, 'User'));

    act(() => {
      useFavoriteStore.getState().toggleFavorite(100);
    });

    const before = useFavoriteStore.getState().favorites;

    act(() => {
      useFavoriteStore.getState().removeFavorite(999);
    });

    const after = useFavoriteStore.getState().favorites;
    expect(after).toEqual(before);
  });
});

// isFavorite
describe('isFavorite', () => {
  it('포함된 id는 true를 반환한다', () => {
    setMockUser(mockUser(1, 'User'));

    act(() => {
      useFavoriteStore.getState().toggleFavorite(100);
    });

    expect(useFavoriteStore.getState().isFavorite(100)).toBe(true);
  });

  it('미포함 id는 false를 반환한다', () => {
    setMockUser(mockUser(1, 'User'));
    expect(useFavoriteStore.getState().isFavorite(999)).toBe(false);
  });
});

// 멀티유저
describe('멀티유저', () => {
  it('유저별로 독립적인 즐겨찾기 목록을 유지한다', () => {
    // User 1이 추가
    setMockUser(mockUser(1, 'User1'));
    act(() => {
      useFavoriteStore.getState().toggleFavorite(100);
    });

    // User 2가 다른 것을 추가
    setMockUser(mockUser(2, 'User2'));
    act(() => {
      useFavoriteStore.getState().toggleFavorite(200);
    });

    // User 2는 100을 가지고 있지 않다
    expect(useFavoriteStore.getState().isFavorite(100)).toBe(false);
    expect(useFavoriteStore.getState().isFavorite(200)).toBe(true);

    // User 1로 돌아오면 100이 여전히 있다
    setMockUser(mockUser(1, 'User1'));
    expect(useFavoriteStore.getState().isFavorite(100)).toBe(true);
    expect(useFavoriteStore.getState().isFavorite(200)).toBe(false);
  });
});

// guest 상태
describe('guest 상태', () => {
  it('비로그인 상태에서 guest 키로 저장된다', () => {
    setMockUser(null); // 비로그인

    act(() => {
      useFavoriteStore.getState().toggleFavorite(100);
    });

    const favorites = useFavoriteStore.getState().favorites;
    expect(favorites['guest']).toContain(100);
  });
});

// getFavoriteCount
describe('getFavoriteCount', () => {
  it('해당 유저의 즐겨찾기 개수를 반환한다', () => {
    setMockUser(mockUser(1, 'User'));

    act(() => {
      useFavoriteStore.getState().toggleFavorite(100);
      useFavoriteStore.getState().toggleFavorite(200);
    });

    expect(useFavoriteStore.getState().getFavoriteCount(1)).toBe(2);
  });

  it('즐겨찾기가 없으면 0을 반환한다', () => {
    expect(useFavoriteStore.getState().getFavoriteCount(999)).toBe(0);
  });
});
