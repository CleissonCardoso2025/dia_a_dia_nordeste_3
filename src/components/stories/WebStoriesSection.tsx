'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import CityCarousel from '@/components/news/CityCarousel';
import { getNoticiaBySlug, getCategorias } from '@/lib/supabase';
import type { Noticia, Categoria } from '@/types';

export default function WebStoriesSection() {
  const params = useParams<{ categoria?: string; slug?: string }>();
  const [categoriaSlug, setCategoriaSlug] = useState<string>(params?.categoria || 'geral');
  const [categoriaNome, setCategoriaNome] = useState<string>('Geral');
  const [corHex, setCorHex] = useState<string>('#D9491F');
  const [noticiaAtualId, setNoticiaAtualId] = useState<string | undefined>(undefined);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function loadContext() {
      try {
        if (params?.slug) {
          const { data } = await getNoticiaBySlug(params.slug);
          const noticia = data as Noticia | null;
          if (isMounted && noticia) {
            setNoticiaAtualId(noticia.id);
            if (noticia.categorias) {
              setCategoriaSlug(noticia.categorias.slug);
              setCategoriaNome(noticia.categorias.nome);
              setCorHex(noticia.categorias.cor_hex || '#D9491F');
              setReady(true);
              return;
            }
          }
        }
        if (params?.categoria) {
          const { data: cats } = await getCategorias();
          const cat = (cats as Categoria[] | null)?.find(c => c.slug === params.categoria);
          if (isMounted && cat) {
            setCategoriaSlug(cat.slug);
            setCategoriaNome(cat.nome);
            setCorHex(cat.cor_hex || '#D9491F');
          }
        }
      } finally {
        if (isMounted) setReady(true);
      }
    }
    loadContext();
    return () => {
      isMounted = false;
    };
  }, [params?.categoria, params?.slug]);

  if (!ready) return null;

  return (
    <CityCarousel
      categoriaSlug={categoriaSlug}
      categoriaNome={categoriaNome}
      corHex={corHex}
      noticiaAtualId={noticiaAtualId}
    />
  );
}
