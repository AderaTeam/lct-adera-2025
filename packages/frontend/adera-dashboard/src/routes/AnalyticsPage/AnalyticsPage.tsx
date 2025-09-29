import * as stylex from '@stylexjs/stylex';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useAuthFetch } from '@adera/auth-fetch';
import { Container, Flex, Grid, headers } from '@adera/ui';
import { colors } from '@adera/ui/tokens.stylex';
import { Filters } from 'features/Filters';
import { Tonality } from 'features/Tonality';
import { TopReviews } from 'features/TopReviews';
import { ApiDashboard } from 'store/_types';
import { AnomalyPeriods } from './_components/AnomalyPeriods';
import { DynamicsNumber } from './_components/DynamicsNumber';
import { DynamicsTonality } from './_components/DynamicsTonality';
import { MostReviews } from './_components/MostReviews';

export const AnalyticsPage = () => {
  const authFetch = useAuthFetch();
  const { data: dashboard } = useSuspenseQuery<ApiDashboard>({
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
            positiveCount={dashboard.summary.positive}
            neutralCount={dashboard.summary.neutral}
            negativeCount={dashboard.summary.negative}
          />
          <TopReviews topics={dashboard.topics} />
          <DynamicsTonality />
          <AnomalyPeriods />
          <DynamicsNumber dynamics={dashboard.dynamics} />
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
