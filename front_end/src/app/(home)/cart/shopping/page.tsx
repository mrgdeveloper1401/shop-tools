import { Metadata } from 'next';
import Shopping from '@/component/templates/index/Shopping/Shopping';
export const metadata: Metadata = {
  title: 'تسویه حساب | فروشگاه GS Tools',
  robots: {
    index: false,
    follow: false,
  },
};
const ShoppingPage = () => <Shopping />;
export default ShoppingPage;
