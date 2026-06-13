import { FC } from 'react';

import { Flex, Pagination, PaginationProps } from '@mantine/core';

import styles from './Base.pagination.module.css';

const BasePagination: FC<PaginationProps> = ({ ...props }) => (
  <Flex className={styles.container} align="center">
    <Pagination
      withControls
      classNames={{
        dots: styles.dots,
        control: styles.control,
        root: styles.root,
      }}
      radius="xs"
      {...props}
    />
  </Flex>
);
export default BasePagination;
