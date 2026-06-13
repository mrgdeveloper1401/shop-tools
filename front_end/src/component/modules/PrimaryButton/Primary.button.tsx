'use client';

import { FC, MouseEventHandler, ReactNode } from 'react';

import { Button, ButtonProps, MantineStyleProp } from '@mantine/core';

import styles from './Primary.button.module.css';

export interface PrimaryButtonProps extends ButtonProps {
  children?: ReactNode;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  rightSection?: ReactNode;
  leftSection?: ReactNode;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  disabled?: boolean;
  loading?: boolean;
  type?: 'button' | 'submit' | 'reset';
  fullWidth?: boolean;
  error?: boolean;
  variant?: 'primary' | 'secondary' | 'outline' | 'filled';
  style?: MantineStyleProp;
  component?: any;
  href?: string;
}

const PrimaryButton: FC<PrimaryButtonProps> = ({
  children,
  size = 'sm',
  variant = 'primary',
  ...restOfProps
}) => (
  <Button
    classNames={{
      root: styles.root,
    }}
    size={size}
    variant={variant === 'primary' ? 'filled' : variant}
    {...(restOfProps as any)}
  >
    {children}
  </Button>
);

export default PrimaryButton;
