import Image from 'next/image';
import Swal from 'sweetalert2';

import BlogArticleEditButtonDrawer from '@/component/modules/drawer/BlogArticleEditButtonDrawer/BlogArticleEditButtonDrawer.drawer';
import BaseTextArea from '@/component/modules/inputs/BaseTextArea/BaseTextArea';
import BaseSelectInput from '@/component/modules/inputs/BaseSelectInput/BaseSelect.input';
import ChevronDownIcon from '@/component/modules/icons/ChevronDown.icon';
import TrashIcon from '@/component/modules/icons/Trash.icon';

import {
  deleteBlogPostApi,
  IAllUsers,
  IBlogTags,
} from '@/data/server_request/dashboard/blogs';
import { showSwal } from '@/utils/swalHelper';
import { convertToJalali } from '@/utils/dateConvertUtils';

import styles from './BlogPost.module.css';

const deletePostHandler = async (
  post_slug: string,
  categoryId: number,
  callGetBlogPostApi: VoidFunction,
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
        const res = await deleteBlogPostApi(post_slug, categoryId);
        if (res.status == 204) {
          showSwal('حذف با موفقیت انجام گردید.', '', 'success', 'تایید');
          callGetBlogPostApi();
        }
      } catch (error) {
        showSwal('خطا در حذف', '', 'error', 'تلاش مجدد');
      }
    }
  });
};

export const BlogPostColumnsData = (
  categoryId: number,
  allAutorInfoData: IAllUsers[],
  allTagsData: IBlogTags[],
  callGetBlogPostApi: VoidFunction,
) => [
  {
    key: 'id',
    header: 'شماره',
    hasFilter: null,
  },
  {
    key: 'post_title',
    header: 'عنوان مقاله',
    hasFilter: null,
    render: (props: any) => (
      <div className={styles.td}>
        <p>{props.post_title || ''}</p>
      </div>
    ),
  },
  {
    key: 'post_introduction',
    header: 'مقدمه اولیه',
    hasFilter: null,
    render: (props: any) => (
      <div className={styles.textArea}>
        <BaseTextArea readOnly value={props.post_introduction || ''} />
      </div>
    ),
  },
  {
    key: 'post_cover_image_url',
    header: 'عکس',
    hasFilter: null,
    render: (props: any) => (
      <>
        {props.post_cover_image_url ? (
          <div className={styles.imageTable}>
            <Image
              src={props.post_cover_image_url}
              alt="image-category"
              width={200}
              height={200}
              loading="lazy"
            />
          </div>
        ) : (
          <div>
            <p>تعیین نشده</p>
          </div>
        )}
      </>
    ),
  },
  {
    key: 'tags',
    header: 'تگ ها',
    hasFilter: null,
    render: (props: any) => (
      <div className={styles.select}>
        {props.tags ? (
          <BaseSelectInput
            rightSection={<ChevronDownIcon />}
            withScrollArea={true}
            placeholder="تگ ها"
            data={props.tags.map((item: any, index: number) => ({
              value: String(item.id),
              label: item.tag_name || '',
            }))}
          />
        ) : (
          <div>-</div>
        )}
      </div>
    ),
  },

  {
    key: 'is_publish',
    header: 'وضعیت',
    hasFilter: null,
    render: (props: any) => (
      <div className={styles.td}>
        <p>{props.is_publish ? 'فعال' : 'غیرفعال'}</p>
      </div>
    ),
  },

  {
    key: 'post_slug',
    header: 'post_slug',
    hasFilter: null,
    render: (props: any) => (
      <div className={styles.td}>
        <p>{props.post_slug || ''}</p>
      </div>
    ),
  },
  {
    key: 'description_slug',
    header: 'description_slug',
    hasFilter: null,
    render: (props: any) => (
      <div className={styles.textArea}>
        <BaseTextArea readOnly value={props.description_slug || ''} />
      </div>
    ),
  },
  {
    key: 'created_at',
    header: 'تاریخ ایجاد',
    render: (props: any) => (
      <div className={styles.d}>{convertToJalali(props.created_at)}</div>
    ),
  },

  {
    key: 'edit',
    header: 'ادیت',
    hasFilter: null,
    render: (props: any) => (
      <BlogArticleEditButtonDrawer
        postSlug={props.post_slug}
        categoryId={categoryId}
        callGetBlogPostApi={callGetBlogPostApi}
        allAutorInfoData={allAutorInfoData}
        allTagsData={allTagsData}
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
        onClick={() =>
          deletePostHandler(props.post_slug, categoryId, callGetBlogPostApi)
        }
      >
        <TrashIcon />
      </button>
    ),
  },
];
