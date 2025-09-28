import { Fragment, useState } from 'react';
import * as stylex from '@stylexjs/stylex';
import { colors } from '../../../../tokens.stylex';
import { text } from '../../../../utils/text';
import { ChevronRightIcon } from '../../../Icon';
import { IconButton, IconButtonVariant } from '../../../IconButton';

const months = [
  'Январь',
  'Февраль',
  'Март',
  'Апрель',
  'Май',
  'Июнь',
  'Июль',
  'Август',
  'Сентябрь',
  'Октябрь',
  'Ноябрь',
  'Декабрь'
];

const weeks = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

interface CalendarProps {
  selectedDate?: Date | null;

  onDateSelect?: (date: Date, fieldType?: 'day' | 'month' | 'year') => void;

  minDate?: Date | string | null;

  maxDate?: Date | string | null;
}

export const Calendar = ({ selectedDate, onDateSelect, minDate, maxDate }: CalendarProps) => {
  const [viewMode, setViewMode] = useState<'day' | 'month' | 'year'>('day');
  const [currentDate, setCurrentDate] = useState(selectedDate ?? new Date());

  const handleItemSelect = (date: Date) => {
    let newDate: Date;

    if (viewMode === 'year') {
      newDate = new Date(date.getFullYear(), selectedDate?.getMonth() ?? 0, selectedDate?.getDate() ?? 1);
      setViewMode('month');
    } else if (viewMode === 'month') {
      newDate = new Date(date.getFullYear(), date.getMonth(), selectedDate?.getDate() ?? 1);
      setViewMode('day');
    } else {
      newDate = date;
    }

    setCurrentDate(newDate);
    onDateSelect?.(newDate, viewMode);
  };

  const handlePrevious = () => {
    if (viewMode === 'day') {
      setCurrentDate((prevDate) => new Date(prevDate.getFullYear(), prevDate.getMonth() - 1, 1));
    } else if (viewMode === 'month') {
      setCurrentDate((prevDate) => new Date(prevDate.getFullYear() - 1, prevDate.getMonth(), 1));
    } else {
      const range = getYearRange(currentDate.getFullYear());
      setCurrentDate(new Date(range.start - 10, 0, 1));
    }
  };

  const handleNext = () => {
    if (viewMode === 'day') {
      setCurrentDate((prevDate) => new Date(prevDate.getFullYear(), prevDate.getMonth() + 1, 1));
    } else if (viewMode === 'month') {
      setCurrentDate((prevDate) => new Date(prevDate.getFullYear() + 1, prevDate.getMonth(), 1));
    } else {
      const range = getYearRange(currentDate.getFullYear());
      setCurrentDate(new Date(range.end + 1, 0, 1));
    }
  };

  const getYearRange = (year: number): { start: number; end: number } => {
    const decadeStart = Math.floor(year / 10) * 10;
    return { start: decadeStart, end: decadeStart + 9 };
  };

  const renderYears = () => {
    const range = getYearRange(currentDate.getFullYear());
    const years = [];
    for (let i = range.start; i <= range.end; i++) {
      const yearDate = new Date(i, 0, 1);
      const disabled = (!!minDate && yearDate < new Date(minDate)) || (!!maxDate && yearDate > new Date(maxDate));

      years.push(
        <li
          key={i}
          aria-disabled={disabled}
          {...stylex.props(text.smallMedium, styles.card(3))}
          aria-selected={selectedDate?.getFullYear() === i}
          onClick={() => {
            !disabled && handleItemSelect(yearDate);
          }}>
          {i}
        </li>
      );
    }
    return years;
  };

  const renderMonths = () => {
    return months.map((name, index) => {
      const monthDate = new Date(currentDate.getFullYear(), index, 1);
      const disabled = (!!minDate && monthDate < new Date(minDate)) || (!!maxDate && monthDate > new Date(maxDate));

      return (
        <li
          aria-disabled={disabled}
          key={`${monthDate.getFullYear().toString()}-${monthDate.getMonth().toString()}`}
          {...stylex.props(text.smallMedium, styles.card(4))}
          aria-selected={
            monthDate.getFullYear() == selectedDate?.getFullYear() && monthDate.getMonth() == selectedDate.getMonth()
          }
          onClick={() => {
            !disabled && handleItemSelect(monthDate);
          }}>
          {name}
        </li>
      );
    });
  };

  const renderDays = () => {
    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);

    const startDayOfWeek = (firstDayOfMonth.getDay() + 6) % 7; // Смещение для начала недели с понедельника

    const days = [];

    for (let i = 1; i <= 42; i++) {
      const day = new Date(currentDate.getFullYear(), currentDate.getMonth(), i - startDayOfWeek);

      if (i <= startDayOfWeek) {
        days.push(
          <li
            {...stylex.props(styles.day(0))}
            key={`${day.getFullYear().toString()}-${day.getMonth().toString()}-${(i - startDayOfWeek).toString()}`}></li>
        );
        continue;
      }

      if (i - startDayOfWeek <= daysInMonth) {
        const order = i - startDayOfWeek;

        const disabled = (!!minDate && day <= new Date(minDate)) || (!!maxDate && day >= new Date(maxDate));

        days.push(
          <li
            key={`${day.getFullYear().toString()}-${day.getMonth().toString()}-${(i - startDayOfWeek).toString()}`}
            {...stylex.props(styles.day(order))}>
            <button
              onClick={() => {
                handleItemSelect(day);
              }}
              disabled={disabled}
              aria-selected={day.toDateString() === selectedDate?.toDateString()}
              type="button"
              {...stylex.props(text.smallMedium, styles.cell)}
              data-today={day.toDateString() === new Date().toDateString()}>
              {i - startDayOfWeek}
            </button>
          </li>
        );
      }
    }
    return days;
  };

  return (
    <div {...stylex.props(styles.root)}>
      <div {...stylex.props(text.defaultMedium, styles.tabs)}>
        <div
          onClick={() => {
            setViewMode('month');
          }}
          {...stylex.props(styles.tab)}
          aria-selected={viewMode == 'month' || viewMode === 'year'}>
          Год
          {(viewMode == 'month' || viewMode === 'year') && <div {...stylex.props(styles.tabLine)}></div>}
        </div>
        <div
          onClick={() => {
            setViewMode('day');
          }}
          {...stylex.props(styles.tab)}
          aria-selected={viewMode == 'day'}>
          Месяц
          {viewMode == 'day' && <div {...stylex.props(styles.tabLine)}></div>}
        </div>
      </div>
      <div {...stylex.props(styles.header)}>
        <IconButton onClick={handlePrevious} type="button" size={'sm'} variant={IconButtonVariant.ghost}>
          <ChevronRightIcon {...stylex.props(styles.left)} />
        </IconButton>
        {viewMode === 'day' && (
          <Fragment>
            <span
              {...stylex.props(text.defaultMedium, styles.button)}
              onClick={() => {
                setViewMode('month');
              }}>
              {months[currentDate.getMonth()]}
            </span>
            <span
              {...stylex.props(text.defaultMedium, styles.button)}
              onClick={() => {
                setViewMode('year');
              }}>
              {currentDate.getFullYear()}
            </span>
          </Fragment>
        )}
        {viewMode === 'month' && (
          <span
            {...stylex.props(text.defaultMedium, styles.button)}
            onClick={() => {
              setViewMode('year');
            }}>
            {currentDate.getFullYear()}
          </span>
        )}
        {viewMode === 'year' && (
          <span {...stylex.props(text.defaultMedium, styles.button)}>
            {getYearRange(currentDate.getFullYear()).start} - {getYearRange(currentDate.getFullYear()).end}
          </span>
        )}
        <IconButton onClick={handleNext} type="button" size={'sm'} variant={IconButtonVariant.ghost}>
          <ChevronRightIcon />
        </IconButton>
      </div>
      <div {...stylex.props(styles.body)}>
        {viewMode === 'day' && (
          <div {...stylex.props(styles.daysWrapper)}>
            <div {...stylex.props(text.smallMedium, styles.weeks)}>
              {weeks.map((w) => (
                <div key={w} {...stylex.props(styles.week)}>
                  {w}
                </div>
              ))}
            </div>
            <ul {...stylex.props(styles.days)}>{renderDays()}</ul>
          </div>
        )}
        {viewMode === 'month' && <ul {...stylex.props(styles.list)}> {renderMonths()}</ul>}
        {viewMode === 'year' && <ul {...stylex.props(styles.list)}>{renderYears()}</ul>}
      </div>
    </div>
  );
};

