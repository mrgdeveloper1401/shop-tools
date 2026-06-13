import { FC } from 'react';
import {
  Select,
  ComboboxItem,
  OptionsFilter,
  SelectProps,
} from '@mantine/core';
import styles from './BaseSelectSearch.input.module.css';

const optionsFilter: OptionsFilter = ({ options, search }) => {
  const splittedSearch = search.toLowerCase().trim().split(' ');
  return (options as ComboboxItem[]).filter((option) => {
    const words = option.label.toLowerCase().trim().split(' ');
    return splittedSearch.every((searchWord) =>
      words.some((word) => word.includes(searchWord)),
    );
  });
};

const BaseSelectSearchInput: FC<SelectProps> = ({ ...restOfProps }) => {
  return (
    <Select
      classNames={{
        label: styles.label,
        input: styles.input,
        dropdown: styles.dropdown,
        option: styles.option,
      }}
      checkIconPosition="right"
      {...restOfProps}
      filter={optionsFilter}
      searchable
    />
  );
};
export default BaseSelectSearchInput;
