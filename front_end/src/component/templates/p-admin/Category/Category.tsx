'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useCreateCategoryForm } from '@/hooks/formik/admin-dashboard/useCreateCateoryFormik';
import { useDebouncedValue } from '@mantine/hooks';

import Swal from 'sweetalert2';
import { FileWithPath } from '@mantine/dropzone';

import BaseTable from '../../../modules/tables/BaseTable/Base.table';
import BaseTextInput from '../../../modules/inputs/BaseTextInput/BaseText.input';
import PrimaryButton from '../../../modules/PrimaryButton/Primary.button';
import BasePagination from '../../../modules/paginations/BasePagination/Base.pagination';
import BaseImageUpload from '@/component/modules/inputs/BaseImageUpload/BaseImageUpload.input';
import BaseSearchInput from '@/component/modules/inputs/BaseSearchInput/BaseSearch.input';

import {
  getCategoryApi,
  ICategory,
  PaginationWithDataType,
  submitCategoryApi,
  submitImageFileApi,
} from '@/data/server_request/dashboard/product';
import { CategoryColumnsData } from './Category.table';
import { showSwal } from '@/utils/swalHelper';
import styles from './Category.module.css';

const CategorySection = () => {
  const urlParams = useSearchParams()?.get('page') || '1';
  const [searchValue, setSearchValue] = useState('');
  const [debouncedSearch] = useDebouncedValue(searchValue, 0);
  const urlparams = useSearchParams();
  const urlSearch = urlparams?.get('Search') || '';

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [allCategoryData, setAllCategoryData] =
    useState<PaginationWithDataType<ICategory>>();
  const [isUploadImageLoading, setIsUploadImageLoading] =
    useState<boolean>(false);
  const [fileImage, setFileImage] = useState<FileWithPath[]>([]);
  const [errorUploadImageLoading, setErrorUploadImageLoading] =
    useState<boolean>(false);

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
          const result = await submitCategoryApi(filteredData);
          if (result.status === 201) {
            showSwal(' با موفقیت انجام گردید.', '', 'success', 'تایید');
            callGetCategoryApi();
          }
        } catch (error) {
          showSwal('مجددا تلاش کنید', '', 'error', 'تلاش مجدد');
        }
      }
    });
  };

  const { values, handleSubmit, errors, handleChange, setFieldValue } =
    useCreateCategoryForm(submitHandler);

  const callGetCategoryApi = async () => {
    try {
      const result = await getCategoryApi(Number(urlParams), urlSearch);
      setAllCategoryData(result);
    } catch (error) {
      // console.log(error)
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    callGetCategoryApi();
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
      setFieldValue('category_image', result.id);
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
  }, [debouncedSearch]);

  return (
    <div className={styles.RegisterMain}>
      <div className={styles.nameSection}>
        <span>ایجاد دسته بندی جدید</span>
      </div>
      <form onSubmit={handleSubmit}>
        <div className={styles.form}>
          <div className={styles.input}>
            <BaseTextInput
              name="category_name"
              value={values.category_name}
              error={errors.category_name}
              label=" عنوان دسته بندی"
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
            افزودن دسته بندی جدید
          </PrimaryButton>
        </div>
      </form>

      <Suspense>
        <div className="mt-14 md:w-[50%] w-full">
          <BaseSearchInput
            placeholder="جستوجو دسته بندی"
            onChange={(e) => setSearchValue(e.target.value)}
            value={searchValue || urlSearch}
          />
        </div>
        <BaseTable
          loadingCount={5}
          isLoading={isLoading}
          columns={CategoryColumnsData(callGetCategoryApi)}
          data={allCategoryData?.results as any}
        />
      </Suspense>
      <BasePagination
        disabled={isLoading}
        onChange={handlePageChange}
        total={Math.ceil((allCategoryData?.count ?? 0) / 20)}
      />
    </div>
  );
};

export default CategorySection;
