import { useState, useEffect } from 'react';
import * as stylex from '@stylexjs/stylex';
import {
  ArrowsRightIcon,
  Button,
  ButtonVariant,
  CircleCheckFilledIcon,
  DownloadIcon,
  Flex,
  Grid,
  headers,
  MessageIconS,
  Stack,
  text
} from '@adera/ui';
import { colors } from '@adera/ui/tokens.stylex';
import { Skeleton } from 'features/Skeleton';

export const FileList = ({ loading, files }: { loading: boolean; files: string[] }) => {
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

  if (files.length === 0 && !showSkeleton)
    return (
      <div {...stylex.props(styles.nothingFound, text.defaultRegular)}>
        Здесь еще ничего нет. Загрузите данные по комментариям, чтобы посмотреть аналитику
      </div>
    );

  return (
    <Grid gap={16} rowGap={20}>
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
            <Grid.Col span={9} style={styles.item} key={f}>
              <Flex gap={16} justify="space-between" align="flex-end">
                <Stack gap={12}>
                  <Flex gap={8}>
                    <h3 {...stylex.props(headers.h3Semibold)}>
                      <CircleCheckFilledIcon color={colors.statusSuccess} /> Данные от 05.10.25 (3)
                    </h3>
                  </Flex>
                  <Flex gap={5} style={[text.defaultMedium, styles.status]}>
                    <MessageIconS /> 100 комментариев
                  </Flex>
                </Stack>
                <Flex gap={16}>
                  <Button variant={ButtonVariant.tertiaryAccent}>
                    Скачать .json <DownloadIcon />
                  </Button>
                  <Button>
                    Смотреть аналитику <ArrowsRightIcon />
                  </Button>
                </Flex>
              </Flex>
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
  }),
  status: {
    color: colors.textTertiaryDefault
  }
});
