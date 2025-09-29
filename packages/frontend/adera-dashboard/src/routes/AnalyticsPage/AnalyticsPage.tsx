import * as stylex from '@stylexjs/stylex';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useAuthFetch } from '@adera/auth-fetch';
import { Container, Flex, Grid, headers } from '@adera/ui';
import { colors } from '@adera/ui/tokens.stylex';
import { Filters } from 'features/Filters';
import { Tonality } from 'features/Tonality';
import { TopReviews } from 'features/TopReviews';
import { AnomalyPeriods } from './_components/AnomalyPeriods';
import { DynamicsNumber } from './_components/DynamicsNumber';
import { DynamicsTonality } from './_components/DynamicsTonality';
import { MostReviews } from './_components/MostReviews';

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
  const authFetch = useAuthFetch();
  const { data: dashboard } = useSuspenseQuery({
    queryKey: ['analytics-dashboard'],
    queryFn: () => authFetch('/analytics/dashboard')
  });

  return (
    <main>
      <Container style={styles.root}>
        <Flex justify="space-between">
          <h1 {...stylex.props(headers.h1Semibold)}>Общая аналитика</h1>
          <Filters />
        </Flex>
        <Grid gap={20} rowGap={20}>
          <Tonality
            positiveCount={dashboard.summary.positiveCount}
            neutralCount={dashboard.summary.neutralCount}
            negativeCount={dashboard.summary.negativeCount}
          />
          <TopReviews topics={data.topics} />
          <DynamicsTonality />
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
    color: colors.textPrimaryDefault,
    display: 'flex',
    flexDirection: 'column',
    gap: 32
  }
});
