import * as stylex from '@stylexjs/stylex';
import { useSuspenseQuery } from '@tanstack/react-query';
import { NavLink, useParams } from 'react-router-dom';
import { useAuthFetch } from '@adera/auth-fetch';
import { ArrowLeftIconL, Container, Flex, Grid, headers } from '@adera/ui';
import { colors } from '@adera/ui/tokens.stylex';
import { Filters } from 'features/Filters';
import { Tonality } from 'features/Tonality';
import { TopReviews } from 'features/TopReviews';
import { ApiFileAnalysisDetail } from 'store/_types';
import { formatDate } from 'utils/formatDate';
import { invariant } from 'utils/invariant';
import { CountsChart } from './_components/CountsChart';

export const UploadAnalysisPage = () => {
  const { id } = useParams();
  invariant(id);

  const authFetch = useAuthFetch();
  const { data: fileAnalysis } = useSuspenseQuery({
    queryKey: ['file-analysis', { id }],
    queryFn: () => authFetch<ApiFileAnalysisDetail>(`/file-analysis/${id}`)
  });

  const topicCounts = fileAnalysis.topics.map((t) => ({ name: t.name, count: t.negative + t.neutral + t.positive }));

  return (
    <main>
      <Container style={styles.root}>
        <Flex justify="space-between">
          <Flex gap={12}>
            <NavLink to={'/upload'}>
              <ArrowLeftIconL color={colors.textBlueDefault} />
            </NavLink>
            <h1 {...stylex.props(headers.h1Semibold)}>
              Данные от {formatDate(fileAnalysis.createdAt, { showTime: true })}
            </h1>
          </Flex>
          <Filters />
        </Flex>

        <Grid gap={20} rowGap={20}>
          <Tonality
            positiveCount={fileAnalysis.summary.positive}
            neutralCount={fileAnalysis.summary.neutral}
            negativeCount={fileAnalysis.summary.negative}
          />
          <TopReviews topics={fileAnalysis.topics} />
          <CountsChart topics={topicCounts} />
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
