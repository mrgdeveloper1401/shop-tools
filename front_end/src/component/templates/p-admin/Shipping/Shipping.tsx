'use client';

import { useCreateShippingForm } from '@/hooks/formik/admin-dashboard/useCreateShippingFormik';
import { Suspense, useEffect, useState } from 'react';

import Swal from 'sweetalert2';

import BaseTable from '../../../modules/tables/BaseTable/Base.table';
import BaseTextInput from '../../../modules/inputs/BaseTextInput/BaseText.input';
import PrimaryButton from '../../../modules/PrimaryButton/Primary.button';

import { ShippingColumnsData } from './Shipping.table';
import { showSwal } from '@/utils/swalHelper';

import {
  getShippingApi,
  getShippingDetailApi,
  IShipping,
  IShippingDetail,
  submitShippingApi,
  submitShippingDetailApi,
} from '@/data/server_request/dashboard/shipping';
import styles from './Shipping.module.css';
import { useCreateShippingDetailForm } from '@/hooks/formik/admin-dashboard/useCreateShippingDetailFormik';
import BaseSelectSearchInput from '@/component/modules/inputs/BaseSelectSearchInput/BaseSelectSearch.input';
import ChevronDownIcon from '@/component/modules/icons/ChevronDown.icon';
import { ShippingDetailColumnsData } from './ShippingDetail.table';

const Shipping = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [allShippingData, setAllShippingData] = useState<IShipping[]>();

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
          const result = await submitShippingApi(values);
          if (result.status === 201 || result.status === 200) {
            showSwal(' با موفقیت انجام گردید.', '', 'success', 'تایید');
            callGetShippingApi();
          }
        } catch (error) {
          showSwal('مجددا تلاش کنید', '', 'error', 'تلاش مجدد');
        }
      }
    });
  };

  const { values, handleSubmit, errors, handleChange } =
    useCreateShippingForm(submitHandler);

  const callGetShippingApi = async () => {
    try {
      const result = await getShippingApi();
      setAllShippingData(result);
    } catch (error) {
      // console.log(error)
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    callGetShippingApi();
  }, []);

  return (
    <>
      <div className={styles.RegisterMain}>
        <div className={styles.nameSection}>
          <span>ایجاد حمل و نقل</span>
        </div>
        <form onSubmit={handleSubmit}>
          <div className={styles.form}>
            <div className={styles.input}>
              <BaseTextInput
                name="name"
                value={values.name}
                error={errors.name}
                label=" عنوان  شرکت حمل و نقل"
                leftSection={null}
                rightSection={null}
                onChange={handleChange}
              />
            </div>

            <PrimaryButton size="lg" type="submit" variant="primary">
              افزودن
            </PrimaryButton>
          </div>
        </form>

        <Suspense>
          <BaseTable
            loadingCount={3}
            isLoading={isLoading}
            columns={ShippingColumnsData(callGetShippingApi)}
            data={allShippingData as any}
          />
        </Suspense>
      </div>
      <ShippingDeatil allShippingData={allShippingData} />
    </>
  );
};

export default Shipping;

const ShippingDeatil = ({ allShippingData }: { allShippingData: any }) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [allShippingDetailData, setAllShippingDetailData] =
    useState<IShippingDetail[]>();

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
          const result = await submitShippingDetailApi(values);
          if (result.status === 201 || result.status === 200) {
            showSwal(' با موفقیت انجام گردید.', '', 'success', 'تایید');
            callGetShippingDetailApi();
          }
        } catch (error) {
          showSwal('مجددا تلاش کنید', '', 'error', 'تلاش مجدد');
        }
      }
    });
  };

  const { values, handleSubmit, errors, handleChange, setFieldValue } =
    useCreateShippingDetailForm(submitHandler);

  const callGetShippingDetailApi = async () => {
    try {
      const result = await getShippingDetailApi();
      setAllShippingDetailData(result);
    } catch (error) {
      // console.log(error)
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    callGetShippingDetailApi();
  }, []);
  return (
    <div className={styles.RegisterMain}>
      <div className={styles.nameSection}>
        <span>جزئیات حمل و نقل</span>
      </div>
      <form onSubmit={handleSubmit}>
        <div className={styles.form}>
          <div className={styles.input}>
            <BaseSelectSearchInput
              name="company"
              rightSection={<ChevronDownIcon />}
              withScrollArea={true}
              placeholder="کمپانی را انتخاب کنید"
              data={
                allShippingData?.map((item: any, index: number) => ({
                  value: String(item.id),
                  label: `${index + 1} - ${item.name}`,
                })) || []
              }
              onChange={(value: any) => setFieldValue('company', Number(value))}
            />
          </div>

          <div className={styles.input}>
            <BaseSelectSearchInput
              name="company"
              rightSection={<ChevronDownIcon />}
              withScrollArea={true}
              placeholder="نوع را انتخاب کنید"
              data={[
                {
                  value: 'standard ',
                  label: 'پست ایران',
                },
                {
                  value: 'express',
                  label: 'پیشتاز',
                },
                {
                  value: 'free',
                  label: 'حضوری',
                },
              ]}
              onChange={(value: any) => setFieldValue('shipping_type', value)}
            />
          </div>
          <div className={styles.input}>
            <BaseTextInput
              name="estimated_days"
              value={values.estimated_days || ''}
              error={errors.estimated_days}
              label="تعداد روزهای مورد نیاز"
              leftSection={null}
              rightSection={null}
              onChange={handleChange}
            />
          </div>
          <div className={styles.input}>
            <BaseTextInput
              name="price"
              value={values.price || ''}
              error={errors.price}
              label="هزینه ی ارسال"
              leftSection={null}
              rightSection={null}
              onChange={handleChange}
            />
          </div>

          <PrimaryButton size="lg" type="submit" variant="primary">
            افزودن
          </PrimaryButton>
        </div>
      </form>

      <Suspense>
        <BaseTable
          loadingCount={5}
          isLoading={isLoading}
          columns={ShippingDetailColumnsData(callGetShippingDetailApi)}
          data={allShippingDetailData as any}
        />
      </Suspense>
    </div>
  );
};
