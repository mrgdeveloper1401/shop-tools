import Swal from 'sweetalert2';

import CategoryEditButtonDrawer from '@/component/modules/drawer/Edits/CategoryEditButtonDrawer/CategoryEditButtonDrawer.drawer';
import TrashIcon from '../../../modules/icons/Trash.icon';

import { showSwal } from '@/utils/swalHelper';
import { deleteCategoryApi } from '@/data/server_request/dashboard/product';

import styles from './Category.module.css';
import Image from 'next/image';

const deleteCategoryHandler = async (
  termId: number,
  callGetCategoryApi: VoidFunction,
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
        const res = await deleteCategoryApi(termId);
        if (res.status == 204) {
          showSwal('حذف با موفقیت انجام گردید.', '', 'success', 'تایید');
          callGetCategoryApi();
        }
      } catch (error) {
        showSwal('خطا در حذف', '', 'error', 'تلاش مجدد');
      }
    }
  });
};

export const CategoryColumnsData = (callGetCategoryApi: VoidFunction) => [
  {
    key: 'id',
    header: 'شماره',
    hasFilter: null,
  },
  {
    key: 'category_name',
    header: 'عنوان دسته بندی',
    hasFilter: null,
    render: (props: any) => (
      <div className={styles.td}>
        <p>{props.category_name}</p>
      </div>
    ),
  },

  {
    key: 'category_image',
    header: 'عکس دسته بندی',
    hasFilter: null,
    render: (props: any) => (
      <div className={styles.td}>
        {props.category_image ? (
          <Image
            width={100}
            height={100}
            src={props.category_url}
            alt={props.category_name}
          />
        ) : (
          <span>عکسی وجود ندارد</span>
        )}
      </div>
    ),
  },

  {
    key: 'edit',
    header: 'ادیت',
    hasFilter: null,
    render: (props: any) => (
      <CategoryEditButtonDrawer
        CategoryId={props.id}
        callGetCategorysApi={callGetCategoryApi}
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
        onClick={() => deleteCategoryHandler(props.id, callGetCategoryApi)}
      >
        <TrashIcon />
      </button>
    ),
  },
];
