import BlogCategory from '@/component/templates/p-admin/BlogsCategory/BlogsCategory';
import { Suspense } from 'react';

const pageBlogs = () => (
  <Suspense>
    <BlogCategory />
  </Suspense>
);
export default pageBlogs;
