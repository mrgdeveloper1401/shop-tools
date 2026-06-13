import ShowDiscountButton from '@/component/modules/ShowDiscountButton/ShowDiscountButton';
import BannerList from '@/component/templates/index/BannerList/BannerList';
import BestBrands from '@/component/templates/index/BestBrands/BestBrands';
import BestProduct from '@/component/templates/index/BestProduct/BestProduct';
import BestSellProduct from '@/component/templates/index/BestSellProduct/BestSellProduct';
import BlogLatestSlider from '@/component/templates/index/BlogLatestSlider/BlogLatestSlider';
import Category from '@/component/templates/index/Category/Category';
import CategoryProduct from '@/component/templates/index/CategoryProduct/CategoryProduct';
import CheapProduct from '@/component/templates/index/CheapProduct/CheapProduct';
import DiscountProduct from '@/component/templates/index/DiscountProduct/DiscountProduct';
import Landing from '@/component/templates/index/Landing/Landing';
import { getHomeBannerCarouselApi } from '@/data/server_request/dashboard/banner';

const Home = async () => {
  const bannerCarousel = await getHomeBannerCarouselApi();
  return (
    <>
      {/* <BlackFridaySection /> */}
      {/* <BannerList /> */}
      <Landing bannerCarousel={bannerCarousel} />
      {/* <CategoryProduct />  */}
      {/* <BestProduct /> */}
      <Category />
      <BestSellProduct />
      <DiscountProduct />
      <BestBrands />
      <CheapProduct />
      <BlogLatestSlider />
      <ShowDiscountButton />
    </>
  );
};
export default Home;
