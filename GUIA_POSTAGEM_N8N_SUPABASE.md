# 🚀 Guia de Retaguarda: Postagens Automáticas no Supabase via n8n

Este guia consolida todas as informações necessárias para configurar os nós do **Supabase** no **n8n**, eliminando qualquer confusão de IDs, schemas ou campos.

---

## 📌 1. Configurações Globais de Conexão no n8n

| Parâmetro | Valor |
| :--- | :--- |
| **Host / Supabase URL** | `https://supabase.proradiobr.com` |
| **API Key / Credential** | *Sua chave Anon Key (ou Service Role se aplicável)* |
| **Schema do Banco** | `dia_a_dia_nordeste` *(atenção: não use `public`)* |
| **Tabela Principal** | `noticias` |
| **Operação recomendada** | `Insert` (ou `Upsert` usando coluna `slug`) |

---

## 🌟 2. IDs das 3 Seções Principais (Bahia, Brasil, Geral)

Use estes UUIDs no campo **`categoria_id`**:

| Seção / Categoria | UUID (`categoria_id`) | Slug no Site | Onde aparece no Portal |
| :--- | :--- | :--- | :--- |
| **Bahia em Pauta** | `91925efe-8c0d-42a7-8e21-1d167b8f670b` | `bahia` | Seção exclusiva **Bahia em Pauta** na Home |
| **Panorama Brasil** | `29041cc7-195c-4973-b71d-c3c5e37c70bf` | `brasil` | Seção exclusiva **Panorama Brasil** na Home |
| **Geral** | `f81c2e96-05fa-4855-aa9b-13397b237ead` | `geral` | Seção **Geral / Editorias** na Home |

---

## ✍️ 3. Autor Padrão (Redação)

Use este UUID no campo **`autor_id`**:

| Autor | UUID (`autor_id`) |
| :--- | :--- |
| **Redação Dia a Dia Nordeste** | `1e79060a-b850-4054-ae69-783db846d5fd` |

---

## 🏙️ 4. Municípios do Semiárido Nordeste II

Para matérias locais que devem aparecer na **Seção de Municípios (Abas da Home)**:

| Município | UUID (`categoria_id`) | Slug |
| :--- | :--- | :--- |
| **Adustina** | `eb26fa6f-1d0d-4efd-bdac-6b6fbdd98431` | `adustina` |
| **Antas** | `2938605f-8be9-4f18-b52b-99bc1c4a72f8` | `antas` |
| **Banzaê** | `1fd8f094-c10e-4a49-a50a-01fdc88cda45` | `banzae` |
| **Cícero Dantas** | `1bff82e6-6033-4d75-8d04-e26d976c0a05` | `cicero-dantas` |
| **Cipó** | `3949c67e-3936-409d-9600-28782301730d` | `cipo` |
| **Coronel João Sá** | `3f094372-90cd-4037-b884-144090d021ff` | `coronel-joao-sa` |
| **Euclides da Cunha** | `32987db5-45a5-4de9-8212-7e87dbc8f24e` | `euclides-da-cunha` |
| **Fátima** | `ebffbf51-6728-401d-9f59-3a334902bdfc` | `fatima` |
| **Heliópolis** | `2dd68615-05d7-48f1-9467-819514c31649` | `heliopolis` |
| **Jeremoabo** | `902d44ce-469a-438d-82c4-b6e4a8357a30` | `jeremoabo` |
| **Nova Soure** | `6f2a37a5-5762-4f9e-9150-7c8267cd5ac4` | `nova-soure` |
| **Novo Triunfo** | `e5e3360f-abf3-4d7c-aea9-85ba3f3b12f6` | `novo-triunfo` |
| **Paripiranga** | `677f9a5e-4050-4ad1-94a5-76c2b779098a` | `paripiranga` |
| **Pedro Alexandre** | `20fd5fa9-68a5-46fa-b521-e68b26f816ea` | `pedro-alexandre` |
| **Ribeira do Amparo** | `6b283438-a9a3-4742-8705-7cfed6acfd49` | `ribeira-do-amparo` |
| **Ribeira do Pombal** | `7d34292b-4217-4571-ba21-f7aa996aa1d3` | `ribeira-do-pombal` |
| **Santa Brígida** | `080bae89-6778-4435-9771-52d94fdecbce` | `santa-brigida` |
| **Sítio do Quinto** | `d76a6809-0f03-45b2-83a5-70f0f308ca0c` | `sitio-do-quinto` |

