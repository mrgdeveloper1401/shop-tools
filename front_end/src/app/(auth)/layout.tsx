import { ReactNode } from 'react';
import Footer from '@/component/templates/index/Footer/Footer';
import DetailInfo from '@/component/modules/DetailInfo/DetailInfo';

export default function SidebarLayout({
  children,
}: {
  children: ReactNode;
}): JSX.Element {
  return (
    <>
      {children}
      <DetailInfo />
      <Footer />
    </>
  );
}
