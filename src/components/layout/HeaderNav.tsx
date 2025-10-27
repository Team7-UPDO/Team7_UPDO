// src/components/layout/HeaderNav.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Badge from '@/components/ui/Badge';
import { cn } from '@/utils/cn';
import { useFavoriteStore } from '@/stores/useFavoriteStore';

const NAV_ITEMS = [
  { label: '모임 찾기', href: '/gathering' },
  { label: '찜한 모임', href: '/favorites', hasBadge: true },
  { label: '모든 리뷰', href: '/reviews' },
];

export default function HeaderNav() {
  const pathname = usePathname();
  const { getFavoriteCount } = useFavoriteStore();
  const favoriteCount = getFavoriteCount();
  const isActive = (href: string) => {
    if (href === '/gathering') return pathname === '/' || pathname?.startsWith('/gathering');
    return pathname?.startsWith(href);
  };

  return (
    <nav className="flex items-center sm:gap-2 md:gap-4 lg:gap-6" role="navigation">
      {NAV_ITEMS.map(item => {
        const active = isActive(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'relative inline-flex items-center transition-colors',
              'px-2 py-2 md:px-3 md:py-2 lg:px-4 lg:py-2',
              'typo-xs sm:typo-base sm:tracking-[-0.48px]',
              active
                ? 'font-semibold text-[var(--color-purple-600)] md:font-bold'
                : 'font-medium text-[var(--color-gray-500)] hover:text-[var(--color-purple-450)]',
            )}>
            <span className="inline-flex flex-shrink-0 items-center gap-1 whitespace-nowrap md:gap-2 lg:gap-2">
              {item.label}
              {item.hasBadge && favoriteCount > 0 && (
                <Badge value={getFavoriteCount()} size="responsive" />
              )}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
