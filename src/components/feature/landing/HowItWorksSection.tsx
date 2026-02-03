'use client';

import { m } from 'framer-motion';

const steps = [
  {
    number: '01',
    emoji: '🎯',
    title: '관심사 선택',
    description: '자기계발, 챌린지, 네트워킹 중 원하는 주제를 골라보세요.',
    color: 'bg-purple-200',
  },
  {
    number: '02',
    emoji: '🤝',
    title: '모임 참여',
    description: '검증된 리더가 이끄는 오프라인 모임에서 새로운 사람들과 만나요.',
    color: 'bg-purple-400',
  },
  {
    number: '03',
    emoji: '🌱',
    title: '경험 공유',
    description: '모임 후기를 남기고 나만의 포트폴리오를 만들어가세요.',
    color: 'bg-purple-600',
  },
];

export default function HowItWorksSection() {
  return (
    <section className="py-8" aria-labelledby="how-it-works-title">
      <div className="layout-container">
        {/* 상단 태그 */}
        <m.div
          className="mb-4 text-center"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}>
          <span className="bg-mint-50 text-mint-700 inline-block rounded-full px-4 py-1.5 text-sm font-medium">
            간편한 시작
          </span>
        </m.div>

        <m.header
          className="mb-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}>
          <h2
            id="how-it-works-title"
            className="text-3xl font-bold text-gray-900 sm:text-4xl lg:text-5xl">
            단 3단계면 충분합니다
          </h2>
        </m.header>

        <div className="relative grid grid-cols-1 gap-8 sm:grid-cols-3 md:gap-6">
          {/* 점선 연결선 (데스크톱만) */}
          <div
            aria-hidden="true"
            className="border-mint-300 pointer-events-none absolute top-24 right-[17%] left-[17%] hidden h-0 border-t-2 border-dashed border-gray-200 sm:block"
          />

          {steps.map((step, idx) => (
            <m.div
              key={idx}
              className="relative flex flex-col items-center text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.15 }}>
              {/* 카드 */}
              <div className="relative mb-6 flex h-40 w-40 items-center justify-center rounded-3xl bg-gray-50 shadow-sm sm:h-44 sm:w-44">
                <span className="text-5xl">{step.emoji}</span>

                {/* 번호 뱃지 */}
                <span
                  className={`absolute -top-2 -right-2 flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold text-white shadow-md ${step.color}`}>
                  {step.number}
                </span>
              </div>

              <h3 className="text-xl font-bold text-gray-900">{step.title}</h3>
              <p className="mt-2 max-w-[250px] text-sm leading-relaxed text-gray-500">
                {step.description}
              </p>
            </m.div>
          ))}
        </div>
      </div>
    </section>
  );
}
