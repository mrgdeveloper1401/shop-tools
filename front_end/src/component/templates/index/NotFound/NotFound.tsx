// import { getHomeBannerHaderApi } from '@/data/server_request/dashboard/banner';
// import Footer from '../Footer/Footer';
// import NavbarCategory from '../NavbarCategory/NavbarCategory';
// import Navbar from '../Navbar/Navbar';
// import PrimaryButton from '@/component/modules/PrimaryButton/Primary.button';
// import Link from 'next/link';

// const data = [
//   { name: 'خانه', href: '/' },
//   { name: 'فروشگاه', href: '/tools-shop' },
//   { name: 'بلاگ', href: '/blog' },
//   { name: 'تماس با ما', href: '/contact-us' },
// ];

// const NotFoundSection = () => {
//   return (
//     <>
//       <Navbar data={data} />
//       <NavbarCategory />
//       <section className="flex justify-center items-center gap-6 flex-col h-[200px]">
//         <p className="text-[25px]">صفحه ی شما یافت نشد!</p>
//         <Link href="/">
//           <PrimaryButton>بازگشت به صفحه ی اصلی</PrimaryButton>
//         </Link>
//       </section>
//       <Footer />
//     </>
//   );
// };
// export default NotFoundSection;


import { getHomeBannerHaderApi } from '@/data/server_request/dashboard/banner';
import Footer from '../Footer/Footer';
import NavbarCategory from '../NavbarCategory/NavbarCategory';
import Navbar from '../Navbar/Navbar';
import PrimaryButton from '@/component/modules/PrimaryButton/Primary.button';
import Link from 'next/link';

const data = [
  { name: 'خانه', href: '/' },
  { name: 'فروشگاه', href: '/tools-shop' },
  { name: 'بلاگ', href: '/blog' },
  { name: 'تماس با ما', href: '/contact-us' },
];

const NotFoundSection = () => {
  return (
    <>
      {/* <Navbar data={data} /> */}
      {/* <NavbarCategory /> */}
      <section className="flex justify-center items-center gap-6 flex-col h-[200px]">
        {/* <p className="text-[25px]">سایت در حال بروز رسانی می باشد</p> */}
        {/* <p className="text-[25px]">برای ثبت سفارش با ما تماس بگیرید</p> */}
        <Link href="/">
          <PrimaryButton>سایت در حال بروز رسانی می باشد</PrimaryButton>
        </Link>
      </section>
      {/* <Footer /> */}
    </>
  );
};
export default NotFoundSection;
