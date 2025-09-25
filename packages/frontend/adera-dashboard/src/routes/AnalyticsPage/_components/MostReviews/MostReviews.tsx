import * as stylex from '@stylexjs/stylex';
import { Flex, Grid, headers, Stack, text } from '@adera/ui';
import { colors } from '@adera/ui/tokens.stylex';
import { Card } from 'components/Card';
import { ReviewBar } from 'components/ReviewBar';

export const MostReviews = () => {
  return (
    <Grid.Col span={3}>
      <Card style={styles.root}>
        <div {...stylex.props(text.subheaderBold)}>Больше всего отзывов</div>
        <Stack style={styles.content} gap={16}>
          <Flex style={styles.block} gap={16}>
            <Stack style={styles.stat} gap={8}>
              <Flex gap={10} align="flex-end">
                <div {...stylex.props(headers.numeric)}>12</div>
                <Flex style={[styles.percent, text.subheaderSemibold]} gap={6}>
                  <div {...stylex.props(styles.circle)}></div> 60%
                </Flex>
              </Flex>
              <ReviewBar positiveCount={10} negativeCount={3} neutralCount={4} />
            </Stack>
            <div {...stylex.props(styles.date, text.defaultBold)}>
              01.10.24 <br /> - <br /> 01.11.24
            </div>
          </Flex>
          <Flex style={styles.block} gap={12}>
            <h1 {...stylex.props(headers.h1Medium)}>5</h1> <div>- обычно в среднем за период</div>
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
