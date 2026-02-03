'use client';

import { m } from 'framer-motion';

const gatherings = [
  {
    emoji: '💻',
    title: '코딩테스트 스터디',
    description: '매주 알고리즘 문제를 함께 풀고 풀이를 공유하며 코딩테스트를 준비합니다.',
    tag: '자기계발',
  },
  {
    emoji: '📚',
    title: '월간 독서 모임',
    description: '한 달에 한 권, 같은 책을 읽고 다양한 관점에서 토론하며 시야를 넓힙니다.',
    tag: '라이프스타일',
  },
  {
    emoji: '🧑‍💼',
    title: '시니어 개발자 멘토링',
    description: '현업 시니어와 1:1 커피챗으로 커리어 방향과 기술 고민을 해결합니다.',
    tag: '네트워킹',
  },
  {
    emoji: '🎨',
    title: '사이드 프로젝트 빌딩',
    description: '기획·디자인·개발 직군이 모여 4주 만에 실제 서비스를 런칭합니다.',
    tag: '챌린지',
  },
];

export default function FeaturesSection() {
  return (
    <section className="py-20 sm:py-28" aria-labelledby="features-title">
      <div className="layout-container">
        <m.header
          className="mb-14 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}>
          <h2 id="features-title" className="text-3xl font-bold text-gray-900 sm:text-4xl">
            이런 모임이 진행되고 있어요
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-base text-gray-500">
            성장, 네트워킹, 챌린지까지 — 다양한 주제의 모임을 만나보세요.
          </p>
        </m.header>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {gatherings.map((gathering, idx) => (
            <m.article
              key={idx}
              className="group rounded-2xl bg-white p-7 transition-shadow duration-300 hover:shadow-lg sm:p-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}>
              {/* 이모지 + 태그 */}
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-50 text-2xl">
                  {gathering.emoji}
                </div>
                <span className="bg-mint-50 text-mint-700 rounded-full py-1 text-lg">
                  {gathering.tag}
                </span>
              </div>

              <h3 className="text-lg font-bold text-gray-900">{gathering.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-500">{gathering.description}</p>
            </m.article>
          ))}
        </div>
      </div>
    </section>
  );
}
