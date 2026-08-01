import { Helmet } from 'react-helmet-async';

interface SEOHeadProps {
  title?: string;
  description?: string;
  ogImage?: string;
  ogType?: 'website' | 'article';
  canonical?: string;
  jsonLd?: object;
}

const SITE_NAME = 'Dia a Dia Nordeste';
const BASE_URL = import.meta.env.VITE_BASE_URL || 'https://diaadianordeste.com.br';
const DEFAULT_OG = `${BASE_URL}/og-default.jpg`;

export default function SEOHead({
  title,
  description = 'Portal de notícias do Nordeste brasileiro. Cobertura completa de política, economia, cultura e muito mais.',
  ogImage = DEFAULT_OG,
  ogType = 'website',
  canonical,
  jsonLd,
}: SEOHeadProps) {
  const fullTitle = title ? `${title} — ${SITE_NAME}` : `${SITE_NAME} | Notícias do Nordeste`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical || (BASE_URL + window.location.pathname)} />

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:type" content={ogType} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content="pt_BR" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {/* JSON-LD */}
      {jsonLd && (
        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
      )}
    </Helmet>
  );
}
