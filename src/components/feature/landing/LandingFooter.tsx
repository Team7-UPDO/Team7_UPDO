import Link from 'next/link';

const footerLinks = {
  서비스: [
    { label: '모임 찾기', href: '/gathering' },
    { label: '찜한 목록', href: '/favorites' },
    { label: '모든 리뷰', href: '/reviews' },
  ],
  고객지원: [
    { label: '자주 묻는 질문', href: '#' },
    { label: '1:1 문의', href: '#' },
    { label: '공지사항', href: '#' },
    { label: '이용약관', href: '#' },
  ],
  Contact: [{ label: 'help@updo.site', href: 'mailto:usnimoes@gmail.com' }],
};

export default function LandingFooter() {
  return (
    <footer className="border-t border-gray-100 py-12 sm:py-16">
      <div className="layout-container">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="text-xl font-bold text-yellow-500">
              <span className="text-purple-500">U</span>
              PD
              <span className="text-mint-500">O</span>
            </p>
            <p className="mt-3 text-sm leading-relaxed text-gray-500">
              성장하고 싶은 사람들의 커뮤니티 플랫폼 UPDO.
              <br />
              우리는 배움의 즐거움을 연결합니다.
            </p>
          </div>

          {/* 링크 컬럼 */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="mb-4 text-sm font-bold text-gray-900">{category}</h3>
              <ul className="space-y-2.5">
                {links.map(link => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-500 transition-colors hover:text-purple-500">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* 하단 저작권 */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-gray-100 pt-8 sm:flex-row">
          <p className="text-xs text-gray-400">
            &copy; {new Date().getFullYear()} UPDO. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link href="#" className="text-xs text-gray-400 transition-colors hover:text-gray-600">
              개인정보처리방침
            </Link>
            <Link href="#" className="text-xs text-gray-400 transition-colors hover:text-gray-600">
              청소년보호정책
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
