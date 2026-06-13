'use client';
import { lazy, Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

import Swal from 'sweetalert2';

import dynamic from 'next/dynamic';
const DatePicker = dynamic(() => import('react-multi-date-picker'), {
  ssr: false,
});
import persian from 'react-date-object/calendars/persian';
import DatePanel from 'react-multi-date-picker/plugins/date_panel';
import persian_fa from 'react-date-object/locales/persian_fa';

const BaseTable = lazy(
  () => import('../../../modules/tables/BaseTable/Base.table'),
);

import BaseTextInput from '../../../modules/inputs/BaseTextInput/BaseText.input';
import PrimaryButton from '../../../modules/PrimaryButton/Primary.button';
import BasePagination from '../../../modules/paginations/BasePagination/Base.pagination';

import { showSwal } from '../../../../utils/swalHelper';
import { dateConvertRangeUtils } from '@/utils/dateConvertUtils';
import { CouponColumnsData } from './Coupon.table';

import { useCreateCouponForm } from '@/hooks/formik/admin-dashboard/useCreateCouponFormik';
import { PaginationWithDataType } from '@/data/server_request/dashboard/product';
import {
  getCouponApi,
  ICoupon,
  submitCouponApi,
} from '@/data/server_request/dashboard/coupon';
import styles from './Coupon.module.css';

const Coupon = () => {
  const urlParams = useSearchParams()?.get('page') || '1';

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [allCouponData, setAllCouponData] =
    useState<PaginationWithDataType<ICoupon>>();

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
          const result = await submitCouponApi(values);
          if (result.status === 201) {
            showSwal(' با موفقیت انجام گردید.', '', 'success', 'تایید');
            callGetCouponApi();
          }
        } catch (error) {
          showSwal('مجددا تلاش کنید', '', 'error', 'تلاش مجدد');
        }
      }
    });
  };

  const { values, errors, handleChange, handleSubmit, setFieldValue } =
    useCreateCouponForm(submitHandler);

  const callGetCouponApi = async () => {
    try {
      const result = await getCouponApi(Number(urlParams));
      setAllCouponData(result);
    } catch (error) {
      // console.log(error)
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    callGetCouponApi();
  }, [urlParams]);

  const handlePageChange = (pageNumber: number) => {
    const params = new URLSearchParams(window.location.search);
    params.set('page', pageNumber.toString());
    window.history.replaceState(null, '', `?${params.toString()}`);
  };

  const timeHandler = (date: any) => {
    dateConvertRangeUtils(date, setFieldValue, 'valid_from', 'valid_to');
  };

  return (
    <div className={styles.RegisterMain}>
      <div className={styles.nameSection}>
        <span>ایجاد کد تخفیف</span>
      </div>
      <form onSubmit={handleSubmit}>
        <div className={styles.form}>
          <div className={styles.input}>
            <BaseTextInput
              name="code"
              value={values.code}
              error={errors.code}
              label="کد تخفیف"
              rightSection={null}
              onChange={handleChange}
            />
          </div>
          <div className={styles.input}>
            <BaseTextInput
              name="maximum_use"
              label="تعداد قابل استفاده"
              value={values.maximum_use || ''}
              error={errors.maximum_use}
              rightSection={null}
              onChange={handleChange}
            />
          </div>
          <div className={styles.input}>
            <BaseTextInput
              name="amount"
              label="مقدار تخفیف"
              value={values.amount}
              error={errors.amount}
              rightSection={null}
              onChange={handleChange}
            />
          </div>
          <div className={styles.input}>
            <div className={styles.datePicker}>
              <DatePicker
                style={{
                  width: '100%',
                  height: '40px',
                  border: 'none',
                  outline: 'none',
                  padding: '0.5rem',
                  textAlign: 'center',
                  background: '#e2e8f0',
                  borderRadius: '10px',
                }}
                plugins={[<DatePanel position="left" />]}
                range
                calendar={persian}
                locale={persian_fa}
                calendarPosition="bottom-center"
                onChange={timeHandler}
                placeholder="تاریخ شروع تا پایان"
                dateSeparator=" تا "
              />
            </div>
          </div>
          <div className={styles.input}>
            <PrimaryButton size="md" type="submit" variant="primary">
              ایجاد کد تخفیف
            </PrimaryButton>
          </div>
        </div>
      </form>
      <Suspense>
        <BaseTable
          loadingCount={3}
          isLoading={isLoading}
          columns={CouponColumnsData(callGetCouponApi)}
          data={allCouponData?.results as any}
        />
      </Suspense>
      <BasePagination
        disabled={isLoading}
        onChange={handlePageChange}
        total={Math.ceil((allCouponData?.count ?? 0) / 20)}
      />
    </div>
  );
};
export default Coupon;
