'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import Swal from 'sweetalert2';
import ShopIcon from '@/component/modules/icons/Shop.icon';
import UserIcon from '@/component/modules/icons/User.icon';
import LogoutIcon from '@/component/modules/icons/Logout.icon';
import AddressIcon from '@/component/modules/icons/Addres.icon';
import TicketIcon from '@/component/modules/icons/Ticket.icon';
import ShopLocationIcon from '@/component/modules/icons/ShopLocation.icon';

import { logout } from '@/utils/logout';
import s from './Sidebar.module.css';

const Sidebar = () => {
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
        logout();
        router.push('/');
      }
    });
  };
  return (
    <div className={s.right_content}>
      <Link href="/">
        <div>
          <span>فروشگاه</span>
          <ShopLocationIcon />
        </div>
      </Link>
      <Link href="/p-user">
        <div>
          <span>سفارشات</span>
          <ShopIcon />
        </div>
      </Link>
      <Link href="/p-user/tickets">
        <div>
          <span>تیکت</span>
          <TicketIcon />
        </div>
      </Link>

      <Link href="/p-user/address">
        <div>
          <span>آدرس</span>
          <AddressIcon />
        </div>
      </Link>
      <Link href="/p-user/profile">
        <div>
          <span>اطلاعات حساب</span>
          <UserIcon />
        </div>
      </Link>
      <button onClick={logoutHandler}>
        <div>
          <span>خروج از حساب</span>
          <LogoutIcon />
        </div>
      </button>
    </div>
  );
};
export default Sidebar;
