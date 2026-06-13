'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useRef } from 'react';
import { Carousel } from '@mantine/carousel';
import Autoplay from 'embla-carousel-autoplay';
import { IBannerCarousel } from '@/data/server_request/dashboard/banner';

import s from './Landing.module.css';
import CounterTimer from '@/component/modules/CounterTimer/CounterTimer';

const Landing = ({ bannerCarousel }: { bannerCarousel: IBannerCarousel[] }) => {
  const autoplay = useRef(Autoplay({ delay: 4000 }));
  return (
    <section className={s.section}>
      <div className={s.containerLanding}>
        <Carousel
          w="100%"
          emblaOptions={{
            loop: true,
            dragFree: true,
            align: 'center',
          }}
          slideGap="md"
          style={{ direction: 'ltr' }}
          withIndicators
          plugins={[autoplay.current]}
          onMouseEnter={autoplay.current.stop}
          onMouseLeave={autoplay.current.reset}
          classNames={{ control: s.control }}
          aria-roledescription="carousel"
          aria-label="بنر اطلاعیه جی اس تولز | فروشگاه ابزار آلات "
        >
          {bannerCarousel.map((item, index) => (
            <Carousel.Slide key={index}>
              <Link href="/tools-shop" className={s.slide}>
                <Image
                  src={item.image_url}
                  alt={`فروشگاه ابزار آلات  جی اس تولز | ${item.name}`}
                  width={10000}
                  height={1000}
                  className={s.imageSlider}
                  loading={index === 0 ? 'eager' : 'lazy'}
                  priority={index === 0}
                />
              </Link>
            </Carousel.Slide>
          ))}
        </Carousel>
      </div>
    </section>
  );
  // return (
  //   <section className="mt-4">
  //     <Link href="/tools-shop?category_id=56" className={s.yalda_image}>
  //       <Image
  //         className="w-full"
  //         src="/images/assets/yalda.png"
  //         alt="تخفیف شب یلدا ابزار فروشی جی اس تولز - خرید ابزار"
  //         width={10000}
  //         height={1000}
  //       />
  //       <div>
  //         <CounterTimer />
  //       </div>
  //     </Link>
  //   </section>
  // );
};

export default Landing;
