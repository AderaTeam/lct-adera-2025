import { ReactNode } from 'react';
import { StyleXStyles } from '@stylexjs/stylex';

/**
 * TODO:
 *  transitionProps?
 */

export interface TooltipProps {
  label: ReactNode;
  children?: ReactNode;
  style?: StyleXStyles;

  offset?: number | { mainAxis?: number; crossAxis?: number };

  disabled?: boolean;
  position?: TooltipPosition;
  arrowPosition?: ArrowPosition;

  openDelay?: number;
  closeDelay?: number;
}

export type TooltipPlacement = 'end' | 'start';

export type TooltipSide = 'top' | 'right' | 'bottom' | 'left';

export type TooltipPosition = TooltipSide | `${TooltipSide}-${TooltipPlacement}`;

export type ArrowPosition = 'center' | 'side';
