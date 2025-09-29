import { useState } from 'react';
import * as stylex from '@stylexjs/stylex';
import {
  Button,
  ButtonVariant,
  ButtonWidth,
  ChevronDownIcon,
  DateInput,
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

const MIN_PERIOD_MS = 7 * 24 * 60 * 60 * 1000; // 7 дней

const shiftDateString = (dateStr: string, days: number): string => {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return d.toISOString();
};

export const PeriodFilter = ({
  to,
  from,
  onFilterUpdate,
  maxDate,
  minDate
}: {
  to: string;
  from: string;
  onFilterUpdate: (value: { to: string; from: string }) => void;
  minDate: string | null;
  maxDate: string | null;
}) => {
  const [open, setOpen] = useState(false);

  const defaultFrom = from || (minDate ? shiftDateString(minDate, 1) : '');
  const defaultTo = to || (maxDate ? shiftDateString(maxDate, 0) : '');

  const [_from, setFrom] = useState(defaultFrom);

  const [_to, setTo] = useState(defaultTo);

  const { showToast, clearToasts } = useToast();

  const showError = (title: string) => {
    clearToasts();
    showToast({ status: ToastStatus.bad, title });
  };

  const handleApplyFilters = (from: string, to: string) => {
    if (!from && !to) {
      onFilterUpdate({ from, to });
      setOpen(false);
      return;
    }

    if (!from || !to) {
      showError('Необходимо выбрать полный промежуток');
      return;
    }

    const fromDate = new Date(from);
    const toDate = new Date(to);

    if (toDate.getTime() - fromDate.getTime() < MIN_PERIOD_MS) {
      showError('Минимальный период — 7 дней');
      return;
    }

    onFilterUpdate({ from, to });
    setOpen(false);
  };

  const handleCancel = () => {
    setFrom(defaultFrom);
    setTo(defaultTo);
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
          {!to || !from
            ? 'За все время'
            : `${new Date(from).toLocaleDateString()} - ${new Date(to).toLocaleDateString()}`}
          <ChevronDownIcon color={colors.textTertiaryDefault} />
        </Button>
      </Modal.Target>

      <Modal.Content>
        <Modal.Header>
          <h2 {...stylex.props(headers.h2Bold)}>Период</h2>
        </Modal.Header>

        <Stack gap={28} style={styles.root}>
          <div {...stylex.props(styles.description)}>Укажите период не менее одной недели (семь дней)</div>

          <Grid style={styles.content} rowGap={24} gap={20}>
            <Grid.Col span={6}>
              <DateInput
                value={_from}
                maxDate={_to}
                minDate={minDate}
                onChange={(e) => {
                  setFrom(e?.toISOString() ?? '');
                }}
                label="Дата начала"
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <DateInput
                value={_to}
                minDate={_from}
                maxDate={maxDate}
                onChange={(e) => {
                  setTo(e?.toISOString() ?? '');
                }}
                label="Дата окончания"
              />
            </Grid.Col>
          </Grid>
        </Stack>

        <Flex style={styles.footer} wrap="nowrap" gap={16}>
          <Button
            width={ButtonWidth.full}
            onClick={() => {
              handleApplyFilters(_from, _to);
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
  content: { gridAutoRows: 'max-content', height: 412, marginBottom: 20 },
  footer: {
    marginBottom: 20
  }
});
