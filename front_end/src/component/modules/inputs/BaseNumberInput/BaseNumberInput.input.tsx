import { FC, useState, useRef } from 'react';

import { NumberInput, NumberInputProps } from '@mantine/core';

import styles from './BaseNumberInput.input.module.css';

const BaseNumberInput: FC<NumberInputProps> = (props) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

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
    <NumberInput
      labelProps={{
        'data-floating': floating,
        'data-filled': filled,
        'data-error': error,
      }}
      data-filled={filled}
      data-error={error}
      classNames={{
        root: styles.root,
        input: styles.input,
        label: styles.label,
        error: styles.error,
        section: styles.section,
      }}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      ref={inputRef}
      {...props}
    />
  );
};

export default BaseNumberInput;
