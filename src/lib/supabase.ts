import { createClient } from '@supabase/supabase-js';
import type { Categoria } from '@/types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mkbnqyhvaozqfpmcyoyw.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1rYm5xeWh2YW96cWZwbWN5b3l3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU1OTg1MDgsImV4cCI6MjEwMTE3NDUwOH0.CLof_mxTVCHjJqXnCorz2EdyXQ6EeAbgDO0YBhAsDb4';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ─────────────────────────────────────────────
// Helpers de query
// ─────────────────────────────────────────────

export async function getNoticias(limite = 12) {
  return supabase
    .from('noticias')
    .select('*, categorias(id,nome,slug,cor_hex), autores(id,nome,foto_url)')
    .order('data_publicacao', { ascending: false })
    .limit(limite);
}

export async function getNoticiaDestaque() {
  return supabase
    .from('noticias')
    .select('*, categorias(id,nome,slug,cor_hex), autores(id,nome,foto_url)')
    .eq('destaque', true)
    .order('data_publicacao', { ascending: false })
    .limit(1)
    .single();
}

export async function getNoticiasDestaque(limite = 5) {
  return supabase
    .from('noticias')
    .select('*, categorias(id,nome,slug,cor_hex), autores(id,nome,foto_url)')
    .eq('destaque', true)
    .order('data_publicacao', { ascending: false })
    .limit(limite);
}

export async function getNoticiaBySlug(slug: string) {
  return supabase
    .from('noticias')
    .select('*, categorias(id,nome,slug,cor_hex), autores(id,nome,foto_url)')
    .eq('slug', slug)
    .single();
}

export async function getNoticiasByCategoria(categoriaSlug: string, limite = 12) {
  return supabase
    .from('noticias')
    .select('*, categorias!inner(id,nome,slug,cor_hex), autores(id,nome,foto_url)')
    .eq('categorias.slug', categoriaSlug)
    .order('data_publicacao', { ascending: false })
    .limit(limite);
}

export async function getMaisAcessadas(limite = 5) {
  return supabase
    .from('noticias')
    .select('id,titulo,slug,imagem_url,views,categorias(nome,slug,cor_hex)')
    .order('views', { ascending: false })
    .limit(limite);
}

export async function getCategorias() {
  const { data, error } = await supabase
    .from('categorias')
    .select('*, noticias(data_publicacao)');

  if (error || !data) {
    return supabase.from('categorias').select('*').order('nome');
  }

  const ordenadas = (data as unknown as (Categoria & { noticias?: { data_publicacao: string }[] })[])
    .map(cat => {
      const noticias = cat.noticias || [];
      const ultimaData = noticias.reduce((max: number, n: { data_publicacao: string }) => {
        const d = new Date(n.data_publicacao).getTime();
        return d > max ? d : max;
      }, 0);
      return { ...cat, ultimaData };
    })
    .sort((a, b) => {
      if (b.ultimaData !== a.ultimaData) {
        return b.ultimaData - a.ultimaData;
      }
      return a.nome.localeCompare(b.nome);
    });

  return { data: ordenadas, error: null };
}

export async function insertCategoria(categoria: Omit<Categoria, 'id'>) {
  return supabase.from('categorias').insert([categoria]);
}

export async function getBanners(posicao: string) {
  // Checa em segundo plano se algum banner acabou de vencer e avisa no webhook do n8n
  verificarEAlertarBannersExpirados().catch(err => console.error('[Banner Expirado Check]', err));

  const { data, error } = await supabase
    .from('banners_ads')
    .select('*')
    .eq('posicao', posicao)
    .eq('ativo', true);

  if (error || !data) return { data: [], error };

  const agora = Date.now();
  const validos = data.filter((b: any) => {
    if (b.data_inicio && new Date(b.data_inicio).getTime() > agora) return false;
    if (b.data_fim && new Date(b.data_fim).getTime() < agora) return false;
    return true;
  });

  return { data: validos, error: null };
}

export async function registrarVisualizacaoBanner(bannerId: string) {
  return supabase.rpc('increment_banner_views', { banner_id: bannerId });
}

import { sendWebhookPayload } from '@/lib/webhook';

export async function registrarCliqueBanner(bannerId: string) {
  return supabase.rpc('increment_banner_clicks', { banner_id: bannerId });
}

