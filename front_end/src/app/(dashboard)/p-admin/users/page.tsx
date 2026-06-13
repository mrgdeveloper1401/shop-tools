import Users from '@/component/templates/p-admin/Users/Users';
import { Suspense } from 'react';

const UsersPage = () => (
  <Suspense>
    <Users />
  </Suspense>
);

export default UsersPage;
