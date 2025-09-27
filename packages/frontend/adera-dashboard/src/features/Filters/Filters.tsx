import * as stylex from '@stylexjs/stylex';
import { Button, ButtonVariant, Flex } from '@adera/ui';
import { ModalFilter } from './_components/ModalFilter';
import { useDirectoryOptions } from './useDirectoryOptions';
import { useFilters } from './useFilters';

export const Filters = () => {
  const { filters, updateFilters } = useFilters();
  const { sourceOptions, productOptions } = useDirectoryOptions();

  return (
    <Flex gap={12}>
      <ModalFilter
        label="Продукты"
        style={styles.products}
        description="Выберите продукты, которые будут использованы в построении аналитики на дашборде"
        options={productOptions}
        value={filters.products}
        onFilterUpdate={(filter) => {
          updateFilters({ products: filter });
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

      <Button variant={ButtonVariant.ghost} aria-selected={true}>
        Период: Год
      </Button>
    </Flex>
  );
};

const styles = stylex.create({
  products: {
    maxWidth: 900
  }
});
