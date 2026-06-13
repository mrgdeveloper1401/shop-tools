import DiscountButtonDrawer from '../DiscountButtonDrawer/DiscountButtonDrawer.drawer';
import Swal from 'sweetalert2';

import TrashIcon from '../../icons/Trash.icon';

import { showSwal } from '@/utils/swalHelper';
import { deleteVariantApi } from '@/data/server_request/dashboard/product';
import { priceFormat } from '@/utils/price-format';
import styles from './VariantButtonDrawer.module.css';

const deleteVariantHandler = async (
  VariantId: number,
  productId: number,
  categoryId: number,
  callGetVariantsApi: VoidFunction,
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
        const res = await deleteVariantApi(VariantId, categoryId, productId);
        if (res.status == 204) {
          showSwal('حذف با موفقیت انجام گردید.', '', 'success', 'تایید');
          callGetVariantsApi();
        }
      } catch (error) {
        showSwal('خطا در حذف', '', 'error', 'تلاش مجدد');
      }
    }
  });
};

export const VariantColumnsData = (
  productId: number,
  categoryId: number,
  callGetVariantsApi: VoidFunction,
) => [
  {
    key: 'name',
    header: 'عنوان ورینت',
    hasFilter: null,
    render: (props: any) => (
      <div className={styles.td}>
        <p>{props.name}</p>
      </div>
    ),
  },
  {
    key: 'price',
    header: 'قیمت',
    hasFilter: null,
    render: (props: any) => (
      <div className={styles.td}>
        <p>{priceFormat(props.price)}</p>
      </div>
    ),
  },
  {
    key: 'stock_number',
    header: 'تعداد ورینت',
    hasFilter: null,
    render: (props: any) => (
      <div className={styles.td}>
        <p>{props.stock_number}</p>
      </div>
    ),
  },
  {
    key: 'discount',
    header: 'تخفیف',
    hasFilter: null,
    render: (props: any) => (
      <DiscountButtonDrawer
        variantId={props.id}
        productId={productId}
        categoryId={categoryId}
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
          deleteVariantHandler(
            props.id,
            productId,
            categoryId,
            callGetVariantsApi,
          )
        }
      >
        <TrashIcon />
      </button>
    ),
  },
];
