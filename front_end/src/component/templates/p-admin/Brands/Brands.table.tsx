import Swal from 'sweetalert2';

import BrandEditButtonDrawer from '@/component/modules/drawer/Edits/BrandEditButtonDrawer/BrandEditButtonDrawer.drawer';
import TrashIcon from '../../../modules/icons/Trash.icon';

import { showSwal } from '@/utils/swalHelper';
import { deleteBrandsApi } from '@/data/server_request/dashboard/product';

import styles from './Brands.module.css';

const deleteBrandsHandler = async (
  brandId: number,
  callGetBrandsApi: VoidFunction,
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
        const res = await deleteBrandsApi(brandId);
        if (res.status == 204) {
          showSwal('حذف با موفقیت انجام گردید.', '', 'success', 'تایید');
          callGetBrandsApi();
        }
      } catch (error) {
        showSwal('خطا در حذف', '', 'error', 'تلاش مجدد');
      }
    }
  });
};

export const BrandsColumnsData = (callGetBrandsApi: VoidFunction) => [
  {
    key: 'id',
    header: 'شماره',
    hasFilter: null,
  },
  {
    key: 'brand_name',
    header: 'عنوان برند',
    hasFilter: null,
    render: (props: any) => (
      <div className={styles.td}>
        <p>{props.brand_name}</p>
      </div>
    ),
  },
  {
    key: 'edit',
    header: 'ادیت',
    hasFilter: null,
    render: (props: any) => (
      <BrandEditButtonDrawer
        callGetBrandsApi={callGetBrandsApi}
        BrandId={props.id}
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
        onClick={() => deleteBrandsHandler(props.id, callGetBrandsApi)}
      >
        <TrashIcon />
      </button>
    ),
  },
];
