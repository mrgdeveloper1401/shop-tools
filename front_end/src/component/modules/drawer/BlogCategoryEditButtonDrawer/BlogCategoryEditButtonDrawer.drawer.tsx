'use client';
import { FC } from 'react';
import { useDisclosure } from '@mantine/hooks';
import { useEditCategoryBlogForm } from '@/hooks/formik/admin-dashboard/useEditCateoryBlogFormik';

import Swal from 'sweetalert2';

import { showSwal } from '@/utils/swalHelper';

import styles from './BlogCategoryEditButtonDrawer.module.css';
import { submitEditBlogCategoryApi } from '@/data/server_request/dashboard/blogs';
import BaseDrawer from '../BaseDrawer/BaseDrawer';
import BaseTextInput from '../../inputs/BaseTextInput/BaseText.input';
import BaseTextArea from '../../inputs/BaseTextArea/BaseTextArea';
import PrimaryButton from '../../PrimaryButton/Primary.button';
import EditIcon from '../../icons/Edit.icon';

interface IBlogCategoryEditButtonDrawerProps {
  categoryId: number;
  callGetBlogCategoryApi: VoidFunction;
}

const BlogCategoryEditButtonDrawer: FC<IBlogCategoryEditButtonDrawerProps> = ({
  categoryId,
  callGetBlogCategoryApi,
}) => {
  const [opened, { open, close }] = useDisclosure(false);

  const submitHandler = async (values: any) => {
    const filteredData = Object.fromEntries(
      Object.entries(values).filter(([key, value]) => value !== ''),
    );
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
          const res = await submitEditBlogCategoryApi(categoryId, filteredData);
          if (res.status === 200) {
            Swal.fire({
              title: '  با موفقیت ادیت گردید.',
              text: '',
              icon: 'success',
              confirmButtonText: 'تایید',
            }).then(() => {
              close();
              callGetBlogCategoryApi();
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

  const { values, errors, handleSubmit, handleChange } =
    useEditCategoryBlogForm(submitHandler);

  return (
    <>
      <BaseDrawer
        lockScroll={true}
        size="md"
        title="ادیت دسته بندی"
        opened={opened}
        onClose={close}
        position="right"
      >
        <form className={styles.formContainer} onSubmit={handleSubmit}>
          <div className={styles.form}>
            <div className={styles.input}>
              <BaseTextInput
                name="category_name"
                value={values.category_name || ''}
                error={errors.category_name}
                label=" نام دسته بندی "
                leftSection={null}
                rightSection={null}
                onChange={handleChange}
              />
            </div>
            <div className={styles.input}>
              <BaseTextArea
                value={values.category_slug || ''}
                label="category_slug"
                name="category_slug"
                rightSection={null}
                error={errors.category_slug}
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
export default BlogCategoryEditButtonDrawer;
