import Swal from 'sweetalert2';

import UserEditButtonDrawer from '@/component/modules/drawer/Edits/UserEditButtonDrawer/UserEditButtonDrawer.drawer';
import TrashIcon from '@/component/modules/icons/Trash.icon';

import { convertToJalali } from '../../../../utils/dateConvertUtils';
import { showSwal } from '@/utils/swalHelper';
import { deleteUserApi } from '@/data/server_request/dashboard/users';

import styles from './Users.module.css';

const deleteUserHandler = async (id: number, callGetAllUsers: VoidFunction) => {
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
        const res = await deleteUserApi(id);
        if (res.status === 204) {
          showSwal('حذف با موفقیت انجام گردید.', '', 'success', 'تایید');
          callGetAllUsers();
        } else {
          showSwal('خطا در حذف', '', 'error', 'تلاش مجدد');
        }
      } catch (error) {
        showSwal('خطا در حذف', '', 'error', 'تلاش مجدد');
      }
    }
  });
};
export const UserColumnsData = (callGetAllUsers: VoidFunction) => [
  {
    key: 'id',
    header: 'شناسه',
    hasFilter: null,
    render: (props: any) => (
      <div>
        <p>{props.id}</p>
      </div>
    ),
  },

  {
    key: 'username',
    header: 'نام کاربر',
    hasFilter: null,
    render: (props: any) => (
      <div className={styles.td}>
        <p>{props.username || '-'}</p>
      </div>
    ),
  },
  {
    key: 'mobile_phone',
    header: 'شماره تماس',
    hasFilter: null,
    render: (props: any) => (
      <div className={styles.td}>
        {props.mobile_phone ? props.mobile_phone : '----'}
      </div>
    ),
  },
  {
    key: 'is_staff',
    header: 'وضعیت دسترسی',
    hasFilter: null,
    render: (props: any) => (
      <div className={styles.td}>
        <p>{props.is_staff ? 'ادمین' : 'عادی'}</p>
      </div>
    ),
  },

  {
    key: 'email',
    header: 'ایمیل',
    hasFilter: null,
    render: (props: any) => <div>{props.email ? props.email : '----'}</div>,
  },

  {
    key: 'created_at',
    header: 'تاریخ عضویت',
    hasFilter: null,
    render: (props: any) => (
      <div className={styles.td}>
        {props.created_at ? convertToJalali(props.created_at) : 'نامشخص'}
      </div>
    ),
  },

  {
    key: 'no1',
    header: 'ادیت',
    hasFilter: null,
    render: (props: any) => (
      <UserEditButtonDrawer
        userId={props.id}
        callGetAllUsers={callGetAllUsers}
      />
    ),
  },
  {
    key: 'no2',
    header: 'حذف',
    hasFilter: null,
    render: (props: any) => {
      return (
        <button
          className={styles.deleteBtn}
          onClick={() => {
            deleteUserHandler(props.id, callGetAllUsers);
          }}
        >
          <TrashIcon />
        </button>
      );
    },
  },
];
