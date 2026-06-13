'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import CardProduct from '../CardProduct/CardProduct';
import ChevronLeftIcon from '@/component/modules/icons/ChevronLeft.icon';

import {
  getRelatedProductApi,
  IProducts,
  PaginationWithDataType,
} from '@/data/server_request/dashboard/product';
import styles from './RelatedProduct.module.css';

const RelatedProducts = ({ categoryId }: { categoryId: number }) => {
  const [data, setData] = useState<PaginationWithDataType<IProducts>>();

  const getApi = async () => {
    try {
      const result = await getRelatedProductApi(categoryId);
      setData(result);
    } catch (error) {
      // console.log('');
    }
  };

  useEffect(() => {
    getApi();
  }, []);

  return (
    <section className={styles.section} aria-labelledby="related-product-title">
      <div className={styles.BestProductConatiner}>
        <div className={styles.header}>
          <h2 id="related-product-title">
            محصولات مرتبــط <span>جی اس تولز</span>
          </h2>
          <div className={styles.divider}></div>
          <Link
            className="text-[14px] font-DanaDemiBold flex items-center "
            href="/tools-shop"
            aria-label="مشاهده محصولات مرتبط ابزار آلات - جی اس تولز"

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
          {data !== undefined && data?.results.length > 0 ? (
            <>
              {data.results
                .slice(0, 6)
                .map(
                  (item) =>
                    item.product_product_image.length > 0 && (
                      <CardProduct data={item as any} key={item.id} />
                    ),
                )}
            </>
          ) : (
            <div>محصولی موجو نمی باشد!</div>
          )}
        </div>
      </div>
    </section>
  );
};
export default RelatedProducts;
