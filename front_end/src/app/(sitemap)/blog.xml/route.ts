import { NextResponse } from 'next/server';

type Blog = {
  post_slug: string;
  updated_at: string;
};

async function fetchBlogs(): Promise<Blog[]> {
  const res = await fetch('https://api.gs-tools.ir/v1/blog/seo_post_blog/', {
    next: { revalidate: 180 },
  });
  return res.json();
}

export async function GET() {
  const base = 'https://gs-tools.ir';

  const blogs = await fetchBlogs();

  const urls = blogs
    .map((b) => {
      const loc = `${base}/blog/${b.post_slug}`;
      const lastmod = b.updated_at
        ? `<lastmod>${new Date(b.updated_at).toISOString()}</lastmod>`
        : '';
      return `<url>
        <loc>${loc}</loc>
        ${lastmod}
        <changefreq>weekly</changefreq>
        <priority>0.7</priority>
      </url>`;
    })
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
