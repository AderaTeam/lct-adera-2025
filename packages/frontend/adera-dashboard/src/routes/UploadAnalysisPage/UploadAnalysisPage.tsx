import * as stylex from '@stylexjs/stylex';
import { useSuspenseQuery } from '@tanstack/react-query';
import { NavLink, useParams } from 'react-router-dom';
import { useAuthFetch } from '@adera/auth-fetch';
import { ArrowLeftIconL, Container, Flex, Grid, headers } from '@adera/ui';
import { colors } from '@adera/ui/tokens.stylex';
import { Tonality } from 'features/Tonality';
import { TopReviews } from 'features/TopReviews';
import { ApiFileAnalysisDetail } from 'store/_types';
import { formatDate } from 'utils/formatDate';
import { invariant } from 'utils/invariant';
import { CountsChart } from './_components/CountsChart';
import { ModalFilter } from 'features/ModalFilter';
import { useState } from 'react';

export const UploadAnalysisPage = () => {
  const { id } = useParams();
  invariant(id);

  const [filters, setFilters] = useState<string>('all');

  const authFetch = useAuthFetch();
  const { data: fileAnalysis } = useSuspenseQuery({
    queryKey: ['file-analysis', { id, filters }],
    queryFn: () => {
      const params = new URLSearchParams();
      if (filters && filters !== 'all') params.set('topics', filters);
      return authFetch<ApiFileAnalysisDetail>(`/file-analysis/${id}?${params}`);
    }
  });

  const { data: topics } = useSuspenseQuery({
    queryKey: ['file-analysis-topics', { id }],
    queryFn: () => {
      return authFetch<{ id: number; name: string }[]>(`/file-analysis/topics/${id}`);
    }
  });

  const topicCounts = fileAnalysis.topics.map((t) => ({ name: t.name, count: t.negative + t.neutral + t.positive }));

  const topicOptions = topics.map((t) => ({ label: t.name, value: t.name }));

  const handleUpdateFilters = (filterState: string) => {
    setFilters(filterState);
  };

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
          <ModalFilter
            isMax
            label="Продукты"
            style={styles.topics}
            description="Выберите продукты, которые будут использованы в построении аналитики на дашборде"
            options={topicOptions}
            value={filters}
            onFilterUpdate={(filter) => {
              handleUpdateFilters(filter);
            }}
          />
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
  },
  topics: {
    maxWidth: 900
  }
});
