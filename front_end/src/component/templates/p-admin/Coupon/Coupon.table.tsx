import Swal from 'sweetalert2';

import { showSwal } from '../../../../utils/swalHelper';
import { convertToJalali } from '../../../../utils/dateConvertUtils';
import { deleteCouponApi } from '@/data/server_request/dashboard/coupon';

import styles from './Coupon.module.css';
import TrashIcon from '@/component/modules/icons/Trash.icon';

const deleteCouponHandler = async (
  id: number,
  callGetCouponApi: VoidFunction,
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
        const res = await deleteCouponApi(id);
        if (res.status == 204) {
          showSwal('حذف با موفقیت انجام گردید.', '', 'success', 'تایید');
          callGetCouponApi();
        }
      } catch (error) {
        showSwal('خطا در حذف', '', 'error', 'تلاش مجدد');
      }
    }
  });
};

export const CouponColumnsData = (callGetCouponApi: VoidFunction) => [
  {
    key: 'id',
    header: 'شماره',
    hasFilter: null,
    render: (props: any) => (
      <div>
        <p>{props.id}</p>
      </div>
    ),
  },
  {
    key: 'code',
    header: 'کد تخفیف',
    hasFilter: null,
    render: (props: any) => (
      <div className={styles.td}>
        <p>{props.code}</p>
      </div>
    ),
  },
  {
    key: 'amount',
    header: 'درصد کد تخفیف',
    hasFilter: null,
    render: (props: any) => (
      <div className={styles.td}>
        <p>{props.amount}%</p>
      </div>
    ),
  },
  {
    key: 'maximum_use',
    header: 'تعداد استفاده شده',
    hasFilter: null,
    render: (props: any) => (
      <div className={styles.td}>
        <p>{props.maximum_use}</p>
      </div>
    ),
  },
  {
    key: 'is_active',
    header: 'وضعیت',
    hasFilter: null,
    render: (props: any) => (
      <div className={styles.td}>
        <p>{props.is_active ? 'فعال' : 'غیرفعال'}</p>
      </div>
    ),
  },
  {
    key: 'valid_from',
    header: 'تاریخ فعال',
    render: (props: any) => (
      <div className={styles.d}>
        {props.valid_to && props.valid_from
          ? ` ${convertToJalali(props.valid_to)} تا ${convertToJalali(
              props.valid_to,
            )}`
          : 'نامشخص'}
      </div>
    ),
  },

  {
    key: 'created_at',
    header: 'تاریخ ایجاد',
    render: (props: any) => (
      <div className={styles.d}>
        {convertToJalali(props.created_at)
          ? convertToJalali(props.created_at)
          : 'نامشخص'}
      </div>
    ),
  },
  {
    key: 'delete',
    header: 'حذف',
    hasFilter: null,
    render: (props: any) => (
      <div className={styles.td}>
        <button
          className={styles.deleteBtn}
          onClick={() => deleteCouponHandler(props.id, callGetCouponApi)}
        >
          <TrashIcon />
        </button>
      </div>
    ),
  },
];
