import * as stylex from '@stylexjs/stylex';
import { styles } from './WizardLoader.styles';

export const WizardLoader = () => {
  return (
    <div {...stylex.props(styles.scene)}>
      <div {...stylex.props(styles.objects)}>
        <div {...stylex.props(styles.square)} />
        <div {...stylex.props(styles.circle)} />
        <div {...stylex.props(styles.triangle)} />
      </div>
      <div {...stylex.props(styles.wizard)}>
        <div {...stylex.props(styles.body)} />
        <div {...stylex.props(styles.right_arm)}>
          <div {...stylex.props(styles.right_hand)} />
        </div>
        <div {...stylex.props(styles.left_arm)}>
          <div {...stylex.props(styles.left_hand)} />
        </div>
        <div {...stylex.props(styles.head)}>
          <div {...stylex.props(styles.beard)} />
          <div {...stylex.props(styles.face)}>
            <div {...stylex.props(styles.adds)} />
          </div>
          <div {...stylex.props(styles.hat)}>
            <div {...stylex.props(styles.hatOfTheHat)} />
            <div {...stylex.props(styles.star, styles.first)} />
            <div {...stylex.props(styles.star, styles.second)} />
            <div {...stylex.props(styles.star, styles.third)} />
          </div>
        </div>
      </div>
    </div>
  );
};
