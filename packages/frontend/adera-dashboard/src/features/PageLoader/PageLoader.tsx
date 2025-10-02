import { useState, useEffect, ReactNode } from 'react';
import * as stylex from '@stylexjs/stylex';
import { Grid } from '@adera/ui';
import { Card } from 'components/Card';
import { Skeleton } from 'features/Skeleton';

export const PageLoader = ({
  loading,
  children,
  showTime = 300
}: {
  loading: boolean;
  children: ReactNode;
  showTime?: number;
}) => {
  const [showSkeleton, setShowSkeleton] = useState(loading);

  // Минимальное время анимации
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (loading) {
      setShowSkeleton(true);
    } else {
      timeout = setTimeout(() => {
        setShowSkeleton(false);
      }, showTime);
    }
    return () => {
      clearTimeout(timeout);
    };
  }, [loading, showTime]);

  if (!showSkeleton) return children;

  return (
    <Grid gap={20} rowGap={20}>
      {Array.from({ length: 4 }, (_, index) => index).map((c) => (
        <Grid.Col key={c} span={3}>
          <Card style={styles.card}>
            <div {...stylex.props(styles.line('100%'))}>
              <Skeleton />
            </div>
            <div {...stylex.props(styles.line('60%'))}>
              <Skeleton />
            </div>
            <div {...stylex.props(styles.line('60%'), styles.big)}>
              <Skeleton />
            </div>
            <div {...stylex.props(styles.line('60%'))}>
              <Skeleton />
            </div>
          </Card>
        </Grid.Col>
      ))}
    </Grid>
  );
};

const styles = stylex.create({
  card: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12
  },
  line: (width: string) => ({
    borderRadius: 6,
    height: 18,
    overflow: 'hidden',
    width
  }),
  big: {
    height: 60
  }
});
