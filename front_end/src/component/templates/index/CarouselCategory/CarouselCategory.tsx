'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useRef } from 'react';
import { Carousel } from '@mantine/carousel';
import Autoplay from 'embla-carousel-autoplay';

import { ICategory } from '@/data/server_request/dashboard/product';
import s from './CarouselCategory.module.css';

const CarouselCategory = ({ data }: { data: ICategory[] }) => {
  const autoplay = useRef(Autoplay({ delay: 7000 }));
  return (
    <section className={s.section}>
      <div className={s.containerLanding}>
        <div className={s.bottom}>
          <Carousel
            w="100%"
            emblaOptions={{
              loop: true,
              dragFree: true,
              align: 'center',
            }}
            slideSize="10%"
            slideGap="md"
            style={{ direction: 'ltr' }}
            plugins={[autoplay.current]}
            onMouseEnter={autoplay.current.stop}
            onMouseLeave={autoplay.current.reset}
          >
            {data.map(
              (item, index) =>
                item.get_category_image_url.length > 0 && (
                  <Carousel.Slide key={index + 1}>
                    <Link
                      href={`/tools-shop/?category_id=${item.id}`}
                      className={s.slide}
                    >
                      <div>
                        <Image
                          src={item.get_category_image_url || ''}
                          alt={`قیمت و خرید ${item.category_name}`}
                          width={65}
                          height={65}
                          className={s.imageSlider}
                          priority
                        />
                      </div>
                      <p>{item.category_name}</p>
                    </Link>
                  </Carousel.Slide>
                ),
            )}
          </Carousel>
        </div>
      </div>
    </section>
  );
};

export default CarouselCategory;
