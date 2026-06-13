import { FC } from 'react';

import { Select, SelectProps } from '@mantine/core';

import ChevronDownIcon from '../../icons/ChevronDown.icon';
import styles from './BaseSelect.input.module.css';

const BaseSelectInput: FC<SelectProps> = (props) => (
  <Select
    size="lg"
    withCheckIcon={false}
    rightSection={<ChevronDownIcon />}
    classNames={{
      label: styles.label,
      input: styles.input,
      dropdown: styles.dropdown,
      option: styles.option,
    }}
    {...props}
  />
);

export default BaseSelectInput;
