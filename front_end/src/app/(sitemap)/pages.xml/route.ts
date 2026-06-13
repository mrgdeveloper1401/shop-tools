import { NextResponse } from 'next/server';

const base = 'https://gs-tools.ir';

const pages = [
  { loc: '/', priority: 1.0, changefreq: 'daily' },
  { loc: '/tools-shop', priority: 0.8, changefreq: 'weekly' },
  { loc: '/contact-us', priority: 0.6, changefreq: 'monthly' },
];

export async function GET() {
  const urls = pages
    .map(
      (p) => `<url>
      <loc>${base}${p.loc}</loc>
      <changefreq>${p.changefreq}</changefreq>
      <priority>${p.priority}</priority>
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
      'Cache-Control': 's-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
