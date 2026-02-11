'use client';

import { m } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

import { buttonVariants } from '@/components/ui/Button';

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-8 pb-12 sm:pt-14" aria-labelledby="hero-title">
      <div className="mx-auto flex max-w-[1280px] flex-col items-center gap-12 px-4 sm:flex-row sm:items-center sm:gap-16 sm:px-6">
        <m.div
          className="flex flex-col items-start sm:w-[60%]"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}>
          <m.span
            className="mb-6 inline-block rounded-full bg-purple-50 px-4 py-1.5 text-sm font-bold tracking-wide text-purple-600"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}>
            성장하고 싶은 사람들의 모임, UPDO
          </m.span>

          <h1
            id="hero-title"
            className="text-4xl leading-[1.1] font-bold text-gray-900 sm:text-5xl md:text-[72px]">
            함께{' '}
            <span className="to-mint-500 bg-gradient-to-r from-purple-500 bg-clip-text text-transparent">
              성장
            </span>
            하는
            <br />
            우리들의 특별한 모임
          </h1>

          <m.p
            className="mt-8 max-w-xl text-sm leading-relaxed text-gray-500 sm:text-lg md:text-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}>
            자기계발부터 취미까지, 관심사가 같은 사람들과
            <br />
            오프라인에서 직접 만나 인사이트를 공유하고
            <br />
            내일을 준비하세요.
          </m.p>

          <m.div
            className="mt-10 flex flex-wrap gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}>
            <Link
              href="/gathering"
              className={buttonVariants({ size: 'large', variant: 'primary' })}>
              모임 둘러보기
            </Link>
          </m.div>

          <m.div
            className="mt-12 flex items-center gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.8 }}>
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map(i => (
                <div
                  key={i}
                  className="to-mint-200 flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border-2 border-white bg-gradient-to-br from-purple-200 text-xs font-bold text-purple-700">
                  {String.fromCodePoint(0x1f600 + i)}
                </div>
              ))}
            </div>
            <p className="text-sm font-medium text-gray-500">
              <span className="font-bold text-gray-900">100+</span> 명이 이미 함께 성장하고 있어요
            </p>
          </m.div>
        </m.div>

        <div className="relative w-[70%] sm:w-[40%]">
          <div className="relative z-10 w-full overflow-hidden rounded-[40px] shadow-2xl shadow-purple-100/50">
            <Image
              src="/images/find_banner.webp"
              alt="UPDO 모임 이미지"
              width={600}
              height={600}
              className="h-auto w-full object-cover"
              priority
            />
          </div>

          <m.div
            className="absolute -top-3 -right-2 z-20 rounded-xl border border-purple-50 bg-white/90 p-2 shadow-lg backdrop-blur-sm sm:-top-6 sm:-right-8 sm:rounded-2xl sm:p-4 sm:shadow-xl"
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}>
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="bg-mint-100 flex h-7 w-7 items-center justify-center rounded-full text-sm sm:h-10 sm:w-10 sm:text-xl">
                ✨
              </div>
              <div>
                <p className="text-[10px] font-bold tracking-wider text-gray-400 sm:text-xs">
                  오늘의 성장
                </p>
                <p className="text-xs font-bold text-gray-900 sm:text-sm">독서 루틴 챌린지 100%</p>
              </div>
            </div>
          </m.div>

          <m.div
            className="absolute -bottom-3 -left-2 z-20 rounded-xl border border-purple-50 bg-white/90 p-2 shadow-lg backdrop-blur-sm sm:-bottom-6 sm:-left-10 sm:rounded-2xl sm:p-5 sm:shadow-xl"
            animate={{ y: [0, 20, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}>
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100 text-sm sm:h-12 sm:w-12 sm:text-xl">
                🚀
              </div>
              <div>
                <p className="text-[10px] font-bold tracking-wider text-gray-400 sm:text-xs">
                  누적 모임
                </p>
                <p className="text-xs font-bold text-purple-600 sm:text-lg">100건 돌파</p>
              </div>
            </div>
          </m.div>
        </div>
      </div>
    </section>
  );
}
