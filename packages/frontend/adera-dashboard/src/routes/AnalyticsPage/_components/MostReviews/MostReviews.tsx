import * as stylex from '@stylexjs/stylex';
import { Flex, Grid, headers, Stack, text } from '@adera/ui';
import { colors } from '@adera/ui/tokens.stylex';
import { Card } from 'components/Card';
import { ReviewBar } from 'components/ReviewBar';
import { calcPercents } from 'utils/calcPercents';

export const MostReviews = ({
  avgReviews,
  maxReviewsData,
  maxReviewsDataTone
}: {
  avgReviews: number;
  maxReviewsData: {
    name: string;
    count: number;
  };
  maxReviewsDataTone?: {
    name: string;
    positive: number;
    negative: number;
    neutral: number;
  };
}) => {
  const [positivePercent] = maxReviewsDataTone
    ? calcPercents([maxReviewsDataTone.positive, maxReviewsDataTone.neutral, maxReviewsDataTone.negative])
    : [0];

  return (
    <Grid.Col span={3}>
      <Card style={styles.root}>
        <div {...stylex.props(text.subheaderBold)}>Больше всего отзывов</div>
        <Stack style={styles.content} gap={16}>
          <Flex style={styles.block} gap={16}>
            <Stack style={styles.stat} gap={8}>
              <Flex gap={10} align="flex-end">
                <div {...stylex.props(headers.numeric)}>{maxReviewsData.count}</div>
                <Flex style={[styles.percent, text.subheaderSemibold]} gap={6}>
                  <div {...stylex.props(styles.circle)}></div> {positivePercent}%
                </Flex>
              </Flex>
              {maxReviewsDataTone && <ReviewBar {...maxReviewsDataTone} />}
            </Stack>
            <div {...stylex.props(styles.date, text.defaultBold)}>{maxReviewsData.name}</div>
          </Flex>
          <Flex style={styles.block} gap={12}>
            <h1 {...stylex.props(headers.h1Medium)}>{avgReviews}</h1> <div>- в среднем за период</div>
          </Flex>
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
  content: {
    paddingBlock: 14
  },
  block: {
    backgroundColor: '#22222E',
    borderRadius: 10,
    padding: 16
  },
  stat: {
    flex: '1'
  },
  date: {
    alignItems: 'center',
    borderColor: colors.outlinePrimaryDefault,
    borderRadius: 10,
    borderStyle: 'solid',
    borderWidth: 2,
    color: colors.textSecondaryDefault,
    display: 'flex',
    height: '100%',
    justifyContent: 'center',
    paddingBlock: 6,
    paddingInline: 10,
    textAlign: 'center',
    width: 100
  },
  percent: {
    color: colors.statusSuccess,
    marginBottom: 5
  },
  circle: {
    backgroundColor: colors.statusSuccess,
    borderRadius: '50%',
    height: 12,
    width: 12
  }
});
