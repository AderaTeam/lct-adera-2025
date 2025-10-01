import { useState, useEffect } from 'react';
import * as stylex from '@stylexjs/stylex';
import { Grid, Stack, text } from '@adera/ui';
import { colors } from '@adera/ui/tokens.stylex';
import { Skeleton } from 'features/Skeleton';
import { ApiFileAnalysisList } from 'store/_types';
import { FileCard } from './FileCard';

export const FileList = ({
  loading,
  files,
  isNewFileCreating
}: {
  loading: boolean;
  files: ApiFileAnalysisList[];
  isNewFileCreating: boolean;
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
      }, 300);
    }
    return () => {
      clearTimeout(timeout);
    };
  }, [loading]);

  if (files.length === 0 && !showSkeleton && !isNewFileCreating)
    return (
      <div {...stylex.props(styles.nothingFound, text.defaultRegular)}>
        Здесь еще ничего нет. Загрузите данные по комментариям, чтобы посмотреть аналитику
      </div>
    );

  return (
    <Grid gap={16} rowGap={20}>
      {!showSkeleton && isNewFileCreating && (
        <Grid.Col span={9} style={styles.item}>
          <FileCard loading={true} id={0} objectKeyUrl={''} createdAt={''} reviewsCount={0} />
        </Grid.Col>
      )}
      {showSkeleton
        ? Array.from({ length: 3 }, (_, index) => index).map((c) => (
            <Grid.Col span={9} style={styles.item} key={c}>
              <Stack gap={12}>
                <div {...stylex.props(styles.line('38%'))}>
                  <Skeleton />
                </div>
                <div {...stylex.props(styles.line('21%'))}>
                  <Skeleton />
                </div>
              </Stack>
            </Grid.Col>
          ))
        : files.map((f) => (
            <Grid.Col span={9} style={styles.item} key={f.id}>
              <FileCard {...f} />
            </Grid.Col>
          ))}
    </Grid>
  );
};

const styles = stylex.create({
  nothingFound: {
    color: colors.textSecondaryDefault
  },
  item: {
    backgroundColor: '#1D1D29',
    borderRadius: 16,
    padding: 24
  },
  line: (width: string) => ({
    borderRadius: 6,
    height: 18,
    overflow: 'hidden',
    width
  })
});
