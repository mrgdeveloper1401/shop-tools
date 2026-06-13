'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Group, Menu, Radio, UnstyledButton } from '@mantine/core';
import ChevronDownIcon from '../../icons/ChevronDown.icon';

const TicketCloseDropdown = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const orderValue = searchParams.get('IsClose');

  const handleChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('IsClose', value);
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <Menu closeOnItemClick={false} width={200} shadow="md">
      <Menu.Target>
        <UnstyledButton style={{ display: 'flex' }}>
          <ChevronDownIcon />
        </UnstyledButton>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Item>
          <Radio.Group
            value={orderValue}
            onChange={handleChange}
            label="بر اساس "
          >
            <Group mt="xs">
              <Radio value="" label="همه" />
              <Radio value="yes" label="تیکت های بسته شده" />
              <Radio value="no" label="تیکت های باز" />
            </Group>
          </Radio.Group>
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};

export default TicketCloseDropdown;
