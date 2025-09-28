import { useState } from 'react';
import * as stylex from '@stylexjs/stylex';
import { useUncontrolled } from '../../hooks/useUncontrolled';
import { ChevronRightIcon, XIcon } from '../Icon';
import { InputBaseProps, InputBase } from '../InputBase';
import { Calendar } from './_components/Calendar';
import { Popover } from './_components/Popover';

export interface DateInputProps extends Omit<InputBaseProps, 'value' | 'defaultValue' | 'onChange'> {
  value?: Date | string | null;

  defaultValue?: Date | null;

  onChange?: (value: Date | null) => void;

  minDate?: Date | string | null;

  maxDate?: Date | string | null;
}

export const DateInput = ({
  value,
  defaultValue,
  onChange,
  placeholder,
  minDate,
  maxDate,
  disabled,
  ...props
}: DateInputProps) => {
  const [open, setOpen] = useState(false);

  const parseDate = (date?: Date | string | null) => {
    if (!date) return null;
    if (typeof date === 'string') return new Date(date);
    return date;
  };

  const [_value, setValue] = useUncontrolled({
    value: parseDate(value),
    defaultValue,
    finalValue: null,
    onChange
  });

  const onDateSelect = (date: Date, fieldType?: 'day' | 'month' | 'year') => {
    setValue(date);

    if (fieldType === 'day') setOpen(false);
  };

  return (
    <Popover onOpenChange={setOpen} open={open}>
      <Popover.Target asChild>
        <InputBase
          placeholder={placeholder ?? '__.__.____'}
          value={_value ? _value.toLocaleDateString() : ''}
          readOnly
          disabled={disabled}
          rightSection={
            !_value ? (
              <ChevronRightIcon
                {...stylex.props(styles.icon)}
                onClick={() => {
                  setOpen(true);
                }}
              />
            ) : (
              <XIcon
                {...stylex.props(styles.icon)}
                onClick={() => {
                  setValue(null);
                }}
              />
            )
          }
          {...props}
        />
      </Popover.Target>
      <Popover.Dropdown style={styles.dropdown}>
        <Calendar minDate={minDate} maxDate={maxDate} selectedDate={_value} onDateSelect={onDateSelect} />
      </Popover.Dropdown>
    </Popover>
  );
};

const styles = stylex.create({
  dropdown: {
    borderRadius: 16
  },
  icon: {
    cursor: 'pointer'
  }
});
