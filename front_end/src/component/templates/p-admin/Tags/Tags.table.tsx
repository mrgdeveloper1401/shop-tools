import Swal from 'sweetalert2';

import TrashIcon from '../../../modules/icons/Trash.icon';

import { showSwal } from '@/utils/swalHelper';

import styles from './Tags.module.css';
import { deleteTagApi } from '@/data/server_request/dashboard/product';
import TagEditButtonDrawer from '@/component/modules/drawer/Edits/TagEditButtonDrawer/TagEditButtonDrawer.drawer';

const deleteTagHandler = async (
  termId: number,
  callGetTagApi: VoidFunction,
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
        const res = await deleteTagApi(termId);
        if (res.status == 204) {
          showSwal('حذف با موفقیت انجام گردید.', '', 'success', 'تایید');
          callGetTagApi();
        }
      } catch (error) {
        showSwal('خطا در حذف', '', 'error', 'تلاش مجدد');
      }
    }
  });
};

export const TagsColumnsData = (callGetTagApi: VoidFunction) => [
  {
    key: 'id',
    header: 'شماره',
    hasFilter: null,
  },
  {
    key: 'tag_name',
    header: 'عنوان تگ',
    hasFilter: null,
    render: (props: any) => (
      <div className={styles.td}>
        <p>{props.tag_name}</p>
      </div>
    ),
  },
  {
    key: 'edit',
    header: 'ادیت',
    hasFilter: null,
    render: (props: any) => (
      <TagEditButtonDrawer TagId={props.id} callGetTagsApi={callGetTagApi} />
    ),
  },
  {
    key: 'delete',
    header: 'حذف',
    hasFilter: null,
    render: (props: any) => (
      <button
        className={styles.deleteBtn}
        onClick={() => deleteTagHandler(props.id, callGetTagApi)}
      >
        <TrashIcon />
      </button>
    ),
  },
];
