import ProductsSection from '@/component/templates/p-admin/Products/Products';
import { Suspense } from 'react';

const ProductsPage = () => (
  <Suspense>
    <ProductsSection />
  </Suspense>
);

export default ProductsPage;
