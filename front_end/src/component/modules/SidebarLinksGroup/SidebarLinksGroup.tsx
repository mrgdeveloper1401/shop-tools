import Link from 'next/link';
import { useState } from 'react';

import { Box, Collapse, Group, ThemeIcon, UnstyledButton } from '@mantine/core';

import ChevronLeftIcon from '../icons/ChevronLeft.icon';

import styles from './SidebarLinksGroup.module.css';

interface LinksGroupProps {
  icon: JSX.Element;
  label: string;
  initiallyOpened?: boolean;
  links?: { label: string; link: string }[];
}

export function SidebarLinksGroup({
  icon: Icon,
  label,
  initiallyOpened,
  links,
}: LinksGroupProps) {
  const hasLinks = Array.isArray(links);
  const [opened, setOpened] = useState(initiallyOpened || false);
  const items = (hasLinks ? links : []).map((link) => (
    <Link className={styles.link} href={link.link} key={link.label}>
      {link.label}
    </Link>
  ));

  return (
    <>
      <UnstyledButton
        className={styles.control}
        onClick={() => setOpened((o) => !o)}
      >
        <Group justify="space-between" gap={0}>
          <Box style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <ThemeIcon variant="light" size={30}>
              {Icon}
            </ThemeIcon>
            <Box ml="md">{label}</Box>
          </Box>
          {hasLinks && (
            <ChevronLeftIcon
              className={styles.chevron}
              style={{
                transform: opened ? 'rotate(90deg)' : 'none',
                fontSize: '15px',
              }}
            />
          )}
        </Group>
      </UnstyledButton>
      {hasLinks ? <Collapse in={opened}>{items}</Collapse> : null}
    </>
  );
}
