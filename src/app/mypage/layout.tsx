import AuthGuard from '@/components/feature/my/AuthGuard';
import MyPageContentPane from '@/components/feature/my/MyPageContentPane';
import UserProfileCard from '@/components/feature/my/UserProfileCard';

import LogoutControl from '@/components/feature/my/controls/LogoutControl';

export default function MyPageLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <div className="mt-10 flex h-full w-full flex-col gap-6 md:flex-row md:gap-15">
        {/* 좌측(PC)/상단(모바일) */}
        <aside className="shrink-0 flex-col md:min-w-[282px]">
          <div className="mb-2 flex w-full items-center justify-between sm:mb-6 md:mb-11">
            <h1 className="typo-body-bold sm:h3Semibold text-gray-900">마이페이지</h1>
            <LogoutControl />
          </div>
          <UserProfileCard />
        </aside>

        {/* 우측(PC)/하단(모바일) */}
        <main className="flex min-h-0 w-full flex-1 flex-col">
          <MyPageContentPane>{children}</MyPageContentPane>
        </main>
      </div>
    </AuthGuard>
  );
}
