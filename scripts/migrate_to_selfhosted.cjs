const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://supabase.proradiobr.com';
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3OTEyMzMxNDcsImV4cCI6MTg5MzQ1NjAwMCwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlzcyI6InN1cGFiYXNlIn0.8QKuedju-l5JJLV7vqq9671uT_1rt7Mk_eoiqhKMjbs';

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { persistSession: false }
});

function extractJson(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const parsed = JSON.parse(content);
  const text = parsed.result;
  const start = text.indexOf('[');
  const end = text.lastIndexOf(']');
  if (start === -1 || end === -1 || end <= start) {
    throw new Error('Não encontrou JSON array em ' + filePath);
  }
  return JSON.parse(text.slice(start, end + 1));
}

async function run() {
  console.log('Iniciando migração para self-hosted...');

  // 1. AUTORES
  console.log('\n--- 1. Migrando Autores ---');
  const autores = [
    {
      id: '1e79060a-b850-4054-ae69-783db846d5fd',
      nome: 'Redação Dia a Dia Nordeste',
      avatar_url: null,
      bio: 'Equipe de jornalismo do portal Dia a Dia Nordeste.',
      criado_em: '2026-08-01 18:19:42.047123+00'
    }
  ];
  const { error: errAutores } = await supabase.from('autores').upsert(autores);
  if (errAutores) console.error('Erro autores:', errAutores);
  else console.log('Autores OK:', autores.length);

  // 2. CATEGORIAS
  console.log('\n--- 2. Migrando Categorias ---');
  const catData = extractJson('C:/Users/centr/.gemini/antigravity-ide/brain/e09177cf-0ca4-4340-b6ac-a609d34777f8/.system_generated/steps/84/output.txt');
  const { error: errCat } = await supabase.from('categorias').upsert(catData);
  if (errCat) console.error('Erro categorias:', errCat);
  else console.log('Categorias OK:', catData.length);

  // 3. BANNERS_ADS
  console.log('\n--- 3. Migrando Banners Ads ---');
  const banData = extractJson('C:/Users/centr/.gemini/antigravity-ide/brain/e09177cf-0ca4-4340-b6ac-a609d34777f8/.system_generated/steps/88/output.txt');
  const { error: errBan } = await supabase.from('banners_ads').upsert(banData);
  if (errBan) console.error('Erro banners_ads:', errBan);
  else console.log('Banners OK:', banData.length);

  // 4. GALERIA_MIDIAS
  console.log('\n--- 4. Migrando Galeria de Mídias ---');
  const midiasData = [
    {"id":"18abbe67-ea5c-4a2e-979e-7d4997f79c4d","titulo":"logo_radio","url":"https://mkbnqyhvaozqfpmcyoyw.supabase.co/storage/v1/object/public/imagens/galeria/1785882703082_p3mt7t1.png","criado_em":"2026-08-04 22:31:43.144026+00"},
    {"id":"e5e8148f-d134-45ac-b012-7b5ef0036a4e","titulo":"Logo Rádio horizontal","url":"https://mkbnqyhvaozqfpmcyoyw.supabase.co/storage/v1/object/public/imagens/galeria/1785937045886_wk0pcqz.webp","criado_em":"2026-08-05 13:37:26.665317+00"},
    {"id":"1a5eacf5-dec8-4b8d-8024-d1f9e5e360fa","titulo":"logo radio black","url":"https://mkbnqyhvaozqfpmcyoyw.supabase.co/storage/v1/object/public/imagens/galeria/1786059035334_uzrk66y.webp","criado_em":"2026-08-06 23:30:35.845052+00"},
    {"id":"eb659510-8424-46a8-b9ba-faa545603f9c","titulo":"ddn favicon","url":"https://mkbnqyhvaozqfpmcyoyw.supabase.co/storage/v1/object/public/imagens/galeria/1786114821585_dzoi8p5.webp","criado_em":"2026-08-07 15:00:22.933085+00"},
    {"id":"ec423c41-781e-434d-b5df-87b0ad06f9ac","titulo":"radio feliz","url":"https://mkbnqyhvaozqfpmcyoyw.supabase.co/storage/v1/object/public/imagens/galeria/1786134258461_ugx71b1.webp","criado_em":"2026-08-07 20:24:19.010177+00"},
    {"id":"8765a23a-5682-4a7c-ad2d-e0501c6c66d2","titulo":"radio feliz gif","url":"https://mkbnqyhvaozqfpmcyoyw.supabase.co/storage/v1/object/public/imagens/galeria/1786134294175_tb09ma1.gif","criado_em":"2026-08-07 20:24:55.756783+00"},
    {"id":"de8fa658-0773-4561-8ea0-e5eb343b554f","titulo":"Mito ou verdade","url":"https://mkbnqyhvaozqfpmcyoyw.supabase.co/storage/v1/object/public/imagens/galeria/1787343616696_grnyaim.webp","criado_em":"2026-08-21 20:20:15.678446+00"},
    {"id":"c3f0677e-83d0-4ca6-a31f-227a5d6089ec","titulo":"Cuidar Feliz aniversario","url":"https://mkbnqyhvaozqfpmcyoyw.supabase.co/storage/v1/object/public/imagens/galeria/1788452556604_i33a5gp.webp","criado_em":"2026-09-03 16:22:35.394211+00"},
    {"id":"ad826904-0d24-4629-9274-ec7fdac1148a","titulo":"Minuto saude","url":"https://mkbnqyhvaozqfpmcyoyw.supabase.co/storage/v1/object/public/imagens/galeria/1788470122243_a4qej3h.webp","criado_em":"2026-09-03 21:15:23.207726+00"}
  ];
  const { error: errMidias } = await supabase.from('galeria_midias').upsert(midiasData);
  if (errMidias) console.error('Erro galeria_midias:', errMidias);
  else console.log('Galeria mídias OK:', midiasData.length);

  // 5. WEB_STORIES
  console.log('\n--- 5. Migrando Web Stories ---');
  const wsRaw1 = extractJson('C:/Users/centr/.gemini/antigravity-ide/brain/e09177cf-0ca4-4340-b6ac-a609d34777f8/.system_generated/steps/94/output.txt');
  const wsRaw2 = extractJson('C:/Users/centr/.gemini/antigravity-ide/brain/e09177cf-0ca4-4340-b6ac-a609d34777f8/.system_generated/steps/96/output.txt');
  const wsData = [...wsRaw1, ...wsRaw2].map(s => ({
    id: s.id,
    titulo: s.titulo,
    categoria: s.categoria,
    corcategoria: s.corCategoria || s.corcategoria,
    capaurl: s.capaUrl || s.capaurl,
    slides: s.slides,
    corpo: s.corpo,
    views: s.views || 0,
    criadoem: s.criadoEm || s.criadoem
  }));

  const wsBatchSize = 50;
  for (let i = 0; i < wsData.length; i += wsBatchSize) {
    const batch = wsData.slice(i, i + wsBatchSize);
    const { error } = await supabase.from('web_stories').upsert(batch);
    if (error) console.error(`Erro lote stories ${i}:`, error);
    else console.log(`Stories lote ${i} - ${i + batch.length} OK`);
  }

  // 6. NOTICIAS
  console.log('\n--- 6. Migrando Notícias ---');
  const notSteps = [98, 100, 102, 104, 106, 108, 110];
  const notData = [];
  for (const step of notSteps) {
    const rows = extractJson(`C:/Users/centr/.gemini/antigravity-ide/brain/e09177cf-0ca4-4340-b6ac-a609d34777f8/.system_generated/steps/${step}/output.txt`);
    notData.push(...rows);
  }

  const cleanNoticias = notData.map(n => ({
    id: n.id,
    titulo: n.titulo,
    slug: n.slug,
    resumo: n.resumo,
    conteudo: n.conteudo || '',
    imagem_url: n.imagem_url,
    categoria_id: n.categoria_id,
    autor_id: n.autor_id,
    data_publicacao: n.data_publicacao,
    views: n.views || 0,
    destaque: n.destaque || false,
    meta_title: n.meta_title,
    meta_description: n.meta_description
  }));

  const notBatchSize = 50;
  for (let i = 0; i < cleanNoticias.length; i += notBatchSize) {
    const batch = cleanNoticias.slice(i, i + notBatchSize);
    const { error } = await supabase.from('noticias').upsert(batch);
    if (error) console.error(`Erro lote noticias ${i}:`, error);
    else console.log(`Noticias lote ${i + 1} a ${i + batch.length} OK`);
  }

  // 7. VERIFICAÇÃO FINAL
  console.log('\n=== CONTAGEM FINAL NO BANCO SELF-HOSTED ===');
  const tables = ['autores', 'categorias', 'banners_ads', 'galeria_midias', 'web_stories', 'noticias'];
  for (const t of tables) {
    const { count, error } = await supabase.from(t).select('*', { count: 'exact', head: true });
    console.log(`${t}: ${count} registros ${error ? '(' + error.message + ')' : ''}`);
  }
}

run().catch(console.error);
