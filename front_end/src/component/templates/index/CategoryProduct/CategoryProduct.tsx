import Link from 'next/link';
import CardProduct from '../CardProduct/CardProduct';
import ChevronLeftIcon from '@/component/modules/icons/ChevronLeft.icon';

import { getHomeProductApi } from '@/data/server_request/dashboard/product';
import styles from './CategoryProduct.module.css';

const CategoryProduct = async () => {
  const result = await getHomeProductApi();
  const productsWithImage = result.results.filter(
    (item) => item.product_product_image.length > 0,
  );

  const displayedProducts = productsWithImage.slice(0, 6);
  return (
    <section className={styles.section} aria-labelledby="best-products-title">
      <div className={styles.BestProductConatiner}>
        <div className={styles.header}>
          <h2 id="best-products-title">
            پک های ویژه روز پدر در <span>جی اس تولز</span>
          </h2>
          <div className={styles.divider}></div>
          <Link
            className="sm:text-[14px] text-[12px] font-DanaDemiBold flex items-center "
            href="/tools-shop"
            aria-label="مشاهده همه محصولات محبوب ابزار آلات - جی اس تولز"
          >
            <span>مشاهده محصولات محبوب</span>

            <ChevronLeftIcon
              stroke="black"
              width="1.6em"
              height="1.6em"
              style={{ marginBottom: '5px' }}
            />
          </Link>
        </div>
        <div className={styles.content}>
          {displayedProducts.reverse().map((item) => (
            <CardProduct data={item as any} key={item.id} />
          ))}
        </div>
      </div>
    </section>
  );
};
export default CategoryProduct;