export async function verificarEAlertarBannersExpirados() {
  try {
    const agoraDate = new Date();
    const agoraIso = agoraDate.toISOString();
    const em24HorasIso = new Date(agoraDate.getTime() + 24 * 60 * 60 * 1000).toISOString();

    // ── 1. CHECAGEM DE ALERTA PRÉVIO (24 Horas Antes do Vencimento) ──
    const { data: preExpira } = await supabase
      .from('banners_ads')
      .select('*')
      .not('data_fim', 'is', null)
      .gt('data_fim', agoraIso)
      .lte('data_fim', em24HorasIso)
      .or('alerta_pre_expiracao_enviado.is.null,alerta_pre_expiracao_enviado.eq.false');

    if (preExpira && preExpira.length > 0) {
      for (const banner of preExpira) {
        const views = banner.visualizacoes ?? 0;
        const cliques = banner.cliques ?? 0;
        const ctr = views > 0 ? ((cliques / views) * 100).toFixed(2) + '%' : '0.00%';
        const diffMs = new Date(banner.data_fim).getTime() - agoraDate.getTime();
        const horasRestantes = Math.max(0, Math.round(diffMs / (1000 * 60 * 60)));

        const res = await sendWebhookPayload('banner_pre_expiracao', {
          id: banner.id,
          titulo: banner.titulo || 'Banner Publicitário',
          anunciante: banner.anunciante || 'Anunciante',
          posicao: banner.posicao,
          link_destino: banner.link_destino || '#',
          data_inicio: banner.data_inicio,
          data_fim: banner.data_fim,
          horas_restantes: horasRestantes,
          visualizacoes: views,
          cliques: cliques,
          ctr: ctr,
          mensagem: `⚠️ AVISO PRÉVIO DE VEICULAÇÃO: O banner "${banner.titulo || 'Anúncio'}" do cliente ${banner.anunciante || 'Anunciante'} vencerá em aproximadamente ${horasRestantes}h (em ${new Date(banner.data_fim).toLocaleString('pt-BR')}). Acesse o portal para realizar o print / prova de veiculação antes que seja desativado automaticamente.`
        });

        if (res.success) {
          await supabase
            .from('banners_ads')
            .update({ alerta_pre_expiracao_enviado: true })
            .eq('id', banner.id);
        }
      }
    }

    // ── 2. CHECAGEM DE ALERTA FINAL (Momento do Vencimento) ──
    const { data: expira } = await supabase
      .from('banners_ads')
      .select('*')
      .not('data_fim', 'is', null)
      .lte('data_fim', agoraIso)
      .or('alerta_expiracao_enviado.is.null,alerta_expiracao_enviado.eq.false');

    if (expira && expira.length > 0) {
      for (const banner of expira) {
        const views = banner.visualizacoes ?? 0;
        const cliques = banner.cliques ?? 0;
        const ctr = views > 0 ? ((cliques / views) * 100).toFixed(2) + '%' : '0.00%';

        const res = await sendWebhookPayload('banner_expirado', {
          id: banner.id,
          titulo: banner.titulo || 'Banner Publicitário',
          anunciante: banner.anunciante || 'Anunciante',
          posicao: banner.posicao,
          link_destino: banner.link_destino || '#',
          data_inicio: banner.data_inicio,
          data_fim: banner.data_fim,
          visualizacoes: views,
          cliques: cliques,
          ctr: ctr,
          mensagem: `🔴 BANNER EXPIRADO E OCULTADO: O banner "${banner.titulo || 'Anúncio'}" do cliente ${banner.anunciante || 'Anunciante'} atingiu a data final de veiculação (${new Date(banner.data_fim).toLocaleString('pt-BR')}) e foi desativado da tela pública.`
        });

        if (res.success) {
          await supabase
            .from('banners_ads')
            .update({ alerta_expiracao_enviado: true })
            .eq('id', banner.id);
        }
      }
    }
  } catch (err) {
    console.error('[Banner Expirado Webhook] Erro ao checar expirações:', err);
  }
}

export async function incrementarViews(noticiaId: string) {
  return supabase.rpc('increment_views', { noticia_id: noticiaId });
}

export async function buscarNoticias(query: string, limite = 20) {
  return supabase
    .from('noticias')
    .select('id,titulo,slug,resumo,imagem_url,data_publicacao,categorias(id,nome,slug,cor_hex)')
    .textSearch('fts', query, { config: 'portuguese', type: 'websearch' })
    .order('data_publicacao', { ascending: false })
    .limit(limite);
}

// === WEB STORIES ===
export async function getWebStories() {
  return supabase
    .from('web_stories')
    .select('*')
    .order('criadoEm', { ascending: false });
}

export async function insertWebStory(story: any) {
  return supabase.from('web_stories').insert([story]).select();
}

export async function deleteWebStory(id: string) {
  return supabase.from('web_stories').delete().eq('id', id);
}

// ==========================================
// MÍDIAS AVULSAS (GALERIA)
// ==========================================
export async function getMidiasAvulsas() {
  return supabase.from('galeria_midias').select('*').order('criado_em', { ascending: false });
}

export async function insertMidiaAvulsa(midia: { titulo: string; url: string }) {
  return supabase.from('galeria_midias').insert([midia]);
}

export async function deleteMidiaAvulsa(id: string) {
  return supabase.from('galeria_midias').delete().eq('id', id);
}
