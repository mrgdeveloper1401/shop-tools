import Swal from 'sweetalert2';

import TrashIcon from '../../icons/Trash.icon';

import { showSwal } from '@/utils/swalHelper';
import { deleteSpecificationApi } from '@/data/server_request/dashboard/product';
import styles from './SpecificationButtonDrawer.module.css';

const deleteSpecificationHandler = async (
  specificationId: number,
  productId: number,
  categoryId: number,
  callGetSpecificationsApi: VoidFunction,
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
        const res = await deleteSpecificationApi(
          specificationId,
          productId,
          categoryId,
        );
        if (res.status == 204) {
          showSwal('حذف با موفقیت انجام گردید.', '', 'success', 'تایید');
          callGetSpecificationsApi();
        }
      } catch (error) {
        showSwal('خطا در حذف', '', 'error', 'تلاش مجدد');
      }
    }
  });
};

export const SpecificationColumnsData = (
  productId: number,
  categoryId: number,
  callGetSpecificationsApi: VoidFunction,
) => [
  {
    key: 'key',
    header: 'ویژگی',
    hasFilter: null,
    render: (props: any) => (
      <div className={styles.td}>
        <p>{props?.attribute.attribute_name}</p>
      </div>
    ),
  },
  {
    key: 'value',
    header: 'توضیح ویژگی',
    hasFilter: null,
    render: (props: any) => (
      <div className={styles.td}>
        <p>{props.value}</p>
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
        onClick={() =>
          deleteSpecificationHandler(
            props.id,
            productId,
            categoryId,
            callGetSpecificationsApi,
          )
        }
      >
        <TrashIcon />
      </button>
    ),
  },
];
