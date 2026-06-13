import LocationIcon from '@/component/modules/icons/Location.icon';
import PhoneIcon from '@/component/modules/icons/Phone.icon';
import TelegramIcon from '@/component/modules/icons/Telegram.icon';
import TelegramFilledIcon from '@/component/modules/icons/TelegramFilled.icon';
import InstagramIcon from '@/component/modules/icons/Instagram.icon';
import WhatsAppIcon from '@/component/modules/icons/WhatsApp.icon';

import s from './ContactUs.module.css';

const ContactUs = () => {
  return (
    <section className={s.container_cotanct}>
      <div className={s.content}>
        <div className={s.box}>
          <div className={s.top}>
            <div>
              <PhoneIcon />
            </div>
            <h1>تلفن تماس</h1>
          </div>
          <div className={s.bootom}>
            <h2 className={s.bootom_top}>شنبه تا پنجشنبه از ساعت 8 الی 10شب</h2>
            <h2 className={s.bootom_botom}>
              <a href="tel:04133817463"> 041-33817463</a>
            </h2>
          </div>
        </div>
        <div className={s.box}>
          <div className={s.top}>
            <div>
              <LocationIcon />
            </div>
            <h1>آدرس ما</h1>
          </div>
          <div className={s.bootom}>
            <h2 className={s.bootom_top}>ما کجا هستیم ؟</h2>
            <h2 className={s.location}>تبریز – میرداماد روبروی مجتمع ماهکار</h2>
          </div>
        </div>
        <div className={s.box}>
          <div className={s.top}>
            <div>
              <LocationIcon />
            </div>
            <h1>آدرس دفتر مرکزی</h1>
          </div>
          <div className={s.bootom}>
            <h2 className={s.location}>
              تبریز - ائل گلی ، خیابان آبیاری ، بلوار شهید باکری ، ستاره امید
              ساختمان پردیس ، عطائی
            </h2>
          </div>
        </div>
        <div className={s.box}>
          <div className={s.top}>
            <div>
              <TelegramFilledIcon />
            </div>
            <h1>صفحات مجازی </h1>
          </div>
          <a target="_blank" href="https://t.me/Garmasa" className={s.social}>
            <TelegramIcon className="text-[22px]" />
            <h2 className={s.location}>:تلگرام</h2>
            <h2 className={s.location}>@Garmasa</h2>
          </a>
          <a
            target="_blank"
            href="https://www.instagram.com/garmasazan2024?igsh=ZjkybmJudTF0OGFs"
            className={s.social}
          >
            <InstagramIcon className="text-[22px]" />
            <h2 className={s.location}>:اینستاگرام</h2>
            <h2 className={s.location}>gs_tools2024</h2>
          </a>
          <a
            target="_blank"
            href="https://wa.me/+989228168388"
            className={s.social}
          >
            <WhatsAppIcon className="text-[22px]" />
            <h2 className={s.location}>:واتساپ</h2>
            <h2 className={s.location}>09228168388</h2>
          </a>
        </div>
      </div>
    </section>
  );
};
export default ContactUs;
