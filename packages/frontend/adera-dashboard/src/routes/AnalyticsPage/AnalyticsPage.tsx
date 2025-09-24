import { Container, Grid } from '@adera/ui';
import { Card } from 'components/Card';

export const AnalyticsPage = () => {
  return (
    <main>
      <Container>
        <header></header>
        <Grid columnGap={12} rowGap={16}>
          <Grid.Col span={3}>
            <Card></Card>
          </Grid.Col>
          <Grid.Col span={3}>
            <Card></Card>
          </Grid.Col>
          <Grid.Col span={3}>
            <Card></Card>
          </Grid.Col>
          <Grid.Col span={3}>
            <Card></Card>
          </Grid.Col>

          <Grid.Col span={12}>
            <Card></Card>
          </Grid.Col>
        </Grid>
      </Container>
    </main>
  );
};
