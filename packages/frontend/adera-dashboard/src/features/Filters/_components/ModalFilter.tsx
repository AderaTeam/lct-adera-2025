import { useState } from 'react';
import * as stylex from '@stylexjs/stylex';
import { StyleXStyles } from '@stylexjs/stylex';
import {
  Button,
  ButtonVariant,
  ButtonWidth,
  Checkbox,
  ChevronDownIcon,
  Flex,
  Grid,
  headers,
  Modal,
  RefreshIcon,
  Stack,
  ToastStatus,
  useToast
} from '@adera/ui';
import { colors } from '@adera/ui/tokens.stylex';

interface ModalFilterProps {
  label?: string;

  description?: string;

  options?: { value: string; label: string }[];

  value?: string;

  onFilterUpdate?: (value: string) => void;

  style?: StyleXStyles;
}

export const ModalFilter = ({
  label = '',
  description,
  options = [],
  value = 'all',
  onFilterUpdate,
  style
}: ModalFilterProps) => {
  const [open, setOpen] = useState(false);

  const { showToast, clearToasts } = useToast();

  const allValues = options.map((o) => o.value);

  const [_value, setValue] = useState(() => {
    const initial = value.split(',').filter(Boolean);
    if (initial.includes('all')) {
      return allValues;
    }
    return initial;
  });

  const isAllSelected = _value.length === allValues.length;
  const isPartiallySelected = _value.length > 0 && !isAllSelected;

  const handleSelectAll = () => {
    if (isAllSelected) {
      setValue([]);
    } else {
      setValue(allValues);
    }
  };

  const handleApplyFilters = (applyValue: string[]) => {
    if (applyValue.length === 0) {
      clearToasts();
      showToast({
        status: ToastStatus.bad,
        title: 'Невозможно выбрать 0 вариантов. Выберите как минимум один вариант'
      });
      return;
    }

    if (applyValue.length === allValues.length) {
      onFilterUpdate?.('all');
      setValue(allValues);
    } else {
      onFilterUpdate?.(applyValue.join(','));
      setValue(applyValue);
    }
    setOpen(false);
  };

  const handleCancel = () => {
    const initial = value.split(',').filter(Boolean);
    if (initial.includes('all')) {
      setValue(allValues);
    } else {
      setValue(initial);
    }
  };

  return (
    <Modal
      onOpenChange={(open) => {
        setOpen(open);

        if (!open) handleCancel();
      }}
      open={open}>
      <Modal.Target>
        <Button variant={ButtonVariant.ghost} aria-selected={true}>
          {value === 'all'
            ? `Все ${label.toLowerCase()}`
            : `${label}: ${value.split(',').filter(Boolean).length.toString()}`}
          <ChevronDownIcon color={colors.textTertiaryDefault} />
        </Button>
      </Modal.Target>

      <Modal.Content style={style}>
        <Modal.Header>
          <h2 {...stylex.props(headers.h2Bold)}>{label}</h2>
        </Modal.Header>

        <Stack gap={28} style={styles.root}>
          {!!description && <div {...stylex.props(styles.description)}>{description}</div>}

          <Grid style={styles.list} rowGap={8} columnGap={16}>
            <Grid.Col span={options.length > 7 ? 6 : 12}>
              <label htmlFor="all" {...stylex.props(styles.label)} aria-checked={isAllSelected || isPartiallySelected}>
                <Checkbox
                  id="all"
                  checked={isAllSelected ? true : isPartiallySelected ? 'indeterminate' : false}
                  onCheckedChange={handleSelectAll}
                />
                Все {label.toLowerCase()}
              </label>
            </Grid.Col>

            {options.map((o) => {
              const checked = _value.includes(o.value);

              return (
                <Grid.Col span={options.length > 7 ? 6 : 12} key={o.value}>
                  <label htmlFor={o.value} {...stylex.props(styles.label)} aria-checked={checked}>
                    <Checkbox
                      id={o.value}
                      checked={checked}
                      value={o.value}
                      onCheckedChange={(isChecked) => {
                        if (isChecked) {
                          setValue((prev) => [...prev, o.value]);
                        } else {
                          setValue((prev) => prev.filter((v) => v !== o.value));
                        }
                      }}
                    />
                    {o.label}
                  </label>
                </Grid.Col>
              );
            })}
          </Grid>
        </Stack>

        <Flex style={styles.footer} wrap="nowrap" gap={16}>
          <Button
            width={ButtonWidth.full}
            onClick={() => {
              handleApplyFilters(_value);
            }}>
            Обновить аналитику
            <RefreshIcon />
          </Button>
          <Button
            variant={ButtonVariant.ghost}
            width={ButtonWidth.full}
            onClick={() => {
              setOpen(false);
            }}>
            Отменить
          </Button>
        </Flex>
      </Modal.Content>
    </Modal>
  );
};

const styles = stylex.create({
  root: {
    flex: '1'
  },
  description: {
    color: colors.textSecondaryDefault,
    paddingInline: 16
  },
  list: { gridAutoRows: 'max-content', height: 412, marginBottom: 20 },
  label: {
    alignItems: 'center',
    backgroundColor: {
      default: 'transparent',
      ':is([aria-checked=false]):hover': colors.buttonSecondaryHover,
      ':is([aria-checked=true])': '#4772FF26'
    },
    borderRadius: 12,
    cursor: 'pointer',
    display: 'flex',
    gap: 12,
    height: '100%',
    paddingBlock: 12,
    paddingInline: 16
  },
  footer: {
    marginBottom: 20
  }
});
