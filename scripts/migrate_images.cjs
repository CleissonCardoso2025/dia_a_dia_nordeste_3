const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://supabase.proradiobr.com';
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3OTEyMzMxNDcsImV4cCI6MTg5MzQ1NjAwMCwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlzcyI6InN1cGFiYXNlIn0.8QKuedju-l5JJLV7vqq9671uT_1rt7Mk_eoiqhKMjbs';
const BUCKET_NAME = 'dia-a-dia-nordeste';

const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

// Helper para sanitize filename
function getCleanFileName(url, slug) {
  try {
    const parsed = new URL(url);
    const pathname = parsed.pathname;
    const ext = path.extname(pathname).split('?')[0].toLowerCase() || '.webp';
    const cleanExt = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg'].includes(ext) ? ext : '.webp';
    const safeSlug = (slug || path.basename(pathname, ext) || 'imagem')
      .toLowerCase()
      .replace(/[^a-z0-9_-]/g, '-')
      .replace(/-+/g, '-')
      .slice(0, 80);
    return `${safeSlug}${cleanExt}`;
  } catch (e) {
    return `img-${Date.now()}.webp`;
  }
}

// Download com timeout e headers de browser
async function fetchImageBuffer(url) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12000);

  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8'
      }
    });
    clearTimeout(timeout);
    if (!res.ok) return null;
    const arrayBuffer = await res.arrayBuffer();
    const contentType = res.headers.get('content-type') || 'image/webp';
    return { buffer: Buffer.from(arrayBuffer), contentType };
  } catch (err) {
    clearTimeout(timeout);
    return null;
  }
}

async function main() {
  console.log(`[1/4] Verificando bucket "${BUCKET_NAME}"...`);
  const { data: buckets } = await supabase.storage.listBuckets();
  const exists = buckets?.some(b => b.name === BUCKET_NAME);
  if (!exists) {
    await supabase.storage.createBucket(BUCKET_NAME, { public: true });
    console.log(`Bucket ${BUCKET_NAME} criado com sucesso.`);
  } else {
    console.log(`Bucket ${BUCKET_NAME} já existe.`);
  }

  // 1. Upload do logo oficial
  console.log('[2/4] Enviando logo oficial para identidade/...');
  const logoPath = path.join(__dirname, '..', 'public', 'logo.png');
  if (fs.existsSync(logoPath)) {
    const logoBuf = fs.readFileSync(logoPath);
    await supabase.storage.from(BUCKET_NAME).upload('identidade/logo.png', logoBuf, {
      contentType: 'image/png',
      upsert: true
    });
    console.log('Logo enviado para identidade/logo.png');
  }

  // 2. Extrair notícias do arquivo noticias.sql
  console.log('[3/4] Lendo dados de export_cloud/noticias.sql...');
  const noticiasSql = fs.readFileSync(path.join(__dirname, '..', 'export_cloud', 'noticias.sql'), 'utf8');

  // Regex para capturar linhas de notícias:
  // ('id', 'titulo', 'slug', 'resumo', 'conteudo', 'imagem_url', ...)
  const items = [];
  const regex = /\('([0-9a-f-]{36})',\s*'([^']*)',\s*'([^']*)',[\s\S]*?,\s*'((https?:\/\/[^']+))'/g;
  let match;
  while ((match = regex.exec(noticiasSql)) !== null) {
    items.push({
      id: match[1],
      slug: match[3],
      url: match[4]
    });
  }

  console.log(`Total de notícias com imagem identificadas: ${items.length}`);

  // 3. Fazer download e upload concorrente controlado
  console.log('[4/4] Baixando imagens e transferindo para o bucket...');
  const CONCURRENCY = 8;
  const updates = [];
  let sucessos = 0;
  let falhas = 0;

  for (let i = 0; i < items.length; i += CONCURRENCY) {
    const batch = items.slice(i, i + CONCURRENCY);
    await Promise.all(batch.map(async (item) => {
      const fileName = getCleanFileName(item.url, item.slug);
      const storagePath = `noticias/${fileName}`;

      const imgData = await fetchImageBuffer(item.url);
      if (imgData && imgData.buffer.length > 500) {
        const { error: upErr } = await supabase.storage.from(BUCKET_NAME).upload(
          storagePath,
          imgData.buffer,
          { contentType: imgData.contentType, upsert: true }
        );

        if (!upErr) {
          const { data: pubUrlData } = supabase.storage.from(BUCKET_NAME).getPublicUrl(storagePath);
          updates.push({
            id: item.id,
            oldUrl: item.url,
            newUrl: pubUrlData.publicUrl
          });
          sucessos++;
          return;
        }
      }
      falhas++;
    }));

    if ((i + CONCURRENCY) % 32 === 0 || (i + CONCURRENCY) >= items.length) {
      console.log(`Progresso: ${Math.min(i + CONCURRENCY, items.length)}/${items.length} (Sucessos: ${sucessos}, Falhas: ${falhas})`);
    }
  }

  console.log(`\nConcluído! ${sucessos} imagens transferidas com sucesso para o bucket ${BUCKET_NAME}. (${falhas} falhas/inacessíveis)`);

  // 4. Gerar SQL de atualização das URLs
  const sqlLines = [
    '-- Script de Atualização de URLs de Imagens para o Bucket dia-a-dia-nordeste',
    '-- Executar no SQL Editor do Supabase Studio',
    '',
    '-- Schema dia_a_dia_nordeste (e fallback para public):'
  ];

  for (const u of updates) {
    const escapedUrl = u.newUrl.replace(/'/g, "''");
    sqlLines.push(`UPDATE dia_a_dia_nordeste.noticias SET imagem_url = '${escapedUrl}' WHERE id = '${u.id}';`);
  }

  const outSqlPath = path.join(__dirname, '..', 'export_cloud', 'update_noticias_imagens.sql');
  fs.writeFileSync(outSqlPath, sqlLines.join('\n'), 'utf8');
  console.log(`Script SQL gerado com sucesso em: ${outSqlPath}`);
}

main().catch(console.error);
