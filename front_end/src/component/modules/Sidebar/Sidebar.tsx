'use client';

import { useRouter } from 'next/navigation';

import Swal from 'sweetalert2';

import HomeIcon from '../icons/Home.icon';
import LogoutIcon from '../icons/Logout.icon';
import CategoryIcon from '../icons/Category.icon';
import ShopIcon from '../icons/Shop.icon';
import TicketIcon from '../icons/Ticket.icon';
import UserIcon from '../icons/User.icon';
import CoupunIcon from '../icons/Coupun.icon';
import TruckIcon from '../icons/TruckCar.icon';
import SellIcon from '../icons/Sell.icon';
import ArticleIcon from '../icons/Article.icon';
import SearchInputIcon from '../icons/SearchInput.icon';

import { SidebarLinksGroup } from '../SidebarLinksGroup/SidebarLinksGroup';
import { logout } from '../../../utils/logout';

import styles from './Sidebar.module.css';
import Link from 'next/link';

const mockdata = [
  {
    label: 'پیشخوان',
    icon: <HomeIcon />,
    links: [
      { label: 'مشاهده سفارشات', link: '/p-admin/orders' },
      { label: 'نمودار فروش', link: '/p-admin' },
    ],
  },

  {
    label: 'دسته بندی',
    icon: <CategoryIcon />,
    links: [{ label: 'همه دسته بندی ها ', link: '/p-admin/category/' }],
  },
  {
    label: 'محصولات',
    icon: <ShopIcon />,
    links: [
      { label: 'همه محصولات', link: '/p-admin/product' },
      { label: 'تگ ها', link: '/p-admin/product/tag' },
      { label: 'برندها', link: '/p-admin/brands' },
      { label: 'ویژگی ها', link: '/p-admin/attribute-key' },
      { label: 'باسلام', link: '/p-admin/ba-salam' },
    ],
  },
  {
    label: 'تیکت ها',
    icon: <TicketIcon />,
    links: [{ label: 'مشاهده تیکت ها', link: '/p-admin/tickets' }],
  },
  {
    label: 'کاربران',
    icon: <UserIcon width="1.2em" height="1.2em" />,
    links: [
      { label: 'همه کاربران', link: '/p-admin/users' },
      { label: 'ایجاد کاربر', link: '/p-admin/users/register' },
    ],
  },
  {
    label: 'کد تخفیف',
    icon: <CoupunIcon />,
    links: [{ label: 'ایجاد کد تخفیف', link: '/p-admin/coupon' }],
  },
  {
    label: 'حمل و نقل',
    icon: <TruckIcon fill="#228be6" width="1.5em" />,
    links: [{ label: 'ایجاد حمل و نقل', link: '/p-admin/shipping' }],
  },

  {
    label: 'بنرها',
    icon: <SellIcon />,
    links: [
      { label: 'ایجاد بنر اطلاعیه', link: '/p-admin/banner' },
      { label: 'ایجاد بنر صفحه', link: '/p-admin/banner-landing' },
    ],
  },

  {
    label: 'بلاگ',
    icon: <ArticleIcon strokeWidth={0.2} width="1.5em" height="1.5em" />,
    links: [
      { label: 'وبلاگ', link: '/p-admin/blogs' },
      { label: 'عکس ها', link: '/p-admin/catalog' },
    ],
  },
  {
    label: 'سایت مپ',
    icon: <SearchInputIcon />,
    links: [{ label: 'سایت مپ', link: '/p-admin/sitemap' }],
  },
];

export function Sidebar() {
  const links = mockdata.map((item) => (
    <SidebarLinksGroup {...item} key={item.label} />
  ));
  const router = useRouter();

  const logoutHandler = () => {
    Swal.fire({
      title: 'آیا از خارج مطمئن هستید؟',
      icon: 'warning',
      confirmButtonText: 'تایید',
      cancelButtonText: 'لغو',
      showCancelButton: true,
      showCloseButton: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        await logout();
        router.push('/');
      }
    });
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.links}>
        <div className={styles.linksInner}>{links}</div>
      </div>

      <button className={styles.footerBackBtn}>
        <Link href="/">
          <span>برگشت به صفجه اصلی</span>
        </Link>
      </button>

      <button className={styles.footerBTn} onClick={logoutHandler}>
        <LogoutIcon />
        <span>خارج شدن</span>
      </button>
    </nav>
  );
}
