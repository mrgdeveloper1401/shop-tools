import OrderAdminShowButtonDrawer from '@/component/modules/drawer/OrderAdminShowButtonDrawer/OrderAdminShowButtonDrawer.drawer';
import { convertToJalali } from '@/utils/dateConvertUtils';
import styles from './Orders.module.css';
import OrderItemsShowButtonDrawer from '@/component/modules/drawer/OrderItemsShowButtonDrawer/OrderItemsShowButtonDrawer.drawer';
import BaseTextArea from '@/component/modules/inputs/BaseTextArea/BaseTextArea';

export const OrderstionColumnsData = [
  {
    key: 'id',
    header: 'شماره',
    hasFilter: null,
  },
  {
    key: 'phone',
    header: 'شماره تماس گیرنده',
    hasFilter: null,
    render: (props: any) => (
      <div className={styles.td}>
        <p>{props.phone || '-'}</p>
      </div>
    ),
  },
  {
    key: 'profile',
    header: 'مشتری',
    hasFilter: null,
    render: (props: any) => (
      <div className={styles.td}>
        <p>
          {props.first_name === null && props.last_name === null
            ? '-'
            : props.first_name + ' ' + props.last_name}
        </p>
      </div>
    ),
  },
  {
    key: 'status',
    header: 'وضعیت',
    hasFilter: null,
    render: (props: any) => {
      return (
        <div className={styles.td}>
          <p>
            {props.status === 'paid'
              ? 'پرداخت موفق'
              : props.status === 'pending'
                ? '   در انتظار پرداخت'
                : props.status === 'cancelled'
                  ? '  لغو شده'
                  : ''}
          </p>
        </div>
      );
    },
  },
  {
    key: 'tracking_code',
    header: 'کد رهگیری',
    hasFilter: null,
    render: (props: any) => (
      <div className={styles.td}>
        <p>{props.tracking_code || 'عدم پرداخت'}</p>
      </div>
    ),
  },

  {
    key: 'description',
    header: 'توضیحات',
    hasFilter: null,
    render: (props: any) => (
      <div className={styles.td}>
        <BaseTextArea
          readOnly
          value={props.description || ''}
          styles={{ input: { height: '50px', width: '200px' } }}
        />
      </div>
    ),
  },
  {
    key: 'created_at',
    header: 'تاریخ پرداخت',
    hasFilter: null,
    render: (props: any) => (
      <div className={styles.td}>
        {convertToJalali(props.created_at) || 'تعیین نشده'}
      </div>
    ),
  },

  {
    key: 'no1',
    header: 'لیست سفارشات',
    hasFilter: null,
    render: (props: any) => (
      <div className={styles.td}>
        <OrderItemsShowButtonDrawer orderId={props.id} />
      </div>
    ),
  },
];
