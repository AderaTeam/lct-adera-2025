import * as stylex from '@stylexjs/stylex';
import { Container, Flex, Grid, headers } from '@adera/ui';
import { colors } from '@adera/ui/tokens.stylex';
import { Filters, useFilters } from 'features/Filters';
import { Tonality } from 'features/Tonality';
import { TopReviews } from 'features/TopReviews';
import { AnomalyPeriods } from './_components/AnomalyPeriods';
import { DynamicsNumber } from './_components/DynamicsNumber';
import { DynamicsTonality } from './_components/DynamicsTonality';
import { MostReviews } from './_components/MostReviews';
import { useDashboard } from './useDashboard';

export const AnalyticsPage = () => {
  const { filters } = useFilters();
  const { data: dashboard } = useDashboard(filters);

  if (!dashboard) return null;

  const maxReviewsDataTone = dashboard.toneDynamics.find((d) => d.name === dashboard.maxReviewsData.name);

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
          <DynamicsTonality dynamics={dashboard.toneDynamics} />
          <AnomalyPeriods anomalies={dashboard.anomalies} />
          <DynamicsNumber dynamics={dashboard.dynamics} />
          <MostReviews
            avgReviews={dashboard.avgReviews}
            maxReviewsData={dashboard.maxReviewsData}
            maxReviewsDataTone={maxReviewsDataTone}
          />
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
