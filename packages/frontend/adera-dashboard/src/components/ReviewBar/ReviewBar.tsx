import * as stylex from '@stylexjs/stylex';
import { colors } from '@adera/ui/tokens.stylex';
import { calcPercents } from 'utils/calcPercents';

export const ReviewBar = ({ positive, neutral, negative }: { positive: number; neutral: number; negative: number }) => {
  const [positivePercent, neutralPercent, negativePercent] = calcPercents([positive, neutral, negative]);

  return (
    <div {...stylex.props(styles.root)}>
      <ReviewBarPart percent={positivePercent} color={colors.statusSuccess} />
      <ReviewBarPart percent={neutralPercent} color={colors.statusNeutral} />
      <ReviewBarPart percent={negativePercent} color={colors.statusError} />
    </div>
  );
};

const ReviewBarPart = ({ percent, color }: { percent: number; color: string }) => {
  return <div {...stylex.props(styles.part(`${percent.toString()}%`, color))}></div>;
};

const styles = stylex.create({
  root: {
    alignItems: 'center',
    backgroundColor: '#323248',
    borderRadius: 4,
    display: 'flex',
    height: 8,
    overflow: 'hidden',
    width: '100%'
  },
  part: (width: string, backgroundColor: string) => ({
    backgroundColor,
    height: 8,
    width
  })
});
