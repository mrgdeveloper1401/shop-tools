import { ReactNode } from 'react';

import Topbar from '@/component/templates/p-admin/Topbar/Topbar';
import { Sidebar } from '@/component/modules/Sidebar/Sidebar';
import styles from '@/styles/DashboardLayout.module.css';

export default function SidebarLayout({
  children,
}: {
  children: ReactNode;
}): JSX.Element {
  return (
    <div>
      <section className={styles.container}>
        <div className={styles.Sidebar}>
          <Sidebar />
        </div>
        <div className={styles.Content}>
          <div>
            <Topbar />
          </div>
          {children}
        </div>
      </section>
    </div>
  );
}
