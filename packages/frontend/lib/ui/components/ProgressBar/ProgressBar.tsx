import * as stylex from '@stylexjs/stylex';
import { StyleXStyles } from '@stylexjs/stylex';
import { colors } from '../../tokens.stylex';
import { text } from '../../utils/text';
import { Stack } from '../Stack';
import { ProgressBarVariant } from './ProgressBar.types';

interface ProgressBarProps {
  value?: number;

  max?: number;

  description?: string;

  title?: string;

  variant?: ProgressBarVariant;

  style?: StyleXStyles;
}

export const ProgressBar = ({
  value,
  max,
  description,
  title,
  variant = ProgressBarVariant.primary,
  style
}: ProgressBarProps) => {
  const percent = value && max ? Math.floor((value / max) * 100) : 0;

  return (
    <Stack gap={4} style={[text.defaultMedium, styles.root, style]}>
      <div>
        {!!title && <span {...stylex.props(text.defaultSemibold)}>{title}: </span>}
        <span {...stylex.props(styles[`${variant}Text`])}>
          {value}/{max}
        </span>{' '}
        {description}
      </div>
      <div>
        <div {...stylex.props(styles.bar)}>
          <div {...stylex.props(styles.progress(percent), styles[variant])}></div>
        </div>
      </div>
    </Stack>
  );
};

const styles = stylex.create({
  root: {
    color: colors.textSecondaryDefault
  },
  bar: {
    backgroundColor: colors.backgroundNeutralDefault,
    borderRadius: 2,
    height: 8,
    overflow: 'hidden',
    position: 'relative',
    width: '100%'
  },
  progress: (width: number) => ({
    height: '100%',
    width: `${String(width)}%`,
    borderRadius: 2
  }),
  primary: {
    backgroundColor: colors.brand80
  },
  secondary: {
    backgroundColor: colors.blue70
  },
  primaryText: {
    color: colors.brand80
  },
  secondaryText: {
    color: colors.blue80
  }
});
