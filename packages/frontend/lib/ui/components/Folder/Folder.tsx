import { PropsWithChildren } from 'react';
import { Slot } from '@radix-ui/react-slot';
import * as stylex from '@stylexjs/stylex';
import { StyleXStyles } from '@stylexjs/stylex';
import { colors } from '../../tokens.stylex';
import { ArrowRightIcon } from '../Icon';
import { IconButton, IconButtonVariant } from '../IconButton';

interface FolderProps extends PropsWithChildren {
  asChild?: boolean;

  style?: StyleXStyles;

  onClick?: () => void;
}

export const Folder = ({ asChild, style, children, onClick }: FolderProps) => {
  const Component = asChild ? Slot : 'div';

  return (
    <Component {...stylex.props(styles.root, style)}>
      <div {...stylex.props(styles.ear)} />
      {children}
      <IconButton onClick={onClick} style={styles.button} type="button" variant={IconButtonVariant.ghost}>
        <ArrowRightIcon />
      </IconButton>
    </Component>
  );
};

const styles = stylex.create({
  root: {
    alignItems: 'center',
    backgroundColor: colors.backgroundUniversal,
    borderRadius: '0 10px 10px',
    display: 'flex',
    flex: '1',
    gap: 16,
    height: 60,
    justifyContent: 'space-between',
    maxWidth: '30%',
    padding: '10px 12px',
    position: 'relative',
    width: '100%'
  },
  ear: {
    backgroundColor: colors.backgroundNeutralHover,
    borderRadius: '10px 10px 10px 0',
    height: 16,
    left: 0,
    position: 'absolute',
    top: -8,
    width: '30%',
    zIndex: -1
  },
  button: {
    marginLeft: 'auto'
  }
});
