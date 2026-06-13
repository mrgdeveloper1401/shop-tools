import { FC } from 'react';
import Link from 'next/link';
import Script from 'next/script';
import HomeIcon from '../icons/Home.icon';
import styles from './BreadcrumbBlog.module.css';

interface BreadcrumbProps {
  category_name: string;
  article_name: string;
  href_category: string;
  href_article: string;
}

const Breadcrumb: FC<BreadcrumbProps> = ({
  category_name,
  article_name,
  href_category,
  href_article,
}) => {
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'خانه',
        item: 'https://gs-tools.ir/',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'مقاله‌ها',
        item: 'https://gs-tools.ir/blog',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: category_name,
        item: `https://gs-tools.ir/blog`,
      },
      {
        '@type': 'ListItem',
        position: 4,
        name: article_name,
        item: `https://gs-tools.ir/blog/${href_article}`,
      },
    ],
  };
  return (
    <>
      <div className={styles.breadcrumb}>
        <nav className={styles.breadcrumb__content} aria-label="breadcrumb">
          <ol className={styles.breadcrumb__list}>
            <li>
              <Link href="/" className={styles.breadcrumb__home_content_icon}>
                <HomeIcon />
              </Link>
            </li>
            <li className={styles.breadCrumb_li1}>
              <Link href="/blog" className={styles.breadcrumb__link}>
                مقاله ها
              </Link>
            </li>
            <li className={styles.breadCrumb_li2}>
              <Link href={href_category || ''}>
                <span className={styles.breadcrumb__item}>{category_name}</span>
              </Link>
            </li>
            <li className={styles.breadCrumb_li3} aria-current="page">
              <Link href={href_article || ''}>
                <span className={styles.breadcrumb__item}>{article_name}</span>
              </Link>
            </li>
          </ol>
        </nav>
      </div>
      <Script
        id="structured-data-article-breadcramp"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
    </>
  );
};

export default Breadcrumb;
