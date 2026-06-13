import { FC } from 'react';

import { Select, SelectProps } from '@mantine/core';

import styles from './Base.select.module.css';

const BaseSelect: FC<SelectProps> = (props) => (
  <Select
    {...props}
    classNames={{ root: styles.root, input: styles.input, label: styles.label }}
  />
);

export default BaseSelect;
