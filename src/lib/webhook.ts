export interface WebhookPayload {
  tipo: 'fale_conosco' | 'envie_pauta' | 'anuncie_conosco' | 'banner_expirado' | 'banner_pre_expiracao' | 'teste';
  origem: string;
  data_envio: string;
  dados: Record<string, unknown>;
}

export type RedeSocialDestino = 'instagram' | 'x' | 'whatsapp' | 'facebook';

export interface NewsWebhookPayload {
  evento: 'nova_noticia_publicada' | 'teste_noticia';
  destinos: RedeSocialDestino[];
  noticia: {
    id?: string;
    manchete: string;
    resumo: string;
    corpo: string;
    slug: string;
    url_materia: string;
    categoria: string;
    imagem_url: string | null;
    data_publicacao: string;
  };
}

// Webhook para Contatos e Formulários
export function getWebhookUrl(): string {
  const url = localStorage.getItem('n8n_webhook_url');
  return url ? url.trim() : '';
}

export function setWebhookUrl(url: string): void {
  localStorage.setItem('n8n_webhook_url', url.trim());
}

// Webhook para Notícias e Redes Sociais
export function getNewsWebhookUrl(): string {
  const url = localStorage.getItem('n8n_news_webhook_url');
  return url ? url.trim() : getWebhookUrl();
}

export function setNewsWebhookUrl(url: string): void {
  localStorage.setItem('n8n_news_webhook_url', url.trim());
}

// Disparo de formulários (Fale conosco / Anuncie)
export async function sendWebhookPayload(tipo: WebhookPayload['tipo'], dados: Record<string, unknown>): Promise<{ success: boolean; error?: string }> {
  const webhookUrl = getWebhookUrl();

  const payload: WebhookPayload = {
    tipo,
    origem: tipo === 'anuncie_conosco' 
      ? 'Formulário Anuncie Conosco' 
      : tipo === 'banner_expirado' 
        ? 'Alerta de Vencimento de Banner Publicitário (Final)' 
        : tipo === 'banner_pre_expiracao'
          ? 'Alerta Prévio de Vencimento de Banner (24h Antes)'
          : 'Formulário Fale Conosco / Envie Pauta',
    data_envio: new Date().toISOString(),
    dados,
  };

  if (!webhookUrl) {
    console.info('[Webhook n8n] Nenhum Webhook URL de formulários configurado. Payload:', payload);
    return { success: true };
  }

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) throw new Error(`HTTP Error ${response.status}: ${response.statusText}`);
    return { success: true };
  } catch (err: unknown) {
    const errorObj = err as { message?: string };
    console.error('[Webhook n8n] Erro ao disparar webhook:', err);
    return { success: false, error: errorObj.message || 'Falha na conexão com o Webhook' };
  }
}

// Disparo de publicação de notícia para Redes Sociais no n8n
export async function sendNewsWebhookPayload(
  destinos: RedeSocialDestino[],
  noticia: NewsWebhookPayload['noticia'],
  evento: NewsWebhookPayload['evento'] = 'nova_noticia_publicada'
): Promise<{ success: boolean; error?: string }> {
  const newsWebhookUrl = getNewsWebhookUrl();

  const payload: NewsWebhookPayload = {
    evento,
    destinos,
    noticia,
  };

  if (!newsWebhookUrl) {
    console.info('[Webhook Notícias n8n] Nenhum Webhook URL de Notícias configurado. Payload:', payload);
    return { success: true };
  }

  try {
    const response = await fetch(newsWebhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) throw new Error(`HTTP Error ${response.status}: ${response.statusText}`);
    return { success: true };
  } catch (err: unknown) {
    const errorObj = err as { message?: string };
    console.error('[Webhook Notícias n8n] Erro ao disparar webhook:', err);
    return { success: false, error: errorObj.message || 'Falha na conexão com o Webhook de Notícias' };
  }
}
