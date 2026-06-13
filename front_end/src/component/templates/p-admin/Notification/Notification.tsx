'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { Notifications } from '@mantine/notifications';
import { notifications } from '@mantine/notifications';
import { Loader } from '@mantine/core';

import { getTimeAgo } from '@/utils/dateConvertUtils';
import TickSingleIcon from '@/component/modules/icons/TickSingle.icon';
import TickDoubleIcon from '@/component/modules/icons/TickDouble.icon';

import {
  getNotificationApi,
  INotification,
  submitEditNotificationApi,
} from '@/data/server_request/dashboard/notification';
import { PaginationWithDataType } from '@/data/server_request/dashboard/product';

import styles from './Notification.module.css';

const NotificationSection = () => {
  const notifRef = useRef<HTMLDivElement | null>(null);

  const [readCount, setReadCount] = useState(0);
  const [unreadCount, setUnreadCount] = useState(0);

  const [isReadNotif, setIsReadNotif] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [notificationData, setNotificationData] =
    useState<PaginationWithDataType<INotification>>();

  const callGetNotification = async (page: number) => {
    try {
      setLoading(true);
      const result = await getNotificationApi(page, isReadNotif);

      if (page === 1) {
        setNotificationData(result);
      } else {
        setNotificationData((prev) =>
          prev
            ? {
                ...result,
                results: [...prev.results, ...result.results],
              }
            : result,
        );
      }

      setHasMore(!!result.next);
      setLoading(false);

      const readNotifications = result.results.filter(
        (item) => item.is_read,
      ).length;
      const unreadNotifications = result.results.length - readNotifications;

      setReadCount(readNotifications);
      setUnreadCount(unreadNotifications);
    } catch (error) {
      setLoading(false);
    }
  };

  useEffect(() => {
    setCurrentPage(1);
    setNotificationData(undefined);
    setHasMore(true);
    callGetNotification(1);
  }, [isReadNotif]);

  useEffect(() => {
    const handleScroll = () => {
      if (!notifRef.current || !hasMore || loading) return;
      const { scrollTop, scrollHeight, clientHeight } = notifRef.current;
      if (scrollTop + clientHeight >= scrollHeight - 50) {
        const nextPage = currentPage + 1;
        setCurrentPage(nextPage);
        callGetNotification(nextPage);
      }
    };

    const currentRef = notifRef.current;
    currentRef?.addEventListener('scroll', handleScroll);

    return () => {
      currentRef?.removeEventListener('scroll', handleScroll);
    };
  }, [currentPage, hasMore, loading]);

  const handleMarkAsRead = async (notifId: number) => {
    const value = {
      is_read: true,
    };

    try {
      const result = await submitEditNotificationApi(notifId, value);
      if (result.status === 200) {
        callGetNotification(1);
        notifications.show({
          title: 'موفقیت آمیز',
          message: 'نوتیف به حالت خوانده شده تغییر داده شد.',
          radius: 'md',
          color: 'violet',
          icon: <TickSingleIcon />,
        });
      }

      setNotificationData((prev) =>
        prev
          ? {
              ...prev,
              results: prev.results.filter((item) => item.id !== notifId),
            }
          : prev,
      );
    } catch (error) {
      notifications.show({
        title: 'خطا',
        message: 'با خطا مواجه شد.',
        radius: 'md',
        color: 'violet',
        icon: <TickSingleIcon />,
      });
    }
  };

  const handleMarkAsUnRead = async (notifId: number) => {
    const value = {
      is_read: false,
    };

    try {
      const result = await submitEditNotificationApi(notifId, value);
      if (result.status === 200) {
        notifications.show({
          title: 'موفقیت آمیز',
          message: 'نوتیف به حالت خوانده نشده تغییر داده شد.',
          radius: 'md',
          color: 'violet',
          icon: <TickSingleIcon />,
        });
      }

      setNotificationData((prev) =>
        prev
          ? {
              ...prev,
              results: prev.results.filter((item) => item.id !== notifId),
            }
          : prev,
      );
    } catch (error) {
      notifications.show({
        title: 'خطا',
        message: 'با خطا مواجه شد.',
        radius: 'md',
        color: 'violet',
        icon: <TickSingleIcon />,
      });
    }
  };

  const notifSliceHanlder = (link: string) => {
    const arr = link.split('/');
    const [category_id, product_id, comment_id] = arr.map((item) => {
      const parts = item.split(':');
      return Number(parts[parts.length - 1]);
    });

    return { category_id, product_id, comment_id };
  };

  return (
    <div className={styles.notifMain}>
      <div className={styles.nameSection}>
        <span>پیام‌های مــــن</span>
        <Notifications />
      </div>

      <div className={styles.notifList}>
        <ul>
          <li
            className={`${styles.notifItem} ${
              !isReadNotif ? styles.active : ''
            }`}
            onClick={() => setIsReadNotif(false)}
          >
            پیام‌های خوانده نشده ({unreadCount})
          </li>
          <li
            className={`${styles.notifItem} ${
              isReadNotif ? styles.active : ''
            }`}
            onClick={() => setIsReadNotif(true)}
          >
            پیام‌های خوانده شده ({readCount})
          </li>
        </ul>
      </div>

      <div className={styles.notifContents} ref={notifRef}>
        {notificationData?.results.length ? (
          notificationData.results.map((item) => (
            <div className={styles.notifContent} key={item.id}>
              <div className={styles.notifContentTitle}>
                <div className={styles.notifContentTitleRight}>
                  {!item.is_read ? (
                    <button onClick={() => handleMarkAsRead(item.id)}>
                      <TickSingleIcon className={styles.singleTick} />
                    </button>
                  ) : (
                    <button onClick={() => handleMarkAsUnRead(item.id)}>
                      <TickDoubleIcon className={styles.singleTick} />
                    </button>
                  )}

                  {item.notif_type === 'product_comment_user' &&
                    (() => {
                      const { category_id, product_id, comment_id } =
                        notifSliceHanlder(item.notifi_redirect_url);
                      return (
                        <div>
                          <Link
                            href={`/product/${product_id}/${category_id}/کامنت`}
                          >
                            <span className={styles.redirect_btn}>
                              مشاهده نظر
                            </span>
                          </Link>
                        </div>
                      );
                    })()}
                </div>
                <span className={styles.date}>
                  {getTimeAgo(item.created_at)}
                </span>
              </div>
              <div className={styles.notifContentDesc}>
                <p>{item.body}</p>
              </div>
            </div>
          ))
        ) : loading ? (
          <div className={styles.loading}>
            <Loader size="sm" color="red" />
          </div>
        ) : (
          <div className={styles.notFound}>پیام جدیدی وجود ندارد!</div>
        )}
        {loading && currentPage > 1 && (
          <div className={styles.loading}>
            <Loader size="sm" color="red" />
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationSection;
