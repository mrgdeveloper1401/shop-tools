'use client';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { useMediaQuery } from '@mantine/hooks';

import NotificationIcon from '../../../modules/icons/Notification.icon';
import MenuIcon from '../../../modules/icons/Menu.icon';

import styles from './Topbar.module.css';
import {
  getProfileApi,
  IProfile,
} from '@/data/server_request/dashboard/profile';
import NotificationSection from '../Notification/Notification';
import { Sidebar } from '@/component/modules/Sidebar/Sidebar';
import CloseIcon from '@/component/modules/icons/Close.icon';
import {
  getNotificationApi,
  INotification,
} from '@/data/server_request/dashboard/notification';
import { PaginationWithDataType } from '@/data/server_request/dashboard/product';

const Topbar = () => {
  const matches = useMediaQuery('(min-width: 1024px)');
  const sidebarRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  const [isOpen, setIsOpen] = useState(false);
  const [isOpenNotif, setIsOpenNotif] = useState(false);
  const [profileData, setProfileData] = useState<IProfile>();

  const [notifData, setNotifData] =
    useState<PaginationWithDataType<INotification>>();

  const callGetNotifApi = async () => {
    try {
      const result = await getNotificationApi(1, false);
      setNotifData(result);
    } catch (error) {
      // console.log(error);
    }
  };

  const callGetProfileApi = async () => {
    try {
      const result = await getProfileApi();
      setProfileData(result[0]);
    } catch (error) {
      // console.log(error);
    }
  };

  useEffect(() => {
    callGetNotifApi();
    callGetProfileApi();
  }, []);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [setIsOpen]);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        notifRef.current &&
        !notifRef.current.contains(event.target as Node)
      ) {
        setIsOpenNotif(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [setIsOpenNotif]);

  return (
    <>
      <div
        ref={sidebarRef}
        className={`${styles.sidebarBase} ${isOpen ? styles.open : ''}`}
      >
        <button onClick={() => setIsOpen(false)}>
          <CloseIcon strokeWidth={1.5} className={styles.close} />
        </button>
        <Sidebar />
      </div>
      <div className={styles.topbar_container}>
        {!matches ? (
          <button className={styles.menu} onClick={() => setIsOpen(true)}>
            <MenuIcon />
          </button>
        ) : (
          <div className={styles.name}>
            <span>سلام {profileData?.first_name || 'ادمین'} خوش آمدی</span>
          </div>
        )}
        <div className={styles.left}>
          <div className={styles.notif_boxes} ref={notifRef}>
            <button
              className={styles.notifBtn}
              onClick={() => setIsOpenNotif(!isOpenNotif)}
            >
              <NotificationIcon />
              <div className={styles.notifCount}>
                {notifData?.results.length || 0}
              </div>
            </button>
            {isOpenNotif && (
              <div className={styles.notifCard}>
                <NotificationSection />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
export default Topbar;
