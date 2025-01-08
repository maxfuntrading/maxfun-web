import { useState, useEffect } from 'react';
import ResizeObserver from 'resize-observer-polyfill';

type Breakpoint = 'sm' | 'md' | 'lg';

const breakpoints: { [key in Breakpoint]: number } = {
  sm: 750,
  md: 1440,
  lg: Infinity,
};

export function useBreakpoint() {
  const [breakpoint, setBreakpoint] = useState<Breakpoint>(() => getBreakpoint(window.innerWidth));

  function getBreakpoint(windowWidth: number): Breakpoint {
    if (windowWidth <= breakpoints.sm) {
      return 'sm';
    } else if (windowWidth <= breakpoints.md) {
      return 'md';
    } else {
      return 'lg';
    }
  }

  useEffect(() => {
    const observer = new ResizeObserver(entries => {
      for (const entry of entries) {
        const { width } = entry.contentRect;
        setBreakpoint(getBreakpoint(width));
      }
    });

    observer.observe(document.body);

    return () => observer.disconnect();
  }, []);

  return {
    breakpoint,
    isSM: breakpoint === 'sm',
    isMD: breakpoint === 'md',
    isLG: breakpoint === 'lg',
    isPC: breakpoint === 'lg' || breakpoint === 'md',
  };
}
