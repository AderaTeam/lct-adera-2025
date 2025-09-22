import { useCallback, useEffect, useRef } from 'react';
import * as stylex from '@stylexjs/stylex';
import { StyleXStyles } from '@stylexjs/stylex';

export interface PositionObserverProps {
  style?: StyleXStyles;
  onVisibleChange?: (visible: boolean) => void;
}

export function PositionObserver({ onVisibleChange, style }: PositionObserverProps) {
  const targetRef = useRef<HTMLDivElement>(null);

  const callback = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      onVisibleChange?.(entry.isIntersecting);
    },
    [onVisibleChange]
  );

  useEffect(() => {
    const target = targetRef.current;

    const options = {
      root: null,
      threshold: 1.0
    };

    const observer = new IntersectionObserver(callback, options);
    if (target) observer.observe(target);

    return () => {
      if (target) observer.unobserve(target);
    };
  }, [callback]);

  return <div ref={targetRef} {...stylex.props(styles.target, style)}></div>;
}

const styles = stylex.create({
  target: {
    display: 'block',
    height: 0,
    visibility: 'hidden',
    width: 0
  }
});
