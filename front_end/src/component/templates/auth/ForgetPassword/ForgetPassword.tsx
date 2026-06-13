'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { useForgetPassForm } from '@/hooks/formik/admin-dashboard/useForgetPassFormik';

import { Notifications, notifications } from '@mantine/notifications';
import ForgetPassVerifyOtp from '../ForgetPassVerifyOtp/ForgetPassVerifyOtp';
import BaseTextInput from '@/component/modules/inputs/BaseTextInput/BaseText.input';
import PrimaryButton from '@/component/modules/PrimaryButton/Primary.button';
import ChevronLeftIcon from '@/component/modules/icons/ChevronLeft.icon';
import PhoneIcon from '@/component/modules/icons/Phone.icon';
import ConfirmIcon from '@/component/modules/icons/Confirm.icon';

import { submitForgetPassApi } from '@/data/server_request/auth';
import { showSwal } from '@/utils/swalHelper';
import s from './ForgetPassword.module.css';

const ForgetPassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [nextStep, setNextStep] = useState(false);

  const submitHandler = async (values: any) => {
    try {
      setIsLoading(true);
      const result = await submitForgetPassApi(values);
      if (result.status === 201) {
        setNextStep(true);
        notifications.show({
          title: '',
          message: 'کد تایید ارسال گردید.',
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

  const { values, handleChange, handleSubmit, errors } =
    useForgetPassForm(submitHandler);

  return (
    <div className={s.ForgetPasswordMain}>
      <Notifications />
      <div className={s.ForgetPassword_right}>
        <div className={s.ForgetPassword_left_main}>
          <div className={s.image}>
            <Image
              src="/images/home/logo.webp"
              alt="logo"
              width={150}
              height={100}
            />
          </div>
          <div className={s.ForgetPassword_tight_title}>
            {!nextStep && (
              <div>
                <Link href="/login-password">ورود با نام کاربری</Link>
                <h2>فراموشی رمز عبور</h2>
              </div>
            )}
            {nextStep && (
              <div>
                <button
                  className={s.btn_back}
                  onClick={() => setNextStep(false)}
                >
                  برگشت
                  <ChevronLeftIcon
                    style={{ rotate: '-90deg', color: 'white' }}
                    stroke="white"
                    width="1.5em"
                    height="1.5em"
                  />
                </button>
              </div>
            )}
          </div>
          {nextStep ? (
            <ForgetPassVerifyOtp mobilePhone={values.mobile_phone} />
          ) : (
            <form onSubmit={handleSubmit} className={s.form_ForgetPassword}>
              <div className={s.ForgetPasswordInputData}>
                <BaseTextInput
                  placeholder="شماره موبایل"
                  name="mobile_phone"
                  value={values.mobile_phone}
                  onChange={handleChange}
                  error={errors.mobile_phone}
                  rightSection={
                    <PhoneIcon
                      stroke="#868E96"
                      strokeWidth="1.5"
                      width="1.9em"
                    />
                  }
                />

                <div className={s.btns}>
                  <PrimaryButton loading={isLoading} type="submit" fullWidth>
                    ورود
                  </PrimaryButton>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgetPassword;
