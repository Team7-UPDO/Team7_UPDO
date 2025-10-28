import AuthGuard from '@/components/feature/my/AuthGuard';
import LogoutControl from '@/components/feature/my/controls/LogoutControl';
import UserProfileCard from '@/components/feature/my/UserProfileCard';
import MyPageContentPane from '@/components/feature/my/MyPageContentPane';

export default function MyPageLayout() {
  return (
    <AuthGuard>
      <div className="mt-10 flex h-full w-full flex-col gap-6 md:flex-row md:gap-15">
        {/* 좌측(PC)/상단(모바일) */}
        <div className="shrink-0 flex-col md:min-w-[282px]">
          <div className="mb-2 flex w-full items-center justify-between sm:mb-6 md:mb-11">
            <span className="typo-body-bold sm:h3Semibold text-gray-900">마이페이지</span>
            <LogoutControl />
          </div>
          <UserProfileCard />
        </div>

        {/* 우측(PC)/하단(모바일) */}
        <div className="flex min-h-0 w-full flex-1 flex-col">
          <MyPageContentPane />
        </div>
      </div>
    </AuthGuard>
  );
}
