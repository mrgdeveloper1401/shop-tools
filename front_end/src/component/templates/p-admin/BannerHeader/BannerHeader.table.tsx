import Link from 'next/link';
import Swal from 'sweetalert2';

import PrimaryButton from '@/component/modules/PrimaryButton/Primary.button';
import TrashIcon from '@/component/modules/icons/Trash.icon';

import { showSwal } from '../../../../utils/swalHelper';
import { deleteBannerHeaderApi } from '@/data/server_request/dashboard/banner';
import styles from './BannerHeader.module.css';
import BaseTextArea from '@/component/modules/inputs/BaseTextArea/BaseTextArea';

const deleteBannerHeaderHandler = async (
  id: number,
  callGetBannerHeaderApi: VoidFunction,
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
        const res = await deleteBannerHeaderApi(id);
        if (res.status == 204) {
          showSwal('حذف با موفقیت انجام گردید.', '', 'success', 'تایید');
          callGetBannerHeaderApi();
        }
      } catch (error) {
        showSwal('خطا در حذف', '', 'error', 'تلاش مجدد');
      }
    }
  });
};

export const BannerHeaderColumnsData = (
  callGetBannerHeaderApi: VoidFunction,
) => [
  {
    key: 'id',
    header: 'شماره',
    hasFilter: null,
    render: (props: any) => <div>{props.id}</div>,
  },
  {
    key: 'header_title',
    header: 'متن بنر',
    hasFilter: null,
    render: (props: any) => (
      <div className={styles.td}>
        <BaseTextArea value={props.header_title || ''} />
      </div>
    ),
  },
  {
    key: 'images',
    header: 'عکس بنر',
    hasFilter: null,
    render: (props: any) => (
      <div className={styles.td}>
        {props.images.map((item: any, index: number) => (
          <Link href={item.get_image_url}>لینک {index + 1}</Link>
        ))}
      </div>
    ),
  },

  {
    key: 'background_color',
    header: 'رنگ ها',
    hasFilter: null,
    render: (props: any) => (
      <div className={styles.td}>
        <p
          style={{
            backgroundColor: props.background_color,
            color: props.text_color,
          }}
        >
          bg-color: {props.background_color || 'نامشخص'}
          {'   '}
          color: {props.text_color || 'نامشخص'}
        </p>
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
          deleteBannerHeaderHandler(props.id, callGetBannerHeaderApi)
        }
      >
        <TrashIcon />
      </button>
    ),
  },
];