'use client';

import { m } from 'framer-motion';
import Image from 'next/image';

const testimonial = {
  userName: '김**',
  userRole: '3년차 프론트엔드 개발자',
  userImage: '/images/avatar_default.webp',
  tag: '시니어 멘토링 참여자',
  comment:
    '주니어로 일하면서 방향을 잘 잡고 있는 건지 확신이 없던 시기였어요. 시니어 개발자와 직접 이야기를 나누며 제 고민을 정리할 수 있었고, 막연했던 성장에 대해 현실적인 조언을 들을 수 있었습니다. 만남 이후에는 앞으로의 학습과 실무 방향이 조금 더 또렷해졌어요.',
};

export default function TestimonialsSection() {
  return (
    <section
      className="relative overflow-hidden py-20 sm:py-28"
      aria-labelledby="testimonials-title">
      <div className="layout-container relative z-10">
        <m.header
          className="mb-14 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}>
          <h2 id="testimonials-title" className="text-3xl font-bold text-gray-900 sm:text-4xl">
            함께한 사람들의 이야기
          </h2>
        </m.header>

        {/* 후기 카드 */}
        <m.div
          className="mx-auto max-w-2xl rounded-3xl bg-white p-8 shadow-sm sm:p-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}>
          {/* 아바타 */}
          <div className="mb-6 flex justify-center">
            <Image
              src={testimonial.userImage}
              alt={testimonial.userName}
              width={64}
              height={64}
              className="rounded-full shadow-md"
              loading="lazy"
            />
          </div>

          {/* 태그 */}
          <div className="mb-6 text-center">
            <span className="inline-block rounded-full bg-purple-50 px-4 py-1 text-xs font-medium text-purple-600">
              {testimonial.tag}
            </span>
          </div>

          {/* 후기 본문 */}
          <blockquote className="mb-6 text-center text-lg leading-relaxed font-medium text-gray-800 sm:text-xl">
            &ldquo;{testimonial.comment}&rdquo;
          </blockquote>

          {/* 사용자 정보 */}
          <p className="text-center text-sm text-gray-500">
            <span className="font-semibold text-gray-700">{testimonial.userName}</span> 님 —{' '}
            {testimonial.userRole}
          </p>
        </m.div>
      </div>
    </section>
  );
}
