import { useEffect, useState } from 'react';

const Countdown = () => {
  const getTargetDate = () => {
    const now = new Date();
    const target = new Date();

    target.setDate(now.getDate() + 4);
    target.setHours(23, 59, 59, 999);

    return target;
  };

  const [timeLeft, setTimeLeft] = useState(
    getTargetDate().getTime() - new Date().getTime(),
  );

  useEffect(() => {
    const interval = setInterval(() => {
      const diff = getTargetDate().getTime() - new Date().getTime();
      setTimeLeft(diff > 0 ? diff : 0);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);

    return {
      days: Math.floor(totalSeconds / (24 * 3600)),
      hours: Math.floor((totalSeconds % (24 * 3600)) / 3600),
      minutes: Math.floor((totalSeconds % 3600) / 60),
      seconds: totalSeconds % 60,
    };
  };

  const { days, hours, minutes, seconds } = formatTime(timeLeft);

  const TimeBox = ({ value, label }: { value: number; label: string }) => (
    <div className="flex flex-col items-center bg-white text-title rounded-2xl px-2 md:py-2 py-1 shadow-lg md:min-w-[90px] min-w-[50px]">
      <span className="md:text-xl text-md font-bold">
        {value.toString().padStart(2, '0')}
      </span>
      <span className="md:text-sm text-xs text-gray-400 mt-1">{label}</span>
    </div>
  );

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex gap-4">
        <TimeBox value={seconds} label="ثانیه" />
        <TimeBox value={minutes} label="دقیقه" />
        <TimeBox value={hours} label="ساعت" />
        <TimeBox value={days} label="روز" />
      </div>
    </div>
  );
};

export default Countdown;
