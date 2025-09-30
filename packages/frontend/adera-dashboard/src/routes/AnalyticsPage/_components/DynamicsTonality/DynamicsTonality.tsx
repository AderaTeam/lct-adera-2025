import { useState } from 'react';
import * as stylex from '@stylexjs/stylex';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Line, LineChart, TooltipProps } from 'recharts';
import { Flex, Grid, text } from '@adera/ui';
import { colors } from '@adera/ui/tokens.stylex';
import { Card } from 'components/Card';
import { CustomXTick, CustomYTick } from '../CustomTick';
import { CustomTooltip } from '../CustomTooltip';

interface CustomPayload {
  value: number;
}

export const DynamicsTonality = ({
  dynamics = []
}: {
  dynamics: {
    name: string;
    positive: number;
    negative: number;
    neutral: number;
  }[];
}) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const keys = [
    { key: 'positive', color: '#37CD78' },
    { key: 'neutral', color: '#D0B938' },
    { key: 'negative', color: '#D46958' }
  ];

  return (
    <Grid.Col span={9}>
      <Card style={styles.root}>
        <Flex justify="space-between">
          <Flex gap={10}>
            <div {...stylex.props(text.subheaderBold)}>Динамика тональности</div>
          </Flex>
          <Flex gap={10}></Flex>
        </Flex>

        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            onMouseMove={(state) => {
              if (state.isTooltipActive && state.activeTooltipIndex) setActiveIndex(+state.activeTooltipIndex);
              else setActiveIndex(null);
            }}
            onMouseLeave={() => {
              setActiveIndex(null);
            }}
            data={dynamics}
            margin={{
              top: 5,
              right: 5,
              left: -12,
              bottom: 0
            }}>
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
              content={(props: TooltipProps<number, string> & { payload?: CustomPayload[] }) => (
                <CustomTooltip>
                  {!!(!!props.payload && props.payload.length && props.active) && (
                    <Flex style={styles.flex} gap={6}>
                      <Flex gap={4}>
                        <div {...stylex.props(styles.circle(colors.statusSuccess))}></div> {props.payload[0].value}
                      </Flex>
                      <Flex gap={4}>
                        <div {...stylex.props(styles.circle(colors.statusNeutral))}></div> {props.payload[1].value}
                      </Flex>
                      <Flex gap={4}>
                        <div {...stylex.props(styles.circle(colors.statusError))}></div> {props.payload[2].value}
                      </Flex>
                    </Flex>
                  )}
                </CustomTooltip>
              )}
              cursor={{
                stroke: colors.blue80,
                strokeWidth: 2,
                strokeDasharray: '8 4'
              }}
            />
            {keys.map((l) => (
              <Line
                key={l.key}
                isAnimationActive={false}
                type="linear"
                dataKey={l.key}
                stroke={l.color}
                dot={false}
                strokeWidth={3}
              />
            ))}
          </LineChart>
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
  },
  flex: {
    paddingInline: 10
  },
  circle: (backgroundColor: string) => ({
    backgroundColor,
    borderRadius: '50%',
    height: 11,
    width: 11
  })
});
