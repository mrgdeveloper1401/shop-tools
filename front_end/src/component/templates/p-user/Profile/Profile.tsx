'use client';
import { useEffect, useState } from 'react';
import {
  getProfileApi,
  submitEditProfileApi,
} from '@/data/server_request/dashboard/profile';

import s from './Profile.module.css';
import BaseTextInput from '@/component/modules/inputs/BaseTextInput/BaseText.input';
import Swal from 'sweetalert2';
import { showSwal } from '@/utils/swalHelper';
import { useEditProfileForm } from '@/hooks/formik/admin-dashboard/useEditProfileFormik';
import PrimaryButton from '@/component/modules/PrimaryButton/Primary.button';

const Profile = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState<number | null>(null);

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
          const result = await submitEditProfileApi(Number(userId), values);
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
    useEditProfileForm(submitHandler);

  const callGetAllProfile = async () => {
    try {
      setIsLoading(true);
      const result = await getProfileApi();
      setFieldValue('first_name', result[0].first_name);
      setFieldValue('last_name', result[0].last_name);
      setUserId(result[0].id);
    } catch (error) {
      // console.error('Error fetching users:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    callGetAllProfile();
  }, []);
  return (
    <div className={s.main}>
      <div className={s.container_Profile}>
        <div className={s.header}>
          <h1>اطلاعات حساب</h1>
        </div>

        <form onSubmit={handleSubmit} className={s.box}>
          <div>
            <BaseTextInput
              label="نام"
              labelProps={{
                'data-floating': true,
              }}
              name="first_name"
              value={values.first_name}
              error={errors.first_name}
              onChange={handleChange}
            />
            <BaseTextInput
              label="نام خانوادگی"
              labelProps={{
                'data-floating': true,
              }}
              name="last_name"
              value={values.last_name}
              error={errors.last_name}
              onChange={handleChange}
            />
          </div>

          <PrimaryButton mt="md" w="159px" type="submit" size="lg">
            ذخیره
          </PrimaryButton>
        </form>
      </div>
    </div>
  );
};
export default Profile;
