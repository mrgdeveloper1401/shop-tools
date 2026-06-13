import Image from 'next/image';
import Swal from 'sweetalert2';

import TrashIcon from '@/component/modules/icons/Trash.icon';
import { showSwal } from '../../../../utils/swalHelper';
import { deleteImageCatalogApi } from '@/data/server_request/dashboard/blogs';

import styles from './ImageCatalog.module.css';

const deleteImageCatalogHandler = async (
  id: number,
  callGetImageCatalogApi: VoidFunction,
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
        const res = await deleteImageCatalogApi(id);
        if (res.status == 204) {
          showSwal('حذف با موفقیت انجام گردید.', '', 'success', 'تایید');
          callGetImageCatalogApi();
        }
      } catch (error) {
        showSwal('خطا در حذف', '', 'error', 'تلاش مجدد');
      }
    }
  });
};

export const ImageCatalogColumnsData = (
  callGetImageCatalogApi: VoidFunction,
) => [
  {
    key: 'id',
    header: 'شماره',
    hasFilter: null,
    render: (props: any) => <div>{props.id}</div>,
  },
  {
    key: 'image',
    header: 'Url',
    render: (props: any) => (
      <div className={styles.td}>
        <p>{props.image || 'نامشخص'}</p>
      </div>
    ),
  },
  {
    key: 'image0',
    header: 'عکس',
    render: (props: any) => (
      <div className={styles.image}>
        {props.image ? (
          <Image
            width={100}
            height={100}
            src={props.image}
            priority
            alt="عکس"
          />
        ) : (
          <p>تعیین نشده</p>
        )}
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
          onClick={() =>
            deleteImageCatalogHandler(props.id, callGetImageCatalogApi)
          }
        >
          <TrashIcon />
        </button>
      </div>
    ),
  },
];
