import Link from 'next/link';
import Swal from 'sweetalert2';

import { showSwal } from '@/utils/swalHelper';

import styles from './BlogsCategory.module.css';
import { deleteBlogCategoryApi } from '@/data/server_request/dashboard/blogs';
import BaseTextArea from '@/component/modules/inputs/BaseTextArea/BaseTextArea';
import PrimaryButton from '@/component/modules/PrimaryButton/Primary.button';
import BlogCategoryEditButtonDrawer from '@/component/modules/drawer/BlogCategoryEditButtonDrawer/BlogCategoryEditButtonDrawer.drawer';
import TrashIcon from '@/component/modules/icons/Trash.icon';

const deleteTermHandler = async (
  termId: number,
  callGetBlogCategoryApi: VoidFunction,
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
        const res = await deleteBlogCategoryApi(termId);
        if (res.status == 204) {
          showSwal('حذف با موفقیت انجام گردید.', '', 'success', 'تایید');
          callGetBlogCategoryApi();
        }
      } catch (error) {
        showSwal('خطا در حذف', '', 'error', 'تلاش مجدد');
      }
    }
  });
};

export const BlogCategoryColumnsData = (
  callGetBlogCategoryApi: VoidFunction,
) => [
  {
    key: 'id',
    header: 'شماره',
    hasFilter: null,
  },
  {
    key: 'category_name',
    header: 'دسته بندی',
    hasFilter: null,
    render: (props: any) => (
      <div className={styles.td}>
        <p>{props.category_name || ''}</p>
      </div>
    ),
  },

  {
    key: 'category_slug',
    header: 'category_slug',
    hasFilter: null,
    render: (props: any) => (
      <div className={styles.textArea}>
        <BaseTextArea readOnly value={props.category_slug || ''} />
      </div>
    ),
  },
  {
    key: 'no0',
    header: 'ایجاد مقاله',
    hasFilter: null,
    render: (props: any) => (
      <Link href={`blogs/create-post/${props.id}`}>
        <PrimaryButton>ایجاد مقاله</PrimaryButton>
      </Link>
    ),
  },

  {
    key: 'edit',
    header: 'ادیت',
    hasFilter: null,
    render: (props: any) => (
      <BlogCategoryEditButtonDrawer
        categoryId={props.id}
        callGetBlogCategoryApi={callGetBlogCategoryApi}
      />
    ),
  },
  {
    key: 'delete',
    header: 'حذف',
    hasFilter: null,
    render: (props: any) => (
      <button
        className={styles.deleteBtn}
        onClick={() => deleteTermHandler(props.id, callGetBlogCategoryApi)}
      >
        <TrashIcon />
      </button>
    ),
  },
];
