'use client';
import Link from 'next/link';
import Image from 'next/image';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { Loader, LoadingOverlay } from '@mantine/core';

import {
  submitVerifyPaymentApi,
  IVarifyPayment,
} from '@/data/server_request/dashboard/orders';

import styles from './ResultPayment.module.css';
import PrimaryButton from '@/component/modules/PrimaryButton/Primary.button';

const ResultPayment = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const status = searchParams.get('status');
  const trackId = searchParams.get('trackId');
  const orderId = searchParams.get('orderId');

  const [paymentInfo, setPaymentInfo] = useState<IVarifyPayment | undefined>();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const callGetSubscripApi = async () => {
    try {
      const result = await submitVerifyPaymentApi(
        String(trackId),
        String(status),
        String(orderId),
      );
      setPaymentInfo(result);
    } catch (error) {
      // console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    callGetSubscripApi();
  }, []);

  return (
    <section className={styles.secction_payment}>
      {isLoading ? (
        <div className={styles.loading}>
          <LoadingOverlay visible />
        </div>
      ) : (
        <>
          {trackId && paymentInfo?.message === 'success' ? (
            <div className={styles.payment_status}>
              <div className={styles.success_content}>
                <h2 className={styles.success_title}>
                  پرداخت با موفقیت ثبت گردید
                </h2>
                <span className={styles.code}>
                  کد رهگیری شما : {paymentInfo?.refNumber}
                </span>
                <span className={styles.desc}>
                  کارشناسان ما دراسرع وقت با شما تماس خواهند گرفت.
                </span>
              </div>
              <div className={styles.btn}>
                <Link href="/">
                  <PrimaryButton>بازگشت به صفحه اصلی</PrimaryButton>
                </Link>
              </div>
            </div>
          ) : (
            <div className={styles.payment_status}>
              <div className={styles.success_content}>
                <h2 className={styles.faield_title}>پرداخت ناموفق!</h2>
                <span className={styles.desc}>با خطا مواجه شدید</span>
              </div>
              <div className={styles.btn}>
                <Link href="/cart/shopping">
                  <PrimaryButton>سعی مجدد!</PrimaryButton>
                </Link>
              </div>
            </div>
          )}
        </>
      )}
    </section>
  );
};
export default ResultPayment;
