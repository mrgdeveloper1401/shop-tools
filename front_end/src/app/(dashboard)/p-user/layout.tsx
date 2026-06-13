import { ReactNode } from 'react';

import Navbar from '@/component/templates/index/Navbar/Navbar';
import NavbarCategory from '@/component/templates/index/NavbarCategory/NavbarCategory';
import Footer from '@/component/templates/index/Footer/Footer';
import Sidebar from './Sidebar/Sidebar';

import s from './layout.module.css';
const data = [
  { name: 'خانه', href: '/' },
  { name: 'فروشگاه', href: '/tools-shop' },
  { name: 'سفارشات', href: '/p-user' },
  { name: 'آدرس', href: '/p-user/address' },
  { name: 'پروفایل', href: '/p-user/profile' },
  { name: 'تماس با ما', href: '/contact-us' },
];

export default function SidebarLayout({
  children,
}: {
  children: ReactNode;
}): JSX.Element {
  return (
    <>
      <Navbar data={data} />
      <NavbarCategory />
      <div className={s.content}>
        <div className={s.right}>
          <Sidebar />
        </div>
        <div className={s.left}>{children}</div>
      </div>
      <Footer />
    </>
  );
}
