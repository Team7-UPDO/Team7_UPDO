// layout.tsx의 QueryProvider, AuthProvider를 테스트코드에서도 사용하기 위한 Provider 제공
//  => 테스트마다 **새로운 QueryClient**를 생성해 캐시가 공유되지 않도록 함.

if (typeof process !== 'undefined') {
  process.env.NEXT_PUBLIC_API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost';
}

import { render } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AuthProvider from '@/app/AuthProvider';

function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        staleTime: 0,
        gcTime: 0, // v5: cacheTime 대신 gcTime 사용
        refetchOnWindowFocus: false,
        refetchOnMount: false,
      },
      mutations: {
        retry: false,
      },
    },
  });
}

export function renderWithProviders(ui: React.ReactNode) {
  const client = createTestQueryClient();

  return render(
    <QueryClientProvider client={client}>
      <AuthProvider>{ui}</AuthProvider>
    </QueryClientProvider>,
  );
}
