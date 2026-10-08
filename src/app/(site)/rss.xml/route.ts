import { GET as getRssGeral, OPTIONS as optionsRssGeral } from '@/app/api/rss/[slug]/route';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: Request) {
  return getRssGeral(request, { params: Promise.resolve({ slug: 'geral' }) });
}

export async function OPTIONS() {
  return optionsRssGeral();
}

