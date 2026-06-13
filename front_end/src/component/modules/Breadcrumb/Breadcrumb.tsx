import { FC } from 'react';
import Link from 'next/link';

import HomeIcon from '../icons/Home.icon';
import styles from './Breadcrumb.module.css';

interface BreadcrumbProps {
  brnad_href: string;
  brand_name: string;
  product_name?: string;
  product_href?: string;
}

const Breadcrumb: FC<BreadcrumbProps> = ({
  brand_name,
  brnad_href,
  product_name,
  product_href,
}) => {
  return (
    <div className={styles.breadcrumb}>
      <div className={styles.breadcrumb__content}>
        <Link
          href="/"
          className={`${styles.breadcrumb__home_content_icon}  ${styles.breadcrumb__home_icon} `}
        >
          <HomeIcon />
        </Link>
        <ul className={styles.breadcrumb__list}>
          <div className={styles.breadCrumb_li1}>
            <Link href="/tools-shop" className={styles.breadcrumb__link}>
              محصولات
            </Link>
          </div>

          <div className={styles.breadCrumb_li2}>
            <Link href={brnad_href || ''}>
              <li className={styles.breadcrumb__item}>{brand_name}</li>
            </Link>
          </div>
          <div className={styles.breadCrumb_li3}>
            <Link href={product_href || ''}></Link>
            <li className={styles.breadcrumb__item}>{product_name}</li>
          </div>
        </ul>
      </div>
    </div>
  );
};

export default Breadcrumb;
