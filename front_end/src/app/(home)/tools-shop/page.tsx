import { Metadata } from 'next';
import { Suspense } from 'react';
import Script from 'next/script';
import ToolShop from '@/component/templates/index/ToolShop/ToolShop';

export const metadata: Metadata = {
  title: 'فروشگاه ابزار جی‌اس تولز | خرید ابزارآلات صنعتی، برقی و دستی',
  description:
    'در فروشگاه جی‌اس تولز، انواع ابزارآلات صنعتی، برقی، دستی و کارگاهی را از برندهای معتبر مانند بوش، دیوالت، ماکیتا و رونیکس با بهترین قیمت خریداری کنید.',
  keywords: [
    'فروشگاه ابزار',
    'جی‌اس تولز',
    'خرید ابزار صنعتی',
    'ابزار برقی',
    'ابزار دستی',
    'ابزار ساختمانی',
    'ابزار کارگاهی',
    'Ronix',
    'Bosch',
    'Makita',
    'DeWalt',
    'Knipex',
  ],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  openGraph: {
    title: 'فروشگاه ابزار جی‌اس تولز | خرید ابزارآلات صنعتی و خانگی',
    description:
      'خرید انواع ابزار صنعتی و خانگی با قیمت مناسب، ارسال سریع و پشتیبانی تخصصی از فروشگاه جی‌اس تولز.',
    url: 'https://gs-tools.ir/tools-shop',
    siteName: 'جی‌اس تولز',
    type: 'website',
    images: [
      {
        url: 'https://gs-tools.ir/image/svgs/Logos/logo.png',
        width: 1200,
        height: 630,
        alt: 'فروشگاه ابزار جی‌اس تولز',
      },
    ],
    locale: 'fa_IR',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'فروشگاه ابزار جی‌اس تولز | خرید ابزار صنعتی و دستی',
    description:
      'خرید آنلاین ابزارآلات صنعتی، برقی، دستی و لوازم جانبی در فروشگاه جی‌اس تولز.',
    images: ['https://gs-tools.ir/image/svgs/Logos/logo.png'],
  },
  alternates: {
    canonical: 'https://gs-tools.ir/tools-shop',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'Store',
  name: 'فروشگاه جی‌اس تولز',
  description:
    'فروشگاه آنلاین ابزارآلات صنعتی، برقی، دستی و کارگاهی با ضمانت اصالت کالا و ارسال سریع به سراسر ایران.',
  url: 'https://gs-tools.ir/tools-shop',
  logo: 'https://gs-tools.ir/images/home/logo.png',
  image: 'https://gs-tools.ir/image/svgs/Logos/logo.png',
  brand: {
    '@type': 'Brand',
    name: 'جی‌اس تولز',
  },
  // sameAs: ['https://www.instagram.com/gs_tools2024', 'https://t.me/Garmasa'],
  contactPoint: [
    {
      '@type': 'ContactPoint',
      telephone: '04133810519',
      contactType: 'customer support',
      areaServed: 'IR',
      availableLanguage: ['fa', 'en'],
    },
  ],
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'تبریز',
    addressRegion: 'آذربایجان شرقی',
    addressCountry: 'IR',
  },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Saturday',
        'Sunday',
      ],
      opens: '09:00',
      closes: '21:00',
    },
  ],
  '@graph': [
    {
      '@type': 'WebSite',
      name: 'جی‌اس تولز',
      url: 'https://gs-tools.ir',
      potentialAction: {
        '@type': 'SearchAction',
        target: 'https://gs-tools.ir/tools-shop?s={search_term_string}',
        'query-input': 'required name=search_term_string',
      },
    },
  ],
};

const ToolShopPage = () => (
  <>
    <Suspense>
      <ToolShop />
    </Suspense>
    <Script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  </>
);
export default ToolShopPage;
