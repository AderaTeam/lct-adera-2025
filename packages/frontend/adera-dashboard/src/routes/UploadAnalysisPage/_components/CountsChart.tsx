import { useState } from 'react';
import * as stylex from '@stylexjs/stylex';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  TooltipProps,
  BarProps
} from 'recharts';
import { Flex, Grid, Stack, text } from '@adera/ui';
import { colors } from '@adera/ui/tokens.stylex';
import { Card } from 'components/Card';
import { CustomXTick, CustomYTick } from 'routes/AnalyticsPage/_components/CustomTick';
import { CustomTooltip } from 'routes/AnalyticsPage/_components/CustomTooltip';
import { getWordForm } from 'utils/getWordForm';

interface CustomPayload {
  value: number;
  payload: {
    name: string;
  };
}

export const CountsChart = ({
  topics
}: {
  topics: {
    name: string;
    count: number;
  }[];
}) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <Grid.Col span={12}>
      <Card style={styles.root}>
        <Flex gap={10}>
          <div {...stylex.props(text.subheaderBold)}>Динамика количества отзывов</div>
        </Flex>

        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            onMouseMove={(state) => {
              if (state.isTooltipActive && state.activeTooltipIndex) setActiveIndex(+state.activeTooltipIndex);
              else setActiveIndex(null);
            }}
            onMouseLeave={() => {
              setActiveIndex(null);
            }}
            margin={{
              top: 10,
              right: 5,
              left: -20,
              bottom: 0
            }}
            data={topics}>
            <XAxis
              tick={(props) => <CustomXTick {...props} activeIndex={activeIndex} />}
              tickMargin={5}
              dataKey="name"
              stroke="#F1F1F133"
              strokeDasharray={8}
            />
            <YAxis tick={(props) => <CustomYTick {...props} />} tickMargin={16} stroke="#F1F1F133" />
            <Tooltip
              content={(props: TooltipProps<number, string> & { payload?: CustomPayload[] }) => {
                console.log(props.payload);
                return (
                  <CustomTooltip>
                    {!!(!!props.payload && props.payload.length && props.active) && (
                      <Stack style={styles.tooltip} gap={6}>
                        <div {...stylex.props(text.defaultSemibold, styles.title)}>
                          {props.payload[0].value} {getWordForm(props.payload[0].value, ['отзыв', 'отзыва', 'отзывов'])}
                        </div>
                        <div>- {props.payload[0].payload.name}</div>
                      </Stack>
                    )}
                  </CustomTooltip>
                );
              }}
              cursor={false}
            />

            <Bar
              dataKey="count"
              background={false}
              fill="#1E52FF"
              radius={[12, 12, 0, 0]}
              shape={(props: BarProps & { chartHeight?: number }) => {
                const { x, width = 120, y, height, index, chartHeight = 200 } = props;
                const isActive = index === activeIndex;

                const _width = Number(+width > 120 ? 120 : width);
                const offsetX = +(x ?? 0) + (+width - _width) / 2;

                return (
                  <g stroke={isActive ? colors.blue80 : 'none'} strokeWidth={isActive ? 2 : 0}>
                    <rect x={offsetX} y={10} width={_width} height={chartHeight} fill="#FFFFFF0D" rx={12} ry={12} />
                    <rect x={offsetX} y={y} width={_width} height={height} fill="#1E52FF" rx={12} ry={12} />
                  </g>
                );
              }}
            />

            <CartesianGrid
              stroke="#F1F1F133"
              strokeDasharray="8px"
              vertical={false}
              horizontalCoordinatesGenerator={({ height }) => {
                return [0 + 10, height / 2];
              }}
            />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </Grid.Col>
  );
};

const styles = stylex.create({
  root: {
    display: 'flex',
    flexDirection: 'column',
    gap: 24,
    height: 355
  },
  title: {
    color: colors.textPrimaryDefault
  },
  tooltip: {
    maxWidth: 200
  }
});
