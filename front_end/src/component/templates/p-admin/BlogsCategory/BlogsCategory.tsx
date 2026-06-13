'use client';
import { Suspense, useEffect, useState } from 'react';
import { useCreateCategoryBlogForm } from '@/hooks/formik/admin-dashboard/useCreateCateoryBlogFormik';

import Swal from 'sweetalert2';

import BaseTextArea from '@/component/modules/inputs/BaseTextArea/BaseTextArea';
import BaseTable from '../../../modules/tables/BaseTable/Base.table';
import BaseTextInput from '../../../modules/inputs/BaseTextInput/BaseText.input';
import PrimaryButton from '../../../modules/PrimaryButton/Primary.button';

import {
  getBlogCategoryAdminApi,
  IBlogCategory,
  submitBlogCategoryApi,
} from '@/data/server_request/dashboard/blogs';
import { showSwal } from '@/utils/swalHelper';
import { BlogCategoryColumnsData } from './BlogsCategory.table';

import styles from './BlogsCategory.module.css';

const BlogCategory = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [allBlogCategoryData, setAllBlogCategoryData] =
    useState<IBlogCategory[]>();

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
        try {
          const result = await submitBlogCategoryApi(values);
          if (result.status === 201) {
            showSwal(' با موفقیت انجام گردید.', '', 'success', 'تایید');
            callGetBlogCategoryApi();
          }
        } catch (error) {
          showSwal('مجددا تلاش کنید', '', 'error', 'تلاش مجدد');
        }
      }
    });
  };

  const { values, handleSubmit, errors, handleChange } =
    useCreateCategoryBlogForm(submitHandler);

  const callGetBlogCategoryApi = async () => {
    try {
      const result = await getBlogCategoryAdminApi();
      setAllBlogCategoryData(result);
    } catch (error) {
      // console.log(first)
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    callGetBlogCategoryApi();
  }, []);

  return (
    <div className={styles.RegisterMain}>
      <div className={styles.nameSection}>
        <span>ایجاد دسته بندی بلاگ</span>
      </div>
      <form onSubmit={handleSubmit}>
        <div className={styles.form}>
          <div className={styles.input}>
            <BaseTextInput
              name="category_name"
              value={values.category_name}
              error={errors.category_name}
              label=" نام دسته بندی "
              leftSection={null}
              rightSection={null}
              onChange={handleChange}
            />
          </div>

          <div className={styles.input}>
            <BaseTextArea
              label="slug"
              name="category_slug"
              value={values.category_slug}
              error={errors.category_slug}
              rightSection={null}
              onChange={handleChange}
            />
          </div>

          <PrimaryButton size="md" type="submit" variant="primary">
            افزودن دسته بندی جدید
          </PrimaryButton>
        </div>
      </form>

      <Suspense>
        <BaseTable
          loadingCount={5}
          isLoading={isLoading}
          columns={BlogCategoryColumnsData(callGetBlogCategoryApi)}
          data={allBlogCategoryData as any}
        />
      </Suspense>
    </div>
  );
};

export default BlogCategory;
