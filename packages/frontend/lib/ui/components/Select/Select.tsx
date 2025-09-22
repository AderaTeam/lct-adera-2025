import { FormEventHandler, ReactNode, useEffect, useMemo, useState } from 'react';
import * as stylex from '@stylexjs/stylex';
import { Combobox, ComboboxItem, getOptionsLockup, SearchIcon, SelectorIcon, text, useUncontrolled } from '@adera/ui';
import { usePrevious } from '@adera/ui/hooks/usePrevious';
import { colors } from '../../tokens.stylex';
import { InputBase, InputBaseProps } from '../InputBase';

export interface SelectProps extends Omit<InputBaseProps, 'value' | 'defaultValue' | 'onChange'> {
  value?: string | null;

  defaultValue?: string | null;

  onChange?: (value: string | null) => void;

  searchable?: boolean;

  searchValue?: string;

  defaultSearchValue?: string;

  onSearchChange?: (value: string) => void;

  nothingFoundMessage?: ReactNode;

  options?: ComboboxItem[];

  hasMore?: boolean;

  next?: () => void;
}

export const Select = ({
  value,
  defaultValue,
  onChange,
  options = [],
  nothingFoundMessage = 'Ничего не найдено',
  searchable = false,
  readOnly,
  required,
  searchValue,
  defaultSearchValue,
  onSearchChange,
  onBlur,
  disabled,
  leftSection,
  validate,
  name,
  hasMore,
  next,
  form,
  ...props
}: SelectProps) => {
  const [dropdownOpened, setDropdownOpened] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const optionsLockup = useMemo(() => getOptionsLockup(options), [options]);

  const [_value, setValue] = useUncontrolled({ value, defaultValue, finalValue: null, onChange });

  const selectedOption = typeof _value === 'string' ? optionsLockup[_value] : undefined;
  const previousSelectedOption = usePrevious(selectedOption);

  const handleInvalid: FormEventHandler<HTMLInputElement> = (e) => {
    e.preventDefault();

    const validity = e.currentTarget.validity;
    const customError = validate?.(e.currentTarget.value, validity);

    if (customError) {
      setError(customError);
    } else if (validity.valueMissing) {
      setError('Обязательное поле');
    } else if (!validity.valid) {
      setError('Поле заполнено неправильно');
    }
  };

  const [search, setSearch] = useUncontrolled({
    value: searchValue,
    defaultValue: defaultSearchValue,
    finalValue: selectedOption ? selectedOption.label : '',
    onChange: onSearchChange
  });

  useEffect(() => {
    if (value === null) {
      setSearch('');
    }

    if (
      typeof value === 'string' &&
      selectedOption &&
      (previousSelectedOption?.value !== selectedOption.value || previousSelectedOption.label !== selectedOption.label)
    ) {
      setSearch(selectedOption.label);
    }
  }, [value, selectedOption, setSearch, previousSelectedOption]);

  const _leftSection = leftSection ?? (searchable ? <SearchIcon /> : null);

  return (
    <Combobox
      onOpenChange={setDropdownOpened}
      open={dropdownOpened}
      value={_value}
      disabled={disabled}
      onValueChange={(value) => {
        setValue(value as string);
        setError(null);
      }}>
      <Combobox.Target asChild>
        <InputBase
          disabled={disabled}
          value={search}
          onErrorChange={setError}
          error={error}
          required={required}
          readOnly={readOnly ?? !searchable}
          leftSection={_leftSection}
          rightSection={<SelectorIcon />}
          onChange={(event) => {
            setSearch(event.currentTarget.value);
            setError(null);
          }}
          onBlur={(event) => {
            setSearch(_value != null ? (optionsLockup[_value]?.label ?? '') : '');
            onBlur?.(event);
          }}
          {...props}
        />
      </Combobox.Target>

      <Combobox.Options hasMore={hasMore} next={next}>
        {options.length ? (
          options.map((o) => (
            <Combobox.Option key={o.value} disabled={o.disabled} value={o.value}>
              {o.label}
            </Combobox.Option>
          ))
        ) : (
          <div role="option" {...stylex.props(text.defaultMedium, styles.nothing)}>
            {nothingFoundMessage}
          </div>
        )}
      </Combobox.Options>

      <Combobox.HiddenInput
        required={required}
        onInvalid={handleInvalid}
        value={_value}
        name={name}
        disabled={disabled}
        form={form}
      />
    </Combobox>
  );
};

const styles = stylex.create({
  nothing: {
    backgroundColor: 'white',
    borderWidth: 0,
    color: colors.textPrimaryDefault,
    display: 'block',
    overflow: 'hidden',
    paddingBlock: '12px',
    paddingInline: '24px',
    position: 'relative',
    textAlign: 'left',
    width: '100%'
  }
});
