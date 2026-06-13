import Orders from '@/component/templates/p-admin/Orders/Orders';
import { Suspense } from 'react';

const OrdersPage = () => (
  <Suspense>
    <Orders />
  </Suspense>
);
export default OrdersPage;
