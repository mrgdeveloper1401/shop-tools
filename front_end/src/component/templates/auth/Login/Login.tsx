'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { useLoginForm } from '@/hooks/formik/admin-dashboard/useLoginFormik';
import { Notifications, notifications } from '@mantine/notifications';

import BaseTextInput from '@/component/modules/inputs/BaseTextInput/BaseText.input';
import PrimaryButton from '@/component/modules/PrimaryButton/Primary.button';
import LoginVerifyOtp from '../LoginVerifyOtp/LoginVerifyOtp';
import ChevronLeftIcon from '@/component/modules/icons/ChevronLeft.icon';
import PhoneIcon from '@/component/modules/icons/Phone.icon';
import ConfirmIcon from '@/component/modules/icons/Confirm.icon';

import { submitLoginApi } from '@/data/server_request/auth';
import { showSwal } from '@/utils/swalHelper';
import s from './Login.module.css';
import { useSearchParams } from 'next/navigation';

const Login = () => {
  const urlParams = useSearchParams();
  const isRedirect = urlParams?.get('redirect');
  const [isLoading, setIsLoading] = useState(false);
  const [nextStep, setNextStep] = useState(false);

  const submitHandler = async (values: any) => {
    try {
      setIsLoading(true);
      const result = await submitLoginApi(values);
      if (result.status === 201) {
        setNextStep(true);
        notifications.show({
          title: '',
          message: 'کد ورود ارسال گردید.',
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
    useLoginForm(submitHandler);

  return (
    <div className={s.loginMain}>
      <Notifications />
      <div className={s.login_right}>
        <div className={s.login_left_main}>
          <Link href="/" className={s.image}>
            <Image
              src="/images/home/logo.png"
              alt="logo"
              width={150}
              height={100}
            />
          </Link>
          <div className={s.login_tight_title}>
            {!nextStep && (
              <div>
                <Link
                  href={`${isRedirect ? '/login-password?redirect=true' : '/login-password'}`}
                >
                  ورود با نام کاربری
                </Link>
                <h2>ورود به جی اس تولز</h2>
              </div>
            )}
            {nextStep && (
              <button className={s.btn_back} onClick={() => setNextStep(false)}>
                <ChevronLeftIcon
                  style={{ rotate: '-90deg', color: 'white' }}
                  stroke="white"
                  width="1.5em"
                  height="1.5em"
                />
                برگشت
              </button>
            )}
          </div>
          {nextStep ? (
            <LoginVerifyOtp mobilePhone={values.mobile_phone} />
          ) : (
            <form onSubmit={handleSubmit} className={s.form_login}>
              <div className={s.loginInputData}>
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

                  <Link
                    href={`${isRedirect ? '/signup?redirect=true' : '/signup'}`}
                  >
                    <PrimaryButton variant="outline" type="submit" fullWidth>
                      ثبت نام
                    </PrimaryButton>
                  </Link>
                </div>
              </div>
              <p className={s.textBottom}>
                ورود شما به معنای پذیرش شرایط جی اس تولز و قوانین حریم‌خصوصی
                است!
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
