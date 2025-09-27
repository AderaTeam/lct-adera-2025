import { useState } from 'react';
import * as stylex from '@stylexjs/stylex';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Flex, Grid, text } from '@adera/ui';
import { colors } from '@adera/ui/tokens.stylex';
import { Card } from 'components/Card';
import { CustomXTick, CustomYTick } from '../CustomTick';
import { CustomTooltip } from '../CustomTooltip';

const data = [
  {
    name: 'Page A',
    uv: 10
  },
  {
    name: 'Page B',
    uv: 20
  },
  {
    name: 'Page C',
    uv: 60
  },
  {
    name: 'Page D',
    uv: 80
  },
  {
    name: 'Page E',
    uv: 20
  },
  {
    name: 'Page F',
    uv: 40
  },
  {
    name: 'Page G',
    uv: 100
  }
];

export const DynamicsNumber = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <Grid.Col span={9}>
      <Card style={styles.root}>
        <Flex gap={10}>
          <div {...stylex.props(text.subheaderBold)}>Динамика количества отзывов</div>
        </Flex>

        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            onMouseMove={(state) => {
              if (state.isTooltipActive && state.activeTooltipIndex) setActiveIndex(+state.activeTooltipIndex);
              else setActiveIndex(null);
            }}
            onMouseLeave={() => {
              setActiveIndex(null);
            }}
            data={data}
            margin={{
              top: 5,
              right: 5,
              left: -25,
              bottom: 0
            }}>
            <defs>
              <linearGradient id="uvGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={colors.blue80} stopOpacity={0.3} />
                <stop offset="100%" stopColor="#47FFD4" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              stroke="#F1F1F11A"
              strokeDasharray="0"
              horizontalCoordinatesGenerator={({ offset }) => {
                const top = offset.top;
                return [top];
              }}
            />

            <XAxis
              tick={(props) => <CustomXTick {...props} activeIndex={activeIndex} />}
              tickMargin={5}
              dataKey="name"
              stroke="#F1F1F11A"
            />
            <YAxis tick={(props) => <CustomYTick {...props} />} tickMargin={16} stroke="#F1F1F11A" />
            <Tooltip
              content={(props) => (
                <CustomTooltip>{!!(props.payload.length && props.active) && props.payload[0].value}</CustomTooltip>
              )}
              cursor={{
                stroke: colors.blue80,
                strokeWidth: 2,
                strokeDasharray: '8 4'
              }}
            />
            <Area
              style={{ outline: 'none' }}
              tabIndex={-1}
              type="linear"
              dataKey="uv"
              strokeWidth={3}
              stroke={colors.blue80}
              fill="url(#uvGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </Card>
    </Grid.Col>
  );
};

const styles = stylex.create({
  root: {
    display: 'flex',
    flexDirection: 'column',
    gap: 24
  }
});
