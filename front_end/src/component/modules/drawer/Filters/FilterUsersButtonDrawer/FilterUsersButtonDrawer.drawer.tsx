import { FC, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useDebouncedValue } from '@mantine/hooks';

import BaseDrawer from '../../BaseDrawer/BaseDrawer';
import BaseTextInput from '@/component/modules/inputs/BaseTextInput/BaseText.input';
import PrimaryButton from '@/component/modules/PrimaryButton/Primary.button';

import styles from './FilterUsersButtonDrawer.module.css';

interface FilterUsersButtonDrawerProps {
  isOpen: boolean;
  onClose: VoidFunction;
}

const FilterUsersButtonDrawer: FC<FilterUsersButtonDrawerProps> = ({
  isOpen,
  onClose,
}) => {
  const urlParams = useSearchParams();
  const [searchValue, setSearchValue] = useState('');
  const [debouncedSearch] = useDebouncedValue(searchValue, 0);

  const handlerSearchChange = (e: any) => {
    setSearchValue(e.target.value);
  };

  useEffect(() => {
    const params = new URLSearchParams(urlParams);

    if (!debouncedSearch) {
      params.delete('PhoneSearch');
    } else {
      params.set('PhoneSearch', debouncedSearch.toString());
    }

    window.history.replaceState(null, '', `?${params.toString()}`);
  }, [debouncedSearch]);

  return (
    <>
      <BaseDrawer
        lockScroll={true}
        size="md"
        title="فیلتر کاربران"
        opened={isOpen}
        onClose={onClose}
        position="right"
      >
        <div className={styles.containerFilter}>
          <div className={styles.form}>
            <div className={styles.input}>
              <BaseTextInput
                name="firstName"
                label="جستجوی موبایل"
                value={searchValue}
                onChange={(e) => handlerSearchChange(e)}
              />
            </div>
          </div>
          <div className={styles.buttonContainer}>
            <PrimaryButton
              size="lg"
              variant="outline"
              type="button"
              onClick={() => {
                setSearchValue('');
              }}
            >
              لغو
            </PrimaryButton>
            <PrimaryButton
              onClick={onClose}
              size="lg"
              variant="primary"
              type="submit"
            >
              تایید
            </PrimaryButton>
          </div>
        </div>
      </BaseDrawer>
    </>
  );
};
export default FilterUsersButtonDrawer;
