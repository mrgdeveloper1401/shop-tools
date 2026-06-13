import Image from 'next/image';
import Swal from 'sweetalert2';

import TrashIcon from '../../icons/Trash.icon';

import { showSwal } from '@/utils/swalHelper';

import { deleteImageApi } from '@/data/server_request/dashboard/product';
import styles from './BaSalamAddButtonDrawer.module.css';

const deleteImageHandler = async (
  imageId: number,
  categoryId: number,
  productId: number,
  callGetImagesApi: VoidFunction,
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
        const res = await deleteImageApi(imageId, productId, categoryId);
        if (res.status == 204) {
          showSwal('حذف با موفقیت انجام گردید.', '', 'success', 'تایید');
          callGetImagesApi();
        }
      } catch (error) {
        showSwal('خطا در حذف', '', 'error', 'تلاش مجدد');
      }
    }
  });
};

export const BaSalamsColumnsData = (
  categoryId: number,
  productId: number,
  callGetImagesApi: VoidFunction,
) => [
  {
    key: 'order',
    header: 'ترتیب',
    hasFilter: null,
    render: (props: any) => (
      <div className={styles.td}>
        <p>{props.order}</p>
      </div>
    ),
  },
  {
    key: 'alt_text_image',
    header: 'عنوان عکس',
    hasFilter: null,
    render: (props: any) => (
      <div className={styles.td}>
        <p>{props.alt_text_image}</p>
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
          src={props?.image.get_image_url || ''}
          alt={props.alt_text_image || ''}
          width={1000}
          height={1000}
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
          deleteImageHandler(props.id, categoryId, productId, callGetImagesApi)
        }
      >
        <TrashIcon />
      </button>
    ),
  },
];
