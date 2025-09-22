import { FormEventHandler, ReactNode, useMemo, useState } from 'react';
import * as stylex from '@stylexjs/stylex';
import {
  Chips,
  Combobox,
  ComboboxItem,
  Flex,
  getOptionsLockup,
  SearchIcon,
  SelectorIcon,
  Stack,
  text,
  useUncontrolled
} from '@adera/ui';
import { colors } from '../../tokens.stylex';
import { InputBase, InputBaseProps } from '../InputBase';

export interface MultiSelectProps extends Omit<InputBaseProps, 'value' | 'defaultValue' | 'onChange'> {
  value?: string[];

  defaultValue?: string[];

  onChange?: (value: string[]) => void;

  onRemove?: (value: string) => void;

  searchable?: boolean;

  searchValue?: string;

  defaultSearchValue?: string;

  onSearchChange?: (value: string) => void;

  nothingFoundMessage?: ReactNode;

  options?: ComboboxItem[];

  hasMore?: boolean;

  next?: () => void;
}

export const MultiSelect = ({
  value,
  defaultValue,
  onChange,
  onRemove,
  options = [],
  nothingFoundMessage = 'Ничего не найдено',
  searchable = false,
  readOnly,
  searchValue,
  defaultSearchValue,
  onSearchChange,
  validate,
  required,
  onKeyDown,
  onBlur,
  onFocus,
  disabled,
  leftSection,
  name,
  label,
  form,
  hasMore,
  next,
  ...props
}: MultiSelectProps) => {
  const [dropdownOpened, setDropdownOpened] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const optionsLockup = useMemo(() => getOptionsLockup(options), [options]);

  const [_value, setValue] = useUncontrolled({ value, defaultValue, finalValue: [], onChange });

  const [search, setSearch] = useUncontrolled({
    value: searchValue,
    defaultValue: defaultSearchValue,
    finalValue: '',
    onChange: onSearchChange
  });

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

  const handleInputKeydown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    onKeyDown?.(event);

    if (event.key === ' ' && !searchable) {
      event.preventDefault();
    }

    if (event.key === 'Backspace' && search.length === 0 && _value.length > 0) {
      onRemove?.(_value[_value.length - 1]);
      setValue(_value.slice(0, _value.length - 1));
    }
  };

  const _leftSection = leftSection ?? (searchable ? <SearchIcon /> : null);

  const values = _value.map((item, index) => (
    <Chips
      size="xs"
      value={item}
      key={`${item}-${index.toString()}`}
      withRemoveButton={!readOnly && !optionsLockup[item]?.disabled}
      onRemove={() => {
        setValue(_value.filter((i) => item !== i));
        onRemove?.(item);
      }}
      disabled={disabled}>
      {optionsLockup[item]?.label ?? item}
    </Chips>
  ));

  return (
    <Stack gap={6}>
      <Combobox
        onOpenChange={setDropdownOpened}
        open={dropdownOpened}
        value={_value}
        disabled={disabled}
        multiple
        onValueChange={(value) => {
          setValue(value as string[]);
        }}>
        <Combobox.Target asChild>
          <InputBase
            label={
              searchable ? (
                <div>
                  {label} {!!values.length && <span {...stylex.props(styles.count)}>(выбрано {values.length})</span>}
                </div>
              ) : (
                label
              )
            }
            disabled={disabled}
            value={searchable ? search : values.length ? `Выбрано ${values.length.toString()}` : ''}
            error={error}
            required={required}
            onErrorChange={setError}
            readOnly={readOnly ?? !searchable}
            leftSection={_leftSection}
            rightSection={<SelectorIcon />}
            onFocus={(event) => {
              onFocus?.(event);
            }}
            onBlur={(event) => {
              onBlur?.(event);
              setSearch('');
            }}
            onChange={(event) => {
              setSearch(event.currentTarget.value);
            }}
            onKeyDown={handleInputKeydown}
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
          onInvalid={handleInvalid}
          required={required}
          value={_value}
          name={name}
          disabled={disabled}
          form={form}
        />
      </Combobox>
      {!!values.length && (
        <Flex rowGap={8} gap={8}>
          {values}
        </Flex>
      )}
    </Stack>
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
  },
  count: {
    color: colors.textTertiaryDefault
  }
});
