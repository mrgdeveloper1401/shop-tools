'use client';
import { lazy, Suspense, useEffect, useState } from 'react';
import { useSiteMapFormikForm } from '@/hooks/formik/admin-dashboard/useSiteMapFormik';

import Swal from 'sweetalert2';
import BaseTextInput from '@/component/modules/inputs/BaseTextInput/BaseText.input';
import BaseSelectInput from '@/component/modules/inputs/BaseSelectInput/BaseSelect.input';
import PrimaryButton from '@/component/modules/PrimaryButton/Primary.button';
import BaseNumberInput from '@/component/modules/inputs/BaseNumberInput/BaseNumberInput.input';
const BaseTable = lazy(
  () => import('@/component/modules/tables/BaseTable/Base.table'),
);

import {
  getSiteMapApi,
  ISiteMap,
  submitSiteMapApi,
} from '../../../../data/server_request/sitemap';
import { showSwal } from '../../../../utils/swalHelper';

import styles from './SiteMap.module.css';
import { SiteMapColumnsData } from './SiteMap.table';

const SiteMap = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [allSiteMapData, setAllSiteMapData] = useState<ISiteMap[]>();

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
          const result = await submitSiteMapApi(values);
          if (result.status === 201) {
            showSwal(' با موفقیت انجام گردید.', '', 'success', 'تایید');
            callGetSiteMapApi();
          }
        } catch (error) {
          showSwal('مجددا تلاش کنید', '', 'error', 'تلاش مجدد');
        }
      }
    });
  };

  const { values, errors, handleChange, handleSubmit, setFieldValue } =
    useSiteMapFormikForm(submitHandler);

  const callGetSiteMapApi = async () => {
    try {
      const result = await getSiteMapApi();
      setAllSiteMapData(result);
    } catch (error) {
      // console.log(error)
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    callGetSiteMapApi();
    getLocalISODate();
  }, []);

  const getLocalISODate = () => {
    const date = new Date();
    const tzOffset = -date.getTimezoneOffset();
    const diff = tzOffset >= 0 ? '+' : '-';
    const pad = (n: number) => String(Math.floor(Math.abs(n))).padStart(2, '0');

    const outputTime =
      date.getFullYear() +
      '-' +
      pad(date.getMonth() + 1) +
      '-' +
      pad(date.getDate()) +
      'T' +
      pad(date.getHours()) +
      ':' +
      pad(date.getMinutes()) +
      ':' +
      pad(date.getSeconds()) +
      diff +
      pad(tzOffset / 60) +
      ':' +
      pad(tzOffset % 60);
    setFieldValue('last_modified', outputTime);
  };

  return (
    <div className={styles.RegisterMain}>
      <div className={styles.nameSection}>
        <span>سایت مپ</span>
      </div>
      <form onSubmit={handleSubmit}>
        <div className={styles.form}>
          <div className={styles.input}>
            <BaseTextInput
              name="slug_text"
              value={values.slug_text}
              error={errors.slug_text}
              placeholder="https://gs-tools.ir/(loc)"
              rightSection={null}
              onChange={handleChange}
            />
          </div>

          <div className={styles.input}>
            <BaseSelectInput
              name="changefreq"
              comboboxProps={{ position: 'bottom' }}
              placeholder="تاریخ تغییرات سایت(changefreq)"
              autoComplete="off"
              data={[
                { value: 'never', label: 'never' },
                { value: 'daily', label: 'daily' },
                { value: 'monthly', label: 'monthly' },
                { value: 'yearly', label: 'yearly' },
              ]}
              onChange={(k, v) => setFieldValue('changefreq', k)}
            />
          </div>

          <div className={styles.input}>
            <BaseNumberInput
              name="priority"
              placeholder="priority(0-1)"
              value={values.priority}
              error={errors.priority}
              onChange={(val) => setFieldValue('priority', val)}
              clampBehavior="strict"
              min={0}
              max={1}
            />
          </div>

          <div className={styles.input}>
            <PrimaryButton onClick={getLocalISODate}>
              تاریخ آخرین تغییر
            </PrimaryButton>
          </div>

          <div className={styles.input}>
            <PrimaryButton size="md" type="submit" variant="primary">
              افزودن سایت مپ جدید
            </PrimaryButton>
          </div>
        </div>
      </form>
      <Suspense>
        <BaseTable
          loadingCount={3}
          isLoading={isLoading}
          columns={SiteMapColumnsData(callGetSiteMapApi)}
          data={allSiteMapData as any}
        />
      </Suspense>
    </div>
  );
};
export default SiteMap;
