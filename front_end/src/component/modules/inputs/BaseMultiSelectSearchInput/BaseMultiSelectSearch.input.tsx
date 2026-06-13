import { FC } from 'react';
import { MultiSelect, MultiSelectProps } from '@mantine/core';
import styles from './BaseMultiSelectSearch.input.module.css';

const BaseMultiSelectSearchInput: FC<MultiSelectProps> = ({
  ...restOfProps
}) => {
  return (
    <MultiSelect
      classNames={{
        root: styles.root,
        input: styles.input,
        label: styles.label,
        error: styles.error,
        section: styles.section,
      }}
      checkIconPosition="right"
      searchable
      {...restOfProps}
    />
  );
};
export default BaseMultiSelectSearchInput;
