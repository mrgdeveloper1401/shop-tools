import Swal from 'sweetalert2';

import TrashIcon from '../../../modules/icons/Trash.icon';

import { showSwal } from '@/utils/swalHelper';
import { deleteShippingDetailApi } from '@/data/server_request/dashboard/shipping';
import { priceFormat } from '@/utils/price-format';

import styles from './Shipping.module.css';

const deleteShippingDetailHandler = async (
  id: number,
  callGetShippingApi: VoidFunction,
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
        const res = await deleteShippingDetailApi(id);
        if (res.status == 204) {
          showSwal('حذف با موفقیت انجام گردید.', '', 'success', 'تایید');
          callGetShippingApi();
        }
      } catch (error) {
        showSwal('خطا در حذف', '', 'error', 'تلاش مجدد');
      }
    }
  });
};

export const ShippingDetailColumnsData = (callGetShippingApi: VoidFunction) => [
  {
    key: 'company',
    header: 'عنوان پست',
    hasFilter: null,
    render: (props: any) => (
      <div className={styles.td}>
        <p>{props.company.name}</p>
      </div>
    ),
  },
  {
    key: 'shipping_type',
    header: 'نوع ارسال',
    hasFilter: null,
    render: (props: any) => (
      <div className={styles.td}>
        <p>{props.shipping_type}</p>
      </div>
    ),
  },
  {
    key: 'estimated_days',
    header: 'مدت زمان ارسال',
    hasFilter: null,
    render: (props: any) => (
      <div className={styles.td}>
        <p>{props.estimated_days}روز</p>
      </div>
    ),
  },
  {
    key: 'price',
    header: 'هزینه ارسال',
    hasFilter: null,
    render: (props: any) => (
      <div className={styles.td}>
        {Number(props.price.split('.')[0]) === 0 ? (
          <p>رایگان</p>
        ) : (
          <p>{priceFormat(props.price)}تومان</p>
        )}
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
          deleteShippingDetailHandler(props.id, callGetShippingApi)
        }
      >
        <TrashIcon />
      </button>
    ),
  },
];
