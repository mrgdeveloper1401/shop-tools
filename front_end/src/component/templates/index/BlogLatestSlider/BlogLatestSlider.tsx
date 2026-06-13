import Link from 'next/link';
import BlogLatestCarousel from '../BlogLatestCarousel/BlogLatestCarousel';
import ChevronLeftIcon from '@/component/modules/icons/ChevronLeft.icon';
import { getLatestBlogApi } from '@/data/server_request/dashboard/blogs';
import s from './BlogLatestSlider.module.css';

const BlogLatestSlider = async () => {
  let LatestBlog = await getLatestBlogApi();

  return (
    <section className={s.section} aria-labelledby="latest-blog-title">
      <div className={s.CategoryConatiner}>
        <div className={s.header}>
          <h2 id="latest-blog-title">
            آخرین مقاله های <span>جی اس تولز</span>
          </h2>
          <div className={s.divider}></div>
          <Link
            className="sm:text-[14px] text-[12px] font-DanaDemiBold flex items-center "
            href="/blog"
            aria-label="مشاهده همه مقالات دنیای ابزار آلات - جی اس تولز"
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
          <BlogLatestCarousel LatestBlog={LatestBlog} />
        </div>
      </div>
    </section>
  );
};
export default BlogLatestSlider;
