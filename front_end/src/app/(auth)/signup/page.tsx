import SignUp from '@/component/templates/auth/SignUp/SignUp';
import { Metadata } from 'next';
import Script from 'next/script';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'ثبت‌نام در جی‌اس تولز | ایجاد حساب کاربری جدید',
  description:
    'با ثبت‌نام در جی‌اس تولز از خدمات ویژه، تخفیف‌ها و پیگیری سفارش‌ها بهره‌مند شوید. ایجاد حساب کاربری فقط در چند ثانیه!',
  keywords: [
    'ثبت‌نام',
    'عضویت',
    'ثبت‌نام جی‌اس تولز',
    'ایجاد حساب کاربری',
    'GS Tools signup',
    'عضو شدن در فروشگاه ابزار',
  ],
  openGraph: {
    title: 'ثبت‌نام در جی‌اس تولز | ایجاد حساب جدید',
    description:
      'عضویت سریع در فروشگاه جی‌اس تولز و دسترسی به امکانات خرید آنلاین، تخفیف‌ها و پشتیبانی اختصاصی.',
    url: 'https://gs-tools.ir/signup',
    siteName: 'جی‌اس تولز',
    type: 'website',
    locale: 'fa_IR',
  },
  alternates: { canonical: 'https://gs-tools.ir/signup' },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'RegisterAction',
  name: 'ثبت‌نام در جی‌اس تولز',
  description: 'صفحه ثبت‌نام برای ایجاد حساب کاربری جدید در جی‌اس تولز.',
  target: 'https://gs-tools.ir/signup',
};

const SignupPage = () => (
  <>
    <Suspense>
      <SignUp />
    </Suspense>
    <Script
      id="signup-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  </>
);
export default SignupPage;
