'use client';

import { Suspense, useEffect, useState } from 'react';
import { useCreateAttributeKeyForm } from '@/hooks/formik/admin-dashboard/useCreateAttributeKeyFormik';

import Swal from 'sweetalert2';

import BaseTable from '../../../modules/tables/BaseTable/Base.table';
import BaseTextInput from '../../../modules/inputs/BaseTextInput/BaseText.input';
import PrimaryButton from '../../../modules/PrimaryButton/Primary.button';

import { AttributeKeyColumnsData } from './AttributeKey.table';
import { showSwal } from '@/utils/swalHelper';

import {
  getAttributeKeysApi,
  IAttributeKey,
  submitAttributeKeyApi,
} from '@/data/server_request/dashboard/product';
import styles from './AttributeKey.module.css';

const AttributeKey = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [allAttributeKeyData, setAllAttributeKeyData] =
    useState<IAttributeKey[]>();

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
          const result = await submitAttributeKeyApi(values);
          if (result.status === 201) {
            showSwal(' با موفقیت انجام گردید.', '', 'success', 'تایید');
            callGetAttributeKeyApi();
          }
        } catch (error) {
          showSwal('مجددا تلاش کنید', '', 'error', 'تلاش مجدد');
        }
      }
    });
  };

  const { values, handleSubmit, errors, handleChange } =
    useCreateAttributeKeyForm(submitHandler);

  const callGetAttributeKeyApi = async () => {
    try {
      const result = await getAttributeKeysApi();
      setAllAttributeKeyData(result);
    } catch (error) {
      // console.log(error)
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    callGetAttributeKeyApi();
  }, []);

  return (
    <div className={styles.RegisterMain}>
      <div className={styles.nameSection}>
        <span>ایجاد مشخصات محصول جدید</span>
      </div>
      <form onSubmit={handleSubmit}>
        <div className={styles.form}>
          <div className={styles.input}>
            <BaseTextInput
              name="attribute_name"
              value={values.attribute_name}
              error={errors.attribute_name}
              label=" عنوان مشخصات محصول"
              leftSection={null}
              rightSection={null}
              onChange={handleChange}
            />
          </div>
          <PrimaryButton size="lg" type="submit" variant="primary">
            افزودن مشخصات جدید
          </PrimaryButton>
        </div>
      </form>

      <Suspense>
        <BaseTable
          loadingCount={5}
          isLoading={isLoading}
          columns={AttributeKeyColumnsData(callGetAttributeKeyApi)}
          data={allAttributeKeyData as any}
        />
      </Suspense>
    </div>
  );
};

export default AttributeKey;
