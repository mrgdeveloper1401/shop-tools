'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { useSignUpForm } from '@/hooks/formik/admin-dashboard/useSignUpFormik';

import { Notifications, notifications } from '@mantine/notifications';

import BasePasswordInput from '@/component/modules/inputs/BasePasswordInput/BasePassword.input';
import BaseTextInput from '@/component/modules/inputs/BaseTextInput/BaseText.input';
import PrimaryButton from '@/component/modules/PrimaryButton/Primary.button';

import PhoneIcon from '@/component/modules/icons/Phone.icon';
import ConfirmIcon from '@/component/modules/icons/Confirm.icon';

import { submitSignUpApi } from '@/data/server_request/auth';
import { showSwal } from '@/utils/swalHelper';
import s from './SignUp.module.css';

const SignUp = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const urlParams = useSearchParams();
  const isRedirect = urlParams?.get('redirect');

  const submitHandler = async (values: any) => {
    try {
      setIsLoading(true);
      const result = await submitSignUpApi(values);

      if (result.status === 201) {
        if (isRedirect) {
          router.push('/login?redirect=true');
        } else {
          router.push('/login');
        }
        notifications.show({
          title: '',
          message: 'ثبت نام با موفقیت انجام گردید.',
          radius: 'md',
          color: 'violet',
          icon: <ConfirmIcon strokeWidth={2} />,
        });
      }

      if (result === 400) {
        showSwal(
          'لطفا وارد شوید!',
          'شما قبلا با این شماره ثبت نام کرده اید.',
          'error',
          'تایید',
        );
      }
    } catch (error) {
      showSwal('مجددا تلاش کنید', '', 'error', 'تلاش مجدد');
    } finally {
      setIsLoading(false);
    }
  };

  const { values, handleChange, handleSubmit, errors } =
    useSignUpForm(submitHandler);

  return (
    <div className={s.SignUpMain}>
      <Notifications />

      <div className={s.SignUp_right}>
        <div className={s.SignUp_left_main}>
          <div className={s.image}>
            <Image
              src="/images/home/logo.webp"
              alt="logo"
              width={150}
              height={100}
            />
          </div>
          <div className={s.SignUp_tight_title}>
            <h2>ثبت نام در جی اس تولز</h2>
          </div>

          <form onSubmit={handleSubmit} className={s.form_SignUp}>
            <div className={s.SignUpInputData}>
              <BaseTextInput
                placeholder="نام کاربری"
                name="username"
                value={values.username}
                onChange={handleChange}
                error={errors.username}
              />
              <BaseTextInput
                placeholder="شماره موبایل"
                name="mobile_phone"
                value={values.mobile_phone}
                onChange={handleChange}
                error={errors.mobile_phone}
                rightSection={
                  <PhoneIcon stroke="#868E96" strokeWidth="1.5" width="1.9em" />
                }
              />
              <BasePasswordInput
                placeholder="رمز عبور"
                name="password"
                autoComplete="on"
                value={values.password}
                onChange={handleChange}
                error={errors.password}
                styles={{ input: { background: 'white' } }}
              />

              <div className={s.btns}>
                <PrimaryButton loading={isLoading} type="submit" fullWidth>
                  ثبت نام
                </PrimaryButton>
                <Link
                  href={`${isRedirect ? '/login?redirect=true' : '/login'}`}
                >
                  <PrimaryButton variant="outline" fullWidth>
                    ورود
                  </PrimaryButton>
                </Link>
              </div>
            </div>
            <p className={s.textBottom}>
              ورود شما به معنای پذیرش شرایط جی اس تولز و قوانین حریم‌خصوصی است!
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
