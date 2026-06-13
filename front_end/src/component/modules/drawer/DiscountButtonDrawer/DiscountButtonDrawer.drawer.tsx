'use client';
import { FC, Suspense, useEffect, useState } from 'react';
import { useAddDiscountForm } from '@/hooks/formik/admin-dashboard/useAddDiscountFormik';
import { useDisclosure } from '@mantine/hooks';

import Swal from 'sweetalert2';
import dynamic from 'next/dynamic';

const DatePicker = dynamic(() => import('react-multi-date-picker'), {
  ssr: false,
});
import DatePanel from 'react-multi-date-picker/plugins/date_panel';
import persian from 'react-date-object/calendars/persian';
import persian_fa from 'react-date-object/locales/persian_fa';
import BaseDrawer from '../BaseDrawer/BaseDrawer';
import BaseTable from '../../tables/BaseTable/Base.table';
import PrimaryButton from '../../PrimaryButton/Primary.button';

import BaseTextInput from '../../inputs/BaseTextInput/BaseText.input';
import { showSwal } from '../../../../utils/swalHelper';

import {
  getDiscountsApi,
  IDiscount,
  PaginationWithDataType,
  submitDiscountApi,
} from '@/data/server_request/dashboard/product';
import { dateConvertRangeUtils } from '@/utils/dateConvertUtils';
import { DiscountColumnsData } from './DiscountButtonDrawer.table';
import styles from './DiscountButtonDrawer.module.css';

interface DiscountButtonDrawerProps {
  productId: number;
  variantId: number;
  categoryId: number;
}
const DiscountButtonDrawer: FC<DiscountButtonDrawerProps> = ({
  variantId,
  productId,
  categoryId,
}) => {
  const [opened, { open, close }] = useDisclosure(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [allDiscountData, setAllDiscountData] =
    useState<PaginationWithDataType<IDiscount>>();

  const submitHandler = async (values: any) => {
    const filteredValues = Object.fromEntries(
      Object.entries(values).filter(
        ([_, value]) => value !== '' && value !== null,
      ),
    );
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
          const res = await submitDiscountApi(
            variantId,
            productId,
            categoryId,
            filteredValues,
          );
          if (res.status === 200 || res.status === 201) {
            Swal.fire({
              title: 'با موفقیت انجام شد.',
              text: '',
              icon: 'success',
              confirmButtonText: 'تایید',
            });
            callGetDiscountsApi();
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
    useAddDiscountForm(submitHandler);

  const callGetDiscountsApi = async () => {
    try {
      const result = await getDiscountsApi(variantId, productId, categoryId);
      setAllDiscountData(result);
    } catch (error) {
      // console.log(error)
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (opened) {
      callGetDiscountsApi();
      setFieldValue('product_variant', variantId);
    }
  }, [opened]);

  const timeHandler = (date: any) => {
    dateConvertRangeUtils(date, setFieldValue, 'start_date', 'end_date');
  };

  return (
    <>
      <BaseDrawer
        lockScroll={true}
        size="xl"
        title="اعمال تخفیف"
        opened={opened}
        onClose={close}
        position="right"
      >
        <form className={styles.form_container} onSubmit={handleSubmit}>
          <div className={styles.form}>
            <div className={styles.input}>
              <BaseTextInput
                name="amount"
                value={values.amount || ''}
                error={errors.amount}
                label="مقدار تخفیف"
                leftSection={null}
                rightSection={null}
                onChange={handleChange}
              />
            </div>
            <div className={styles.input}>
              <div className={styles.datePicker}>
                <DatePicker
                  style={{
                    width: '100%',
                    height: '50px',
                    border: 'none',
                    outline: 'none',
                    padding: '0.5rem',
                    textAlign: 'center',
                    background: '#e2e8f0',
                    borderRadius: '10px',
                    color: 'black',
                  }}
                  className={styles.datePicker}
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
              <PrimaryButton size="lg" type="submit">
                اعمال تخفیف
              </PrimaryButton>
            </div>
          </div>
        </form>
        <Suspense>
          <div className={styles.table}>
            <BaseTable
              loadingCount={3}
              isLoading={isLoading}
              columns={DiscountColumnsData(
                variantId,
                productId,
                categoryId,
                callGetDiscountsApi,
              )}
              data={allDiscountData?.results as any}
            />
          </div>
        </Suspense>
      </BaseDrawer>
      <PrimaryButton onClick={open} size="xs" className={styles.td}>
        اعمال تخفیف
      </PrimaryButton>
    </>
  );
};
export default DiscountButtonDrawer;
