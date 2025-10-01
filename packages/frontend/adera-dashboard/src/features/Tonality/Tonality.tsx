import { Fragment, ReactNode } from 'react';
import * as stylex from '@stylexjs/stylex';
import { Grid, headers, MessageIconM, text } from '@adera/ui';
import { colors } from '@adera/ui/tokens.stylex';
import { Card } from 'components/Card';
import { calcPercents } from 'utils/calcPercents';
import { NegativeIcon, NeutralIcon, PositiveIcon } from './_icons';

export const Tonality = ({
  positiveCount,
  neutralCount,
  negativeCount
}: {
  positiveCount: number;
  neutralCount: number;
  negativeCount: number;
}) => {
  const [positivePercent, neutralPercent, negativePercent] = calcPercents([positiveCount, neutralCount, negativeCount]);

  const max = positiveCount + neutralCount + negativeCount;

  return (
    <Fragment>
      <TonalityCard
        label="Положительные"
        percent={positivePercent}
        count={positiveCount}
        max={max}
        icon={<PositiveIcon />}
      />
      <TonalityCard
        label="Нейтральные"
        percent={neutralPercent}
        count={neutralCount}
        max={max}
        icon={<NeutralIcon />}
      />
      <TonalityCard
        label="Отрицательные"
        percent={negativePercent}
        count={negativeCount}
        max={max}
        icon={<NegativeIcon />}
      />
    </Fragment>
  );
};

interface TonalityCardProps {
  label: string;
  count: number;
  percent: number;
  icon?: ReactNode;
  max: number;
}

const TonalityCard = ({ label, count, max, percent, icon }: TonalityCardProps) => {
  return (
    <Grid.Col span={3}>
      <Card style={styles.card}>
        <div {...stylex.props(text.subheaderBold)}>
          {label} <br /> упоминания
        </div>
        <div {...stylex.props(styles.percent)}>
          {icon}
          <div {...stylex.props(headers.numeric)}>{percent}%</div>
        </div>
        <div {...stylex.props(styles.description, text.subheaderMedium)}>
          <MessageIconM /> ({count}/{max})
        </div>
      </Card>
    </Grid.Col>
  );
};

const styles = stylex.create({
  card: {
    display: 'flex',
    flexDirection: 'column',
    gap: 20
  },
  percent: {
    alignItems: 'center',
    display: 'flex',
    gap: 4
  },
  description: {
    alignItems: 'center',
    color: colors.textTertiaryDefault,
    display: 'flex',
    gap: 5
  }
});
