import { Select, SelectProps } from './Select';

/**
 * Интерфейс, который в теории должен копировать ApiDirectory и значение, которые
 * нужны клиенту, чтобы отрисовывать значение справочников
 */
interface SelectedRecordState {
  id: string;

  name?: string;

  title?: string;

  active?: boolean;
}

type PaginatedSelectProps = Omit<SelectProps, 'onChange'> & {
  selectedRecord?: SelectedRecordState | null;

  onChange?: (value: string | null, selectedRecord: SelectedRecordState | null) => void;
};

/**
 * Для корректной работы Select, справочник которого использует пагинацию
 * необходимо обновлять не только value, как string id, но и
 * выбранное значение, пример:
 *  onChange={(id, selectedRecord) => {
      handleChange(id, ApiDirectoryId); - значение необходимое для апдейта формы
      handleChange(selectedRecord, ApiDirectory); - значение необходимое для работы компонента
    }}
 */
export const PaginatedSelect = ({ options = [], value, selectedRecord, onChange, ...props }: PaginatedSelectProps) => {
  // Значение, которое пришло с сервера и возможно имеет offset=n
  const selectedOption = selectedRecord
    ? {
        value: selectedRecord.id,
        label: selectedRecord.name ?? selectedRecord.title ?? '',
        disabled: !selectedRecord.active
      }
    : null;

  // Фильтрация значений из общего массива options для того, чтобы не было дублирования с выбранным
  const filteredOptions = options.filter((o) => o.value !== value);

  /**
   * Чтобы корректно отображать options в dropdown нам нужно не только фильтровать options выбранными value,
   * но и обновлять selectedOption -> selectedRecord
   */
  const handleChange = (value: string | null) => {
    const findedValue = [selectedOption, ...filteredOptions].find((o) => o?.value === value);

    const updatedSelectedRecord: SelectedRecordState | null = findedValue
      ? { id: findedValue.value, name: findedValue.label }
      : null;

    onChange?.(value, updatedSelectedRecord);
  };

  /**
   * В options Select выбранное значение (оно идет первым) и отфильтрованный options,
   * при отсутвиии selectedRecord в Select передаются базовые options (поведение для справочника без пагинации)
   */
  return (
    <Select
      options={selectedOption ? [selectedOption, ...filteredOptions] : options}
      value={value}
      onChange={handleChange}
      {...props}
    />
  );
};
