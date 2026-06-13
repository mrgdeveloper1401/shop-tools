'use client';

import { useState, useRef, forwardRef } from 'react';

import { TextInput, TextInputProps, Flex } from '@mantine/core';

import SearchInputIcon from '../../icons/SearchInput.icon';
import styles from './BaseSearch.input.module.css';

interface SearchInputProps extends TextInputProps {
  autoFocus?: boolean;
  leftSection?: React.ReactNode;
  rightSection?: React.ReactNode;
}

const BaseSearchInput = forwardRef(
  (
    {
      leftSection,
      rightSection,
      autoFocus,
      placeholder,
      ...props
    }: SearchInputProps,
    ref,
  ) => {
    const inputRef: any = ref || useRef<HTMLInputElement | null>(null);
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
      <TextInput
        {...props}
        ref={inputRef}
        data-testid="base-search-input"
        labelProps={{
          'data-floating': floating,
          'data-filled': filled,
          'data-error': error,
        }}
        data-filled={filled}
        data-error={error}
        onFocus={props.onFocus ? props.onFocus : () => setFocused(true)}
        onBlur={props.onBlur ? props.onBlur : () => setFocused(false)}
        classNames={{
          root: styles.root,
          input: styles.input,
          // label: styles.label,
          // error: styles.error,
          // section: styles.section
        }}
        placeholder={placeholder}
        rightSection={
          leftSection || (
            <Flex
              align="center"
              justify="center"
              // style={{ marginRight: "8px" }}
            >
              <SearchInputIcon fontSize={28} />
            </Flex>
          )
        }
        // rightSection={rightSection}
        rightSectionProps={{
          'aria-hidden': false,
        }}
        autoFocus={focused}
      />
    );
  },
);

export default BaseSearchInput;
