import Image from 'next/image';

export default function GroupDetailCanceled() {
  return (
    <section className="flex min-h-screen items-center justify-center">
      <div className="flex flex-col items-center justify-center gap-3 py-12" role="alert">
        <Image src="/images/empty.webp" alt="" width={171} height={115} className="opacity-70" />
        <p className="text-sm text-gray-400 md:text-base">
          삭제된 모임입니다. 모임 찾기 페이지로 이동합니다.
        </p>
      </div>
    </section>
  );
}
