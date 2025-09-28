import { ComponentProps, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { StyleXStyles } from '@stylexjs/stylex';
import * as stylex from '@stylexjs/stylex';
import { text } from '@adera/ui';
import { colors } from '@adera/ui/tokens.stylex';
import { useComboboxContext } from '../../Combobox.context';

export interface ComboboxOptionProps extends Omit<ComponentProps<'div'>, 'style'> {
  asChild?: boolean;

  style?: StyleXStyles;

  value: string;

  disabled?: boolean;
}

// TODO возможно не устанавливать значение через setLabel, а рендерить через портал напрямую в ComboboxValue

export function ComboboxOption({ children, style, value: valueProp, disabled, ...props }: ComboboxOptionProps) {
  const { value, setValue, multiple, setLabel, setOpen } = useComboboxContext();
  const [textContent, setTextContent] = useState('');

  const ref = useRef<HTMLDivElement | null>(null);
  const valuePropRef = useRef(valueProp);
  const setLabelRef = useRef(setLabel);

  const status = multiple
    ? value?.includes(valuePropRef.current)
      ? 'checked'
      : 'unchecked'
    : valuePropRef.current === value
      ? 'checked'
      : 'unchecked';

  useLayoutEffect(() => {
    setTextContent(ref.current?.textContent?.slice(0, ref.current.textContent.length / 2) ?? '');
  }, []);

  useEffect(() => {
    if (valuePropRef.current === value || value?.includes(valuePropRef.current)) {
      setLabelRef.current(textContent);
    }
  }, [value, textContent]);

  const handleClick = () => {
    if (disabled) return;
    if (multiple) {
      setValue(value?.includes(valuePropRef.current) ? value : [...(value as string[]), valuePropRef.current]);
    } else {
      setValue(valuePropRef.current);
    }

    setLabel(textContent);
    setOpen(false);
  };

  return (
    <div
      {...stylex.props(text.defaultMedium, styles.base, style)}
      onMouseDown={handleClick}
      ref={ref}
      role={'option'}
      data-state={status}
      data-disabled={disabled}
      {...props}>
      {children}
    </div>
  );
}

const styles = stylex.create({
  base: {
    backgroundColor: {
      default: 'transparent',
      ':is(:hover):not([data-disabled=true], [data-state=checked])': colors.buttonSecondaryHover,
      ':is([data-state=checked])': 'rgba(71, 114, 255, 0.15)'
    },
    borderWidth: 0,
    color: colors.textPrimaryDefault,
    cursor: { ':not(:is([data-disabled=true]))': 'pointer' },
    display: 'block',
    overflow: 'hidden',
    paddingBlock: '12px',
    paddingInline: '24px',
    position: 'relative',
    textAlign: 'left',
    transition: 'all 0.2s',
    width: '100%'
  }
});
