import * as stylex from '@stylexjs/stylex';
import { Flex } from '@adera/ui';
import { ModalFilter } from './_components/ModalFilter';
import { PeriodFilter } from './_components/PeriodFilter';
import { useDirectoryOptions } from './useDirectoryOptions';
import { useFilters } from './useFilters';

export const Filters = () => {
  const { filters, updateFilters } = useFilters();
  const { sourceOptions, topicOptions, reviewsDateRangeOptions } = useDirectoryOptions();

  return (
    <Flex gap={12}>
      <ModalFilter
        label="Продукты"
        style={styles.topics}
        description="Выберите продукты, которые будут использованы в построении аналитики на дашборде"
        options={topicOptions}
        value={filters.topics}
        onFilterUpdate={(filter) => {
          updateFilters({ topics: filter });
        }}
      />
      <ModalFilter
        label="Источники"
        description="Выберите источники, которые будут использованы в построении аналитики на дашборде"
        options={sourceOptions}
        value={filters.sources}
        onFilterUpdate={(filter) => {
          updateFilters({ sources: filter });
        }}
      />
      <PeriodFilter
        minDate={reviewsDateRangeOptions.minDate}
        maxDate={reviewsDateRangeOptions.maxDate}
        to={filters.to}
        from={filters.from}
        onFilterUpdate={(filter) => {
          updateFilters({ ...filter });
        }}
      />
    </Flex>
  );
};

const styles = stylex.create({
  topics: {
    maxWidth: 900
  }
});
