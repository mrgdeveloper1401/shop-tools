import Image from 'next/image';
import Swal from 'sweetalert2';

import TrashIcon from '@/component/modules/icons/Trash.icon';

import { showSwal } from '../../../../utils/swalHelper';
import { deleteBannerLandingApi } from '@/data/server_request/dashboard/banner';
import styles from './BannerLanding.module.css';

const deleteBannerLandingHandler = async (
  id: number,
  callGetBannerLandingApi: VoidFunction,
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
        const res = await deleteBannerLandingApi(id);
        if (res.status == 204) {
          showSwal('حذف با موفقیت انجام گردید.', '', 'success', 'تایید');
          callGetBannerLandingApi();
        }
      } catch (error) {
        showSwal('خطا در حذف', '', 'error', 'تلاش مجدد');
      }
    }
  });
};

export const BannerLandingColumnsData = (callGetBannerLandingApi: any) => [
  {
    key: 'name',
    header: 'عنوان',
    hasFilter: null,
    render: (props: any) => (
      <div className={styles.td}>
        <p>{props.name || 'نامشخص'}</p>
      </div>
    ),
  },
  {
    key: 'image',
    header: 'عکس',
    hasFilter: null,
    render: (props: any) => (
      <div className={styles.td}>
        <Image
          src={props.image_url}
          alt={props.name}
          width={250}
          height={250}
        />
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
          deleteBannerLandingHandler(props.id, callGetBannerLandingApi)
        }
      >
        <TrashIcon />
      </button>
    ),
  },
];
