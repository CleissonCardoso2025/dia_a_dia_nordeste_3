import { getNoticias } from '@/lib/supabase';
import { gerarRssXml } from '@/lib/rss';
import type { Noticia } from '@/types';

export async function GET(request: Request) {
  const { data } = await getNoticias(40);
  const noticias = (data as unknown as Partial<Noticia>[]) ?? [];
  const xml = gerarRssXml(noticias, null);

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml',
    },
  });
}
