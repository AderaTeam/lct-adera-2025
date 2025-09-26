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
      <div {...stylex.props(styles.content)}>
        <div {...stylex.props(text.defaultMedium)}>{title}</div>
      </div>
    </div>
  );
};

const styles = stylex.create({
  root: {
    alignItems: 'flex-start',
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 12,
    color: colors.textPrimaryDefault,
    display: 'flex',
    gap: 8,
    maxWidth: 360,
    paddingBlock: 16,
    paddingInline: '20px 16px'
  },
  circle: {
    borderRadius: '50%',
    height: 20,
    width: 20
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8
  },
  good: {
    color: colors.statusSuccess
  },
  info: {
    color: colors.statusNeutral
  },
  bad: {
    color: colors.statusError
  }
});
