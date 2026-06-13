import { redirect, RedirectType } from 'next/navigation';

export async function GET() {
  redirect('/sitemap_index.xml', RedirectType.replace);
}
