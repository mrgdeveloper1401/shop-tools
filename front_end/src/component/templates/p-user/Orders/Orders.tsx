'use client';
import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

import BasePagination from '@/component/modules/paginations/BasePagination/Base.pagination';
import BaseTable from '@/component/modules/tables/BaseTable/Base.table';
import { getAllOrderApi, IOrder } from '@/data/server_request/dashboard/orders';
import { OrderstionColumnsData } from './Orders.table';
import { PaginationWithDataType } from '@/data/server_request/dashboard/product';
import styles from './Orders.module.css';

const Orders = () => {
  const urlParamas = useSearchParams();
  const urlPageIndex = urlParamas?.get('page') || '';

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [allOrders, setAllOrders] = useState<PaginationWithDataType<IOrder>>();
  const [filterPaymentStatus, setFilterPaymentStatus] =
    useState<string>('true');

  const callGetOrderApi = async () => {
    try {
      const result = await getAllOrderApi(
        String(urlPageIndex),
        undefined,
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
  }, [filterPaymentStatus, urlPageIndex]);

  const handlePageChange = (pageNumber: number) => {
    const params = new URLSearchParams();
    params.set('page', pageNumber.toString());
    window.history.replaceState(null, '', `?${params.toString()}`);
  };

  return (
    <section className={styles.secctionListCard}>
      <div className={styles.RegisterMain}>
        <div className={styles.nameSection}>
          <span>لیست سفارشات</span>
        </div>

        <div className={styles.header}>
          <div className={styles.filter}>
            <button
              className={`${styles.filter_btn} ${
                filterPaymentStatus === 'true' ? styles.active : ''
              }`}
              onClick={() => setFilterPaymentStatus('true')}
            >
              تایید شده
            </button>

            <button
              className={`${styles.filter_btn} ${
                filterPaymentStatus === 'false' ? styles.active : ''
              }`}
              onClick={() => setFilterPaymentStatus('false')}
            >
              لغو شده
            </button>
          </div>
        </div>

        <Suspense>
          <BaseTable
            loadingCount={3}
            isLoading={isLoading}
            columns={OrderstionColumnsData}
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
