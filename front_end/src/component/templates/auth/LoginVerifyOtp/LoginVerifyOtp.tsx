'use client';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useLoginOtpVerifyFormik } from '@/hooks/formik/admin-dashboard/useLoginOtpVerifyFormik';
import { notifications, Notifications } from '@mantine/notifications';

import Cookies from 'js-cookie';
import { PinInput } from '@mantine/core';
import PrimaryButton from '@/component/modules/PrimaryButton/Primary.button';

import ConfirmIcon from '@/component/modules/icons/Confirm.icon';

import { submitLoginOtpVerifyApi } from '@/data/server_request/auth';
import { showSwal } from '../../../../utils/swalHelper';

import s from './LoginVerifyOtp.module.css';

const LoginVerifyOtp = ({ mobilePhone }: { mobilePhone: string }) => {
  const router = useRouter();
  const urlParams = useSearchParams();
  const isRedirect = urlParams?.get('redirect');
  const [isLoading, setIsLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(120);

  const submitHandler = async (values: any) => {
    try {
      setIsLoading(true);
      const result = await submitLoginOtpVerifyApi(values);
      Cookies.set('token', JSON.stringify(result.data));
      if (result.status === 201 || result.status === 200) {
        if (isRedirect) {
          router.push('/cart/shopping');
        } else {
          router.push('/');
        }
        notifications.show({
          title: '',
          message: 'شما با موفقیت وارد شدید',
          radius: 'md',
          color: 'violet',
          icon: <ConfirmIcon strokeWidth={2} />,
        });
      }
    } catch (error) {
      showSwal('مجددا تلاش کنید', '', 'error', 'تلاش مجدد');
    } finally {
      setIsLoading(false);
    }
  };

  const { values, handleSubmit, errors, setFieldValue } =
    useLoginOtpVerifyFormik(submitHandler);

  useEffect(() => {
    if (timeLeft === 0) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec < 10 ? '0' + sec : sec}`;
  };

  const handleResend = async () => {
    try {
      const result = await submitLoginOtpVerifyApi({
        phone: mobilePhone,
      });
      if (result.status === 201) {
        setTimeLeft(120);
      }
    } catch (error) {
      showSwal('مجددا تلاش کنید', '', 'error', 'تلاش مجدد');
    }
  };

  useEffect(() => {
    setFieldValue('phone', mobilePhone);
  }, []);

  return (
    <form onSubmit={handleSubmit} className={s.form_login}>
      <Notifications />
      <div className={s.loginInputData}>
        <PinInput
          length={6}
          placeholder=""
          type="number"
          size="lg"
          name="code"
          value={values.code}
          onChange={(value) => setFieldValue('code', value)}
          classNames={{
            root: s.root,
            input: s.input,
            pinInput: s.pinInput,
          }}
        />

        <div className={s.btns}>
          <PrimaryButton loading={isLoading} type="submit" fullWidth>
            ورود
          </PrimaryButton>
        </div>
        <div className={s.resendOtpCode}>
          <div>
            {timeLeft === 0 && (
              <button onClick={handleResend}>ارسال مجدد کد</button>
            )}
            <div>
              <p>{formatTime(timeLeft)}</p>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default LoginVerifyOtp;
