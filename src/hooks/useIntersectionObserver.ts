import React, { useState, useEffect, useRef } from 'react';

interface IntersectionObserverOptions {
  threshold?: number | number[];
  root?: Element | null;
  rootMargin?: string;
  triggerOnce?: boolean;
}

const useIntersectionObserver = (
  options: IntersectionObserverOptions = { threshold: 0.1, triggerOnce: true }
): [React.RefObject<HTMLDivElement>, boolean] => {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        if (options.triggerOnce && elementRef.current) {
          observer.unobserve(elementRef.current);
        }
      } else {
        if (!options.triggerOnce) {
          setIsVisible(false);
        }
      }
    }, options);

    const currentElement = elementRef.current;
    if (currentElement) {
      observer.observe(currentElement);
    }

    return () => {
      if (currentElement) {
        observer.unobserve(currentElement);
      }
    };
  }, [options, elementRef]);

  return [elementRef, isVisible];
};

export default useIntersectionObserver;