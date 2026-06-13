import { getHomeBannerHaderApi } from '@/data/server_request/dashboard/banner';

const BannerHeader = async () => {
  const banner = await getHomeBannerHaderApi();
  if (banner.length === 0) {
    return null;
  }

  return (
    <div
      className={`flex justify-center flex-wrap items-center text-center sm:gap-10 gap-2 py-4 text-[16px] px-1 `}
      style={{
        backgroundColor: `${banner[0].background_color}`,
        color: `${banner[0].text_color}`,
      }}
    >
      <span className="font-DanaDemiBold sm:text-sm text-xs">
        {banner[0].header_title}
      </span>
      {/* {banner[0]?.images && (
        <div className={styles.bannerImage}>
          <Image
            objectFit="contain"
            src={banner[0].image}
            width={50}
            height={50}
            quality={100}
            priority
          />
        </div>
      )} */}
    </div>
  );
};
export default BannerHeader;
