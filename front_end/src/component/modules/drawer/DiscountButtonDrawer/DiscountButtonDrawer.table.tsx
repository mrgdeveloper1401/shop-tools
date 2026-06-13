import Swal from 'sweetalert2';

import TrashIcon from '../../icons/Trash.icon';

import { showSwal } from '@/utils/swalHelper';

import { convertToJalali } from '@/utils/dateConvertUtils';
import { deleteDiscountApi } from '@/data/server_request/dashboard/product';
import styles from './/DiscountButtonDrawer.module.css';

const deleteDiscountHandler = async (
  discountId: number,
  variantId: number,
  productId: number,
  categoryId: number,
  callGetDiscountsApi: VoidFunction,
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
        const res = await deleteDiscountApi(
          discountId,
          variantId,
          productId,
          categoryId,
        );
        if (res.status == 204) {
          showSwal('حذف با موفقیت انجام گردید.', '', 'success', 'تایید');
          callGetDiscountsApi();
        }
      } catch (error) {
        showSwal('خطا در حذف', '', 'error', 'تلاش مجدد');
      }
    }
  });
};

export const DiscountColumnsData = (
  variantId: number,
  productId: number,
  categoryId: number,
  callGetDiscountsApi: VoidFunction,
) => [
  {
    key: 'value',
    header: 'مقدار تخفیف',
    hasFilter: null,
    render: (props: any) => (
      <div className={styles.td}>
        <p>{props.amount}%</p>
      </div>
    ),
  },
  {
    key: 'start_date',
    header: 'شروع تخفیف',
    hasFilter: null,
    render: (props: any) => (
      <div className={styles.td}>{convertToJalali(props.start_date)}</div>
    ),
  },
  {
    key: 'end_date',
    header: 'پایان تخفیف',
    hasFilter: null,
    render: (props: any) => (
      <div className={styles.td}>{convertToJalali(props.end_date)}</div>
    ),
  },
  {
    key: 'created_at',
    header: 'ایجاد',
    hasFilter: null,
    render: (props: any) => (
      <div className={styles.td}>{convertToJalali(props.created_at)}</div>
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
          deleteDiscountHandler(
            props.id,
            variantId,
            productId,
            categoryId,
            callGetDiscountsApi,
          )
        }
      >
        <TrashIcon />
      </button>
    ),
  },
];
