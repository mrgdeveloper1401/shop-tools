'use client';
import { FC, Suspense, useEffect, useState } from 'react';
import { useDisclosure } from '@mantine/hooks';
import { useAddVariantForm } from '@/hooks/formik/admin-dashboard/useAddVariantFormik';

import Swal from 'sweetalert2';

import BaseDrawer from '../BaseDrawer/BaseDrawer';
import BaseTable from '../../tables/BaseTable/Base.table';
import PrimaryButton from '../../PrimaryButton/Primary.button';

import BaseTextInput from '../../inputs/BaseTextInput/BaseText.input';
import { showSwal } from '../../../../utils/swalHelper';

import {
  getVariantsApi,
  IVariant,
  submitVariantApi,
} from '@/data/server_request/dashboard/product';
import { VariantColumnsData } from './VariantButtonDrawer.table';
import styles from './VariantButtonDrawer.module.css';
import { Button } from '@mantine/core';

interface VariantButtonDrawerProps {
  productId: number;
  categoryId: number;
}
const VariantButtonDrawer: FC<VariantButtonDrawerProps> = ({
  productId,
  categoryId,
}) => {
  const [opened, { open, close }] = useDisclosure(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [allVariantData, setAllVariantData] = useState<IVariant[]>();

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
          const res = await submitVariantApi(categoryId, productId, values);
          if (res.status === 200 || res.status === 201) {
            Swal.fire({
              title: 'با موفقیت انجام شد.',
              text: '',
              icon: 'success',
              confirmButtonText: 'تایید',
            });
            callGetVariantsApi();
          } else {
            showSwal('دوباره تلاش کنید !', '', 'warning', 'سعی مجدد');
          }
        } catch (error) {
          // console.log(error);
        }
      }
    });
  };

  const { values, handleSubmit, handleChange, errors, setFieldValue } =
    useAddVariantForm(submitHandler);

  const callGetVariantsApi = async () => {
    try {
      const result = await getVariantsApi(categoryId, productId);
      setAllVariantData(result);
    } catch (error) {
      // console.log(error)
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (opened) {
      setFieldValue('product', productId);
      callGetVariantsApi();
    }
  }, [opened]);

  return (
    <>
      <BaseDrawer
        lockScroll={true}
        size="xl"
        title="مشخصات محصول"
        opened={opened}
        onClose={close}
        position="right"
      >
        <form className={styles.form_container} onSubmit={handleSubmit}>
          <div className={styles.form}>
            <div className={styles.input}>
              <BaseTextInput
                name="name"
                labelProps={{
                  'data-floating': true,
                }}
                placeholder="رنگ قرمز"
                value={values.name}
                error={errors.name}
                label="عنوان محصول"
                leftSection={null}
                rightSection={null}
                onChange={handleChange}
              />
            </div>
            <div className={styles.input}>
              <BaseTextInput
                name="price"
                value={values.price}
                error={errors.price}
                label=" قیمت محصول"
                leftSection={null}
                rightSection={null}
                onChange={handleChange}
              />
            </div>
            <div className={styles.input}>
              <BaseTextInput
                name="stock_number"
                value={values.stock_number || ''}
                error={errors.stock_number}
                label="تعداد محصول"
                leftSection={null}
                rightSection={null}
                onChange={handleChange}
              />
            </div>
            <div className={styles.btns}>
              <PrimaryButton fullWidth size="lg" type="submit">
                افزودن
              </PrimaryButton>
            </div>
          </div>
        </form>
        <Suspense>
          <div className={styles.table}>
            <BaseTable
              loadingCount={3}
              isLoading={isLoading}
              columns={VariantColumnsData(
                productId,
                categoryId,
                callGetVariantsApi,
              )}
              data={allVariantData as any}
            />
          </div>
        </Suspense>
      </BaseDrawer>

      <Button
        variant="filled" color="red" radius="xl"
        onClick={open}

      >
        افزدون قیمت

      </Button>

    </>
  );
};
export default VariantButtonDrawer;
