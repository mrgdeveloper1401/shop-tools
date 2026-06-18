'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useCreateProductForm } from '@/hooks/formik/admin-dashboard/useCreateProductFormik';
import { useDebouncedValue } from '@mantine/hooks';
import { Switch } from '@mantine/core';
import Swal from 'sweetalert2';

import BaseTextArea from '@/component/modules/inputs/BaseTextArea/BaseTextArea';
import BaseTable from '../../../modules/tables/BaseTable/Base.table';
import BaseTextInput from '../../../modules/inputs/BaseTextInput/BaseText.input';
import PrimaryButton from '../../../modules/PrimaryButton/Primary.button';
import BasePagination from '../../../modules/paginations/BasePagination/Base.pagination';
import BaseSelectSearchInput from '@/component/modules/inputs/BaseSelectSearchInput/BaseSelectSearch.input';
import BaseMultiSelectSearchInput from '@/component/modules/inputs/BaseMultiSelectSearchInput/BaseMultiSelectSearch.input';
import BaseSearchInput from '@/component/modules/inputs/BaseSearchInput/BaseSearch.input';

import ChevronDownIcon from '@/component/modules/icons/ChevronDown.icon';

import {
  getAllBrandsApi,
  getAllCategoryApi,
  getAllTagsApi,
  getProductsAdminApi,
  getProductsApi,
  IBrands,
  ICategory,
  IProducts,
  ITags,
  PaginationWithDataType,
  submitProductsApi,
} from '@/data/server_request/dashboard/product';
import { ProductsColumnsData } from './Products.table';
import { showSwal } from '@/utils/swalHelper';

import styles from './Products.module.css';

const ProductsSection = () => {
  const urlParams = useSearchParams()?.get('page') || '1';
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [allProductsData, setAllProductsData] =
    useState<PaginationWithDataType<IProducts>>();
  const [allBrandsData, setAllBrandsData] = useState<IBrands[]>();
  const [allCategoryData, setAllCategoryData] = useState<ICategory[]>();
  const [allTagsData, setAllTagsData] = useState<ITags[]>();

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
          const result = await submitProductsApi(values.category, values);
          if (result.status === 201) {
            showSwal(' با موفقیت انجام گردید.', '', 'success', 'تایید');
            callGetProductsApi();
          }
        } catch (error) {
          showSwal('مجددا تلاش کنید', '', 'error', 'تلاش مجدد');
        }
      }
    });
  };

  const { values, handleSubmit, errors, handleChange, setFieldValue } =
    useCreateProductForm(submitHandler);

  const callGetProductsApi = async () => {
    try {
      const result = await getProductsAdminApi(
        Number(urlParams),
        undefined,
        urlSearch,
        undefined,
        "-id"
      );
      setAllProductsData(result);

      const resultBrands = await getAllBrandsApi();
      setAllBrandsData(resultBrands);

      const resultCategory = await getAllCategoryApi();
      setAllCategoryData(resultCategory);

      const resultTags = await getAllTagsApi();
      setAllTagsData(resultTags);
    } catch (error) {
      // console.log(error)
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    callGetProductsApi();
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
        <span>محصولات</span>
      </div>
      <form onSubmit={handleSubmit}>
        <div className={styles.form}>
          <div className={styles.input}>
            <Switch
              label="تیپاکس فعال شود"
              name="in_person_purchase"
              size="sm"
              checked={values.in_person_purchase}
              onChange={handleChange}
            />
          </div>
          <div className={styles.input}></div>
          <div className={styles.input}>
            <BaseTextInput
              name="product_name"
              value={values.product_name}
              error={errors.product_name}
              label="عنوان محصول"
              leftSection={null}
              rightSection={null}
              onChange={handleChange}
            />
          </div>
          <div className={styles.input}>
            <BaseTextInput
              name="sku"
              value={values.sku}
              error={errors.sku}
              label="شناسه محصول"
              leftSection={null}
              rightSection={null}
              onChange={handleChange}
            />
          </div>
          <div className={styles.input}>
            <BaseTextArea
              name="description"
              value={values.description}
              error={errors.description}
              label="توضیحات محصول"
              leftSection={null}
              rightSection={null}
              onChange={handleChange}
            />
          </div>

          <div className={styles.input}>
            <BaseSelectSearchInput
              name="category"
              rightSection={<ChevronDownIcon />}
              withScrollArea={true}
              placeholder="دسته بندی را انتخاب کنید"
              data={
                allCategoryData?.map((item: any, index: number) => ({
                  value: String(item.id),
                  label: `${index + 1} - ${item.category_name}`,
                })) || []
              }
              onChange={(value: any) =>
                setFieldValue('category', Number(value))
              }
            />
          </div>
          <div className={styles.input}>
            <BaseSelectSearchInput
              name="product_brand"
              rightSection={<ChevronDownIcon />}
              withScrollArea={true}
              placeholder="برند را انتخاب کنید"
              data={
                allBrandsData?.map((item: any, index: number) => ({
                  value: String(item.id),
                  label: `${index + 1}- ${item.brand_name}`,
                })) || []
              }
              onChange={(value: any) =>
                setFieldValue('product_brand', Number(value))
              }
            />
          </div>
          <div className={styles.input}>
            <BaseMultiSelectSearchInput
              errorProps={errors}
              name="tags"
              rightSection={<ChevronDownIcon />}
              placeholder="تگ ها را انتخاب کنید"
              withScrollArea={true}
              data={allTagsData?.map((item: any, index: number) => ({
                value: String(item.id),
                label: `${index + 1} - ${item.tag_name}`,
              }))}
              onChange={(value: any) => setFieldValue('tags', value)}
            />
          </div>

          <PrimaryButton size="lg" type="submit" variant="primary">
            افزودن محصول جدید
          </PrimaryButton>
        </div>
      </form>

      <Suspense>
        <div className="mt-14 md:w-[50%] w-full">
          <BaseSearchInput
            placeholder="جستوجو محصولات"
            onChange={(e) => setSearchValue(e.target.value)}
            value={searchValue || urlSearch}
          />
        </div>
        <BaseTable
          loadingCount={5}
          isLoading={isLoading}
          columns={ProductsColumnsData(
            callGetProductsApi,
            allBrandsData as any,
            allCategoryData as any,
            allTagsData as any,
          )}
          data={allProductsData?.results as any}
        />
      </Suspense>
      <BasePagination
        disabled={isLoading}
        onChange={handlePageChange}
        total={Math.ceil((allProductsData?.count ?? 0) / 20)}
      />
    </div>
  );
};

export default ProductsSection;
