'use client';
import { FC } from 'react';
import Link from 'next/link';
import Image from 'next/image';

import { Carousel } from '@mantine/carousel';
import PrimaryButton from '@/component/modules/PrimaryButton/Primary.button';
import EntireIcon from '@/component/modules/icons/Entire.icon';

import { ILatestBlogApi } from '@/data/server_request/dashboard/blogs';
import styles from './BlogLatestCarousel.module.css';

interface BlogCarouselProps {
  LatestBlog: ILatestBlogApi[];
}

const BlogLatestCarousel: FC<BlogCarouselProps> = ({ LatestBlog }) => {
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
      {LatestBlog.length > 0 &&
        LatestBlog.map((item) => (
          <Carousel.Slide key={item.id}>
            <Link href={`/blog/${item.post_slug}`} className={styles.box}>
              <div className={styles.boxTop}>
                <Image
                  src={item.post_cover_image.image}
                  alt={item.post_title}
                  width={390}
                  height={180}
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
        ))}
    </Carousel>
  );
};

export default BlogLatestCarousel;
