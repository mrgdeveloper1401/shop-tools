'use client';

import { FC, useRef, useState } from 'react';

import { useDisclosure } from '@mantine/hooks';
import { PasswordInput, PasswordInputProps } from '@mantine/core';

import styles from './BasePassword.input.module.css';

const BasePasswordInput: FC<PasswordInputProps> = (props) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [visible, { toggle }] = useDisclosure(false);

  const [focused, setFocused] = useState(false);
  const filled =
    (inputRef.current?.value &&
      String(inputRef.current?.value).length > 0 &&
      !focused) ||
    undefined;
  const floating =
    focused || (inputRef.current?.value as string)?.length > 0 || undefined;
  const error = (props.error && String(props.error).length > 0) || undefined;

  return (
    <PasswordInput
      data-testid="base-password-input"
      labelProps={{
        'data-floating': floating,
        'data-filled': filled,
        'data-error': error,
      }}
      data-filled={filled}
      data-error={error}
      visible={visible}
      onVisibilityChange={toggle}
      classNames={{
        root: styles.root,
        input: styles.input,
        label: styles.label,
        error: styles.error,
        section: styles.section,
        innerInput: styles.innerInput,
      }}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      ref={inputRef}
      {...props}
    />
  );
};

export default BasePasswordInput;
