import { useEffect, useRef } from 'react';

export default function useClickAway<T extends HTMLElement>(handler: (event: MouseEvent) => void) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const listener = (event: MouseEvent) => {
      if (!ref.current || ref.current.contains(event.target as Node)) {
        return;
      }
      handler(event);
    };
    document.addEventListener('click', listener);
    return () => {
      document.removeEventListener('click', listener);
    };
  }, [ref, handler]);

  return ref;
}
