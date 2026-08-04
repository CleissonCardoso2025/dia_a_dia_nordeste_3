// Tipos principais do portal Dia a Dia Nordeste

export interface Categoria {
  id: string;
  nome: string;
  slug: string;
  cor_hex: string;
  tipo?: 'municipio' | 'editorial';
}

export interface Autor {
  id: string;
  nome: string;
  foto_url: string | null;
  bio: string | null;
}

export interface Noticia {
  id: string;
  titulo: string;
  slug: string;
  resumo: string;
  conteudo: string;
  imagem_url: string | null;
  categoria_id: string;
  autor_id: string | null;
  data_publicacao: string;
  views: number;
  destaque: boolean;
  meta_title: string | null;
  meta_description: string | null;
  // Joins
  categorias?: Categoria;
  autores?: Autor;
}

export interface BannerAd {
  id: string;
  posicao: 'header' | 'sidebar' | 'footer' | 'middle';
  imagem_url: string;
  link_destino: string;
  ativo: boolean;
  titulo?: string;
  anunciante?: string;
  visualizacoes?: number;
  cliques?: number;
  criado_em?: string;
  data_inicio?: string | null;
  data_fim?: string | null;
}

export interface SearchResult {
  id: string;
  titulo: string;
  slug: string;
  resumo: string;
  imagem_url: string | null;
  data_publicacao: string;
  categorias?: Categoria;
}

export type Theme = 'dark' | 'light';

export interface StorySlide {
  id: string;
  imagemUrl: string;
  titulo: string;
  texto: string;
  linkSaibaMais?: string;
}

export interface WebStory {
  id: string;
  titulo: string;
  categoria: string;
  corCategoria: string;
  capaUrl: string;
  criadoEm: string;
  corpo?: string;
  slides: StorySlide[];
}
