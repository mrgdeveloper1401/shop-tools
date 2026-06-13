import ResultPayment from '@/component/templates/index/ResultPayment/ResultPayment';
import { Metadata } from 'next';
import { Suspense } from 'react';
export const metadata: Metadata = {
  title: ' پرداخت نهایی | فروشگاه GS Tools',
  robots: {
    index: false,
    follow: false,
  },
};
const ResultPaymentPage = () => (
  <Suspense>
    <ResultPayment />
  </Suspense>
);
export default ResultPaymentPage;
