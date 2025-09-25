import * as stylex from '@stylexjs/stylex';
import { text } from '@adera/ui';
import { colors } from '@adera/ui/tokens.stylex';

interface CustomTickProps {
  x?: number;
  y?: number;
  payload: { value: string | number; index?: number };
}

export const CustomYTick = ({ x, y, payload }: CustomTickProps) => {
  const _y = y ?? 0;
  const _x = x ?? 0;

  return (
    <text x={_x} y={_y} textAnchor="middle" fill={colors.black40} {...stylex.props(text.smallMedium)}>
      {payload.value}
    </text>
  );
};
