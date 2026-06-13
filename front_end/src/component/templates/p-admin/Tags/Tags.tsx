'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import { useCreateTagForm } from '@/hooks/formik/admin-dashboard/useCreateTagFormik';
import { useDebouncedValue } from '@mantine/hooks';

import Swal from 'sweetalert2';

import BaseSearchInput from '@/component/modules/inputs/BaseSearchInput/BaseSearch.input';
import BaseTable from '../../../modules/tables/BaseTable/Base.table';
import BaseTextInput from '../../../modules/inputs/BaseTextInput/BaseText.input';
import BasePagination from '@/component/modules/paginations/BasePagination/Base.pagination';
import PrimaryButton from '../../../modules/PrimaryButton/Primary.button';

import { TagsColumnsData } from './Tags.table';
import { showSwal } from '@/utils/swalHelper';

import {
  getTagsApi,
  ITags,
  PaginationWithDataType,
  submitTagApi,
} from '@/data/server_request/dashboard/product';

import styles from './Tags.module.css';

const TagSection = () => {
  const urlParams = useSearchParams()?.get('page') || '1';

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [allTagData, setAllTagData] = useState<PaginationWithDataType<ITags>>();

  const [searchValue, setSearchValue] = useState('');
  const [debouncedSearch] = useDebouncedValue(searchValue, 0);
  const urlparams = useSearchParams();
  const urlSearch = urlparams?.get('Search') || '';

  const submitHandler = async (values: any) => {
    Swal.fire({
      title: 'آیا از اضافه کردن  مطمئن هستید؟',
      icon: 'warning',
      confirmButtonText: 'تایید',
      cancelButtonText: 'لغو',
      showCancelButton: true,
      showCloseButton: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const result = await submitTagApi(values);
          if (result.status === 201) {
            showSwal(' با موفقیت انجام گردید.', '', 'success', 'تایید');
            callGetTagApi();
          }
        } catch (error) {
          showSwal('مجددا تلاش کنید', '', 'error', 'تلاش مجدد');
        }
      }
    });
  };

  const { values, handleSubmit, errors, handleChange } =
    useCreateTagForm(submitHandler);

  const callGetTagApi = async () => {
    try {
      const result = await getTagsApi(Number(urlParams), urlSearch);
      setAllTagData(result);
    } catch (error) {
      // console.log(error)
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    callGetTagApi();
  }, [urlParams, urlSearch]);

  const handlePageChange = (pageNumber: number) => {
    const params = new URLSearchParams();
    params.set('page', pageNumber.toString());
    window.history.replaceState(null, '', `?${params.toString()}`);
  };

  useEffect(() => {
    const params = new URLSearchParams(urlParams);

    if (!debouncedSearch) {
      params.delete('Search');
    } else {
      params.set('Search', debouncedSearch.toString());
    }

    window.history.replaceState(null, '', `?${params.toString()}`);
  }, [debouncedSearch, urlSearch]);

  return (
    <div className={styles.RegisterMain}>
      <div className={styles.nameSection}>
        <span>ایجاد تگ جدید</span>
      </div>
      <form onSubmit={handleSubmit}>
        <div className={styles.form}>
          <div className={styles.input}>
            <BaseTextInput
              name="tag_name"
              value={values.tag_name}
              error={errors.tag_name}
              label=" عنوان تگ"
              leftSection={null}
              rightSection={null}
              onChange={handleChange}
            />
          </div>

          <PrimaryButton size="lg" type="submit" variant="primary">
            افزودن تگ جدید
          </PrimaryButton>
        </div>
      </form>

      <Suspense>
        <div className="mt-14 md:w-[50%] w-full">
          <BaseSearchInput
            placeholder="جستوجو تگ"
            onChange={(e) => setSearchValue(e.target.value)}
            value={searchValue || urlSearch}
          />
        </div>
        <BaseTable
          loadingCount={5}
          isLoading={isLoading}
          columns={TagsColumnsData(callGetTagApi)}
          data={allTagData?.results as any}
        />
      </Suspense>
      <BasePagination
        disabled={isLoading}
        onChange={handlePageChange}
        total={Math.ceil((allTagData?.count ?? 0) / 20)}
      />
    </div>
  );
};

export default TagSection;