const styles = stylex.create({
  root: {
    background: colors.backgroundPrimary,
    borderRadius: 16,
    display: 'flex',
    flexDirection: 'column',
    gap: 24,
    padding: '16px 0 20px',
    width: 320
  },
  tabs: {
    alignItems: 'center',
    display: 'flex',
    gap: 0
  },
  tab: {
    alignItems: 'center',
    borderBottomColor: colors.outlinePrimaryDefault,
    borderBottomStyle: 'solid',
    borderBottomWidth: 1,
    color: {
      default: colors.textSecondaryDefault,
      ':is([aria-selected=true])': colors.textBlueDefault,
      ':hover': colors.textBlueDefault
    },
    cursor: 'pointer',
    display: 'flex',
    flex: '1',
    height: 32,
    justifyContent: 'center',
    position: 'relative',
    transition: 'color 0.2s'
  },
  tabLine: {
    backgroundColor: colors.textBlueDefault,
    borderTopLeftRadius: 2,
    borderTopRightRadius: 2,
    bottom: -1,
    height: 2,
    left: 0,
    position: 'absolute',
    width: '100%'
  },
  header: {
    alignItems: 'center',
    display: 'flex',
    gap: 0,
    justifyContent: 'center'
  },
  button: {
    color: {
      default: colors.textSecondaryDefault,
      ':hover': colors.textBlueDefault
    },
    cursor: 'pointer',
    fontWeight: 500,
    paddingInline: 4
  },
  body: {
    padding: '0 20px'
  },
  daysWrapper: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12
  },
  weeks: {
    color: colors.textSecondaryDefault,
    display: 'grid',
    gap: 0,
    gridTemplateColumns: 'repeat(7, 1fr)'
  },
  week: {
    gridColumn: 'span 1',
    textAlign: 'center'
  },
  days: {
    display: 'grid',
    gap: 0,
    gridTemplateColumns: 'repeat(7, 1fr)',
    listStyle: 'none',
    margin: 0,
    padding: 0
  },
  day: (order: number) => ({
    alignItems: 'center',
    display: 'flex',
    gridColumn: 'span 1',
    height: 40,
    justifyContent: 'center',
    order,
    paddingBlock: 2,
    width: 40
  }),
  cell: {
    alignItems: 'center',
    backgroundColor: {
      default: 'transparent',
      ':not(:disabled):hover': colors.textBlueDefault,
      ':is([aria-selected=true])': colors.textBlueDefault
    },
    borderColor: {
      default: 'transparent',
      ':is([data-today=true])': colors.textBlueDefault,
      ':not(:disabled):hover': 'transparent'
    },
    borderRadius: 10,
    borderStyle: 'solid',
    borderWidth: 1,
    color: {
      default: colors.textPrimaryDefault,
      ':not(:disabled):hover': colors.textPrimaryHover,
      ':is([aria-selected=true])': colors.textPrimaryActive,
      ':disabled': colors.black40
    },
    cursor: { default: 'pointer', ':disabled': 'unset' },
    display: 'flex',
    height: 36,
    justifyContent: 'center',
    width: 36
  },
  list: {
    columnGap: 4,
    display: 'grid',
    gap: 4,
    gridTemplateColumns: 'repeat(12, 1fr)',
    listStyle: 'none',
    margin: 0,
    padding: 0,
    rowGap: 8
  },
  card: (width: number) => ({
    gridColumn: `span ${width.toString()}`,
    color: {
      default: colors.textPrimaryDefault,
      ':not(:disabled):hover': colors.textPrimaryHover,
      ':is([aria-selected=true])': colors.textPrimaryActive,
      ':disabled': colors.black40
    },
    backgroundColor: {
      default: 'transparent',
      ':not(:is([aria-disabled=true])):hover': colors.textBlueDefault,
      ':is([aria-selected=true])': colors.textBlueDefault
    },
    padding: '8px 12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    transition: 'all 0.2s',
    cursor: 'pointer'
  }),
  left: {
    transform: 'rotate(-180deg)'
  }
});
