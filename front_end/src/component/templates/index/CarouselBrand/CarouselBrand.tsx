'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useRef } from 'react';
import { Carousel } from '@mantine/carousel';
import Autoplay from 'embla-carousel-autoplay';

import { IBrandsHome } from '@/data/server_request/dashboard/product';
import s from './CarouselBrand.module.css';

const CarouselCategory = ({ data }: { data: IBrandsHome[] }) => {
  const autoplay = useRef(Autoplay({ delay: 4000 }));
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
                item.brand_image_url !== null && (
                  <Carousel.Slide key={index}>
                    <Link
                      href={`/tools-shop/?brand_id=${item.id}`}
                      className={s.slide}
                    >
                      <div>
                        <Image
                          src={item.brand_image_url}
                          alt={`محصولات برند ${item.brand_name}`}
                          width={850}
                          height={850}
                          className={s.imageSlider}
                          priority
                        />
                      </div>
                      <span>{item.brand_name}</span>
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
