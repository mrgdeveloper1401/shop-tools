'use client';
import { FC, Suspense, useEffect, useState } from 'react';
import { useDisclosure } from '@mantine/hooks';
import { useAddSpecificationForm } from '@/hooks/formik/admin-dashboard/useAddSpecificationFormik';

import Swal from 'sweetalert2';

import BaseDrawer from '../BaseDrawer/BaseDrawer';
import BaseTable from '../../tables/BaseTable/Base.table';
import PrimaryButton from '../../PrimaryButton/Primary.button';

import BaseTextInput from '../../inputs/BaseTextInput/BaseText.input';
import { showSwal } from '../../../../utils/swalHelper';

import {
  getAttributeKeysApi,
  getSpecificationApi,
  IAttributeKey,
  ISpecification,
  PaginationWithDataType,
  submitSpecificationApi,
} from '@/data/server_request/dashboard/product';
import { SpecificationColumnsData } from './SpecificationButtonDrawer.table';
import styles from './SpecificationButtonDrawer.module.css';
import BaseSelectSearchInput from '../../inputs/BaseSelectSearchInput/BaseSelectSearch.input';
import ChevronDownIcon from '../../icons/ChevronDown.icon';
import { Button } from '@mantine/core';

interface SpecificationButtonDrawerProps {
  productId: number;
  categoryId: number;
}
const SpecificationButtonDrawer: FC<SpecificationButtonDrawerProps> = ({
  productId,
  categoryId,
}) => {
  const [opened, { open, close }] = useDisclosure(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [allSpecificationData, setAllSpecificationData] =
    useState<ISpecification[]>();
  const [allAttributeData, setAllAttributeData] = useState<IAttributeKey[]>();

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
          const res = await submitSpecificationApi(
            categoryId,
            productId,
            values,
          );
          if (res.status === 200 || res.status === 201) {
            Swal.fire({
              title: 'با موفقیت انجام شد.',
              text: '',
              icon: 'success',
              confirmButtonText: 'تایید',
            });
            callGetSpecificationsApi();
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
    useAddSpecificationForm(submitHandler);

  const callGetSpecificationsApi = async () => {
    try {
      const resultAttribute = await getAttributeKeysApi();
      setAllAttributeData(resultAttribute);

      const result = await getSpecificationApi(categoryId, productId);
      setAllSpecificationData(result);
    } catch (error) {
      // console.log(error)
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (opened) callGetSpecificationsApi();
    setFieldValue('product', productId);
  }, [opened]);

  return (
    <>
      <BaseDrawer
        lockScroll={true}
        size="xl"
        title="مشخصات های محصول"
        opened={opened}
        onClose={close}
        position="right"
      >
        <form className={styles.form_container} onSubmit={handleSubmit}>
          <div className={styles.form}>
            <div className={styles.input}>
              <BaseSelectSearchInput
                name="category"
                rightSection={<ChevronDownIcon />}
                withScrollArea={true}
                placeholder=" ویژگی را انتخاب کنید"
                data={
                  allAttributeData?.map((item: any, index: number) => ({
                    value: String(item.id),
                    label: `${index + 1} - ${item.attribute_name}`,
                  })) || []
                }
                onChange={(value: any) =>
                  setFieldValue('attribute', Number(value))
                }
              />
            </div>
            <div className={styles.input}>
              <BaseTextInput
                name="value"
                value={values.value || ''}
                error={errors.value}
                label=" توضیح ویژگی"
                leftSection={null}
                rightSection={null}
                onChange={handleChange}
              />
            </div>
            <div className={styles.btns}>
              <PrimaryButton size="lg" type="submit">
                افزودن مشخصات
              </PrimaryButton>
            </div>
          </div>
        </form>
        <Suspense>
          <div className={styles.table}>
            <BaseTable
              loadingCount={3}
              isLoading={isLoading}
              columns={SpecificationColumnsData(
                productId,
                categoryId,
                callGetSpecificationsApi,
              )}
              data={allSpecificationData as any}
            />
          </div>
        </Suspense>
      </BaseDrawer>

      <Button variant="filled" onClick={open} color="red" radius="xl">
        افزودن مشخصات

      </Button>
    </>
  );
};
export default SpecificationButtonDrawer;
