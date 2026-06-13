import { priceFormat } from '@/utils/price-format';
import styles from './OrderItemsShowButtonDrawer.module.css';

export const OrderItemsColumnsData = [
  {
    key: 'id',
    header: 'شماره',
    hasFilter: null,
    render: (props: any) => <p>{props.id}</p>,
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
    key: 'variant_name',
    header: 'نام ورینت',
    hasFilter: null,
    render: (props: any) => (
      <div className={styles.td}>
        <p>{props.variant_name}</p>
      </div>
    ),
  },

  {
    key: 'price',
    header: 'قیمت و تعداد',
    hasFilter: null,
    render: (props: any) => (
      <div className={styles.td}>
        <p>
          {priceFormat(String(props.price))} * {props.quantity}
        </p>
      </div>
    ),
  },
  {
    key: 'calc_price_quantity',
    header: 'قیمت نهایی',
    hasFilter: null,
    render: (props: any) => (
      <div className={styles.td}>
        <p>{priceFormat(String(props.calc_price_quantity))}</p>
      </div>
    ),
  },
];
