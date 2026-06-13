'use client';
import { Suspense, useEffect, useState } from 'react';
import { useCreateTagsBlogForm } from '@/hooks/formik/admin-dashboard/useCreateTagsBlogFormik';
import Swal from 'sweetalert2';

import BaseTextInput from '@/component/modules/inputs/BaseTextInput/BaseText.input';
import PrimaryButton from '@/component/modules/PrimaryButton/Primary.button';
import BaseTable from '@/component/modules/tables/BaseTable/Base.table';
import TrashIcon from '@/component/modules/icons/Trash.icon';

import {
  deleteBlogTagApi,
  getBlogTagApi,
  IBlogTags,
  submitBlogTagApi,
} from '@/data/server_request/dashboard/blogs';
import { showSwal } from '@/utils/swalHelper';

import styles from './BlogTags.module.css';

const BlogTags = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [allBlogTagsData, setAllBlogTagsData] = useState<IBlogTags[]>();

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
          const result = await submitBlogTagApi(values);
          if (result.status === 201) {
            showSwal(' با موفقیت انجام گردید.', '', 'success', 'تایید');
            callGetBlogTagsApi();
          }
        } catch (error) {
          showSwal('مجددا تلاش کنید', '', 'error', 'تلاش مجدد');
        }
      }
    });
  };

  const { values, handleSubmit, errors, handleChange } =
    useCreateTagsBlogForm(submitHandler);

  const callGetBlogTagsApi = async () => {
    try {
      const result = await getBlogTagApi();
      setAllBlogTagsData(result);
    } catch (error) {
      // console.log(first)
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    callGetBlogTagsApi();
  }, []);

  const deleteTagHandler = async (
    tagId: number,
    callGetBlogTagsApi: VoidFunction,
  ) => {
    Swal.fire({
      title: 'آیا از حذف مطمئن هستید؟',
      icon: 'warning',
      confirmButtonText: 'تایید',
      cancelButtonText: 'لغو',
      showCancelButton: true,
      showCloseButton: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await deleteBlogTagApi(tagId);
          if (res.status == 204) {
            showSwal('حذف با موفقیت انجام گردید.', '', 'success', 'تایید');
            callGetBlogTagsApi();
          }
        } catch (error) {
          showSwal('خطا در حذف', '', 'error', 'تلاش مجدد');
        }
      }
    });
  };

  const BlogTagDataColumnsData = (callGetBlogTagsApi: VoidFunction) => [
    {
      key: 'id',
      header: 'شماره',
      hasFilter: null,
    },
    {
      key: 'tag_name',
      header: 'عنوان تگ',
      hasFilter: null,
      render: (props: any) => (
        <div className={styles.td}>
          <p>{props.tag_name}</p>
        </div>
      ),
    },

    {
      key: 'delete',
      header: 'حذف',
      hasFilter: null,
      render: (props: any) => (
        <button
          className={styles.deleteBtn}
          onClick={() => deleteTagHandler(props.id, callGetBlogTagsApi)}
        >
          <TrashIcon />
        </button>
      ),
    },
  ];

  return (
    <div className={styles.RegisterMain}>
      <div className={styles.nameSection}>
        <span>ایجاد تگ</span>
      </div>
      <form onSubmit={handleSubmit}>
        <div className={styles.form}>
          <div className={styles.input}>
            <BaseTextInput
              name="tag_name"
              value={values.tag_name}
              error={errors.tag_name}
              label="عنوان تگ"
              leftSection={null}
              rightSection={null}
              onChange={handleChange}
            />
          </div>

          <PrimaryButton size="md" type="submit" variant="primary">
            افزودن تگ جدید
          </PrimaryButton>
        </div>
      </form>

      <Suspense>
        <BaseTable
          loadingCount={5}
          isLoading={isLoading}
          columns={BlogTagDataColumnsData(callGetBlogTagsApi)}
          data={allBlogTagsData as any}
        />
      </Suspense>
    </div>
  );
};

export default BlogTags;
