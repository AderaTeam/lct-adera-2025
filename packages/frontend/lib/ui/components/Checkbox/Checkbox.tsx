import { Fragment, useEffect, useState } from 'react';
import * as RadixCheckbox from '@radix-ui/react-checkbox';
import { StyleXStyles } from '@stylexjs/stylex';
import * as stylex from '@stylexjs/stylex';
import { colors } from '@adera/ui/tokens.stylex';
import CheckIcon from './check.svg?react';
import MinusIcon from './minus.svg?react';

export interface CheckboxProps extends Omit<RadixCheckbox.CheckboxProps, 'style'> {
  style?: StyleXStyles;
}

export function Checkbox({ style, checked: checkedProp, defaultChecked, name, form, ...props }: CheckboxProps) {
  const [checked, setChecked] = useState(checkedProp ?? defaultChecked ?? false);

  useEffect(() => {
    if (checkedProp !== undefined) {
      setChecked(checkedProp);
    }
  }, [checkedProp]);

  return (
    <Fragment>
      {name && (
        <input
          form={form}
          type="hidden"
          name={name}
          value={String(checked)} // 'true' или 'false'
        />
      )}
      <RadixCheckbox.Root
        checked={checked}
        onCheckedChange={setChecked}
        {...stylex.props(styles.root, style)}
        {...props}>
        <RadixCheckbox.Indicator {...stylex.props(styles.indicator)}>
          {checked === 'indeterminate' && <MinusIcon />}
          {checked === true && <CheckIcon />}
        </RadixCheckbox.Indicator>
      </RadixCheckbox.Root>
    </Fragment>
  );
}

const styles = stylex.create({
  root: {
    alignItems: 'center',
    backgroundColor: {
      default: 'white',
      ':is([aria-checked=true])': colors.textPrimaryDefault
    },
    borderColor: {
      default: colors.outlinePrimaryDefault,
      ':hover:not(:disabled):not([aria-checked=true], [aria-checked=mixed]):not([aria-invalid=true])':
        colors.outlinePrimaryHover,
      ':is([aria-checked=true])': 'transparent'
    },
    borderRadius: 7,
    borderStyle: 'solid',
    borderWidth: 2,
    cursor: {
      default: 'pointer',
      ':disabled': 'default'
    },
    display: 'flex',
    height: 28,
    justifyContent: 'center',
    width: 28
  },

  indicator: {
    color: colors.textInverse,
    lineHeight: 0
  }
});
