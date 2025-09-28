import * as stylex from '@stylexjs/stylex';

export interface ComboboxHiddenInputProps extends Omit<React.ComponentPropsWithoutRef<'input'>, 'value' | 'type'> {
  /** Значение инпута */
  value: string | string[] | null;

  /** Разделитель, используемый для преобразования массива в строку, по умолчанию `','` */
  valuesDivider?: string;
}

/**
 * Не использует `type="hidden"`, чтобы работала нативная валидация формы.
 */
export function ComboboxHiddenInput({ value, valuesDivider = ',', ...others }: ComboboxHiddenInputProps) {
  return (
    <input
      {...stylex.props(styles.root)}
      onChange={() => void 0}
      value={Array.isArray(value) ? value.join(valuesDivider) : (value ?? '')}
      {...others}
    />
  );
}

const styles = stylex.create({
  root: {
    display: 'none',
    visibility: 'hidden'
  }
});
