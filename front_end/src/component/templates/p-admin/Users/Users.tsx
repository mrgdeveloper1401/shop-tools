'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useDisclosure } from '@mantine/hooks';

import FilterUsersButtonDrawer from '@/component/modules/drawer/Filters/FilterUsersButtonDrawer/FilterUsersButtonDrawer.drawer';
import BaseTable from '@/component/modules/tables/BaseTable/Base.table';
import BasePagination from '@/component/modules/paginations/BasePagination/Base.pagination';

import FilterIcon from '@/component/modules/icons/Filter.icon';
import CloseIcon from '@/component/modules/icons/Close.icon';

import { IUser, getAllUsers } from '@/data/server_request/dashboard/users';
import { UserColumnsData } from './User.table';
import { PaginationWithDataType } from '@/data/server_request/dashboard/product';
import styles from './Users.module.css';

const Users = () => {
  const [opened, { open, close }] = useDisclosure(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [usersData, setUsersData] = useState<PaginationWithDataType<IUser>>();
  const urlParams = useSearchParams();
  const pageIndex = urlParams?.get('page') || '1';
  const searchUrl = urlParams?.get('PhoneSearch') || '';

  const callGetAllUsers = async () => {
    try {
      setIsLoading(true);
      const result = await getAllUsers(Number(pageIndex), searchUrl);
      setUsersData(result);
    } catch (error) {
      // console.error('Error fetching users:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    callGetAllUsers();
  }, [urlParams]);

  const handlePageChange = (pageNumber: number) => {
    const params = new URLSearchParams(window.location.search);
    params.set('page', pageNumber.toString());
    window.history.replaceState(null, '', `?${params.toString()}`);
  };

  return (
    <div className={styles.UsersRegisterMain}>
      <div className={styles.nameSection}>
        <span>اسامی کاربران</span>
        <div className={styles.filterSection}>
          {opened && (
            <FilterUsersButtonDrawer isOpen={opened} onClose={close} />
          )}

          <button className={styles.filterButton} onClick={open}>
            <FilterIcon />
          </button>

          {searchUrl && (
            <button
              className={styles.clearAllFilters}
              onClick={() => {
                window.history.replaceState(null, '', window.location.pathname);
              }}
            >
              <CloseIcon />
            </button>
          )}
        </div>
      </div>

      <Suspense>
        <BaseTable
          loadingCount={4}
          isLoading={isLoading}
          columns={UserColumnsData(callGetAllUsers)}
          data={usersData?.results as any}
        />
      </Suspense>

      <BasePagination
        disabled={isLoading}
        onChange={handlePageChange}
        total={Math.ceil((usersData?.count ?? 0) / 20)}
      />
    </div>
  );
};

export default Users;
