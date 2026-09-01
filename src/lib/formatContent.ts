/**
 * Formata o conteúdo do artigo garantindo que quebras de linha e múltiplos parágrafos
 * digitados pelo redator sejam devidamente renderizados em HTML com tags <p> e <br />.
 */
export function formatArticleContent(rawContent: string | null | undefined): string {
  if (!rawContent) return '';

  const trimmed = rawContent.trim();
  if (!trimmed) return '';

  // Se já contiver tags estruturais de bloco HTML principais (<p, <div, <h1-6, <blockquote, <ul, <ol, <table, <section, <article, <figure)
  const hasBlockTags = /<\/?(p|div|h[1-6]|blockquote|ul|ol|table|section|article|figure)[^>]*>/i.test(trimmed);

  if (!hasBlockTags) {
    // Normaliza quebras de linha <br> duplas caso o usuário tenha colado
    const normalized = trimmed.replace(/<br\s*\/?>\s*<br\s*\/?>/gi, '\n\n');

    // Divide em blocos por 2 ou mais quebras de linha (\n\n)
    const paragraphs = normalized
      .split(/\n\s*\n+/)
      .map(p => p.trim())
      .filter(Boolean);

    if (paragraphs.length > 0) {
      return paragraphs
        .map(p => `<p>${p.replace(/\n/g, '<br />')}</p>`)
        .join('\n');
    }
  }

  return trimmed;
}
