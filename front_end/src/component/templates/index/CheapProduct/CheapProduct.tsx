import Link from 'next/link';
import CardProduct from '../CardProduct/CardProduct';
import ChevronLeftIcon from '@/component/modules/icons/ChevronLeft.icon';
import { getProductsApi } from '@/data/server_request/dashboard/product';
import styles from './CheapProduct.module.css';
const CheapProduct = async () => {
  const result = await getProductsApi(
    1,
    undefined,
    undefined,
    undefined,
    'first_variant_price',
  );

  return (
    <section className={styles.section} aria-labelledby="cheap-title">
      <div className={styles.BestProductConatiner}>
        <div className={styles.header}>
          <h2 id="cheap-title">
            اقتصادی ترین محصولات
            <span> جی اس تولز </span>
          </h2>
          <div className={styles.divider}></div>
          <Link
            className="sm:text-[14px] text-[12px] font-DanaDemiBold flex items-center "
            href="/tools-shop"
            aria-label="مشاهده همه ابزار آلات ارزان قیمت - جی اس تولز"
          >
            <span>مشاهده محصولات </span>

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
export default CheapProduct;
