import { convertToJalali } from '@/utils/dateConvertUtils';
import styles from './Chart.module.css';

export const ChartColumnsData = [
  {
    key: 'total_quantity',
    header: 'تعداد',
    hasFilter: null,
    render: (props: any) => (
      <div className={styles.td}>
        <p>{props.total_quantity || '0'}</p>
      </div>
    ),
  },
  {
    key: 'sale_date',
    header: 'تاریخ پرداخت',
    hasFilter: null,
    render: (props: any) => (
      <div className={styles.td}>
        <p>{convertToJalali(props.sale_date) || '0'}</p>
      </div>
    ),
  },

  {
    key: 'total_amount',
    header: 'در آمد',
    hasFilter: null,
    render: (props: any) => (
      <div className={styles.td}>
        <p>{props.total_amount.toLocaleString() || ''}</p>
      </div>
    ),
  },
];
