import Swal from 'sweetalert2';

import BrandEditButtonDrawer from '@/component/modules/drawer/Edits/BrandEditButtonDrawer/BrandEditButtonDrawer.drawer';
import TrashIcon from '../../../modules/icons/Trash.icon';

import { showSwal } from '@/utils/swalHelper';

import styles from './Shipping.module.css';
import { deleteShippingApi } from '@/data/server_request/dashboard/shipping';

const deleteShippingHandler = async (
  brandId: number,
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
        const res = await deleteShippingApi(brandId);
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

export const ShippingColumnsData = (callGetShippingApi: VoidFunction) => [
  {
    key: 'id',
    header: 'شماره',
    hasFilter: null,
  },
  {
    key: 'name',
    header: 'عنوان ',
    hasFilter: null,
    render: (props: any) => (
      <div className={styles.td}>
        <p>{props.name}</p>
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
        onClick={() => deleteShippingHandler(props.id, callGetShippingApi)}
      >
        <TrashIcon />
      </button>
    ),
  },
];
