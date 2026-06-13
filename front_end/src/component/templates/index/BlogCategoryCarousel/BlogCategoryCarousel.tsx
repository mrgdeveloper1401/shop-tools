'use client';
import { FC, useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

import { Carousel } from '@mantine/carousel';

import PrimaryButton from '@/component/modules/PrimaryButton/Primary.button';
import EntireIcon from '@/component/modules/icons/Entire.icon';
import {
  getBlogPostApi,
  IBlogCategory,
  IBlogPostsArticle,
} from '@/data/server_request/dashboard/blogs';
import { PaginationWithDataType } from '@/data/server_request/dashboard/product';

import styles from './BlogCategoryCarousel.module.css';

interface BlogCategoryCarouselProps {
  data: IBlogCategory;
}

const BlogCategoryCarousel: FC<BlogCategoryCarouselProps> = ({ data }) => {
  const [allBlogCategoryData, setAllBlogCategoryData] =
    useState<PaginationWithDataType<IBlogPostsArticle>>();

  const callGetBlogCategoryApi = async () => {
    try {
      const result = await getBlogPostApi(data.id);
      setAllBlogCategoryData(result);
    } catch (error) {
      // console.log(first)
    }
  };

  useEffect(() => {
    callGetBlogCategoryApi();
  }, []);

  if (allBlogCategoryData?.count === 0) {
    return (
      <div className="text-center text-red-500 w-full">
        مقاله های مربوط به این بخش بزودی انتشار داده خواهد شد!
      </div>
    );
  }

  return (
    <Carousel
      slideSize="300px"
      w="100%"
      slideGap="md"
      emblaOptions={{
        loop: true,
        dragFree: true,
      }}
      style={{ direction: 'ltr' }}
      classNames={{
        viewport: styles.viewport,
        controls: styles.controls,
        control: styles.control,
        container: styles.container,
        slide: styles.slide,
      }}
    >
      {allBlogCategoryData?.results && allBlogCategoryData.count > 0 ? (
        allBlogCategoryData.results.map((item) => (
          <Carousel.Slide key={item.id}>
            <Link href={`/blog/${item.post_slug}`} className={styles.box}>
              <div className={styles.boxTop}>
                <Image
                  src={item.post_cover_image.image}
                  alt={item.post_title}
                  width={390}
                  height={225}
                  quality={75}
                />
              </div>
              <div className={styles.boxBottom}>
                <div className={styles.boxBottom_up}>
                  <div className={styles.title}>
                    <h3>{item.post_title}</h3>
                  </div>
                  <div className={styles.post_introduction}>
                    <p>
                      {item.post_introduction.slice(0, 220)}
                      ...
                    </p>
                  </div>
                </div>
                <div className={styles.boxBottom_down}>
                  <PrimaryButton fullWidth>
                    <EntireIcon />
                    <span>مطالعه مقاله</span>
                  </PrimaryButton>
                </div>
              </div>
            </Link>
          </Carousel.Slide>
        ))
      ) : (
        <div>بزودی </div>
      )}
    </Carousel>
  );
};
export default BlogCategoryCarousel;
