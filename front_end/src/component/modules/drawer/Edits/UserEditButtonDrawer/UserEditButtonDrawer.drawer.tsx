'use client';
import { FC } from 'react';
import { useEditUserForm } from '@/hooks/formik/admin-dashboard/useEditUserFormik';
import { useDisclosure } from '@mantine/hooks';

import { Switch } from '@mantine/core';
import Swal from 'sweetalert2';

import BaseTextInput from '../../../inputs/BaseTextInput/BaseText.input';
import BaseDrawer from '../../BaseDrawer/BaseDrawer';
import PrimaryButton from '../../../PrimaryButton/Primary.button';

import EditIcon from '@/component/modules/icons/Edit.icon';

import { submitEditUserApi } from '@/data/server_request/dashboard/users';
import { showSwal } from '@/utils/swalHelper';
import styles from './UserEditButtonDrawer.module.css';

interface IUserEditButtonDrawerProps {
  userId: number;
  callGetAllUsers: VoidFunction;
}
const UserEditButtonDrawer: FC<IUserEditButtonDrawerProps> = ({
  userId,
  callGetAllUsers,
}) => {
  const [opened, { open, close }] = useDisclosure(false);

  const submitHandler = async (values: any) => {
    Swal.fire({
      title: 'آیا از ادیت خود اطمینان دارید؟',
      icon: 'warning',
      iconHtml: '!',
      confirmButtonText: 'تایید',
      cancelButtonText: 'لغو',
      showCancelButton: true,
      showCloseButton: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await submitEditUserApi(userId, values);
          if (res.status === 200) {
            Swal.fire({
              title: 'دسته بندی با موفقیت ادیت گردید.',
              text: '',
              icon: 'success',
              confirmButtonText: 'تایید',
            }).then(() => {
              close();
              callGetAllUsers();
            });
          } else {
            showSwal('دوباره تلاش کنید !', '', 'warning', 'سعی مجدد');
          }
        } catch (error) {
          // console.log(error);
        }
      }
    });
  };

  const { values, handleSubmit, errors, handleChange } =
    useEditUserForm(submitHandler);

  return (
    <>
      <BaseDrawer
        lockScroll={true}
        size="xl"
        title="ادیت کاربر"
        opened={opened}
        onClose={close}
        position="right"
      >
        <form className={styles.form_container} onSubmit={handleSubmit}>
          <div className={styles.form}>
            <div className={styles.input}>
              <Switch
                name="is_active"
                checked={values.is_active}
                error={errors.is_active}
                onChange={handleChange}
                label="فعال"
                size="md"
                labelPosition="left"
              />
            </div>
            <div className={styles.input}>
              <BaseTextInput
                name="username"
                value={values.username || ''}
                error={errors.username}
                label="نام کاربری"
                leftSection={null}
                rightSection={null}
                onChange={handleChange}
              />
            </div>
            <div className={styles.input}>
              <BaseTextInput
                name="email"
                value={values.mobile_phone || ''}
                error={errors.mobile_phone}
                label="شماره موبایل"
                leftSection={null}
                rightSection={null}
                onChange={handleChange}
              />
            </div>
            <div className={styles.input}>
              <BaseTextInput
                name="email"
                value={values.email || ''}
                error={errors.email}
                label="ایمیل"
                leftSection={null}
                rightSection={null}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className={styles.buttonContainer}>
            <PrimaryButton
              size="lg"
              variant="outline"
              type="button"
              onClick={close}
            >
              لغو
            </PrimaryButton>
            <PrimaryButton size="lg" variant="primary" type="submit">
              تایید
            </PrimaryButton>
          </div>
        </form>
      </BaseDrawer>
      <button onClick={open}>
        <EditIcon />
      </button>
    </>
  );
};
export default UserEditButtonDrawer;
