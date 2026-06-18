import { ReactNode } from 'react';
import { Metadata } from 'next';
import Footer from '@/component/templates/index/Footer/Footer';
import Navbar from '@/component/templates/index/Navbar/Navbar';
import NavbarCategory from '@/component/templates/index/NavbarCategory/NavbarCategory';
import BannerHeader from '@/component/templates/index/BannerHeader/BannerHeader';
import DetailInfo from '@/component/modules/DetailInfo/DetailInfo';
import { notFound } from 'next/navigation';

const data = [
  { name: 'خانه', href: '/' },
  { name: 'فروشگاه', href: '/tools-shop' },
  { name: 'بلاگ', href: '/blog' },
  { name: 'تماس با ما', href: '/contact-us' },
];

export const metadata: Metadata = {
  title: 'جی اس تولز | فروشگاه اینترنتی تولز آلات صنعتی، دستی و برقی',
  description:
    'جی اس تولز، فروشگاه تخصصی تولزآلات صنعتی، برقی و دستی با ارسال سریع، ضمانت اصالت کالا و قیمت مناسب. تجربه‌ی خرید آسان تولز با پشتیبانی حرفه‌ای.',
  keywords: [
    'خرید تولز',
    'فروشگاه تولز',
    'تولز برقی',
    'تولز دستی',
    'تولز صنعتی',
    'فروشگاه اینترنتی تولز',
    'جی اس تولز',
    'تولز نجاری',
    'تولز تخصصی',
    'تخفیف تولز',
  ],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'فروشگاه اینترنتی تولز جی اس تولز | خرید تولز با بهترین قیمت',
    description:
      'فروشگاه آنلاین جی اس تولز؛ مرجع خرید تولزآلات با کیفیت و قیمت مناسب. ارسال سریع، گارانتی معتبر و پشتیبانی مطمئن.',
    url: 'https://gs-tools.ir',
    type: 'website',
    siteName: 'جی اس تولز | GS Tools',
  },
};

export default function SidebarLayout({
  children,
}: {
  children: ReactNode;
}): JSX.Element {
  return notFound()
  // return (
  //   <>
  //     <header>
  //       <BannerHeader />
  //       <Navbar data={data} />
  //       <NavbarCategory />
  //     </header>
  //     <main className="bg-[#FCFCFC]">
  //       {children}
  //       <DetailInfo />
  //     </main>
  //     <Footer />
  //   </>
  // ); 
}
