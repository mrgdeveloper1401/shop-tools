import Swal from 'sweetalert2';

import { Switch } from '@mantine/core';

import ImageAddButtonDrawer from '@/component/modules/drawer/ImageAddButtonDrawer/ImageAddButtonDrawer.drawer';
import SpecificationButtonDrawer from '@/component/modules/drawer/SpecificationButtonDrawer/SpecificationButtonDrawer.drawer';
import ProductEditButtonDrawer from '@/component/modules/drawer/Edits/ProductEditButtonDrawer/ProductEditButtonDrawer.drawer';
import BaSalamAddButtonDrawer from '@/component/modules/drawer/BaSalamAddButtonDrawer/BaSalamAddButtonDrawer.drawer';
import VariantButtonDrawer from '@/component/modules/drawer/VariantButtonDrawer/VariantButtonDrawer.drawer';

import TrashIcon from '../../../modules/icons/Trash.icon';

import {
  deleteProductsApi,
  IBrands,
  ICategory,
  ITags,
} from '@/data/server_request/dashboard/product';
import { showSwal } from '@/utils/swalHelper';
import { convertToJalali } from '@/utils/dateConvertUtils';
import styles from './Products.module.css';

const deleteCategoryHandler = async (
  productId: number,
  categoryId: number,
  callGetProductsApi: VoidFunction,
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
        const res = await deleteProductsApi(productId, categoryId);
        if (res.status == 204) {
          showSwal('حذف با موفقیت انجام گردید.', '', 'success', 'تایید');
          callGetProductsApi();
        }
      } catch (error) {
        showSwal('خطا در حذف', '', 'error', 'تلاش مجدد');
      }
    }
  });
};

export const ProductsColumnsData = (
  callGetProductsApi: VoidFunction,
  allBrandsData: IBrands[],
  allCategoryData: ICategory[],
  allTagsData: ITags[],
) => [
  {
    key: 'sku',
    header: 'شناسه',
    hasFilter: null,
    render: (props: any) => (
      <div className={styles.td}>
        <p>{props.sku}</p>
      </div>
    ),
  },
  {
    key: 'product_name',
    header: 'نام محصول',
    hasFilter: null,
    render: (props: any) => (
      <div className={styles.td}>
        <p>{props.product_name}</p>
      </div>
    ),
  },
  {
    key: 'in_person_purchase',
    header: 'ارسال با تیپاکس',
    hasFilter: null,
    render: (props: any) => (
      <div className={styles.td}>
        <Switch size="sm" checked={props.in_person_purchase} />
      </div>
    ),
  },
  {
    key: 'created_at',
    header: 'ایجاد',
    hasFilter: null,
    render: (props: any) => (
      <div className={styles.td}>{convertToJalali(props.created_at)}</div>
    ),
  },
  {
    key: 'image',
    header: 'عکس',
    hasFilter: null,
    render: (props: any) => (
      <div className={styles.td}>
        <ImageAddButtonDrawer
          productId={props.id}
          categoryId={props.category_id}
        />
      </div>
    ),
  },
  {
    key: 'specification',
    header: 'ویژگی ها',
    hasFilter: null,

    render: (props: any) => (
      <div className={styles.td}>
        <SpecificationButtonDrawer
          productId={props.id}
          categoryId={props.category_id}
        />
      </div>
    ),
  },
  {
    key: 'variant',
    header: 'قیمت',
    hasFilter: null,

    render: (props: any) => (
      <div className={styles.td}>
        <VariantButtonDrawer
          productId={props.id}
          categoryId={props.category_id}
        />
      </div>
    ),
  },
  {
    key: 'basalam',
    header: 'باسلام',
    hasFilter: null,

    render: (props: any) => (
      <div className={styles.td}>
        <BaSalamAddButtonDrawer
          productId={props.id}
          categoryId={props.category_id}
        />
      </div>
    ),
  },
  {
    key: 'edit',
    header: 'ادیت',
    hasFilter: null,
    render: (props: any) => (
      <div className={styles.td}>
        <ProductEditButtonDrawer
          productId={props.id}
          categoryId={props.category_id}
          callGetProductsApi={callGetProductsApi}
          allBrandsData={allBrandsData}
          allCategoryData={allCategoryData}
          allTagsData={allTagsData}
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
          deleteCategoryHandler(props.id, props.category_id, callGetProductsApi)
        }
      >
        <TrashIcon />
      </button>
    ),
  },
];