---

## 📋 5. Mapeamento de Campos da Tabela `noticias` no n8n

Ao configurar as colunas no node Supabase:

| Coluna | Tipo | Obrigatório | Exemplo / Instrução |
| :--- | :--- | :---: | :--- |
| `titulo` | String | Sim | Título atraente da matéria |
| `slug` | String | Sim | Ex: `meu-titulo-da-noticia-1234` (letras minúsculas e hífens) |
| `resumo` | String | Sim | Subtítulo / lead da matéria (1 a 2 parágrafos curtos) |
| `conteudo` | String (HTML) | Sim | Texto com tags HTML (`<p>`, `<h3>`, `<strong>`, etc.) |
| `imagem_url` | String | Sim | URL completa da imagem de capa |
| `categoria_id` | UUID | Sim | ID da categoria escolhida (da lista acima) |
| `autor_id` | UUID | Sim | `1e79060a-b850-4054-ae69-783db846d5fd` |
| `data_publicacao` | Timestamp | Sim | `{{ $now.toISO() }}` ou data ISO (`2026-10-16T12:00:00Z`) |
| `destaque` | Boolean | Não | `true` ou `false` (padrão: `false`) |
| `meta_title` | String | Não | Título SEO (pode ser o mesmo que `titulo`) |
| `meta_description`| String | Não | Descrição SEO (pode ser o mesmo que `resumo`) |

---

## 💡 6. Dica: Snippet de Código JavaScript para Node do n8n

Se você quiser automatizar a escolha da categoria no n8n antes do node do Supabase, você pode usar um nó de **Code (JavaScript)** com este mapa:

```javascript
const categoriaMap = {
  // Principais
  'bahia': '91925efe-8c0d-42a7-8e21-1d167b8f670b',
  'bahia em pauta': '91925efe-8c0d-42a7-8e21-1d167b8f670b',
  'brasil': '29041cc7-195c-4973-b71d-c3c5e37c70bf',
  'panorama brasil': '29041cc7-195c-4973-b71d-c3c5e37c70bf',
  'geral': 'f81c2e96-05fa-4855-aa9b-13397b237ead',
  
  // Municípios
  'ribeira do pombal': '7d34292b-4217-4571-ba21-f7aa996aa1d3',
  'cicero dantas': '1bff82e6-6033-4d75-8d04-e26d976c0a05',
  'euclides da cunha': '32987db5-45a5-4de9-8212-7e87dbc8f24e',
  'jeremoabo': '902d44ce-469a-438d-82c4-b6e4a8357a30',
  'cipo': '3949c67e-3936-409d-9600-28782301730d'
};

const categoriaTexto = ($json.categoria || 'Geral').toLowerCase().trim();
const categoriaId = categoriaMap[categoriaTexto] || 'f81c2e96-05fa-4855-aa9b-13397b237ead'; // Default Geral
const autorId = '1e79060a-b850-4054-ae69-783db846d5fd';

// Gerar slug limpo se não vier pronto
const gerarSlug = (txt) => {
  return txt.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-') + '-' + Math.floor(Math.random() * 10000);
};

return {
  ...$json,
  categoria_id: categoriaId,
  autor_id: autorId,
  slug: $json.slug || gerarSlug($json.titulo),
  data_publicacao: $json.data_publicacao || new Date().toISOString()
};
```
