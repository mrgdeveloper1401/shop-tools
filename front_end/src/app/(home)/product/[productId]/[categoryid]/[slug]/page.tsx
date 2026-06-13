import ProductDetail from '@/component/templates/index/ProductDetail/ProductDetail';
import { getOneProductApi } from '@/data/server_request/dashboard/product';
import { Metadata } from 'next';
import Script from 'next/script';

type Props = {
  params: {
    productId: string;
    categoryid: string;
    slug: string;
  };
};

export async function generateMetadata({
  params,
}: {
  params: Promise<Props['params']>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const { productId, categoryid, slug } = resolvedParams;

  const product = await getOneProductApi(Number(productId), Number(categoryid));

  if (!product) {
    return {
      title: 'محصولی پیدا نشد',
      description: 'محصولی با این مشخصات یافت نشد.',
    };
  }

  const keywords = [
    product.product_name,
    product.product_brand?.brand_name || '',
    ...product.tags.map((tag) => tag.tag_name),
  ];

  return {
    icons: {
      icon: '/favicon.ico',
    },
    title: `قیمت و خرید ${product.product_name}`,
    description: product.description,
    keywords: keywords.join(', '),
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
      },
    },
    openGraph: {
      title: `قیمت و خرید ${product.product_name}`,
      description: product.description,
      url: `https://gs-tools.ir/${productId}/${categoryid}/${slug}`,
      siteName: 'جی اس تولز',
      type: 'website',
      images: product.product_product_image.map((img) => ({
        url: img.image.get_image_url,
        width: 1200,
        height: 630,
        alt: product.product_name,
      })),
      locale: 'fa_IR',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${product.product_name} | GS Tools`,
      description: product.description,
      images: product.product_product_image.map(
        (img) => img.image.get_image_url,
      ),
    },
    alternates: {
      canonical: `https://gs-tools.ir/${productId}/${categoryid}/${slug}`,
    },
  };
}

const ProductPage = async ({
  params,
}: {
  params: Promise<Props['params']>;
}) => {
  const resolvedParams = await params;
  const { productId, categoryid, slug } = resolvedParams;

  const product = await getOneProductApi(Number(productId), Number(categoryid));
  if (!product) return <p>محصول پیدا نشد</p>;

  const productStructuredData = {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    name: product.product_name,
    image: product.product_product_image.map((img) => img.image.get_image_url),
    description: product.description,
    sku: product.sku || '',
    brand: {
      '@type': 'Brand',
      name: product.product_brand.brand_name || '',
    },
    offers: {
      '@type': 'Offer',
      url: `https://gs-tools.ir/${productId}/${categoryid}/${slug}`,
      priceCurrency: 'IRR',
      price: product.variants.length && product.variants[0].price,
      availability: 'https://schema.org/InStock',
    },
  };

  return (
    <>
      <ProductDetail data={product} categoryId={Number(categoryid)} />
      <Script
        id="product-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productStructuredData),
        }}
      />
    </>
  );
};

export default ProductPage;
