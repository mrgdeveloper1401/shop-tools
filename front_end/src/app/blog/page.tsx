import BlogsCategory from '@/component/templates/index/BlogsCategory/BlogsCategory';
import {
  getBlogCategoryApi,
  getLatestBlogApi,
} from '@/data/server_request/dashboard/blogs';
import { Metadata } from 'next';
import Script from 'next/script';
export const metadata: Metadata = {
  title: 'وبلاگ جی‌اس تولز | مقالات آموزشی ابزارآلات، صنعت و نکات فنی',
  description:
    'در وبلاگ جی‌اس تولز مقالات تخصصی و آموزشی درباره ابزارآلات صنعتی، نکات ایمنی، راهنمای خرید، تعمیر و نگهداری ابزارهای برقی و دستی را بخوانید.',
  keywords: [
    'وبلاگ جی‌اس تولز',
    'آموزش ابزارآلات',
    'نکات فنی',
    'راهنمای خرید ابزار',
    'ابزار برقی',
    'ابزار صنعتی',
    'ابزار دستی',
    'نگهداری ابزار',
    'تعمیر ابزار',
    'ایمنی در کارگاه',
    'فروشگاه ابزار در تبریز',
    'جی‌اس تولز',
  ],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  openGraph: {
    title: 'وبلاگ جی‌اس تولز | آموزش و مقالات تخصصی ابزارآلات',
    description:
      'جدیدترین آموزش‌ها و مقالات درباره ابزارآلات صنعتی و خانگی، راهنمای خرید، نکات نگهداری و بررسی تخصصی برندهای ابزار در وبلاگ جی‌اس تولز.',
    url: 'https://gs-tools.ir/blog',
    siteName: 'جی‌اس تولز',
    type: 'website',
    images: [
      {
        url: 'https://gs-tools.ir/images/home/logo.webp',
        width: 1200,
        height: 630,
        alt: 'وبلاگ جی‌اس تولز - آموزش و مقالات ابزارآلات',
      },
    ],
    locale: 'fa_IR',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'وبلاگ جی‌اس تولز | آموزش و مقالات ابزارآلات صنعتی',
    description:
      'مطالب آموزشی و مقالات تخصصی درباره ابزارآلات برقی، دستی و صنعتی در وبلاگ جی‌اس تولز.',
    images: ['https://gs-tools.ir/images/home/logo.webp'],
  },
  alternates: {
    canonical: 'https://gs-tools.ir/blog',
  },
};

const BlogsCategoryPage = async () => {
  const blogCategory = await getBlogCategoryApi();
  let LatestBlog = await getLatestBlogApi();

  const blogStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'وبلاگ جی‌اس تولز',
    url: 'https://gs-tools.ir/blog',
    inLanguage: 'fa',
    publisher: {
      '@type': 'Organization',
      name: 'جی‌اس تولز',
      logo: {
        '@type': 'ImageObject',
        url: 'https://gs-tools.ir/image/svgs/Logos/logo.png',
      },
    },
    blogPost: LatestBlog.map((item: any) => ({
      '@type': 'BlogPosting',
      headline: item.post_title,
      description: item.post_introduction,
      datePublished: item.created_at,
      dateModified: item.updated_at,
      author: {
        '@type': 'Person',
        name: item.author.get_full_name || 'codiema.ir',
      },
      url: `https://gs-tools.ir/blog/${item.post_slug}`,
      image: item.post_cover_image.image,
    })),
  };

  return (
    <>
      <BlogsCategory blogCategory={blogCategory} />;
      <Script
        id="blog-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogStructuredData) }}
      />
    </>
  );
};

export default BlogsCategoryPage;
