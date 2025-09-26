import { useState } from 'react';
import * as RadixCheckbox from '@radix-ui/react-checkbox';
import { StyleXStyles } from '@stylexjs/stylex';
import * as stylex from '@stylexjs/stylex';
import { useUncontrolled } from '../../hooks/useUncontrolled';
import { colors } from '../../tokens.stylex';
import CheckIcon from './check.svg?react';
import { useCheckboxGroup } from './CheckboxGroup.context';
import MinusIcon from './minus.svg?react';

export interface CheckboxProps extends Omit<RadixCheckbox.CheckboxProps, 'style' | 'value'> {
  style?: StyleXStyles;

  value?: string;
}

export function Checkbox({ style, checked, defaultChecked, onCheckedChange, value, ...props }: CheckboxProps) {
  const ctx = useCheckboxGroup();
  const [isHovered, setIsHovered] = useState<boolean>(false);

  const handleCheckedChange = (checked: RadixCheckbox.CheckedState) => {
    onCheckedChange?.(checked);

    ctx?.toggleValue(value ?? '');
  };

  const [_checked, setChecked] = useUncontrolled({
    value: checked ?? ctx?.isChecked(value ?? ''),
    defaultValue: defaultChecked,
    onChange: handleCheckedChange,
    finalValue: false
  });

  return (
    <RadixCheckbox.Root
      onMouseEnter={() => {
        setIsHovered(true);
      }}
      onMouseLeave={() => {
        setIsHovered(false);
      }}
      checked={_checked}
      onCheckedChange={setChecked}
      {...stylex.props(styles.root, style)}
      {...props}>
      <RadixCheckbox.Indicator {...stylex.props(styles.indicator)}>
        {checked === 'indeterminate' && <MinusIcon {...stylex.props(styles.icon)} />}
        {_checked === true && <CheckIcon {...stylex.props(styles.icon)} />}
      </RadixCheckbox.Indicator>
      {!_checked && isHovered && <CheckIcon color={colors.textTertiaryHover} {...stylex.props(styles.icon)} />}
    </RadixCheckbox.Root>
  );
}

const styles = stylex.create({
  root: {
    alignItems: 'center',
    backgroundColor: {
      default: colors.backgroundSecondary,
      ':not(:disabled):is([aria-checked=true])': colors.buttonPrimaryDefault,
      ':not(:disabled):is([aria-checked=false]):hover': 'transparent'
    },
    borderColor: {
      default: colors.outlinePrimaryDefault,
      ':not(disabled):is([aria-checked=false]):hover': colors.outlinePrimaryHover,
      ':is([aria-checked=true])': colors.buttonPrimaryDefault
    },
    borderRadius: 7,
    borderStyle: 'solid',
    borderWidth: 2,
    color: {
      default: 'transparent',
      ':is([aria-checked=true])': colors.backgroundPrimary
    },
    cursor: {
      default: 'pointer',
      ':disabled': 'default'
    },
    display: 'flex',
    height: 28,
    justifyContent: 'center',
    maxWidth: 28,
    minWidth: 28
  },
  indicator: {
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'center'
  },
  icon: {
    height: 16,
    maxWidth: 16,
    minWidth: 16
  }
});
