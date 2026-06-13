'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import { Divider } from '@mantine/core';
import DOMPurify from 'dompurify';

import BreadcrumbBlog from '@/component/modules/BreadcrumbBlog/BreadcrumbBlog';
import UserIcon from '@/component/modules/icons/User.icon';
import CalenderIcon from '@/component/modules/icons/Calender.icon';
import ClockIcon from '@/component/modules/icons/Clock.icon';
import ConfirmIcon from '@/component/modules/icons/Confirm.icon';
import CopyIcon from '@/component/modules/icons/Copy.icon';
import ArticleIcon from '@/component/modules/icons/Article.icon';
import TagIcon from '@/component/modules/icons/Tag.icon';
import ShareIcon from '@/component/modules/icons/Share.icon';

import {
  ILatestBlogApi,
  IPostArticle,
} from '@/data/server_request/dashboard/blogs';
import { convertToJalali } from '@/utils/dateConvertUtils';
import styles from './BlogArticle.module.css';

const BlogArticle = ({
  articleData,
  latestBlog,
}: {
  articleData: IPostArticle;
  latestBlog: ILatestBlogApi[];
}) => {
  const { slug } = useParams();
  const categoryTitle = decodeURIComponent(String(slug));
  const [copied, setCopied] = useState(false);

  const handleCopyUrl = () => {
    const currentUrl = window.location.href;
    navigator.clipboard
      .writeText(currentUrl)
      .then(() => {
        setCopied(true);

        setTimeout(() => {
          setCopied(false);
        }, 2000);
      })
      .catch((err) => {
        // console.error('کپی ناموفق بود:', err);
      });
  };

  return (
    <section className={styles.section}>
      <BreadcrumbBlog
        category_name={articleData?.category_name || ''}
        article_name={articleData?.post_title || ''}
        href_category={`/blog`}
        href_article={`/blog/${articleData?.post_slug}`}
      />
      <div className={styles.article_container}>
        <div className={styles.right}>
          <div className={styles.header_info}>
            <h1 className={styles.title}>{articleData?.post_title}</h1>
            <Divider my="md" color="#e5e5e599" />
            <div className={styles.header_info_content}>
              <div>
                <UserIcon strokeWidth={0.3} />
                <span>
                  {articleData?.author.length
                    ? articleData?.author.map((item, index) =>
                        index === articleData.author.length - 1
                          ? item?.full_name
                          : item?.full_name + ' و ',
                      )
                    : 'جی اس تولز'}
                </span>
              </div>
              <div>
                <ClockIcon width="1.2em" height="1.2em" />
                <span>{articleData?.read_time}دقیقه</span>
              </div>
              <div>
                <CalenderIcon />
                <time dateTime={articleData?.created_at}>
                  {articleData?.created_at &&
                    articleData.created_at.length > 0 &&
                    convertToJalali(articleData.created_at)}
                </time>
              </div>
            </div>
          </div>

          <figure className={styles.poster}>
            <Image
              src={
                (articleData?.post_cover_image &&
                  articleData?.post_cover_image) ||
                ''
              }
              alt={articleData?.post_title || ''}
              width={600}
              height={600}
              quality={75}
            />
            <figcaption>
              {articleData?.post_title} - فروشگاه ابزار جی اس تولز
            </figcaption>
          </figure>

          {articleData?.post_body && (
            <SafeHTML
              html={articleData.post_body}
              className={styles.body_content}
            />
          )}
        </div>
        <div className={styles.left}>
          <div className={styles.share_link_box}>
            <div className={styles.share_link}>
              <ShareIcon />
              <span>اشتراک گذاری مقاله</span>
            </div>
            <button
              type="button"
              onClick={handleCopyUrl}
              className={styles.copy_link}
            >
              {copied ? (
                <div className={styles.icon_box}>
                  <span>تایید</span>
                  <ConfirmIcon fontSize={22} strokeWidth={1.3} />
                </div>
              ) : (
                <div className={styles.icon_box}>
                  <span>کپی</span>
                  <CopyIcon />
                </div>
              )}
              <span className={styles.url_link}>
                https://gs-tools.ir/blog/{categoryTitle.slice(0, 10)}
                ...
              </span>
            </button>
          </div>

          <aside className={styles.latest_articles}>
            <div className={styles.header}>
              <ArticleIcon />
              <span>مقالات مرتبط</span>
            </div>
            <div className={styles.content}>
              {latestBlog.map((item) => (
                <Link key={item.id} href={`/blog/${item.post_slug}`}>
                  <div className={styles.latest_articles_box}>
                    <div>
                      <Image
                        src={item.post_cover_image.image}
                        width={500}
                        height={500}
                        alt={item.post_title}
                        priority={false}
                      />
                    </div>
                    <div className={styles.latest_article_info}>
                      <h4>{item.post_title}</h4>
                      <div>
                        <CalenderIcon />
                        <span>{convertToJalali(item.created_at)}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </aside>

          <div className={styles.tags_container}>
            <div className={styles.tag_header}>
              <TagIcon />
              <span>تگ ها</span>
            </div>
            <div className={styles.tags_box}>
              {articleData?.tags &&
                articleData?.tags.map((item) => (
                  <div key={item.id} className={styles.tag}>
                    <span>#</span>
                    <span>{item.tag_name}</span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
export default BlogArticle;

interface SafeHTMLProps {
  html: string;
  className?: string;
}

function SafeHTML({ html, className }: SafeHTMLProps) {
  const [clean, setClean] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const purified = DOMPurify.sanitize(html);
      setClean(purified);
    }
  }, [html]);

  if (!clean) return null;

  return (
    <div className={className} dangerouslySetInnerHTML={{ __html: clean }} />
  );
}
