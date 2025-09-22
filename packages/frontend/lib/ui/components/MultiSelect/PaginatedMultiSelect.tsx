import { MultiSelect, MultiSelectProps } from './MultiSelect';

/**
 * Интерфейс, который в теории должен копировать ApiDirectory и значение, которые
 * нужны клиенту, чтобы отрисовывать значение справочников
 */
interface SelectedRecordsState {
  id: string | number;

  name?: string;

  title?: string;

  active?: boolean;
}

type PaginatedMultiSelectProps = Omit<MultiSelectProps, 'onChange'> & {
  selectedRecords?: SelectedRecordsState[];

  onChange?: (value: string[] | null, selectedRecords: SelectedRecordsState[]) => void;
};

/**
 * Для корректной работы MultiSelect, справочник которого использует пагинацию
 * необходимо обновлять не только value, как массив id, но и
 * массив выбранных значений, пример:
 *  onChange={(ids, selecedData) => {
      handleChange(ids, ApiDirectoryIds[]); - значение необходимое для апдейта формы
      handleChange(selectedRecords, ApiDirectory[]); - значение необходимое для работы компонента
    }}
 */
export const PaginatedMultiSelect = ({
  options = [],
  value,
  selectedRecords,
  onChange,
  ...props
}: PaginatedMultiSelectProps) => {
  // Значения, которые пришли с сервера и возможно имеют offset=n
  const selectedOptions =
    selectedRecords?.map((d) => ({
      value: d.id.toString(),
      label: d.name ?? d.title ?? ''
    })) ?? [];

  // Фильтрация значений из общего массива options для того, чтобы не было дублирования с выбранными
  const filteredOptions = options.filter((o) => !value?.includes(o.value));

  /**
   * Чтобы корректно отображать options в dropdown нам нужно не только фильтровать options выбранными value,
   * но и обновлять selectedOptions -> selectedRecords
   */
  const handleChange = (value: string[] | null) => {
    const updatedSelectedRecords: SelectedRecordsState[] = [...selectedOptions, ...filteredOptions]
      .filter((o) => value?.includes(o.value.toString()))
      .map((o) => ({ id: o.value, name: o.label }));

    onChange?.(value, updatedSelectedRecords);
  };

  /**
   * В options MultiSelect выбранные значения (они идут первыми) и отфильтрованный options,
   * при отсутвиии selectedRecords в MultiSelect передаются базовые options (поведение для справочника без пагинации)
   */
  return (
    <MultiSelect
      options={selectedRecords ? [...selectedOptions, ...filteredOptions] : options}
      value={value}
      onChange={handleChange}
      {...props}
    />
  );
};
