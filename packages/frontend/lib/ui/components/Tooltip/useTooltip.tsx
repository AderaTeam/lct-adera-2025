import { useCallback, useEffect, useState } from 'react';
import { TooltipPlacement, TooltipPosition, TooltipSide } from './Tooltip.types';

export const useTooltip = (
  visible: boolean,
  position: TooltipPosition,
  childRef: React.RefObject<HTMLElement | null>,
  tooltipRef: React.RefObject<HTMLElement | null>,
  offset: number | { mainAxis?: number; crossAxis?: number }
) => {
  const [coords, setCoords] = useState({ top: 0, left: 0 });

  const updatePosition = useCallback(() => {
    if (!childRef.current || !tooltipRef.current) return;

    const childRect = childRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    const baseOffset = 8;

    const basePositions: Record<TooltipSide, { top: number; left: number }> = {
      top: {
        top: childRect.top - tooltipRect.height - baseOffset,
        left: childRect.left + (childRect.width - tooltipRect.width) / 2
      },
      bottom: {
        top: childRect.bottom + baseOffset,
        left: childRect.left + (childRect.width - tooltipRect.width) / 2
      },
      left: {
        top: childRect.top + (childRect.height - tooltipRect.height) / 2,
        left: childRect.left - tooltipRect.width - baseOffset
      },
      right: {
        top: childRect.top + (childRect.height - tooltipRect.height) / 2,
        left: childRect.right + baseOffset
      }
    };

    const [side, placement] = position.split('-') as [TooltipSide, TooltipPlacement?];

    let { top, left } = basePositions[side];

    if (placement) {
      if (side === 'top' || side === 'bottom') {
        left = placement === 'start' ? childRect.left : childRect.right - tooltipRect.width;
      } else {
        top = placement === 'start' ? childRect.top : childRect.bottom - tooltipRect.height;
      }
    }

    if (typeof offset === 'number') {
      const offsetMap: Record<TooltipSide, { top: number; left: number }> = {
        top: { top: -offset, left: 0 },
        bottom: { top: offset, left: 0 },
        left: { top: 0, left: -offset },
        right: { top: 0, left: offset }
      };

      top += offsetMap[side].top;
      left += offsetMap[side].left;
    } else {
      top += offset.mainAxis ?? 0;
      left += offset.crossAxis ?? 0;
    }

    console.log({ top: top + window.scrollY, left: left + window.scrollX });

    setCoords({ top: top + window.scrollY, left: left + window.scrollX });
  }, [childRef, offset, position, tooltipRef]);

  useEffect(() => {
    if (!visible) return;

    updatePosition();

    const parent = childRef.current?.closest('[data-scroll-container]') as HTMLElement | null;
    parent?.addEventListener('scroll', updatePosition);

    return () => {
      parent?.removeEventListener('scroll', updatePosition);
    };
  }, [visible, updatePosition, childRef]);

  return coords;
};
