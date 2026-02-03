'use client';

import { m } from 'framer-motion';
import Link from 'next/link';
import { buttonVariants } from '@/components/ui/Button';

export default function CTASection() {
  return (
    <section className="relative overflow-hidden py-20 sm:py-28">
      {/* 배경 장식 */}
      <div className="pointer-events-none absolute -top-20 -left-20 h-80 w-80 rounded-full opacity-40 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 -bottom-20 h-80 w-80 rounded-full bg-purple-100 opacity-40 blur-3xl" />

      <div className="layout-container relative z-10">
        <m.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}>
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            지금 바로 당신의{' '}
            <span className="bg-gradient-to-r from-purple-500 to-purple-400 bg-clip-text text-transparent">
              성장
            </span>
            을 시작하세요
          </h2>
          <p className="mx-auto mt-4 max-w-md text-base text-gray-500">
            혼자가 아니라 함께할 때 성장은 더 빨라집니다.
            <br />
            UPDO에서 당신의 가치를 알아주는 동료들을 만나보세요.
          </p>
        </m.div>

        <m.div
          className="mt-10 flex justify-center"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}>
          <Link href="/gathering" className={buttonVariants({ size: 'large', variant: 'primary' })}>
            함께 성장하러 가기
          </Link>
        </m.div>
      </div>
    </section>
  );
}
