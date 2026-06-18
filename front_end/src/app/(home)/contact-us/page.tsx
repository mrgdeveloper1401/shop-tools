import ContactUs from '@/component/templates/index/ContactUs/ContactUs';
import { Metadata } from 'next';
import Script from 'next/script';
export const metadata: Metadata = {
  title: 'تماس با ما | جی‌اس تولز ',
  description:
    'از طریق صفحه تماس با ما در جی‌اس تولز می‌توانید با تیم پشتیبانی و فروش در ارتباط باشید. شماره تماس، آدرس، شبکه‌های اجتماعی و ساعات کاری ما در این بخش قرار دارد.',
  keywords: [
    'تماس با ما',
    'جی‌اس تولز',
    'GS Tools',
    'پشتیبانی جی‌اس تولز',
    'آدرس فروشگاه ابزار',
    'شماره تماس جی‌اس تولز',
    'ارتباط با جی‌اس تولز',
    'فروشگاه ابزار در تبریز',
    'پشتیبانی مشتریان ابزارآلات',
    'خرید ابزار صنعتی تبریز',
    'واتساپ جی‌اس تولز',
    'اینستاگرام جی‌اس تولز',
    'تلگرام جی‌اس تولز',
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
    title: 'تماس با ما | جی‌اس تولز',
    description:
      'در این صفحه می‌توانید با تیم فروش و پشتیبانی جی‌اس تولز تماس بگیرید. اطلاعات تماس، آدرس فروشگاه و شبکه‌های اجتماعی در اختیار شماست.',
    url: 'https://gs-tools.ir/contact-us',
    siteName: 'جی‌اس تولز',
    type: 'website',
    locale: 'fa_IR',
    images: [
      {
        url: 'https://gs-tools.ir/images/home/logo.png',
        width: 1200,
        height: 630,
        alt: 'تماس با جی‌اس تولز',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'تماس با جی‌اس تولز | GS Tools',
    description:
      'برای ارتباط با تیم جی‌اس تولز از طریق شماره تماس، واتساپ یا شبکه‌های اجتماعی اقدام کنید.',
    images: ['https://gs-tools.ir/images/home/logo.png'],
  },
  alternates: {
    canonical: 'https://gs-tools.ir/contact-us',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'ContactPage',
  name: 'تماس با جی‌اس تولز',
  description:
    'اطلاعات تماس با فروشگاه جی‌اس تولز شامل شماره تلفن، آدرس فروشگاه، واتساپ، تلگرام و اینستاگرام رسمی.',
  url: 'https://gs-tools.ir/contact-us',
  publisher: {
    '@type': 'Organization',
    name: 'جی‌اس تولز',
    url: 'https://gs-tools.ir',
    logo: 'https://gs-tools.ir/images/home/logo.png',
    contactPoint: [
      {
        '@type': 'ContactPoint',
        telephone: '04133810519',
        contactType: 'customer support',
        areaServed: 'IR',
        availableLanguage: ['fa', 'en'],
      },
      {
        '@type': 'ContactPoint',
        telephone: '+989228168388',
        contactType: 'WhatsApp',
        areaServed: 'IR',
      },
    ],
    sameAs: [
      'https://www.instagram.com/garmasazan2024',
      'https://t.me/Garmasa',
      'https://wa.me/+989228168388',
    ],
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'تبریز',
      addressRegion: 'آذربایجان شرقی',
      streetAddress: 'تبریز – میرداماد جنب تیپاکس',
      addressCountry: 'ایران',
    },
  },
};

const ContactUsPage = () => (
  <>
    <ContactUs />
    <Script
      id="contact-us-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  </>
);
export default ContactUsPage;
