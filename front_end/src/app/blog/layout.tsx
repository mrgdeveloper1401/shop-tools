import { ReactNode } from 'react';
import Navbar from '@/component/templates/index/Navbar/Navbar';
import NavbarCategory from '@/component/templates/index/NavbarCategory/NavbarCategory';
import Footer from '@/component/templates/index/Footer/Footer';
import BannerHeader from '@/component/templates/index/BannerHeader/BannerHeader';

const data = [
  { name: 'خانه', href: '/' },
  { name: 'فروشگاه', href: '/tools-shop' },
  { name: 'بلاگ', href: '/blog' },
  { name: 'تماس با ما', href: '/contact-us' },
];

export default function BlogHome({
  children,
}: {
  children: ReactNode;
}): JSX.Element {
  return (
    <>
      <header>
        <BannerHeader />
        <Navbar data={data} />
        <NavbarCategory />
      </header>
      <main>{children}</main>
      <Footer />
    </>
  );
}
