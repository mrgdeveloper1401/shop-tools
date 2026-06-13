import Orders from '@/component/templates/p-user/Orders/Orders';
import { Suspense } from 'react';

const UserPage = () => (
  <Suspense>
    <Orders />
  </Suspense>
);
export default UserPage;
