import { NextResponse } from 'next/server';

export const revalidate = 600; // Cache de 10 minutos (600s)

export interface PodcastEpisode {
  id: string;
  videoId: string;
  title: string;
  speaker: string;
  summary: string;
  link: string;
  thumbnail: string;
  published: string;
  views?: string;
}

export async function GET() {
  const channelId = 'UC8_1EAnJTnrn78GFTTMrY6Q';
  const rssUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;

  try {
    const res = await fetch(rssUrl, {
      next: { revalidate: 600 },
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; DiaADiaNordesteBot/1.0)',
      },
    });

    if (!res.ok) {
      throw new Error(`Falha ao obter RSS do YouTube: ${res.status}`);
    }

    const xmlText = await res.text();

    // Parse manual e seguro de XML de feed do YouTube
    const entryRegex = /<entry>([\s\S]*?)<\/entry>/g;
    const episodes: PodcastEpisode[] = [];

    let match;
    while ((match = entryRegex.exec(xmlText)) !== null) {
      const entryContent = match[1];

      const videoIdMatch = entryContent.match(/<yt:videoId>([^<]+)<\/yt:videoId>/);
      const titleMatch = entryContent.match(/<title>([^<]+)<\/title>/);
      const publishedMatch = entryContent.match(/<published>([^<]+)<\/published>/);
      const viewsMatch = entryContent.match(/<media:statistics views="([^"]+)"/);

      if (videoIdMatch && titleMatch) {
        const videoId = videoIdMatch[1];
        const rawTitle = titleMatch[1]
          .replace(/&amp;/g, '&')
          .replace(/&quot;/g, '"')
          .replace(/&#39;/g, "'")
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>');

        // Extrai orador/convidado se houver separador como | ou - ou :
        let speaker = 'Canabrava Podcast';
        let summary = rawTitle;

        if (rawTitle.includes('|')) {
          const parts = rawTitle.split('|');
          summary = parts[0].trim();
          speaker = parts.slice(1).join(' | ').trim();
        } else if (rawTitle.includes(' - ')) {
          const parts = rawTitle.split(' - ');
          speaker = parts[0].trim();
          summary = parts.slice(1).join(' - ').trim();
        } else if (rawTitle.includes(':')) {
          const parts = rawTitle.split(':');
          speaker = parts[0].trim();
          summary = parts.slice(1).join(':').trim();
        }

        episodes.push({
          id: videoId,
          videoId,
          title: rawTitle,
          speaker,
          summary,
          link: `https://www.youtube.com/watch?v=${videoId}`,
          thumbnail: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
          published: publishedMatch ? publishedMatch[1] : new Date().toISOString(),
          views: viewsMatch ? viewsMatch[1] : undefined,
        });
      }
    }

    return NextResponse.json({
      channelTitle: 'Canabrava Podcast',
      channelUrl: `https://www.youtube.com/channel/${channelId}`,
      episodes,
    });
  } catch (error: any) {
    console.error('[YouTube Podcast RSS Error]', error);
    return NextResponse.json(
      { error: 'Não foi possível carregar os episódios do podcast no momento.' },
      { status: 500 }
    );
  }
}
