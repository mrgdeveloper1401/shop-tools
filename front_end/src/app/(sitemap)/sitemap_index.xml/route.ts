import { NextResponse } from 'next/server';

const baseUrl = 'https://gs-tools.ir';

export async function GET() {
  const lastMod = new Date().toISOString().split('T')[0];

  const sitemaps = ['product.xml', 'blog.xml', 'pages.xml'];

  const sitemapIndexContent = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${sitemaps
      .map(
        (file) => `
    <sitemap>
        <loc>${baseUrl}/${file}</loc>
        <lastmod>${lastMod}</lastmod>
    </sitemap>
    `,
      )
      .join('')}
</sitemapindex>`;

  const headers = {
    'Content-Type': 'application/xml',
    'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200',
  };

  return new NextResponse(sitemapIndexContent, { headers });
}
