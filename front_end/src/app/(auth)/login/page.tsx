import { Suspense } from 'react';
import Login from '@/component/templates/auth/Login/Login';
import { Metadata } from 'next';
import Script from 'next/script';

export const metadata: Metadata = {
  title: 'ورود به حساب کاربری | جی‌اس تولز',
  description:
    'برای خرید، پیگیری سفارش‌ها و مشاهده تاریخچه خرید خود وارد حساب کاربری در جی‌اس تولز شوید.',
  keywords: [
    'ورود',
    'ورود به حساب',
    'ورود کاربر جی‌اس تولز',
    'GS Tools login',
    'حساب کاربری ابزار',
    'ورود فروشگاه ابزار',
  ],
  openGraph: {
    title: 'ورود به حساب کاربری | جی‌اس تولز',
    description:
      'با ورود به حساب کاربری، از امکانات ویژه جی‌اس تولز مانند پیگیری سفارش‌ها و خرید سریع بهره‌مند شوید.',
    url: 'https://gs-tools.ir/login',
    siteName: 'جی‌اس تولز',
    type: 'website',
    locale: 'fa_IR',
  },
  alternates: { canonical: 'https://gs-tools.ir/login' },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'ورود به حساب کاربری',
  description:
    'صفحه ورود کاربران به حساب جی‌اس تولز برای خرید و مشاهده سفارش‌ها.',
  url: 'https://gs-tools.ir/login',
};

const LoginPage = () => (
  <>
    <Suspense>
      <Login />
    </Suspense>
    <Script
      id="login-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  </>
);
export default LoginPage;
