import Link from 'next/link';
import CarouselCategory from '../CarouselCategory/CarouselCategory';
import ChevronLeftIcon from '@/component/modules/icons/ChevronLeft.icon';
import DiscountIcon from '@/component/modules/icons/Discount.icon';

import { getHomeCategoryApi } from '@/data/server_request/dashboard/product';
import s from './Category.module.css';

const Category = async () => {
  const category = await getHomeCategoryApi();
  const CategoryData = category.filter((item) => item.get_category_image_url);
  return (
    <section className={s.section}>
      <div className="mb-4 lg:hidden flex justify-center">
        <h2 className={s.title}>
          <Link href="/tools-shop?has_Discount=has_discount">
            <span>تخفیف ها و پیشنهادات</span>
            <DiscountIcon fontSize={22} />
          </Link>
        </h2>
      </div>
      <div className={s.CategoryConatiner}>
        <div className={s.header}>
          <h2>
            دسته بندی محصولات <span>جی اس تولز</span>
          </h2>
          <div className={s.divider}></div>
          <Link
            className="sm:text-[14px] text-[12px] font-DanaDemiBold flex items-center "
            href="/tools-shop"
          >
            <span>مشاهده دسته بندی ها </span>
            <ChevronLeftIcon
              stroke="black"
              width="1.6em"
              height="1.6em"
              style={{ marginBottom: '5px' }}
            />
          </Link>
        </div>
        <div className={s.content}>
          <CarouselCategory data={CategoryData} />
        </div>
      </div>
    </section>
  );
};
export default Category;
