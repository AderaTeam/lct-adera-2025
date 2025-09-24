import { Fragment, ReactNode } from 'react';
import * as stylex from '@stylexjs/stylex';
import { Grid, headers, MessageIcon, text } from '@adera/ui';
import { Card } from 'components/Card';
import { colors } from '@adera/ui/tokens.stylex';
import { NegativeIcon, NeutralIcon, PositiveIcon } from 'routes/AnalyticsPage/_icons';

export const Tonality = ({
  positiveCount,
  neutralCount,
  negativeCount
}: {
  positiveCount: number;
  neutralCount: number;
  negativeCount: number;
}) => {
  const max = positiveCount + negativeCount + neutralCount;

  return (
    <Fragment>
      <TonalityCard label="Положительные" count={positiveCount} max={max} icon={<PositiveIcon />} />
      <TonalityCard label="Нейтральные" count={neutralCount} max={max} icon={<NeutralIcon />} />
      <TonalityCard label="Негативные" count={negativeCount} max={max} icon={<NegativeIcon />} />
    </Fragment>
  );
};

interface TonalityCardProps {
  label: string;
  count: number;
  icon?: ReactNode;
  max: number;
}

const TonalityCard = ({ label, count, max, icon }: TonalityCardProps) => {
  const percent = count && max ? Math.floor((count / max) * 100) : 0;

  return (
    <Grid.Col span={3}>
      <Card style={styles.card}>
        <div {...stylex.props(text.subheaderBold)}>
          {label} <br /> отзывы
        </div>
        <div {...stylex.props(styles.percent)}>
          {icon}
          <div {...stylex.props(headers.numeric)}>{percent}%</div>
        </div>
        <div {...stylex.props(styles.description, text.subheaderMedium)}>
          <MessageIcon /> ({count}/{max})
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
    display: 'flex',
    gap: 5,
    color: colors.textTertiaryDefault
  }
});
