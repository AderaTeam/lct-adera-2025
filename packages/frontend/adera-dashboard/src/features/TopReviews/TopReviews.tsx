import { useMemo } from 'react';
import * as stylex from '@stylexjs/stylex';
import { ArrowsSortIconM, ArrowsSortIconS, Flex, Grid, headers, MessageIconS, Modal, Stack, text } from '@adera/ui';
import { colors } from '@adera/ui/tokens.stylex';
import { Card } from 'components/Card';
import { ReviewBar } from 'components/ReviewBar';
import { useFilters } from 'features/Filters/useFilters';
import { SortDirections } from 'store/_types';
import { calcPercents } from 'utils/calcPercents';

export const TopReviews = ({
  topics
}: {
  topics: {
    name: string;
    positive: number;
    neutral: number;
    negative: number;
  }[];
}) => {
  const { filters, updateFilters } = useFilters();

  const isPositiveTop = filters.sort_review_top === SortDirections.asc;

  const handleUpdateFilters = (sort_review_top: SortDirections) => {
    updateFilters({
      sort_review_top: sort_review_top === SortDirections.asc ? SortDirections.desc : SortDirections.asc
    });
  };

  const extendedTopics = useMemo(
    () =>
      topics.map((t) => {
        const [positivePercent, , negativePercent] = calcPercents([t.positive, t.neutral, t.negative]);

        return { ...t, positivePercent, negativePercent };
      }),
    [topics]
  );

  const _topics = extendedTopics.sort((a, b) =>
    isPositiveTop ? b.positivePercent - a.positivePercent : b.negativePercent - a.negativePercent
  );

  return (
    <Grid.Col span={3}>
      <Card style={styles.root}>
        <div {...stylex.props(styles.heading)}>
          <div {...stylex.props(text.subheaderBold, styles.headingLabel)}>
            ТОП “{isPositiveTop ? 'Положительных' : 'Отрицательных'}”
          </div>

          <ArrowsSortIconS
            {...stylex.props(styles.sorting)}
            aria-selected={!isPositiveTop}
            onClick={() => {
              handleUpdateFilters(filters.sort_review_top);
            }}
          />

          <Modal>
            <Modal.Target style={styles.all}>Все</Modal.Target>

            <Modal.Content>
              <Modal.Header>
                <div {...stylex.props(styles.header)}>
                  <h2 {...stylex.props(headers.h2Bold)}>ТОП</h2>
                  <Flex
                    onClick={() => {
                      handleUpdateFilters(filters.sort_review_top);
                    }}
                    gap={10}
                    aria-selected={!isPositiveTop}
                    style={styles.sorting}>
                    <ArrowsSortIconM />
                    {isPositiveTop ? 'Сначала положительные' : 'Сначала отрицательные'}
                  </Flex>
                </div>
              </Modal.Header>

              <ul {...stylex.props(styles.topics)}>
                {_topics.map((t, index) => (
                  <li key={t.name} {...stylex.props(styles.topic, text.subheaderMedium)}>
                    <div {...stylex.props(styles.index)}>{index + 1}</div>
                    <div {...stylex.props(styles.name)}>{t.name}</div>
                    <div {...stylex.props(styles.block(100), text.subheaderBold)}>
                      <MessageIconS /> {t.positive + t.neutral + t.negative}:
                    </div>
                    <div {...stylex.props(styles.block(80))}>
                      <div {...stylex.props(styles.circle(colors.statusSuccess))} /> {t.positive}
                    </div>
                    <div {...stylex.props(styles.block(80))}>
                      <div {...stylex.props(styles.circle(colors.statusNeutral))} />
                      {t.neutral}
                    </div>
                    <div {...stylex.props(styles.block(80))}>
                      <div {...stylex.props(styles.circle(colors.statusError))} />
                      {t.negative}
                    </div>
                  </li>
                ))}
              </ul>
            </Modal.Content>
          </Modal>
        </div>

        <Stack gap={12}>
          {_topics.map(
            (t, index) =>
              index < 3 && (
                <Stack key={t.name} gap={4}>
                  <Flex justify="space-between" gap={8} style={text.defaultMedium}>
                    {t.name}
                    <Flex style={styles.count} gap={4}>
                      {isPositiveTop ? t.positivePercent.toString() + '%' : t.negativePercent.toString() + '%'}
                      <div
                        {...stylex.props(
                          styles.circle(isPositiveTop ? colors.statusSuccess : colors.statusError)
                        )}></div>
                    </Flex>
                  </Flex>
                  <ReviewBar {...t} />
                </Stack>
              )
          )}
        </Stack>
      </Card>
    </Grid.Col>
  );
};

const styles = stylex.create({
  root: {
    display: 'flex',
    flexDirection: 'column',
    gap: 16
  },
  heading: {
    alignItems: 'center',
    display: 'flex',
    gap: 8,
    userSelect: 'none'
  },
  headingLabel: {
    width: 183
  },
  sorting: {
    color: {
      default: colors.textTertiaryDefault,
      ':not(:is([aria-selected=true])):hover': colors.textTertiaryHover,
      ':is([aria-selected=true])': colors.textBlueDefault
    },
    cursor: 'pointer',
    transition: 'color 0.2s'
  },
  all: {
    color: {
      default: colors.textBlueDefault,
      ':hover': colors.textBlueHover
    },
    cursor: 'pointer',
    marginLeft: 'auto',
    textDecoration: 'underline',
    transition: 'all 0.2s'
  },
  count: {
    color: colors.textSecondaryDefault
  },
  circle: (backgroundColor: string) => ({
    backgroundColor,
    borderRadius: '50%',
    height: 11,
    width: 11
  }),
  topics: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    listStyle: 'none',
    margin: 0,
    maxHeight: 610,
    overflow: 'auto',
    padding: 0,
    '::-webkit-scrollbar': {
      background: 'transparent',
      display: 'none',
      height: 0,
      width: 0
    }
  },
  topic: {
    alignItems: 'center',
    backgroundColor: '#232333',
    borderRadius: 10,
    display: 'flex',
    paddingBlock: 2,
    paddingInline: 8
  },
  index: {
    color: colors.textTertiaryDefault,
    padding: 10
  },
  name: {
    overflow: 'hidden',
    padding: 10,
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    width: '37%'
  },
  header: {
    alignItems: 'center',
    display: 'flex',
    gap: 10
  },
  block: (width: number) => ({
    alignItems: 'center',
    color: colors.textSecondaryDefault,
    display: 'flex',
    gap: 10,
    justifyContent: 'flex-start',
    padding: 10,
    width
  })
});
