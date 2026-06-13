import Link from 'next/link';
import Image from 'next/image';
import { Divider } from '@mantine/core';

import BoxIcon from '@/component/modules/icons/Box.icon';
import WarrantyIcon from '@/component/modules/icons/Warranty.icon';
import SupportIcon from '@/component/modules/icons/Support.icon';
import TruckIcon from '@/component/modules/icons/TruckCar.icon';
import TelegramIcon from '@/component/modules/icons/Telegram.icon';
import InstagramIcon from '@/component/modules/icons/Instagram.icon';
import HeartIcon from '@/component/modules/icons/Heart.icon';
import WhatsAppIcon from '@/component/modules/icons/WhatsApp.icon';

import styles from './Footer.module.css';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.support}>
        <div className={styles.support_bottom_container}>
          <div className={styles.support_bottom}>
            <div className={styles.support_bottom_right}>
              <h4>پشتیبانی</h4>
              <div className={styles.support_bottom_right_content}>
                <h4 className={styles.phone}>
                  <a
                    aria-label="شماره تماس فروشگاه ابزار - جی اس تولز"
                    href="tel:04133810519"
                  >
                    تلفن : 04133810519
                  </a>
                </h4>
                <div className=" md:block hidden w-[1px] h-[20px] bg-black"></div>
                <span>شنبه تا چهارشنبه ۸ الی ۲۱ - پنجشنبه 8 الی ۲۰:۳۰</span>
              </div>
            </div>
            <div className={styles.support_bottom_left}>
              <div className={styles.support_bottom_left_icons}>
                <TruckIcon />
                <h4>ارسال سریع کالا</h4>
              </div>
              <div className={styles.support_bottom_left_icons}>
                <BoxIcon />
                <h4>مهلت ۷ روز بازگشت کالا</h4>
              </div>
              <div className={styles.support_bottom_left_icons}>
                <WarrantyIcon />
                <h4>پشتیبانی تلفنی</h4>
              </div>
              <div className={styles.support_bottom_left_icons}>
                <SupportIcon />
                <h4>تضمین اصالت کالا</h4>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.footer_bootom}>
        <div className={styles.footer_container}>
          <div className={styles.footer_right}>
            <div className={styles.footer_right_box}>
              <h5>جی اس تولز</h5>
              <ul>
                <li>
                  <Link href="/tools-shop">فروشگاه</Link>
                </li>
                <li>
                  <Link href="/tools-shop?has_Discount=has_discount">
                    محصولات تخفیف دار
                  </Link>
                </li>
                <li>
                  <Link href="/blog">بلاگ</Link>
                </li>
                <li>
                  <Link href="/contact-us">تماس با ما</Link>
                </li>
              </ul>
            </div>

            <div className={styles.footer_right_social}>
              <h5>تماس با ما</h5>
              <span className={styles.social}>
                مارا در صفحات مجازی دنبال کنید
              </span>
              <ul className={styles.icon_box}>
                <li className={styles.icon}>
                  <a target="_blank" href="https://t.me/Garmasa">
                    <TelegramIcon style={{ marginRight: '2px' }} />
                    <span>تلگرام</span>
                  </a>
                </li>
                <li className={styles.icon}>
                  <a
                    target="_blank"
                    href="https://www.instagram.com/garmasazan2024?igsh=ZjkybmJudTF0OGFs"
                  >
                    <InstagramIcon />
                    <span>اینستاگرام</span>
                  </a>
                </li>

                <li className={styles.icon}>
                  <a target="_blank" href="https://wa.me/+989228168388">
                    <WhatsAppIcon width="1em" height="1em" />
                    <span>واتساپ</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className={styles.footer_left}>
            <div className={styles.footer_left_box}>
              <a
                href="https://trustseal.enamad.ir/?id=512237&Code=Z9Qrc3FCyBMdb1D2BHmZqrnigNyOqRkP"
                target="_blank"
                className="bg-slate-200 rounded-lg p-4 w-[120px] h-auto flex justify-center items-center"
              >
                <Image
                  src="/images/assets/enmad.png"
                  width={100}
                  height={100}
                  alt="enmad-gs-tools"
                />
              </a>
            </div>
          </div>
        </div>
        <Divider />
        <div className={styles.footer_bootom}>
          <a
            target="_blank"
            href="http://codeima.ir/"
            className={styles.codeima}
          >
            ساخته شده با عشق
            <p>"برنامه نویسی آکادمی کدیما"</p>
            <HeartIcon />
          </a>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
