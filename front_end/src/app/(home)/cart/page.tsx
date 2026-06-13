import Cart from '@/component/templates/index/Cart/Cart';
import { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'تسویه حساب | فروشگاه GS Tools',
  robots: {
    index: false,
    follow: false,
  },
};
const CartPage = () => <Cart />;
export default CartPage;
