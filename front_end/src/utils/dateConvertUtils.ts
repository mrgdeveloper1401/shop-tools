import { DateObject } from 'react-multi-date-picker';
import gregorian from 'react-date-object/calendars/gregorian';
import gregorian_fa from 'react-date-object/locales/gregorian_fa';

const dateConvertUtils = (date: any, setFieldValue: any) => {
  const object = { date, format: 'YYYY-MM-DD' };

  const dateTime = new DateObject(object)
    .convert(gregorian, gregorian_fa)
    .format()
    .replace(/[۰-۹]/g, (digit: string) =>
      String.fromCharCode(digit.charCodeAt(0) - 1728),
    );
  setFieldValue('birth_date', dateTime);
};

const dateConvertRangeUtils = (
  date: any,
  setFieldValue: any,
  start: string,
  end: string,
) => {
  const [first, second] = date;

  const dateTimeStart = new DateObject({
    date: first,
    format: 'YYYY-MM-DD',
  })
    .convert(gregorian, gregorian_fa)
    .format()
    .replace(/[۰-۹]/g, (digit: string) =>
      String.fromCharCode(digit.charCodeAt(0) - 1728),
    );

  const dateTimeEnd = new DateObject({
    date: second,
    format: 'YYYY-MM-DD',
  })
    .add(1, 'day')
    .convert(gregorian, gregorian_fa)
    .format()
    .replace(/[۰-۹]/g, (digit: string) =>
      String.fromCharCode(digit.charCodeAt(0) - 1728),
    );

  setFieldValue(start, dateTimeStart);
  setFieldValue(end, dateTimeEnd);
};

const convertToJalali = (time: string): string => {
  return new Date(time.slice(0, 10)).toLocaleDateString('fa-IR');
};

const MonthNames = [
  'فروردین',
  'اردیبهشت',
  'خرداد',
  'تیر',
  'مرداد',
  'شهریور',
  'مهر',
  'آبان',
  'آذر',
  'دی',
  'بهمن',
  'اسفند',
];

const convertToJalaliMonth = (time: string): string => {
  const month = new Date(time.slice(0, 10))
    .toLocaleDateString('fa-IR')
    .replace(/[۰-۹]/g, (digit) => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(digit)))
    .slice(5, 6);

  return MonthNames[parseInt(month) - 1];
};

const getJalaliDayNameInEnglish = (time: string): string => {
  const jalaliDayName = new Date(time.slice(0, 10)).toLocaleDateString(
    'fa-IR',
    {
      weekday: 'long',
    },
  );

  return jalaliDayName;
};

const formatPersianCreatedAt = (createdAt: string) => {
  const now = new Date();
  const createdTime = new Date(createdAt);
  const differenceInMs = now.getTime() - createdTime.getTime();
  const differenceInHours = Math.floor(differenceInMs / (1000 * 60 * 60));

  if (differenceInHours < 24) {
    return `${differenceInHours} ساعت پیش`;
  } else {
    const formatter = new Intl.DateTimeFormat('fa-IR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
    return formatter.format(createdTime);
  }
};

const fa = {
  locale: 'fa',
  long: {
    year: { past: '{0} سال پیش', future: 'در {0} سال' },
    month: { past: '{0} ماه پیش', future: 'در {0} ماه' },
    week: { past: '{0} هفته پیش', future: 'در {0} هفته' },
    day: { past: '{0} روز پیش', future: 'در {0} روز' },
    hour: { past: '{0} ساعت پیش', future: 'در {0} ساعت' },
    minute: { past: '{0} دقیقه پیش', future: 'در {0} دقیقه' },
    second: { past: '{0} ثانیه پیش', future: 'در {0} ثانیه' },
  },
};

import TimeAgo from 'javascript-time-ago';
TimeAgo.addLocale(fa as any);
const timeAgo = new TimeAgo('fa');

const getTimeAgo = (date: Date | string) => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return timeAgo.format(dateObj);
};

const getPastDate = (daysAgo: number): string => {
  const date = new Date();
  date.setDate(date.getDate() - (daysAgo - 1));

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

function convertUTCToIranISO(utcDate: string): string {
  const date = new Date(utcDate);

  const tehranFormatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Tehran',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });

  const parts = tehranFormatter.formatToParts(date);
  const get = (type: string) =>
    parts.find((p) => p.type === type)?.value || '00';

  const iso = `${get('year')}-${get('month')}-${get('day')}T${get('hour')}:${get(
    'minute',
  )}:${get('second')}.000+03:30`;

  return iso;
}

export {
  dateConvertUtils,
  convertToJalali,
  convertToJalaliMonth,
  getJalaliDayNameInEnglish,
  dateConvertRangeUtils,
  formatPersianCreatedAt,
  getTimeAgo,
  getPastDate,
  convertUTCToIranISO,
};
