import ForgetPassword from '@/component/templates/auth/ForgetPassword/ForgetPassword';
import { Metadata } from 'next';
import Script from 'next/script';

export const metadata: Metadata = {
  title: 'بازیابی رمز عبور | جی‌اس تولز',
  description:
    'اگر رمز عبور خود را فراموش کرده‌اید، می‌توانید از طریق این صفحه رمز جدیدی برای حساب جی‌اس تولز خود تنظیم کنید.',
  keywords: [
    'فراموشی رمز عبور',
    'بازیابی رمز',
    'ریست رمز جی‌اس تولز',
    'بازیابی پسورد',
    'GS Tools password reset',
  ],
  openGraph: {
    title: 'فراموشی رمز عبور | جی‌اس تولز',
    description:
      'با وارد کردن ایمیل یا شماره تلفن، لینک بازیابی رمز عبور برای شما ارسال می‌شود.',
    url: 'https://gs-tools.ir/forget-password',
    siteName: 'جی‌اس تولز',
    type: 'website',
    locale: 'fa_IR',
  },
  alternates: { canonical: 'https://gs-tools.ir/forget-password' },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'بازیابی رمز عبور',
  description:
    'صفحه بازیابی رمز عبور برای کاربران جی‌اس تولز جهت تنظیم رمز جدید.',
  url: 'https://gs-tools.ir/forget-password',
};

const ForgetPasswordPage = () => (
  <>
    <ForgetPassword />
    <Script
      id="forget-pass-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  </>
);
export default ForgetPasswordPage;
