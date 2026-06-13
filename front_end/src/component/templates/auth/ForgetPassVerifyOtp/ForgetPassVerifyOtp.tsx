'use client';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { useForgetPassVerifyForm } from '@/hooks/formik/admin-dashboard/useForgetPassVerifyFormik';
import { notifications, Notifications } from '@mantine/notifications';

import Cookies from 'js-cookie';
import { PinInput } from '@mantine/core';
import PrimaryButton from '@/component/modules/PrimaryButton/Primary.button';
import BaseTextInput from '@/component/modules/inputs/BaseTextInput/BaseText.input';

import ConfirmIcon from '@/component/modules/icons/Confirm.icon';

import {
  submitForgetPassApi,
  submitForgetPassVerifyApi,
} from '@/data/server_request/auth';
import { showSwal } from '../../../../utils/swalHelper';

import s from './ForgetPassVerifyOtp.module.css';

const ForgetPassVerifyOtp = ({ mobilePhone }: { mobilePhone: string }) => {
  const router = useRouter();
  const urlParams = useSearchParams();
  const isRedirect = urlParams?.get('redirect');
  const [isLoading, setIsLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(120);

  const submitHandler = async (values: any) => {
    try {
      setIsLoading(true);
      const result = await submitForgetPassVerifyApi(values);
      Cookies.set('token', JSON.stringify(result.data));
      if (result.status === 201 || result.status === 200) {
        if (isRedirect) {
          router.push('/cart/shopping');
        } else {
          router.push('/login-password');
        }
        notifications.show({
          title: '',
          message: 'رمز شما با موفقیت تغییر یافت.',
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

  const { values, handleSubmit, errors, setFieldValue, handleChange } =
    useForgetPassVerifyForm(submitHandler);

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
      const result = await submitForgetPassApi({
        mobile_phone: mobilePhone,
      });
      if (result.status === 201) {
        setTimeLeft(120);
      }
    } catch (error) {
      showSwal('مجددا تلاش کنید', '', 'error', 'تلاش مجدد');
    }
  };

  useEffect(() => {
    setFieldValue('mobile_phone', mobilePhone);
  }, []);

  return (
    <form onSubmit={handleSubmit} className={s.form_ForgetPass}>
      <Notifications />
      <div className={s.ForgetPassInputData}>
        <PinInput
          length={6}
          placeholder=""
          type="number"
          size="lg"
          name="code"
          value={values.otp}
          onChange={(value) => setFieldValue('otp', value)}
          classNames={{
            root: s.root,
            input: s.input,
            pinInput: s.pinInput,
          }}
        />

        <BaseTextInput
          label="رمز را وارد کنید"
          name="password"
          value={values.password}
          error={errors.password}
          onChange={handleChange}
        />
        <BaseTextInput
          label="رمز را مجددا وارد کنید"
          name="confirm_password"
          value={values.confirm_password}
          error={errors.confirm_password}
          onChange={handleChange}
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

export default ForgetPassVerifyOtp;
