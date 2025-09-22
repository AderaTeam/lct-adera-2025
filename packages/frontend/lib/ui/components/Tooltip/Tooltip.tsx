import { useState, useRef, useEffect } from 'react';
import * as stylex from '@stylexjs/stylex';
import { createPortal } from 'react-dom';
import { colors } from '@adera/ui/tokens.stylex';
import { text } from '../../utils/text';
import { TooltipProps } from './Tooltip.types';
import { useTooltip } from './useTooltip';

export const Tooltip = ({
  label,
  offset = 0,
  children,
  position = 'top',
  arrowPosition = 'center',
  disabled,
  openDelay = 300,
  closeDelay = 0,
  style
}: TooltipProps) => {
  const [visible, setVisible] = useState(false);
  const [ready, setReady] = useState(false);

  const tooltipRef = useRef<HTMLDivElement>(null);
  const childRef = useRef<HTMLDivElement>(null);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const coords = useTooltip(visible, position, childRef, tooltipRef, offset);

  const handleMouseEnter = () => {
    if (!disabled) {
      timeoutRef.current = setTimeout(() => {
        setVisible(true);
      }, openDelay);
    }
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setVisible(false);
      setReady(false);
    }, closeDelay);
  };

  useEffect(() => {
    if (coords.top !== 0 || coords.left !== 0) {
      setReady(true);
    }
  }, [coords]);

  useEffect(() => {
    setVisible(false);
    setReady(false);
  }, [label]);

  return (
    <div ref={childRef} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} {...stylex.props(style)}>
      {children}
      {createPortal(
        visible && (
          <div
            ref={tooltipRef}
            {...stylex.props(
              text.defaultMedium,
              styles.tooltip(coords.top, coords.left, ready ? 1 : 0),
              styles[arrowPosition]
            )}
            role="tooltip"
            aria-hidden={!visible}>
            {label}
          </div>
        ),
        document.body
      )}
    </div>
  );
};

const styles = stylex.create({
  tooltip: (top: number, left: number, opacity: number) => ({
    backgroundColor: 'white',
    borderRadius: 8,
    color: colors.textSecondaryDefault,
    left: `${left.toString()}px`,
    opacity,
    transition: 'opacity 0.4s',
    padding: 8,
    width: 'fit-content',
    boxShadow: '0px 1px 20px 0px #00000014, 0px 1px 2px 0px #0000000D',
    position: 'absolute',
    top: `${top.toString()}px`,
    zIndex: 30,
    '::before': {
      content: '',
      position: 'absolute',
      borderWidth: '7px',
      borderStyle: 'solid',
      borderColor: 'transparent',
      borderTopWidth: '12px',
      borderTopStyle: 'solid',
      borderTopColor: 'white',
      filter: 'drop-shadow(rgba(0, 0, 0, 0.04) 0px 1px 3px)',
      zIndex: -1
    }
  }),
  center: {
    '::before': {
      left: '50%',
      transform: 'translateX(-50%)',
      bottom: '-18px'
    }
  },
  side: {
    '::before': {
      right: 20,
      bottom: '-18px'
    }
  }
});
