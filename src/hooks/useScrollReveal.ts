import { useEffect, useRef, useState } from 'react';

export const useScrollReveal = (threshold: number = 0.1) => {
  const [isRevealed, setIsRevealed] = useState(false);
  const elementRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsRevealed(true);
          observer.unobserve(element);
        }
      },
      {
        threshold,
        rootMargin: '0px 0px -50px 0px',
      }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [threshold]);

  return { elementRef, isRevealed };
};

export const useMultipleScrollReveal = (count: number, threshold: number = 0.1) => {
  const [revealedItems, setRevealedItems] = useState<boolean[]>(new Array(count).fill(false));
  const elementRefs = useRef<(HTMLElement | null)[]>(new Array(count).fill(null));

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    elementRefs.current.forEach((element, index) => {
      if (!element) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setRevealedItems(prev => {
              const newState = [...prev];
              newState[index] = true;
              return newState;
            });
            observer.unobserve(element);
          }
        },
        {
          threshold,
          rootMargin: '0px 0px -50px 0px',
        }
      );

      observer.observe(element);
      observers.push(observer);
    });

    return () => {
      observers.forEach(observer => observer.disconnect());
    };
  }, [threshold]);

  const setRef = (index: number) => (ref: HTMLElement | null) => {
    elementRefs.current[index] = ref;
  };

  return { setRef, revealedItems };
};