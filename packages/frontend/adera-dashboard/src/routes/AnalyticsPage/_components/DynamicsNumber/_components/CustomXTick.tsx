import * as stylex from '@stylexjs/stylex';
import { text } from '@adera/ui';
import { colors } from '@adera/ui/tokens.stylex';

interface CustomTickProps {
  x?: number;
  y?: number;
  payload: { value: string | number; index?: number };
  activeIndex: number | null;
}

export const CustomXTick = ({ x, y, payload, activeIndex }: CustomTickProps) => {
  const isActive = payload.index === activeIndex;

  const _y = (y ?? 0) + 15;
  const _x = x ?? 0;

  return (
    <text x={_x} y={_y} textAnchor="middle" aria-selected={isActive} {...stylex.props(text.smallMedium, styles.root)}>
      {payload.value}
    </text>
  );
};

const styles = stylex.create({
  root: {
    color: {
      default: colors.black40,
      ':is([aria-selected=true])': colors.textBlueDefault
    },
    fontWeight: 700,
    paddingBlock: 4
  }
});
