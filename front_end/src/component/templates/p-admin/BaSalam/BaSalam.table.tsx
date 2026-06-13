import styles from './BaSalam.module.css';

export const BaSalamColumnsData = (callGetBaSalamApi: VoidFunction) => [
  {
    key: 'id',
    header: 'شماره',
    hasFilter: null,
  },
  {
    key: 'title',
    header: 'عنوان محصول',
    hasFilter: null,
    render: (props: any) => (
      <div className={styles.td}>
        <p>{props.title || ''}</p>
      </div>
    ),
  },
  {
    key: 'title',
    header: 'عنوان محصول',
    hasFilter: null,
    render: (props: any) => (
      <div className={styles.td}>
        <p>{props.status.name || ''}</p>
      </div>
    ),
  },
];
