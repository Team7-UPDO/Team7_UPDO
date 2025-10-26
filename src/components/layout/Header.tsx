import Link from 'next/link';
import Image from 'next/image';

import HeaderProfile from './HeaderProfile';
import HeaderNav from './HeaderNav';

import { cn } from '@/utils/cn';

interface HeaderProps {
  favoriteCount?: number;
  className?: string;
}

interface NavItem {
  label: string;
  href: string;
  hasBadge?: boolean;
}

export default function Header({ favoriteCount = 0, className }: HeaderProps) {
  return (
    <header className={cn('sticky top-0 z-50 w-full bg-[var(--canvas)]', className)}>
      <div className="layout-container m-auto w-full px-4 md:px-6">
        <div className="flex items-center justify-between py-2 md:py-4">
          {/* Left Group: Logo + Navigation */}
          <div className="flex items-center md:gap-8 lg:gap-10">
            {/* Logo */}
            <Link
              href="/gathering"
              className="relative h-[44px] w-[50px] sm:mr-2 md:h-[50px] md:w-[57px] lg:h-[70px] lg:w-[80px]">
              <Image
                src="/images/header_logo.png"
                alt="UPDO"
                fill
                sizes="(max-width: 768px) 50px, (max-width: 1024px) 57px, 80px"
                className="object-contain"
                priority
              />
            </Link>

            {/* Navigation */}
            <HeaderNav favoriteCount={favoriteCount} />
          </div>

          {/* Right: profile(Login or MyPage) */}
          <HeaderProfile />
        </div>
      </div>
    </header>
  );
}
