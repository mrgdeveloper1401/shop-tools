import Swal from 'sweetalert2';

import TrashIcon from '../../../modules/icons/Trash.icon';

import { showSwal } from '@/utils/swalHelper';
import { deleteAttributeKeyApi } from '@/data/server_request/dashboard/product';

import styles from './AttributeKey.module.css';

const deleteAttributeKeyHandler = async (
  id: number,
  callGetAttributeKeyApi: VoidFunction,
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
        const res = await deleteAttributeKeyApi(id);
        if (res.status == 204) {
          showSwal('حذف با موفقیت انجام گردید.', '', 'success', 'تایید');
          callGetAttributeKeyApi();
        }
      } catch (error) {
        showSwal('خطا در حذف', '', 'error', 'تلاش مجدد');
      }
    }
  });
};

export const AttributeKeyColumnsData = (
  callGetAttributeKeyApi: VoidFunction,
) => [
  {
    key: 'id',
    header: 'شماره',
    hasFilter: null,
  },
  {
    key: 'AttributeKey_name',
    header: 'دسته بندی',
    hasFilter: null,
    render: (props: any) => (
      <div className={styles.td}>
        <p>{props.attribute_name}</p>
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
          deleteAttributeKeyHandler(props.id, callGetAttributeKeyApi)
        }
      >
        <TrashIcon />
      </button>
    ),
  },
];
