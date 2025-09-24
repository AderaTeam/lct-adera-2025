import { Suspense } from 'react';
import * as stylex from '@stylexjs/stylex';
import { Outlet } from 'react-router-dom';
import { Spinner, Stack } from '@adera/ui';
import { Header } from './_components/Header';

export function PublicLayout() {
  return (
    <Suspense
      fallback={
        <Stack style={styles.loader} align="center" justify="center">
          <Spinner size="lg" />
        </Stack>
      }>
      <div {...stylex.props(styles.root)}>
        <Header />
        <div {...stylex.props(styles.content)}>
          <Outlet />
        </div>
      </div>
    </Suspense>
  );
}

const styles = stylex.create({
  root: {
    display: 'flex',
    flexDirection: 'column',
    gap: 0,
    width: '100%'
  },
  content: {
    flex: '1'
  },
  loader: {
    height: '100dvh'
  }
});
