import { ComponentProps, useEffect, useRef } from 'react';
import * as stylex from '@stylexjs/stylex';
import { StyleXStyles } from '@stylexjs/stylex';

export interface InfiniteScrollProps extends Omit<ComponentProps<'div'>, 'style'> {
  hasMore?: boolean;

  next?: () => void;

  style?: StyleXStyles;
}

export function InfiniteScroll({ children, style, hasMore, next, ...props }: InfiniteScrollProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const target = ref.current;

    const observer = new IntersectionObserver((entries) => {
      const [entry] = entries;
      if (entry.isIntersecting && hasMore) {
        next?.();
      }
    });

    if (target) {
      observer.observe(target);
    }

    return () => {
      if (target) {
        observer.unobserve(target);
      }
    };
  }, [hasMore, next]);

  return (
    <div {...stylex.props(style)} {...props}>
      {children}
      <div aria-hidden={true} ref={ref} />
    </div>
  );
}
