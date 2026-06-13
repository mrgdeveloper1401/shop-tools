'use client';
import { useState } from 'react';
import { useCreateUserForm } from '../../../../hooks/formik/admin-dashboard/useCreateUserFormik';

import Swal from 'sweetalert2';

import BaseTextInput from '../../../modules/inputs/BaseTextInput/BaseText.input';

import PrimaryButton from '../../../modules/PrimaryButton/Primary.button';

import { showSwal } from '../../../../utils/swalHelper';

import styles from './Register.module.css';
import { submitUserApi } from '@/data/server_request/dashboard/users';

const Register = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

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
        setIsLoading(true);
        try {
          const result = await submitUserApi(values);
          if (result.status === 201) {
            showSwal(' با موفقیت انجام گردید.', '', 'success', 'تایید');
          }
        } catch (error) {
          showSwal('مجددا تلاش کنید', '', 'error', 'تلاش مجدد');
        } finally {
          setIsLoading(false);
        }
      }
    });

    try {
    } catch (error) {
      // console.log(error);
    }
  };
  const { values, handleChange, handleSubmit, errors, setFieldValue } =
    useCreateUserForm(submitHandler);

  return (
    <div className={styles.RegisterMain}>
      <div className={styles.nameSection}>
        <span>ایجاد کاربر جدید</span>
      </div>
      <form onSubmit={handleSubmit}>
        <div className={styles.form}>
          <div className={styles.input}>
            <BaseTextInput
              value={values.username}
              name="username"
              error={errors.username}
              label="نام کاربری *"
              rightSection={null}
              onChange={handleChange}
            />
          </div>
          <div className={styles.input}>
            <BaseTextInput
              value={values.mobile_phone}
              name="mobile_phone"
              error={errors.mobile_phone}
              label="شماره موبایل *"
              rightSection={null}
              onChange={handleChange}
            />
          </div>
          <div className={styles.input}>
            <BaseTextInput
              value={values.email || ''}
              name="email"
              error={errors.email}
              label="ایمیل"
              rightSection={null}
              onChange={handleChange}
            />
          </div>

          <PrimaryButton
            loading={isLoading}
            size="lg"
            type="submit"
            variant="primary"
          >
            افزودن کاربر جدید
          </PrimaryButton>
        </div>
      </form>
    </div>
  );
};

export default Register;
