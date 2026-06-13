import Link from 'next/link';
import CardProduct from '../CardProduct/CardProduct';
import ChevronLeftIcon from '@/component/modules/icons/ChevronLeft.icon';
import { getHomeProductsApi } from '@/data/server_request/dashboard/product';
import styles from './DiscountProduct.module.css';

const DiscountProduct = async () => {
  const result = await getHomeProductsApi(
    1,
    undefined,
    undefined,
    undefined,
    undefined,
    true,
  );

  if (result.results.length === 0) {
    return null;
  }
  return (
    <section className={styles.section} aria-labelledby="discount-title">
      <div className={styles.BestProductConatiner}>
        <div className={styles.header}>
          <h2 id="discount-title">
            مـحصولات با تخفیف <span>جی اس تولز </span>
          </h2>
          <div className={styles.divider}></div>
          <Link
            className="sm:text-[14px] text-[12px] font-DanaDemiBold flex items-center "
            href="/tools-shop"
            aria-label="مشاهده همه محصولات تخفیف دار ابزار آلات - جی اس تولز"
          >
            <span>مشاهده تخفیف</span>
            <ChevronLeftIcon
              stroke="black"
              width="1.6em"
              height="1.6em"
              style={{ marginBottom: '5px' }}
            />
          </Link>
        </div>
        <div className={styles.content}>
          {result.results
            .slice(0, 6)
            .map(
              (item) =>
                item.product_product_image.length > 0 && (
                  <CardProduct data={item as any} key={item.id} />
                ),
            )}
        </div>
      </div>
    </section>
  );
};
export default DiscountProduct;
