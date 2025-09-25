import * as stylex from '@stylexjs/stylex';
import { Grid, MoodSadIcon, MoodSmileIcon, Stack, text } from '@adera/ui';
import { colors } from '@adera/ui/tokens.stylex';
import { Card } from 'components/Card';

export const AnomalyPeriods = () => {
  return (
    <Grid.Col span={3}>
      <Card style={styles.root}>
        <div {...stylex.props(text.subheaderBold)}>Аномальные периоды</div>
        <Stack gap={8}>
          <div {...stylex.props(styles.period)}>
            <Stack gap={8}>
              <div {...stylex.props(styles.icon('rgba(57, 191, 115, 0.25)', colors.statusSuccess))}>
                <MoodSmileIcon />
              </div>
              <Stack gap={2}>
                <div {...stylex.props(text.defaultBold, styles.countSuccess)}>12 отзывов</div>
                <div {...stylex.props(text.defaultRegular)}>Самый позитивный</div>
              </Stack>
            </Stack>

            <div {...stylex.props(styles.date, text.defaultBold)}>Октябрь 2024</div>
          </div>

          <div {...stylex.props(styles.period)}>
            <Stack gap={8}>
              <div {...stylex.props(styles.icon('rgba(234, 96, 74, 0.25)', colors.statusError))}>
                <MoodSadIcon />
              </div>
              <Stack gap={2}>
                <div {...stylex.props(text.defaultBold, styles.countError)}>12 отзывов</div>
                <div {...stylex.props(text.defaultRegular)}>Самый негативный </div>
              </Stack>
            </Stack>

            <div {...stylex.props(styles.date, text.defaultBold)}>Сентябрь 2024</div>
          </div>
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
  period: {
    backgroundColor: '#22222E',
    borderRadius: 10,
    color: colors.textSecondaryDefault,
    display: 'flex',
    gap: 8,
    justifyContent: 'space-between',
    paddingBlock: 12,
    paddingInline: 16
  },
  icon: (backgroundColor: string, color: string) => ({
    alignItems: 'center',
    backgroundColor,
    borderRadius: 8,
    color,
    display: 'flex',
    justifyContent: 'center',
    padding: 4,
    width: 'fit-content'
  }),
  countSuccess: {
    color: colors.statusSuccess
  },
  countError: {
    color: colors.statusError
  },
  date: {
    alignItems: 'center',
    borderColor: colors.outlinePrimaryDefault,
    borderRadius: 10,
    borderStyle: 'solid',
    borderWidth: 2,
    display: 'flex',
    justifyContent: 'center',
    paddingBlock: 15,
    paddingInline: 10,
    textAlign: 'center',
    width: 100
  }
});
