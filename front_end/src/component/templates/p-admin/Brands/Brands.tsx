'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useCreateBrandForm } from '@/hooks/formik/admin-dashboard/useCreateBrandFormik';
import { useDebouncedValue } from '@mantine/hooks';
import { FileWithPath } from '@mantine/dropzone';

import Swal from 'sweetalert2';

import BaseTable from '../../../modules/tables/BaseTable/Base.table';
import BaseTextInput from '../../../modules/inputs/BaseTextInput/BaseText.input';
import BaseImageUpload from '@/component/modules/inputs/BaseImageUpload/BaseImageUpload.input';
import BaseSearchInput from '@/component/modules/inputs/BaseSearchInput/BaseSearch.input';
import PrimaryButton from '../../../modules/PrimaryButton/Primary.button';
import BasePagination from '../../../modules/paginations/BasePagination/Base.pagination';

import { BrandsColumnsData } from './Brands.table';
import { showSwal } from '@/utils/swalHelper';

import {
  getBrandsApi,
  IBrands,
  PaginationWithDataType,
  submitBrandsApi,
  submitImageFileApi,
} from '@/data/server_request/dashboard/product';
import styles from './Brands.module.css';

const Brands = () => {
  const urlParams = useSearchParams()?.get('page') || '1';
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [allBrandsData, setAllBrandsData] =
    useState<PaginationWithDataType<IBrands>>();
  const [isUploadImageLoading, setIsUploadImageLoading] =
    useState<boolean>(false);
  const [fileImage, setFileImage] = useState<FileWithPath[]>([]);
  const [errorUploadImageLoading, setErrorUploadImageLoading] =
    useState<boolean>(false);

  const [searchValue, setSearchValue] = useState('');
  const [debouncedSearch] = useDebouncedValue(searchValue, 0);
  const urlparams = useSearchParams();
  const urlSearch = urlparams?.get('Search') || '';

  const submitHandler = async (values: any) => {
    const filteredData = Object.fromEntries(
      Object.entries(values).filter(
        ([key, value]) => value !== '' && value !== null,
      ),
    );
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
          const result = await submitBrandsApi(filteredData);

          if (result.status === 201) {
            showSwal(' با موفقیت انجام گردید.', '', 'success', 'تایید');
            callGetBrandsApi();
          }
        } catch (error) {
          showSwal('مجددا تلاش کنید', '', 'error', 'تلاش مجدد');
        }
      }
    });
  };

  const { values, handleSubmit, errors, handleChange, setFieldValue } =
    useCreateBrandForm(submitHandler);

  const callGetBrandsApi = async () => {
    try {
      const result = await getBrandsApi(Number(urlParams), urlSearch);
      setAllBrandsData(result);
    } catch (error) {
      // console.log(error)
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    callGetBrandsApi();
  }, [urlParams, urlSearch]);

  const handlePageChange = (pageNumber: number) => {
    const params = new URLSearchParams();
    params.set('page', pageNumber.toString());
    window.history.replaceState(null, '', `?${params.toString()}`);
  };

  useEffect(() => {
    if (fileImage.length > 0) {
      callSubmitImageFileApi();
    }
  }, [fileImage]);

  const callSubmitImageFileApi = async () => {
    setIsUploadImageLoading(true);
    setErrorUploadImageLoading(false);
    try {
      const formData = new FormData();
      formData.append('image', fileImage[0]);
      const result = await submitImageFileApi(formData);
      setFieldValue('brand_image', result.id);
    } catch (error) {
      // console.log(error);
    } finally {
      setIsUploadImageLoading(false);
    }
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
        <span>ایجاد برند جدید</span>
      </div>
      <form onSubmit={handleSubmit}>
        <div className={styles.form}>
          <div className={styles.input}>
            <BaseTextInput
              name="brand_name"
              value={values.brand_name}
              error={errors.brand_name}
              label=" عنوان برند"
              leftSection={null}
              rightSection={null}
              onChange={handleChange}
            />
          </div>
          <div className={styles.input}>
            <BaseImageUpload
              isUploadImageLoading={isUploadImageLoading}
              files={fileImage}
              onSetFiles={setFileImage}
            />
            <div>
              {errorUploadImageLoading && (
                <p className="text-center text-red-600">خطا در بارگذاری عکس</p>
              )}
            </div>
          </div>

          <PrimaryButton size="lg" type="submit" variant="primary">
            افزودن برند جدید
          </PrimaryButton>
        </div>
      </form>

      <Suspense>
        <div className="mt-14 md:w-[50%] w-full">
          <BaseSearchInput
            placeholder="جستوجو برند"
            onChange={(e) => setSearchValue(e.target.value)}
            value={searchValue || urlSearch}
          />
        </div>
        <BaseTable
          loadingCount={5}
          isLoading={isLoading}
          columns={BrandsColumnsData(callGetBrandsApi)}
          data={allBrandsData?.results as any}
        />
      </Suspense>
      <BasePagination
        disabled={isLoading}
        onChange={handlePageChange}
        total={Math.ceil((allBrandsData?.count ?? 0) / 20)}
      />
    </div>
  );
};

export default Brands;
