import Link from 'next/link';

export default function ShowDiscountButton() {
  return (
    <div className="fixed bottom-2 right-0 w-full z-10">
      <Link href="/tools-shop">
        <div className="flex items-center justify-center p-4">
          <div className="relative w-full max-w-4xl">
            <div
              className="absolute inset-0 rounded-2xl
                bg-[#EE4242]
                border border-white/20
                shadow-2xl"
            ></div>

            <div className="relative flex items-center justify-evenly md:flex-row flex-col-reverse px-4 py-2 text-white">
              <div className="text-center">
                <span className="text-xl md:text-2xl text-white  font-extrabold leading-tight drop-shadow">
                  خرید محصولات اورجینال و تایید شده
                </span>
              </div>
              <div
                className=" backdrop-blur-md bg-white text-title  hover:bg-white/70 
                transition-all 
                rounded-full px-8 py-2 
                border border-white/30 
                cursor-pointer"
              >
                <span className="text-md md:text-md font-bold ">
                  🔔 مشاهده محصولات
                </span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
