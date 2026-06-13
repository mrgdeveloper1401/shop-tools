import { NextResponse } from 'next/server';

interface Product {
  category_id: number;
  product_id: string;
  product_name: string;
  product_slug: string;
  created_at: string;
  updated_at: string;
}

async function fetchProducts(): Promise<Product[]> {
  const res = await fetch('https://api.gs-tools.ir/v1/product/seo_product/', {
    next: { revalidate: 180 },
  });
  if (!res.ok) throw new Error(`Failed to fetch products: ${res.status}`);
  return res.json();
}

export async function GET() {
  const base = 'https://gs-tools.ir';

  const products = await fetchProducts();

  const urls = products
    .map(
      (p) => `<url>
      <loc>${base}/product/${p.product_id}/${p.category_id}/${p.product_slug}</loc>
      ${p.updated_at ? `<lastmod>${new Date(p.updated_at).toISOString()}</lastmod>` : ''}
      <changefreq>weekly</changefreq>
      <priority>0.95</priority>
    </url>`,
    )
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${urls}
  </urlset>`;

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 's-maxage=1800, stale-while-revalidate=86400',
    },
  });
}
