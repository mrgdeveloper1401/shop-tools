import Swal from 'sweetalert2';

import { showSwal } from '../../../../utils/swalHelper';
import { deleteSiteMapApi } from '@/data/server_request/sitemap';
import TrashIcon from '@/component/modules/icons/Trash.icon';

import styles from './SiteMap.module.css';

const deleteSiteMapHandler = async (
  id: number,
  callGetSiteMapApi: VoidFunction,
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
        const res = await deleteSiteMapApi(id);
        if (res.status == 204) {
          showSwal('حذف با موفقیت انجام گردید.', '', 'success', 'تایید');
          callGetSiteMapApi();
        }
      } catch (error) {
        showSwal('خطا در حذف', '', 'error', 'تلاش مجدد');
      }
    }
  });
};

export const SiteMapColumnsData = (callGetSiteMapApi: VoidFunction) => [
  {
    key: 'id',
    header: 'شماره',
    hasFilter: null,
    render: (props: any) => (
      <div>
        <p>{props.id}</p>
      </div>
    ),
  },
  {
    key: 'slug_text',
    header: 'loc',
    hasFilter: null,
    render: (props: any) => (
      <div className={styles.td}>
        <p>{props.slug_text}</p>
      </div>
    ),
  },
  {
    key: 'last_modified',
    header: 'lastmod',
    hasFilter: null,
    render: (props: any) => (
      <div className={styles.td}>
        <p>{props.last_modified}</p>
      </div>
    ),
  },
  {
    key: 'priority',
    header: 'priority',
    hasFilter: null,
    render: (props: any) => (
      <div className={styles.td}>
        <p>{props.priority}</p>
      </div>
    ),
  },
  {
    key: 'changefreq',
    header: 'changefreq',
    hasFilter: null,
    render: (props: any) => (
      <div className={styles.td}>
        <p>{props.changefreq}</p>
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
          onClick={() => deleteSiteMapHandler(props.id, callGetSiteMapApi)}
        >
          <TrashIcon />
        </button>
      </div>
    ),
  },
];
