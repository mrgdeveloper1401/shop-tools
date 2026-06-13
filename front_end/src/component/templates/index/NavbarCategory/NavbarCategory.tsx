import Link from 'next/link';

import CategoryIcon from '@/component/modules/icons/Category.icon';
import HomeIcon from '@/component/modules/icons/Home.icon';
import ShopLocationIcon from '@/component/modules/icons/ShopLocation.icon';
import BlogIcon from '@/component/modules/icons/Blog.icon';
import DiscountIcon from '@/component/modules/icons/Discount.icon';
import ChevronLeftIcon from '@/component/modules/icons/ChevronLeft.icon';
import LocationIcon from '@/component/modules/icons/Location.icon';

import { getHomeCategoryApi } from '@/data/server_request/dashboard/product';

import s from './NavbarCategory.module.css';

const NavbarCategory = async () => {
  const category = await getHomeCategoryApi();
  return (
    <nav
      className={s.navbar_container}
      aria-label="منوی دسته‌بندی فروشگاه ابزار آلات | جی اس تولز"
    >
      <div className={s.header}>
        <ul className={s.ul}>
          <li>
            <div className={s.dropdown_container}>
              <button
                aria-haspopup="true"
                aria-expanded="false"
                aria-label="مشاهده دسته‌بندی کالاها"
              >
                <CategoryIcon />
                دسته بندی کالاها
              </button>
              <div className={s.dropdown}>
                <ul className={s.dropdown_ul}>
                  {category.map((item) => (
                    <li key={item.id}>
                      <Link
                        href={`/tools-shop/?category_id=${item.id}`}
                        title={`مشاهده محصولات دسته ${item.category_name}`}
                      >
                        {item.category_name}
                        <ChevronLeftIcon />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </li>
          <div className={s.divider}></div>
          <li>
            <Link href="/" title="بازگشت به صفحه اصلی">
              <HomeIcon />
              خانه
            </Link>
          </li>
          <div className={s.divider}></div>
          <li>
            <Link href="/tools-shop" title="مشاهده فروشگاه جی اس تولز">
              <ShopLocationIcon />
              فروشگاه
            </Link>
          </li>
          <div className={s.divider}></div>
          <li>
            <Link href="/blog" title="مطالعه مقالات و بلاگ">
              <BlogIcon />
              بلاگ
            </Link>
          </li>
          <div className={s.divider}></div>
          <li>
            <Link href="/contact-us" title="تماس با جی اس تولز">
              <LocationIcon width="1.1em" />
              تماس و آدرس ما
            </Link>
          </li>
        </ul>

        <h2 className={s.title}>
          <Link
            href="/tools-shop?has_Discount=has_discount"
            title="مشاهده تخفیف‌ها و پیشنهادات ویژه"
          >
            <span>تخفیف ها و پیشنهادات</span>
            <DiscountIcon fontSize={22} />
          </Link>
        </h2>
      </div>
    </nav>
  );
};
export default NavbarCategory;
