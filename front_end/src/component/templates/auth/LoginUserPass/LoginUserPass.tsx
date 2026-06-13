'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { useLoginUserPassForm } from '@/hooks/formik/admin-dashboard/useLoginUserPassFormik';

import Cookies from 'js-cookie';
import { Notifications, notifications } from '@mantine/notifications';

import BaseTextInput from '@/component/modules/inputs/BaseTextInput/BaseText.input';
import PrimaryButton from '@/component/modules/PrimaryButton/Primary.button';
import BasePasswordInput from '@/component/modules/inputs/BasePasswordInput/BasePassword.input';
import PhoneIcon from '@/component/modules/icons/Phone.icon';
import ConfirmIcon from '@/component/modules/icons/Confirm.icon';

import { submitLoginUserPassApi } from '@/data/server_request/auth';
import { showSwal } from '@/utils/swalHelper';
import s from './LoginUserPass.module.css';

const LoginUserPass = () => {
  const router = useRouter();
  const urlParams = useSearchParams();
  const isRedirect = urlParams?.get('redirect');
  const [isLoading, setIsLoading] = useState(false);

  const submitHandler = async (values: any) => {
    try {
      setIsLoading(true);
      const result = await submitLoginUserPassApi(values);

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
      showSwal(
        'رمز یا نام کاربری شما اشتباه می باشد!',
        '',
        'error',
        'تلاش مجدد',
      );
    } finally {
      setIsLoading(false);
    }
  };

  const { values, handleChange, handleSubmit, errors } =
    useLoginUserPassForm(submitHandler);

  return (
    <div className={s.loginMain}>
      <Notifications />
      <div className={s.login_right}>
        <div className={s.login_left_main}>
          <Link href="/" className={s.image}>
            <Image
              src="/images/home/logo.webp"
              alt="logo"
              width={150}
              height={100}
            />
          </Link>
          <div className={s.login_tight_title}>
            <div>
              <Link href="/login">ورود با موبایل</Link>
              <h2>ورود به جی اس تولز</h2>
            </div>
          </div>
          <form onSubmit={handleSubmit} className={s.form_login}>
            <div className={s.loginInputData}>
              <BaseTextInput
                placeholder="شماره موبایل"
                name="phone"
                value={values.phone}
                onChange={handleChange}
                error={errors.phone}
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
            <Link
              href="/forget-password"
              className="text-black text-[14px] mt-2 mr-2"
            >
              رمز خود را فراموش کرده اید؟
            </Link>
            <p className={s.textBottom}>
              ورود شما به معنای پذیرش شرایط جی اس تولز و قوانین حریم‌خصوصی است!
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginUserPass;
