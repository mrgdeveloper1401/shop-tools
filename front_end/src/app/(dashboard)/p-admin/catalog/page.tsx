import ImageCatalog from '@/component/templates/p-admin/ImageCatalog/ImageCatalog';
import { Suspense } from 'react';

const CatalogPage = () => (
  <Suspense>
    <ImageCatalog />
  </Suspense>
);

export default CatalogPage;
