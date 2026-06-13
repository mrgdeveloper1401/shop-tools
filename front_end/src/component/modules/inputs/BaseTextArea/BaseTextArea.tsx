'use client';
import { FC, useState, useRef } from 'react';
import { Textarea, TextareaProps } from '@mantine/core';
import styles from './BaseTextArea.module.css';

const BaseTextArea: FC<TextareaProps> = (props) => {
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

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
    <Textarea
      labelProps={{
        'data-floating': floating,
        'data-filled': filled,
        'data-error': error,
      }}
      data-filled={filled}
      data-error={error}
      ref={inputRef}
      classNames={{
        root: styles.root,
        input: styles.input,
        label: styles.label,
        error: styles.error,
        section: styles.section,
      }}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      {...props}
    />
  );
};
export default BaseTextArea;
