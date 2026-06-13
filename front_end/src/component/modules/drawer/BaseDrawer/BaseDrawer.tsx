import { FC } from 'react';

import { Drawer, DrawerProps as BaseDrawerProps } from '@mantine/core';

import styles from './BaseDrawer.module.css';

const BaseDrawer: FC<BaseDrawerProps> = ({ children, ...props }) => (
  <>
    <Drawer
      classNames={{
        body: styles.body,
        header: styles.headercontent,
        root: styles.root,
      }}
      {...props}
      position="left"
    >
      {children}
    </Drawer>
  </>
);
export default BaseDrawer;
