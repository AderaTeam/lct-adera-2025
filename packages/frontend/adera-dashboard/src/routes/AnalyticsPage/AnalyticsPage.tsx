import * as stylex from '@stylexjs/stylex';
import { Container, Grid } from '@adera/ui';
import { colors } from '@adera/ui/tokens.stylex';
import { Card } from 'components/Card';
import { AnomalyPeriods } from './_components/AnomalyPeriods';
import { DynamicsNumber } from './_components/DynamicsNumber';
import { MostReviews } from './_components/MostReviews';
import { Tonality } from './_components/Tonality';
import { TopReviews } from './_components/TopReviews';

const data = {
  topics: [
    { name: 'Кредиты', positiveCount: 30, neutralCount: 20, negativeCount: 15 },
    { name: 'Перевод', positiveCount: 90, neutralCount: 2, negativeCount: 78 },
    { name: 'Мобильное приложение', positiveCount: 10, neutralCount: 20, negativeCount: 37 },
    { name: 'Банкоматы', positiveCount: 70, neutralCount: 14, negativeCount: 36 },
    { name: 'Обслуживание', positiveCount: 11, neutralCount: 20, negativeCount: 22 }
  ],
  counts: {
    positiveCount: 211,
    neutralCount: 66,
    negativeCount: 208
  }
};

export const AnalyticsPage = () => {
  return (
    <main {...stylex.props(styles.root)}>
      <Container>
        <Grid gap={20} rowGap={20}>
          <Tonality
            positiveCount={data.counts.positiveCount}
            neutralCount={data.counts.neutralCount}
            negativeCount={data.counts.negativeCount}
          />
          <TopReviews topics={data.topics} />
          <Grid.Col span={9}>
            <Card></Card>
          </Grid.Col>
          <AnomalyPeriods />
          <DynamicsNumber />
          <MostReviews />
        </Grid>
      </Container>
    </main>
  );
};

const styles = stylex.create({
  root: {
    color: colors.textPrimaryDefault
  }
});
