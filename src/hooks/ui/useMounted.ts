'use client';
import { useEffect, useState } from 'react';

export function useMounted(delay = 0): boolean {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    if (delay > 0) {
      const timer = window.setTimeout(() => setMounted(true), delay);
      return () => window.clearTimeout(timer);
    }
    setMounted(true);
    return () => void 0;
  }, [delay]);
  return mounted;
}
