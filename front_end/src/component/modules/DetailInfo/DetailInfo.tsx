'use client';
import { useState } from 'react';

const DetailInfo = () => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="mt-48 bg-slate-100 rounded-[24px] sm:px-4 sm:py-4 py-2 max-w-5xl mx-auto px-4 relative">
      <h1 className="sm:text-[32px] text-[22px] text-center font-DanaExtraBold mb-6 bg-slate-200 rounded-[12px] text-gray-900">
        بهترین فروشگاه ابزار آلات و خرید ابزار آلات
      </h1>
      <h2 className="sm:text-[32px] text-[22px] font-DanaExtraBold mb-6 text-gray-900">
        ابزار چیست؟ راهنمای جامع خرید ابزار از جی‌اس تولز
      </h2>

      <div
        className={`relative overflow-hidden transition-all duration-500 ${
          expanded ? 'max-h-[7000px]' : 'max-h-[160px]'
        }`}
      >
        <div>
          <p className="text-gray-900  text-md leading-8 mb-6">
            ابزار به هر وسیله‌ای گفته می‌شود که برای انجام کارهای فنی، صنعتی یا
            خانگی طراحی شده و فرآیندها را سریع‌تر، دقیق‌تر و ساده‌تر می‌کند.
            ابزارها نقش واسطه یا تسهیل‌گر دارند و بدون آنها، انجام بسیاری از
            فعالیت‌ها دشوار یا حتی غیرممکن خواهد بود. از پیچ‌گوشتی و چکش ساده
            گرفته تا دریل برقی و اره زنجیری بنزینی، ابزارها در انواع مختلفی عرضه
            می‌شوند و در جی‌اس تولز می‌توانید مجموعه‌ای کامل از این محصولات را
            پیدا کنید.
          </p>
          <h2 className="text-xl font-DanaDemiBold mb-4 text-gray-900">
            انواع ابزار: کدام ابزار برای شما مناسب است؟
          </h2>
          <ul className="list-disc pr-8 text-gray-900  text-md leading-8 mb-6">
            <li>
              <strong>ابزار دستی:</strong> ابزارهای دستی با نیروی انسانی کار
              می‌کنند و برای کارهای سبک و دقیق مناسب‌اند. نمونه‌ها: پیچ‌گوشتی،
              چکش، انبر، آچار، اره دستی.
            </li>
            <li>
              <strong>ابزار برقی:</strong> ابزارهای برقی با برق یا باتری کار
              می‌کنند و سرعت و دقت بیشتری دارند. نمونه‌ها: دریل برقی، اره
              عمودبر، فرز، پیچ‌گوشتی شارژی.
            </li>
            <li>
              <strong>ابزار بادی:</strong> ابزارهای بادی از نیروی باد تغذیه
              می‌شوند و در صنایع سنگین کاربرد دارند. نمونه‌ها: میخکوب بادی،
              پیستوله بادی، کمپرسور هوا.
            </li>
            <li>
              <strong>ابزار بنزینی:</strong> ابزارهای بنزینی با سوخت کار می‌کنند
              و برای پروژه‌های سنگین مناسب‌اند. نمونه‌ها: اره زنجیری، موتور برق،
              علف‌زن.
            </li>
          </ul>
          <h2 className="text-xl font-DanaDemiBold mb-4 text-gray-900">
            ابزار آلات
          </h2>
          <ul className="list-disc pr-8 text-gray-900  text-md leading-8 mb-6">
            <li>
              <strong>ابزار خانگی:</strong> قدرت و دوام متوسط، مناسب برای
              استفاده کوتاه‌مدت، قیمت اقتصادی و ابعاد کوچک. مثال: دریل پیچ‌گوشتی
              شارژی سبک.
            </li>
            <li>
              <strong>ابزار صنعتی:</strong> کیفیت و دوام بالا، مناسب برای
              پروژه‌های سنگین، قیمت بالاتر و طراحی حرفه‌ای. مثال: دریل صنعتی،
              فرزهای حرفه‌ای.
            </li>
          </ul>
          <h2 className="text-xl font-DanaDemiBold mb-4 text-gray-900">
            نکات کلیدی برای خرید ابزار
          </h2>
          <ul className="list-disc pr-8 text-gray-900  text-md leading-8 mb-6">
            <li>
              نیاز خود را مشخص کنید: نوع پروژه و قدرت مورد نیاز ابزار را بررسی
              کنید.
            </li>
            <li>
              برند معتبر انتخاب کنید: دوام و کارایی بهتر و هزینه تعمیر کمتر.
            </li>
            <li>
              امکانات جانبی: ابزارهایی با قابلیت‌های اضافی کار شما را آسان‌تر
              می‌کنند.
            </li>
            <li>
              ایمنی: ابزارهای با استاندارد ایمنی بالا از حوادث جلوگیری می‌کنند.
            </li>
            <li>
              گارانتی و خدمات پس از فروش: به وجود گارانتی و پشتیبانی توجه کنید.
            </li>
          </ul>
          <h2 className="text-xl font-DanaDemiBold mb-4 text-gray-900">
            برندهای معتبر ابزار در جهان و ایران
          </h2>
          <p className="text-gray-900  text-md leading-8 mb-6">
            برندهای معتبر ابزار در جی‌اس تولز جی‌اس تولز مجموعه‌ای از بهترین
            برندهای جهانی و ایرانی را با ضمانت اصالت کالا ارائه می‌دهد: جهانی:
            دیوالت (DEWALT) ایرانی و آسیایی: اِکو (EKO)، رونیکس (RONIX)، توسن
            (TOSAN)، میکا (MIKA)، اوآسیس (OASIS)، دینگ‌چی (DINGQI)، ادون (EDON)،
            لیهو (LIHU)، کادکس (KADEX)، ولف (WOLF) اقتصادی‌ترین برندها: باس
            (BOSS)، رونیکس (RONIX)، توسن (TOSAN)، میکا (MIKA)، اوآسیس (OASIS)،
            دینگ‌چی (DINGQI)، ادون
          </p>
          <h2 className="text-xl font-DanaDemiBold mb-4 text-gray-900">
            ابزارهای پرکاربرد در جی‌اس تولز
          </h2>
          <ul className="list-disc pr-8 text-gray-900  text-md leading-8 mb-6">
            <li>ابزار دستی: پیچ‌گوشتی، آچار، انبر، جعبه بکس</li>
            <li>ابزار برقی: دریل، فرز، اره برقی، پیچ‌گوشتی شارژی</li>
            <li>ابزار بادی: میخکوب، پیستوله، کمپرسور هوا</li>
            <li>ابزار بنزینی: اره زنجیری، علف‌زن، موتور برق</li>
          </ul>
          <h2 className="text-xl font-DanaDemiBold mb-4 text-gray-900">
            چرا از جی‌اس تولز خرید کنید؟
          </h2>
          <ul className="list-disc pr-8 text-gray-900  text-md leading-8 mb-6">
            <li>
              تنوع بی‌نظیر: مجموعه کامل ابزارهای دستی، برقی، بادی و بنزینی
            </li>
            <li>کیفیت تضمین‌شده: برندهای معتبر با ضمانت اصالت</li>
            <li>ارسال سریع: تحویل مطمئن و سریع به سراسر ایران</li>
            <li>مشاوره تخصصی: راهنمایی برای انتخاب ابزار مناسب</li>
            <li>پشتیبانی قوی: خدمات پس از فروش و گارانتی معتبر</li>
          </ul>
          <h2 className="text-xl font-DanaDemiBold mb-4 text-gray-900">
            خرید ابزار برقی
          </h2>
          <h2 className="text-xl font-DanaDemiBold mb-4 text-gray-900">
            خرید ابزار
          </h2>
          <h2 className="text-xl font-DanaDemiBold mb-4 text-gray-900">
            خرید ابزار دستی
          </h2>
          <h2 className="text-xl font-DanaDemiBold mb-4 text-gray-900">
            خرید ابزار صنعتی
          </h2>
          <h2 className="text-xl font-DanaDemiBold mb-4 text-gray-900">
            خرید ابزار با بهترین قیمت و کیفیت
          </h2>
          <p className="text-gray-900  text-md leading-8 mb-6">
            اگر به دنبال خرید ابزار، ابزار برقی، ابزار دستی، ابزار صنعتی یا
            هستید، جی‌اس تولز بهترین گزینه برای شماست. با محصولات متنوع و
            باکیفیت، تجربه‌ای مطمئن از خرید آنلاین ابزار خواهید داشت. همین حالا
            از جی‌اس تولز بازدید کنید و ابزار مورد نیاز خود را با بهترین قیمت
            تهیه کنید!
          </p>
        </div>

        {!expanded && (
          <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-white to-transparent backdrop-blur-sm pointer-events-none"></div>
        )}
      </div>

      <div className="w-full flex justify-center mt-6 ">
        <button
          className="bg-primary rounded-[12px] px-4 py-2 text-white"
          onClick={() => setExpanded(!expanded)}
          aria-expanded={expanded}
        >
          {expanded ? 'بستن توضیحات' : 'مطالعه بیشتر'}
        </button>
      </div>
    </div>
  );
};

export default DetailInfo;
