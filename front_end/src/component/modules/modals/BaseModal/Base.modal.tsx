import { FC, ReactNode } from 'react';

import { Modal } from '@mantine/core';

import styles from './Base.modal.module.css';

interface BaseModalProps {
  opened: boolean;
  onClose: () => void;
  children?: ReactNode;
  size?: string | number;
  title: string;
  withCloseButton?: boolean;
  classNames?: any;
}

const BaseModal: FC<BaseModalProps> = ({
  opened,
  onClose,
  children,
  size = 1016,
  title,
  ...restOfProps
}) => (
  <Modal
    closeOnClickOutside
    opened={opened}
    onClose={onClose}
    title={title}
    size={size}
    centered
    classNames={{
      root: styles.root,
      header: styles.header,
      body: styles.body,
      title: styles.title,
      content: styles.content,
    }}
    {...restOfProps}
  >
    {children}
  </Modal>
);

export default BaseModal;
