import * as stylex from '@stylexjs/stylex';
import { useSheetContext } from '../../Sheet.context';

export function SheetOverlay() {
  const { open } = useSheetContext();

  if (!open) {
    return null;
  }

  return <div {...stylex.props(styles.root)}></div>;
}

const styles = stylex.create({
  root: {
    backdropFilter: 'blur(2px)',
    left: 0,
    position: 'fixed',
    top: 0,
    width: stylex.firstThatWorks('100svw', '100vw'),
    zIndex: 20,
    height: stylex.firstThatWorks('100svh', '100vh'),
    background: 'rgba(0, 0, 0, 0.3)'
  }
});
