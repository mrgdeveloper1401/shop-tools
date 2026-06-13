'use client';
import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useDebouncedValue } from '@mantine/hooks';

import BasePagination from '@/component/modules/paginations/BasePagination/Base.pagination';
import BaseSearchInput from '@/component/modules/inputs/BaseSearchInput/BaseSearch.input';
import BaseTable from '@/component/modules/tables/BaseTable/Base.table';
import {
  getAllReasultOrderApi,
  IResultOrder,
} from '@/data/server_request/dashboard/orders';
import { OrderstionColumnsData } from './Orders.table';
import { PaginationWithDataType } from '@/data/server_request/dashboard/product';
import styles from './Orders.module.css';

const Orders = () => {
  const urlParamas = useSearchParams();
  const urlPageIndex = urlParamas?.get('page') || '';
  const search = urlParamas?.get('phone') || '';

  const [searchValue, setSearchValue] = useState('');
  const [debouncedSearch] = useDebouncedValue(searchValue, 0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [allOrders, setAllOrders] =
    useState<PaginationWithDataType<IResultOrder>>();
  const [filterPaymentStatus, setFilterPaymentStatus] =
    useState<string>('pending');

  const callGetOrderApi = async () => {
    try {
      const result = await getAllReasultOrderApi(
        String(urlPageIndex),
        search,
        filterPaymentStatus,
      );
      setAllOrders(result);
    } catch (error) {
      // console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    callGetOrderApi();
  }, [filterPaymentStatus, search, urlPageIndex]);

  const handlePageChange = (pageNumber: number) => {
    const params = new URLSearchParams();
    params.set('page', pageNumber.toString());
    window.history.replaceState(null, '', `?${params.toString()}`);
  };

  const handlerSearchChange = (e: any) => {
    setSearchValue(e.target.value);
  };

  useEffect(() => {
    const params = new URLSearchParams(urlParamas);
    if (!debouncedSearch) {
      params.delete('phone');
    } else {
      params.set('phone', debouncedSearch.toString());
    }

    window.history.replaceState(null, '', `?${params.toString()}`);
  }, [debouncedSearch]);

  return (
    <section className={styles.secctionListCard}>
      <div className={styles.RegisterMain}>
        <div className={styles.nameSection}>
          <span>لیست سفارشات</span>
        </div>

        <div className={styles.header}>
          <div className={styles.search_box}>
            <BaseSearchInput
              onChange={handlerSearchChange}
              radius="md"
              placeholder="جستوجو (شماره موبایل)"
            />
          </div>

          <div className={styles.filter}>
            <button
              className={`${styles.filter_btn} ${
                filterPaymentStatus === 'paid' ? styles.active : ''
              }`}
              onClick={() => setFilterPaymentStatus('paid')}
            >
              پرداخت موفق
            </button>

            <button
              className={`${styles.filter_btn} ${
                filterPaymentStatus === 'pending' ? styles.active : ''
              }`}
              onClick={() => setFilterPaymentStatus('pending')}
            >
              در انتظار پرداخت
            </button>
            <button
              className={`${styles.filter_btn} ${
                filterPaymentStatus === 'cancelled' ? styles.active : ''
              }`}
              onClick={() => setFilterPaymentStatus('cancelled')}
            >
              لغو شده
            </button>
          </div>
        </div>

        <Suspense>
          <BaseTable
            loadingCount={3}
            isLoading={isLoading}
            columns={OrderstionColumnsData(callGetOrderApi)}
            data={allOrders?.results as any}
          />
        </Suspense>
        <BasePagination
          disabled={isLoading}
          onChange={handlePageChange}
          total={Math.ceil((allOrders?.count ?? 0) / 20)}
        />
      </div>
    </section>
  );
};
export default Orders;
