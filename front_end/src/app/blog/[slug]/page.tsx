import Script from 'next/script';
import { Metadata } from 'next';
import BlogArticle from '@/component/templates/index/BlogArticle/BlogArticle';

import {
  getBlogPostArticleApi,
  getLatestBlogApi,
} from '@/data/server_request/dashboard/blogs';

type Props = {
  params: {
    slug: string;
  };
};

export async function generateMetadata({
  params,
}: {
  params: Promise<Props['params']>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const { slug } = resolvedParams;

  const slugTitle = decodeURIComponent(String(slug));

  const blog = await getBlogPostArticleApi(slugTitle);

  if (!blog) {
    return {
      title: 'مقاله پیدا نشد',
      description: 'مقاله‌ای با این مشخصات یافت نشد.',
    };
  }

  return {
    icons: {
      icon: '/favicon.ico',
    },
    title: blog.post_title,
    description: blog.post_introduction,
    keywords: blog.tags.map((tag: any) => tag.tag_name).join(', '),
    authors: [{ name: 'جی اس تولز' }],
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
      },
    },
    openGraph: {
      type: 'article',
      title: blog.post_title,
      description: blog.post_introduction,
      images: [blog.post_cover_image],
      url: `https://gs-tools.ir/blog/${blog.post_slug}`,
      publishedTime: blog.created_at,
      modifiedTime: blog.updated_at,
    },
    alternates: {
      canonical: `https://gs-tools.ir/blog/${blog.post_slug}`,
    },
    metadataBase: new URL('https://gs-tools.ir'),
  };
}

const BlogArticlePage = async ({
  params,
}: {
  params: Promise<Props['params']>;
}) => {
  const resolvedParams = await params;
  const { slug } = resolvedParams;
  const slugTitle = decodeURIComponent(String(slug));
  const articleData = await getBlogPostArticleApi(slugTitle);

  let latestBlog = await getLatestBlogApi();

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: articleData.post_title,
    description: articleData.post_introduction,
    image: articleData.post_cover_image,
    author: [
      {
        '@type': 'Person',
        name: 'جی اس تولز',
      },
      {
        '@type': 'Person',
        name: 'کدیما',
      },
    ],
    publisher: {
      '@type': 'Organization',
      name: 'آکادمی کدیما',
      logo: {
        '@type': 'ImageObject',
        url: 'https://gs-tools.ir/images/home/logo.webp',
      },
    },
    datePublished: articleData.created_at,
    dateModified: articleData.updated_at,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://gs-tools.ir/blog/${articleData.post_slug}`,
    },
    inLanguage: 'fa',
  };

  return (
    <>
      <BlogArticle
        articleData={articleData}
        latestBlog={latestBlog.slice(0, 7)}
      />
      <Script
        id="structured-data-article"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
    </>
  );
};

export default BlogArticlePage;
