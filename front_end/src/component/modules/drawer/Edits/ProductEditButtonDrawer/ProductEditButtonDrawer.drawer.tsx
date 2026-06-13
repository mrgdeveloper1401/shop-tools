'use client';
import { FC, useEffect } from 'react';
import { useDisclosure } from '@mantine/hooks';
import { useCreateProductForm } from '@/hooks/formik/admin-dashboard/useCreateProductFormik';

import Swal from 'sweetalert2';
import { Switch } from '@mantine/core';

import BaseTextArea from '@/component/modules/inputs/BaseTextArea/BaseTextArea';
import BaseSelectSearchInput from '@/component/modules/inputs/BaseSelectSearchInput/BaseSelectSearch.input';
import BaseMultiSelectSearchInput from '@/component/modules/inputs/BaseMultiSelectSearchInput/BaseMultiSelectSearch.input';
import BaseTextInput from '../../../inputs/BaseTextInput/BaseText.input';
import BaseDrawer from '../../BaseDrawer/BaseDrawer';
import PrimaryButton from '../../../PrimaryButton/Primary.button';

import EditIcon from '@/component/modules/icons/Edit.icon';
import ChevronDownIcon from '@/component/modules/icons/ChevronDown.icon';

import {
  getOneProductAdminApi,
  IBrands,
  ICategory,
  ITags,
  submitEditProductsApi,
} from '@/data/server_request/dashboard/product';
import { showSwal } from '@/utils/swalHelper';

import styles from './ProductEditButtonDrawer.module.css';

interface IProductEditButtonDrawerProps {
  productId: number;
  categoryId: number;
  callGetProductsApi: VoidFunction;
  allBrandsData: IBrands[];
  allCategoryData: ICategory[];
  allTagsData: ITags[];
}
const ProductEditButtonDrawer: FC<IProductEditButtonDrawerProps> = ({
  productId,
  categoryId,
  callGetProductsApi,
  allBrandsData,
  allCategoryData,
  allTagsData,
}) => {
  const [opened, { open, close }] = useDisclosure(false);

  const submitHandler = async (values: any) => {
    Swal.fire({
      title: 'آیا از ادیت خود اطمینان دارید؟',
      icon: 'warning',
      iconHtml: '!',
      confirmButtonText: 'تایید',
      cancelButtonText: 'لغو',
      showCancelButton: true,
      showCloseButton: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await submitEditProductsApi(
            productId,
            categoryId,
            values,
          );
          if (res.status === 200) {
            Swal.fire({
              title: ' محصول با موفقیت ادیت گردید.',
              text: '',
              icon: 'success',
              confirmButtonText: 'تایید',
            }).then(() => {
              close();
              callGetProductsApi();
            });
          } else {
            showSwal('دوباره تلاش کنید !', '', 'warning', 'سعی مجدد');
          }
        } catch (error) {
          // console.log(error);
        }
      }
    });
  };

  const { values, handleSubmit, errors, handleChange, setFieldValue } =
    useCreateProductForm(submitHandler);

  const callGetProductApi = async () => {
    try {
      const result = await getOneProductAdminApi(productId, categoryId);
      setFieldValue('product_name', result.product_name);
      setFieldValue('description', result.description);
      setFieldValue('sku', result.sku);
      setFieldValue(
        'tags',
        result.tags.map((item) => String(item.id)),
      );
      setFieldValue('product_brand', result.product_brand.id);
      setFieldValue('category', result.category.id);
      setFieldValue('in_person_purchase', result.in_person_purchase);
    } catch (error) {
      // console.log(error)
    } finally {
      // setIsLoading(false);
    }
  };

  useEffect(() => {
    if (opened) callGetProductApi();
  }, [opened]);

  return (
    <>
      <BaseDrawer
        lockScroll={true}
        size="xl"
        title="ادیت محصول"
        opened={opened}
        onClose={close}
        position="right"
      >
        <form className={styles.form_container} onSubmit={handleSubmit}>
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
            <div className={styles.input}>
              <BaseTextInput
                labelProps={{
                  'data-floating': true,
                }}
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
                labelProps={{
                  'data-floating': true,
                }}
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
                labelProps={{
                  'data-floating': true,
                }}
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
                value={allCategoryData
                  ?.find((item) => item.id === values.category)
                  ?.id?.toString()}
                data={
                  allCategoryData?.map((item: any, index: number) => ({
                    value: String(item.id),
                    label: `${index + 1} - ${item.category_name}`,
                  })) || []
                }
                onChange={(value: any) => {
                  setFieldValue('category', Number(value));
                }}
              />
            </div>
            <div className={styles.input}>
              <BaseSelectSearchInput
                name="product_brand"
                rightSection={<ChevronDownIcon />}
                withScrollArea={true}
                placeholder="برند را انتخاب کنید"
                value={allBrandsData
                  ?.find((item) => item.id === values.product_brand)
                  ?.id?.toString()}
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
                value={values.tags}
                data={allTagsData?.map((item: any, index: number) => ({
                  value: String(item.id),
                  label: `${index + 1}-  ${item.tag_name}`,
                }))}
                onChange={(value: any) => setFieldValue('tags', value)}
              />
            </div>
          </div>
          <div className={styles.buttonContainer}>
            <PrimaryButton
              size="lg"
              variant="outline"
              type="button"
              onClick={close}
            >
              لغو
            </PrimaryButton>
            <PrimaryButton size="lg" variant="primary" type="submit">
              تایید
            </PrimaryButton>
          </div>
        </form>
      </BaseDrawer>
      <button onClick={open}>
        <EditIcon />
      </button>
    </>
  );
};
export default ProductEditButtonDrawer;
