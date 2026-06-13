'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

import BaseTable from '../../../modules/tables/BaseTable/Base.table';

import BasePagination from '@/component/modules/paginations/BasePagination/Base.pagination';
import { BaSalamColumnsData } from './BaSalam.table';
import { getBaSalamApi } from '@/data/server_request/dashboard/BaSalam';
import styles from './BaSalam.module.css';

const BaSalamSection = () => {
  const urlParams = useSearchParams()?.get('page') || '1';
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [allBaSalamData, setAllBaSalamData] = useState<{
    data: any[];
    page: number;
    per_page: number;
    result_count: number;
    total_count: number;
    total_page: number;
  }>();

  const callGetBaSalamApi = async () => {
    try {
      const result = await getBaSalamApi(Number(urlParams));
      setAllBaSalamData(result);
    } catch (error) {
      // console.log(error)
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    callGetBaSalamApi();
  }, [urlParams]);

  const handlePageChange = (pageNumber: number) => {
    const params = new URLSearchParams();
    params.set('page', pageNumber.toString());
    window.history.replaceState(null, '', `?${params.toString()}`);
  };

  return (
    <div className={styles.RegisterMain}>
      <div className={styles.nameSection}>
        <span>محصولات باسلام</span>
      </div>
      <Suspense>
        <BaseTable
          loadingCount={5}
          isLoading={isLoading}
          columns={BaSalamColumnsData(callGetBaSalamApi)}
          data={allBaSalamData?.data as any}
        />
      </Suspense>
      <BasePagination
        onChange={handlePageChange}
        total={Math.ceil((allBaSalamData?.total_count ?? 0) / 10)}
      />
    </div>
  );
};

export default BaSalamSection;
