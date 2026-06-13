import OrderItemsShowButtonDrawer from '@/component/modules/drawer/OrderItemsShowButtonDrawer/OrderItemsShowButtonDrawer.drawer';
import OrderAdminShowButtonDrawer from '@/component/modules/drawer/OrderAdminShowButtonDrawer/OrderAdminShowButtonDrawer.drawer';
import { convertToJalali } from '@/utils/dateConvertUtils';
import styles from './Orders.module.css';
import BaseTextArea from '@/component/modules/inputs/BaseTextArea/BaseTextArea';

export const OrderstionColumnsData = (callGetOrdersApi: VoidFunction) => [
  {
    key: 'id',
    header: 'شماره',
    hasFilter: null,
    render: (props: any) => <p>{props.id}</p>,
  },

  {
    key: 'user_phone',
    header: 'پنل کاربری',
    hasFilter: null,
    render: (props: any) => (
      <div className={styles.td}>
        <p>{props.profile.user_phone || '-'}</p>
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
        <p>
          {props.payment_gateways.length > 0
            ? props?.payment_gateways[0].payment_gateway.trackId
            : '-'}
        </p>
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
    key: 'address',
    header: 'آدرس',
    hasFilter: null,
    render: (props: any) => (
      <div className={styles.td}>
        {props.address && props.shipping_id && (
          <OrderAdminShowButtonDrawer
            ShippingId={props.shipping_id}
            AddressId={props.address.id}
          />
        )}
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
