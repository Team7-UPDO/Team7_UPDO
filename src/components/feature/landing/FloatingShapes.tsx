'use client';

import { m } from 'framer-motion';

export default function FloatingShapes() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* ── 상단 영역 (Hero 근처) ── */}
      <m.div
        className="absolute top-[5%] left-[5%] h-32 w-32 rounded-full bg-purple-100 opacity-50 blur-xl sm:h-44 sm:w-44"
        animate={{ y: [0, -20, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      />
      <m.div
        className="bg-mint-600 absolute top-[8%] right-[10%] h-16 w-16 rounded-full opacity-40 blur-lg sm:h-24 sm:w-24"
        animate={{ x: [0, 15, 0], y: [0, -15, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
      />
      <m.div
        className="bg-mint-100 absolute top-[15%] right-[25%] h-20 w-20 rounded-2xl opacity-50 blur-xl sm:h-28 sm:w-28"
        animate={{ y: [0, 20, 0], rotate: [0, 10, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* ── 중간 영역 (Features / HowItWorks 근처) ── */}
      <m.div
        className="bg-mint-600 absolute top-[35%] left-[8%] h-24 w-24 rounded-full opacity-40 blur-xl sm:h-36 sm:w-36"
        animate={{ x: [0, -10, 0], scale: [1, 0.9, 1] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
      />
      <m.div
        className="absolute top-[45%] right-[5%] h-20 w-20 rounded-full bg-purple-100 opacity-50 blur-xl sm:h-32 sm:w-32"
        animate={{ y: [0, 25, 0] }}
        transition={{ duration: 7.5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
      />
      <m.div
        className="bg-mint-600 absolute top-[50%] left-[40%] h-14 w-14 rounded-full opacity-35 blur-lg sm:h-20 sm:w-20"
        animate={{ x: [0, 20, 0], y: [0, -10, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
      />

      {/* ── 하단 영역 (Testimonials / CTA 근처) ── */}
      <m.div
        className="absolute top-[70%] right-[15%] h-28 w-28 rounded-2xl bg-purple-100 opacity-40 blur-xl sm:h-40 sm:w-40"
        animate={{ y: [0, -18, 0], rotate: [0, -8, 0] }}
        transition={{ duration: 8.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
      />
      <m.div
        className="bg-mint-600 absolute top-[80%] left-[10%] h-20 w-20 rounded-full opacity-45 blur-xl sm:h-32 sm:w-32"
        animate={{ y: [0, 15, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 6.5, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
      />
      <m.div
        className="absolute top-[90%] right-[35%] h-16 w-16 rounded-full bg-purple-200 opacity-35 blur-lg sm:h-24 sm:w-24"
        animate={{ x: [0, -12, 0] }}
        transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
      />
    </div>
  );
}
