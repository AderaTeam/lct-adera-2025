import * as stylex from '@stylexjs/stylex';

export const Skeleton = () => {
  return <div {...stylex.props(styles.root)}></div>;
};

const shine = stylex.keyframes({
  '0%': { backgroundPosition: '200% 0' },
  '100%': { backgroundPosition: '-100% 0' }
});

const styles = stylex.create({
  root: {
    animationDuration: '1.5s',
    animationIterationCount: 'infinite',
    animationName: shine,
    animationTimingFunction: 'linear',
    backgroundColor: '#22222E',
    backgroundImage: 'linear-gradient(90deg, #22222E 0%, #33333fff 20%, #22222E 40%)',
    backgroundSize: '200% 100%',
    height: '100%',
    width: '100%'
  }
});
