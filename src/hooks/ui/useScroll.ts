import { useEffect, useRef } from 'react';

export function useScroll() {
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => {
    const html = document.documentElement;
    html.classList.add('scroll-hidden');

    const onScroll = () => {
      if (!timer.current) html.classList.remove('scroll-hidden');
      if (timer.current) window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => {
        timer.current = undefined;
        html.classList.add('scroll-hidden');
      }, 400);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (timer.current) window.clearTimeout(timer.current);
      html.classList.remove('scroll-hidden');
    };
  }, []);
}
