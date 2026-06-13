import Link from 'next/link';
import BlogCategoryCarousel from '../BlogCategoryCarousel/BlogCategoryCarousel';
import BlogLatestSlider from '../BlogLatestSlider/BlogLatestSlider';
import ChevronLeftIcon from '@/component/modules/icons/ChevronLeft.icon';
import { IBlogCategory } from '@/data/server_request/dashboard/blogs';
import s from './BlogsCategory.module.css';

const BlogsCategory = ({ blogCategory }: { blogCategory: IBlogCategory[] }) => {
  return (
    <section className={s.scrollSection}>
      <div className={s.title}>
        <h1>مقالات آموزشی و تخصصی ابزارآلات در جی‌اس تولز</h1>
      </div>
      <BlogLatestSlider />
      <div className="flex flex-col gap-10">
        {blogCategory.length > 0 &&
          blogCategory?.map((item) => (
            <section className={s.section} key={item.id}>
              <div className={s.CategoryConatiner}>
                <div className={s.header}>
                  <h2>
                    مقاله های {item.category_name} <span>جی اس تولز</span>
                  </h2>
                  <div className={s.divider}></div>
                  <Link
                    className="sm:text-[14px] text-[12px] font-DanaDemiBold flex items-center "
                    href="/blog"
                  >
                    <span>مشاهده مقاله ها</span>
                    <ChevronLeftIcon
                      stroke="black"
                      width="1.6em"
                      height="1.6em"
                      style={{ marginBottom: '5px' }}
                    />
                  </Link>
                </div>
                <div className={s.content}>
                  <BlogCategoryCarousel data={item} />
                </div>
              </div>
            </section>
          ))}
      </div>
    </section>
  );
};
export default BlogsCategory;
