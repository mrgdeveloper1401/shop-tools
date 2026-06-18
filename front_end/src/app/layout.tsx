import type { Metadata } from 'next';
import Script from 'next/script';
import { mantineHtmlProps, MantineProvider } from '@mantine/core';
import mainTheme from '../component/modules/themes/mainTheme';
import '@mantine/carousel/styles.css';
import '@mantine/core/styles.css';
import '@mantine/dropzone/styles.css';
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';

import './globals.css';

export const metadata: Metadata = {
  title:
    'جی‌اس تولز | خرید ابزار و قیمت ابزارآلات ساختمانی و صنعتی، دستی و برقی',
  description:
    'فروشگاه اینترنتی جی‌اس تولز؛ فروشگاه انواع ابزارآلات صنعتی، برقی، دستی، ابزار کارگاهی، ابزار دقیق و لوازم جانبی در تبریز و سراسر ایران.',
  keywords: [
    'جی‌اس تولز',
    'GS Tools',
    'فروشگاه ابزارآلات',
    'ابزار برقی',
    'ابزار دستی',
    'ابزار صنعتی',
    'ابزار کارگاهی',
    'ابزار دقیق',
    'ابزار رنگ آمیزی',
    'ابزار شارژی',
    'لوازم جانبی ابزار',
    'فروش آنلاین ابزار',
    'ابزار در تبریز',
    'ابزارآلات صنعتی ایران',
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
    title: 'جی‌اس تولز | فروشگاه ابزارآلات صنعتی و دستی',
    description:
      'خرید آنلاین ابزارآلات حرفه‌ای در جی‌اس تولز؛ ابزار برقی، دستی، صنعتی و ابزار دقیق با ضمانت کیفیت.',
    url: 'https://gs-tools.ir',
    siteName: 'جی‌اس تولز',
    type: 'website',
    images: [
      {
        url: 'https://gs-tools.ir/images/home/logo.png',
        width: 1200,
        height: 630,
        alt: 'لوگوی جی‌اس تولز',
      },
    ],
    locale: 'fa_IR',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'جی‌اس تولز | فروشگاه ابزارآلات صنعتی',
    description:
      'ابزارآلات برقی، دستی، صنعتی و ابزار دقیق را در جی‌اس تولز با کیفیت بالا خرید کنید.',
    images: ['https://gs-tools.ir/images/home/logo.png'],
  },
  alternates: {
    canonical: 'https://gs-tools.ir',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'جی‌اس تولز',
  alternateName: ['gs tools', 'فروشگاه ابزارآلات جی‌اس تولز', 'خرید ابزار'],
  url: 'https://gs-tools.ir',
  logo: 'https://gs-tools.ir/images/home/logo.png',
  // sameAs: [
  // 'https://www.instagram.com/gs_tools2024',
  // 'https://t.me/Garmasa',
  // ],
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
    addressCountry: 'ایران',
  },
  '@graph': [
    {
      '@type': 'WebSite',
      name: 'جی‌اس تولز',
      url: 'https://gs-tools.ir',
      potentialAction: {
        '@type': 'SearchAction',
        target: 'https://gs-tools.ir/?s={search_term_string}',
        'query-input': 'required name=search_term_string',
      },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl" {...mantineHtmlProps}>
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=5"
        />

        <link
          rel="preload"
          href="/fonts/Dana/woff2/DanaFaNum-Regular.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/Dana/woff2/Dana-Regular.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/Dana/woff2/DanaFaNum-DemiBold.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </head>
      <body>
        <MantineProvider theme={mainTheme}>{children}</MantineProvider>
        <Script
          id="organization-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </body>
    </html>
  );
}
