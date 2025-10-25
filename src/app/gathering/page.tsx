import GatheringSection from '@/components/feature/gathering/GatheringSection';
import Image from 'next/image';

export default function GatheringPage() {
  return (
    <>
      <header className="flex h-[192px] w-full items-center justify-between rounded-3xl bg-white sm:h-[244px]">
        <div className="ml-5 flex flex-col justify-center text-nowrap sm:ml-24">
          <p className="typo-body-sm sm:typo-subtitle text-[var(--purple-550)]">
            함께 성장 할 사람을 찾고 계신가요?
          </p>
          <p className="card-title sm:h3Semibold">지금 모임에 참여해보세요</p>
        </div>

        <div className="flex h-44 w-36 items-center justify-center sm:mr-16 sm:h-auto sm:w-[275px] md:mr-24 md:w-[316px]">
          <Image
            src="/images/find_banner.png"
            alt="모임 찾기 배너"
            width={310}
            height={70}
            priority
            style={{ width: 'auto', height: 'auto' }}
          />
        </div>
      </header>
      <main>
        <GatheringSection />
      </main>
    </>
  );
}
