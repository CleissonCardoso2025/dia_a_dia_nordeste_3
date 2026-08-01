import type { Noticia, Categoria } from '@/types';

function xmlEscape(str: string): string {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function formatRfc822Date(dateStr: string | undefined): string {
  try {
    if (!dateStr) return new Date().toUTCString();
    const d = new Date(dateStr);
    return d.toUTCString();
  } catch (e) {
    return new Date().toUTCString();
  }
}

/**
 * Gera a string de XML do Feed RSS 2.0 com noticias completas, imagem e titulo.
 */
export function gerarRssXml(
  noticias: Partial<Noticia>[],
  categoriaSelecionada?: Categoria | null,
  baseUrl: string = 'https://diaadianordeste.com.br'
): string {
  const tituloCanal = categoriaSelecionada
    ? `Dia a Dia Nordeste — Notícias de ${categoriaSelecionada.nome}`
    : 'Dia a Dia Nordeste — Feed RSS Oficial';

  const descricaoCanal = categoriaSelecionada
    ? `Feed RSS de matérias jornalísticas de ${categoriaSelecionada.nome} no Semiárido Nordeste II`
    : 'Notícias do território Semiárido Nordeste II da Bahia — Conectando o Semiárido';

  const itemsXml = noticias
    .map(n => {
      const catNome = n.categorias?.nome || categoriaSelecionada?.nome || 'Geral';
      const catSlug = n.categorias?.slug || categoriaSelecionada?.slug || 'geral';
      const linkNoticia = `${baseUrl}/noticia/${catSlug}/${n.slug}`;
      const imagem = n.imagem_url || '';
      const pubDate = formatRfc822Date(n.data_publicacao);
      const conteudoCompleto = n.conteudo || n.resumo || '';

      return `    <item>
      <title>${xmlEscape(n.titulo || '')}</title>
      <link>${xmlEscape(linkNoticia)}</link>
      <guid isPermaLink="true">${xmlEscape(linkNoticia)}</guid>
      <pubDate>${pubDate}</pubDate>
      <category>${xmlEscape(catNome)}</category>
      <description><![CDATA[${imagem ? `<p><img src="${imagem}" alt="${xmlEscape(n.titulo || '')}" /></p>` : ''}<p>${n.resumo || ''}</p>]]></description>
      <content:encoded><![CDATA[${imagem ? `<p><img src="${imagem}" alt="${xmlEscape(n.titulo || '')}" /></p>` : ''}${conteudoCompleto}]]></content:encoded>
      ${imagem ? `<enclosure url="${xmlEscape(imagem)}" type="image/jpeg" length="0" />` : ''}
    </item>`;
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" 
     xmlns:content="http://purl.org/rss/1.0/modules/content/"
     xmlns:dc="http://purl.org/dc/elements/1.1/"
     xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${xmlEscape(tituloCanal)}</title>
    <link>${xmlEscape(baseUrl)}</link>
    <atom:link href="${xmlEscape(baseUrl)}/rss.xml" rel="self" type="application/rss+xml" />
    <description>${xmlEscape(descricaoCanal)}</description>
    <language>pt-BR</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${itemsXml}
  </channel>
</rss>`;
}
