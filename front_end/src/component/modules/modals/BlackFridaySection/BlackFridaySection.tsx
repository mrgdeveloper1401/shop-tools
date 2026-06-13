'use client';
import { useDisclosure } from '@mantine/hooks';
import BaseModal from '../BaseModal/Base.modal';
import Link from 'next/link';
import Image from 'next/image';
import styles from './BlackFridaySection.module.css';
const BlackFridaySection = () => {
  const [opened, { open, close }] = useDisclosure(true);

  return (
    <BaseModal withCloseButton={false} opened={opened} onClose={close} title="">
      <Link
        href="/tools-shop?category_id=53"
        className="sm:p-4 rounded-xl border-none outline-none"
      >
        <Image
          src="/images/assets/black-friday.webp"
          width={1000}
          height={1000}
          alt="مشاهده محصولات بلک فرایدی"
          className="w-full object-cover rounded-xl"
        />
        <div className={styles.button_wrapper}>
          <button className={`${styles.button_ocean} ${styles.shine_button}`}>
            مشاهده محصولات تخفیف دار
          </button>
        </div>
      </Link>
    </BaseModal>
  );
};
export default BlackFridaySection;
