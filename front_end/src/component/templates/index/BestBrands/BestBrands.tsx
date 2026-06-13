import Link from 'next/link';
import CarouselBrand from '../CarouselBrand/CarouselBrand';
import ChevronLeftIcon from '@/component/modules/icons/ChevronLeft.icon';

import { getHomeLandingBrandsApi } from '@/data/server_request/dashboard/product';
import s from './BestBrands.module.css';

const BestBrands = async () => {
  const BestBrands = await getHomeLandingBrandsApi();
  return (
    <section className={s.section} aria-labelledby="best-brands-title">
      <div className={s.CategoryConatiner}>
        <div className={s.header}>
          <h2 id="best-brands-title">
            مـحبوب تـریـن بـرنـدهای <span>جی اس تولز</span>
          </h2>
          <div className={s.divider}></div>
          <Link
            className="sm:text-[14px] text-[12px] font-DanaDemiBold flex items-center "
            href="/tools-shop"
          >
            <span>مشاهده برند ها</span>
            <ChevronLeftIcon
              stroke="black"
              width="1.6em"
              height="1.6em"
              style={{ marginBottom: '5px' }}
            />
          </Link>
        </div>
        <div className={s.content}>
          <CarouselBrand data={BestBrands} />
        </div>
      </div>
    </section>
  );
};
export default BestBrands;
