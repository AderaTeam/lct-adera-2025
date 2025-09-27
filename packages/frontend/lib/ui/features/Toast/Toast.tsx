import { useEffect } from 'react';
import * as stylex from '@stylexjs/stylex';
import { text } from '@adera/ui';
import { colors } from '../../tokens.stylex';
import { ToastOptions, ToastStatus } from './Toast.types';

interface ToastProps extends ToastOptions {
  onClose: (id: string) => void;
}

export const Toast = ({ id, title, status = ToastStatus.good, onClose }: ToastProps) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id);
    }, 3000);

    return () => {
      clearTimeout(timer);
    };
  }, [onClose, id]);

  return (
    <div {...stylex.props(styles.root)}>
      <div {...stylex.props(styles.circle, styles[status])} />
      <div {...stylex.props(text.defaultSemibold)}>{title}</div>
    </div>
  );
};

const styles = stylex.create({
  root: {
    alignItems: 'center',
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 12,
    color: colors.textPrimaryDefault,
    display: 'flex',
    gap: 12,
    maxWidth: 360,
    padding: 16
  },
  circle: {
    borderRadius: '50%',
    height: 16,
    minWidth: 16
  },
  good: {
    backgroundColor: colors.statusSuccess
  },
  info: {
    backgroundColor: colors.statusNeutral
  },
  bad: {
    backgroundColor: colors.statusError
  }
});
