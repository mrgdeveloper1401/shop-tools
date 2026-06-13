import { Metadata } from 'next';
import { Suspense } from 'react';
import Script from 'next/script';
import LoginUserPass from '@/component/templates/auth/LoginUserPass/LoginUserPass';

export const metadata: Metadata = {
  title: 'ورود با رمز عبور | جی‌اس تولز',
  description:
    'با وارد کردن رمز عبور حساب خود به فروشگاه جی‌اس تولز وارد شوید و از امکانات خرید آنلاین استفاده کنید.',
  keywords: [
    'ورود با رمز عبور',
    'ورود کاربران',
    'جی‌اس تولز لاگین',
    'GS Tools password login',
  ],
  openGraph: {
    title: 'ورود با رمز عبور | جی‌اس تولز',
    description:
      'ورود سریع کاربران جی‌اس تولز از طریق رمز عبور برای دسترسی به حساب کاربری.',
    url: 'https://gs-tools.ir/login-password',
    siteName: 'جی‌اس تولز',
    type: 'website',
    locale: 'fa_IR',
  },
  alternates: { canonical: 'https://gs-tools.ir/login-password' },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'LoginAction',
  name: 'ورود با رمز عبور در جی‌اس تولز',
  description:
    'صفحه ورود کاربران جی‌اس تولز با استفاده از رمز عبور برای دسترسی به حساب.',
  target: 'https://gs-tools.ir/login-password',
};

const LoginPage = () => (
  <>
    <Suspense>
      <LoginUserPass />
    </Suspense>
    <Script
      id="login-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  </>
);
export default LoginPage;
