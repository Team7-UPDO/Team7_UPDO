'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Badge from '@/components/ui/Badge';
import { cn } from '@/utils/cn';
import { useFavoriteStore } from '@/stores/useFavoriteStore';
import { useUserStore } from '@/stores/useUserStore';
import { useMounted } from '@/hooks/ui/useMounted';

const NAV_ITEMS = [
  { label: '모임 찾기', href: '/gathering' },
  { label: '찜한 모임', href: '/favorites', hasBadge: true },
  { label: '모든 리뷰', href: '/reviews' },
];

export default function HeaderNav() {
  const userId = useUserStore(state => state.user?.id ?? null);
  const favoriteStore = useFavoriteStore();
  const hasHydrated = useFavoriteStore(state => state._hasHydrated);
  const pathname = usePathname();
  const mounted = useMounted();
  const isActive = (href: string) => {
    if (href === '/gathering') return pathname?.startsWith('/gathering');
    return pathname?.startsWith(href);
  };
  const favoriteCount = mounted && hasHydrated ? favoriteStore.getFavoriteCount(userId) : 0;

  return (
    <nav className="flex items-center sm:gap-2 md:gap-4 lg:gap-6" aria-label="주 메뉴">
      {NAV_ITEMS.map(item => {
        const active = isActive(item.href);
        const showBadge = mounted && hasHydrated && item.hasBadge && favoriteCount > 0;
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? 'page' : undefined}
            className={cn(
              'relative inline-flex items-center transition-colors',
              'px-2 py-2 md:px-3 md:py-2 lg:px-4 lg:py-2',
              'typo-xs sm:typo-base sm:tracking-[-0.48px]',
              active
                ? 'font-semibold text-[var(--color-purple-600)] md:font-bold'
                : 'font-medium text-[var(--color-gray-500)] hover:text-[var(--color-purple-450)]',
            )}>
            <span className="relative inline-flex flex-shrink-0 items-center gap-1 whitespace-nowrap md:gap-2 lg:gap-2">
              {item.label}
              {showBadge && (
                <>
                  <Badge
                    value={favoriteCount}
                    size="responsive"
                    className="absolute -right-3.5 sm:-right-4.5 md:-right-6.5"
                    aria-hidden
                  />
                  <span className="sr-only">{favoriteCount}개</span>
                </>
              )}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
