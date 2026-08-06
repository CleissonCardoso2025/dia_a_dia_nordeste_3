'use client';

import { useEffect, useState, useMemo, Suspense } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Maximize2, Minimize2, Play, Pause, ChevronLeft, ChevronRight, QrCode, Radio } from 'lucide-react';
import { heroContainerVariants, heroWordVariants, heroOverlayVariants } from '@/animations/variants';
import { getNoticiasDestaque, getNoticias, getNoticiasByCategoria } from '@/lib/supabase';
import type { Noticia } from '@/types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Mocks removidos

function TVDisplayContent() {
  const { categoria } = useParams<{ categoria?: string }>();
  const searchParams = useSearchParams();

  // Ler configurações salvas no admin ou da URL
  const savedConfigRaw = localStorage.getItem('tv_signage_config');
  const savedConfig = savedConfigRaw ? JSON.parse(savedConfigRaw) : {};

  const tempoPorSlide = Number(searchParams.get('tempo')) || Number(savedConfig.tempoPorSlide) || 10; // segundos
  const mostrarQrCode = searchParams.get('qrcode') !== null 
    ? searchParams.get('qrcode') === 'true' 
    : (savedConfig.mostrarQrCode ?? true);
  const fonteParam = searchParams.get('fonte') || savedConfig.fonteNoticias || 'destaques';

  const [noticias, setNoticias] = useState<Partial<Noticia>[]>([]);
  const [loading, setLoading] = useState(true);
  const [indexAtual, setIndexAtual] = useState(0);
  const [progresso, setProgresso] = useState(0);
  const [isPausado, setIsPausado] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [horarioAtual, setHorarioAtual] = useState(new Date());

  // Atualizar relógio a cada segundo
  useEffect(() => {
    const clockTimer = setInterval(() => setHorarioAtual(new Date()), 1000);
    return () => clearInterval(clockTimer);
  }, []);

  // Carregar notícias conforme rota ou parâmetro
  useEffect(() => {
    setLoading(true);
    async function carregarDados() {
      let resultData: Partial<Noticia>[] = [];

      try {
        if (categoria) {
          const { data } = await getNoticiasByCategoria(categoria, 10);
          if (data && data.length > 0) resultData = data as unknown as Partial<Noticia>[];
        } else if (fonteParam === 'destaques') {
          const { data } = await getNoticiasDestaque(10);
          if (data && data.length > 0) resultData = data as unknown as Partial<Noticia>[];
        } else {
          const { data } = await getNoticias(15);
          if (data && data.length > 0) {
            resultData = data as unknown as Partial<Noticia>[];
          }
        }
      } catch (err) {
        console.error('Erro ao carregar notícias no Modo TV:', err);
      }

      setNoticias(resultData);
      setIndexAtual(0);
      setLoading(false);
    }

    carregarDados();
  }, [categoria, fonteParam]);

  // Timer de progresso e transição automática
  useEffect(() => {
    if (isPausado || noticias.length === 0) return;

    const intervalMs = 100;
    const totalMs = tempoPorSlide * 1000;
    const stepIncrement = (intervalMs / totalMs) * 100;

    const timer = setInterval(() => {
      setProgresso((prev) => {
        if (prev >= 100) {
          setIndexAtual((i) => (i + 1) % noticias.length);
          return 0;
        }
        return prev + stepIncrement;
      });
    }, intervalMs);

    return () => clearInterval(timer);
  }, [isPausado, tempoPorSlide, noticias.length, indexAtual]);

  // Reset do progresso ao trocar de índice manualmente
  const proximaNoticia = () => {
    setIndexAtual((i) => (i + 1) % noticias.length);
    setProgresso(0);
  };

  const anteriorNoticia = () => {
    setIndexAtual((i) => (i - 1 + noticias.length) % noticias.length);
    setProgresso(0);
  };

  // Alternar tela cheia
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const noticiaAtual = noticias[indexAtual];

  // URL absoluta da notícia para o QR Code
  const urlNoticia = useMemo(() => {
    if (!noticiaAtual) return '';
    const origin = window.location.origin;
    const catSlug = noticiaAtual.categorias?.slug ?? 'geral';
    const notSlug = noticiaAtual.slug ?? '';
    return `${origin}/noticia/${catSlug}/${notSlug}`;
  }, [noticiaAtual]);

  // Gerar QR Code via API pública do QRServer
  const qrCodeImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&color=ffffff&bgcolor=1e5c4e&data=${encodeURIComponent(urlNoticia)}`;

  if (noticias.length === 0) return (
    <div className="flex h-screen items-center justify-center bg-black text-white">
      <div className="flex flex-col items-center gap-4">
        <Radio size={48} className="text-brand-laranja animate-pulse" />
        <h1 className="text-2xl font-titulo font-bold">Aguardando notícias...</h1>
      </div>
    </div>
  );

  const palavrasTitulo = (noticiaAtual.titulo ?? '').split(' ');

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-black text-white font-sans select-none">
      {/* ── BARRA DE PROGRESSO DE TEMPO ── */}
      <div className="absolute top-0 left-0 right-0 z-40 h-1.5 bg-white/10">
        <motion.div
          className="h-full bg-brand-laranja shadow-[0_0_12px_#D9491F]"
          style={{ width: `${progresso}%` }}
          transition={{ ease: 'linear' }}
        />
      </div>

      {/* ── CABEÇALHO SUPERIOR FIXO (MARCA + CLIMA/HORA + CANAL) ── */}
      <header className="absolute top-4 left-6 right-6 z-30 flex items-center justify-between pointer-events-none">
        {/* Logo Dia a Dia Nordeste + Badge do Canal */}
        <div className="flex items-center gap-4 bg-black/50 backdrop-blur-md px-5 py-2.5 rounded-2xl border border-white/10 pointer-events-auto">
          <img
            src="https://mkbnqyhvaozqfpmcyoyw.supabase.co/storage/v1/object/public/logo/logo_%20diaadia.png"
            alt="Dia a Dia Nordeste"
            className="h-9 w-auto object-contain"
          />
          <div className="h-6 w-px bg-white/20" />
          <div className="flex items-center gap-2">
            <Radio className="h-4 w-4 text-brand-laranja animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-brand-creme">
              {categoria ? `Canal ${categoria}` : 'Digital Signage'}
            </span>
          </div>
        </div>

        {/* Relógio em Tempo Real & Controles */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-3 bg-black/50 backdrop-blur-md px-5 py-2.5 rounded-2xl border border-white/10 text-right pointer-events-auto">
            <Clock className="h-5 w-5 text-brand-laranja" />
            <div>
              <p className="text-sm font-bold leading-none text-white">
                {format(horarioAtual, 'HH:mm:ss')}
              </p>
              <p className="text-[10px] text-white/70 uppercase tracking-wide mt-0.5">
                {format(horarioAtual, "EEEE, d 'de' MMMM", { locale: ptBR })}
              </p>
            </div>
          </div>

          {/* Botões do sistema (Fullscreen e Pause) */}
          <button
            onClick={() => setIsPausado(!isPausado)}
            className="h-11 w-11 rounded-2xl bg-black/50 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/80 hover:text-white hover:bg-black/70 transition-all pointer-events-auto"
            title={isPausado ? 'Continuar Rotação' : 'Pausar'}
          >
            {isPausado ? <Play size={18} className="text-brand-laranja fill-brand-laranja" /> : <Pause size={18} />}
          </button>

          <button
            onClick={toggleFullscreen}
            className="h-11 w-11 rounded-2xl bg-black/50 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/80 hover:text-white hover:bg-black/70 transition-all pointer-events-auto"
            title="Alternar Tela Cheia"
          >
            {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
          </button>
        </div>
      </header>

      {/* ── CONTEÚDO PRINCIPAL COM ANIMAÇÍO DE KEN BURNS ── */}
      {loading ? (
        <div className="flex h-full w-full items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="h-12 w-12 rounded-full border-4 border-brand-laranja border-t-transparent animate-spin" />
            <p className="text-sm font-semibold tracking-wider uppercase text-white/70">Carregando feed de notícias...</p>
          </div>
        </div>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            key={noticiaAtual.id ?? indexAtual}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="relative h-full w-full"
          >
            {/* Imagem de Fundo em Zoom Suave (Ken Burns Effect) */}
            <motion.div
              initial={{ scale: 1 }}
              animate={{ scale: 1.12 }}
              transition={{ duration: tempoPorSlide, ease: 'linear' }}
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url('${noticiaAtual.imagem_url}')` }}
            />

            {/* Gradiente Escuro Multicamadas para Leitura Perfeita */}
            <motion.div
              variants={heroOverlayVariants}
              initial="hidden"
              animate="show"
              className="absolute inset-0 bg-linear-to-t from-black via-black/60 to-black/30"
            />

            {/* Conteúdo Informativo em Primeiro Plano */}
            <div className="absolute bottom-0 left-0 right-0 p-8 sm:p-14 lg:p-20 z-20 flex flex-col lg:flex-row items-end justify-between gap-12">
              
              {/* Lado Esquerdo: Manchete e Resumo */}
              <div className="flex-1 space-y-6">
                {/* Badge da Categoria */}
                {noticiaAtual.categorias && (
                  <span
                    className="inline-block rounded-full px-4 py-1.5 text-xs font-extrabold text-white uppercase tracking-wider shadow-lg"
                    style={{ backgroundColor: noticiaAtual.categorias.cor_hex || '#D9491F' }}
                  >
                    {noticiaAtual.categorias.nome}
                  </span>
                )}

                {/* Manchete com revelação palavra por palavra */}
                <motion.h1
                  key={`title-${indexAtual}`}
                  variants={heroContainerVariants}
                  initial="hidden"
                  animate="show"
                  className="font-titulo font-black text-white text-3xl sm:text-5xl lg:text-6xl leading-[1.15] drop-shadow-2xl"
                >
                  {palavrasTitulo.map((word, i) => (
                    <motion.span
                      key={i}
                      variants={heroWordVariants}
                      className="inline-block mr-3"
                    >
                      {word}
                    </motion.span>
                  ))}
                </motion.h1>

                {/* Resumo/Subtítulo */}
                <motion.p
                  key={`resumo-${indexAtual}`}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                  className="text-white/85 text-lg sm:text-xl lg:text-2xl font-light leading-relaxed pr-8 line-clamp-3 drop-shadow-md"
                >
                  {noticiaAtual.resumo}
                </motion.p>
              </div>

              {/* Lado Direito: QR Code para Leitura no Celular (Se ativado) */}
              {mostrarQrCode && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.4 }}
                  className="shrink-0 bg-brand-surface/90 backdrop-blur-xl border border-brand-border p-4 rounded-3xl flex flex-col items-center gap-2 shadow-2xl text-center"
                >
                  <div className="bg-white p-2 rounded-2xl shadow-inner">
                    <img
                      src={qrCodeImageUrl}
                      alt="Leia a matéria completa no celular"
                      className="w-28 h-28 sm:w-32 sm:h-32 object-contain rounded-xl"
                    />
                  </div>
                  <div className="flex items-center gap-1.5 text-brand-laranja text-xs font-bold">
                    <QrCode size={14} />
                    <span>Leia no Celular</span>
                  </div>
                  <p className="text-[10px] text-brand-muted max-w-32.5 leading-tight">
                    Aponte a câmera para abrir esta notícia no portal
                  </p>
                </motion.div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      )}

      {/* ── NAVIGATORS LATERAIS (OCULTOS ATÉ PASSAR O MOUSE) ── */}
      <div className="absolute inset-y-0 left-4 z-30 flex items-center opacity-0 hover:opacity-100 transition-opacity">
        <button
          onClick={anteriorNoticia}
          className="h-12 w-12 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white hover:bg-brand-laranja transition-all flex items-center justify-center cursor-pointer"
        >
          <ChevronLeft size={24} />
        </button>
      </div>

      <div className="absolute inset-y-0 right-4 z-30 flex items-center opacity-0 hover:opacity-100 transition-opacity">
        <button
          onClick={proximaNoticia}
          className="h-12 w-12 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white hover:bg-brand-laranja transition-all flex items-center justify-center cursor-pointer"
        >
          <ChevronRight size={24} />
        </button>
      </div>

      {/* Rodapé contador de notícias */}
      <div className="absolute bottom-4 left-8 z-30 text-xs text-white/50 font-mono">
        Exibindo {indexAtual + 1} de {noticias.length} notícias
      </div>
    </div>
  );
}

export default function TVDisplayPage() {
  return (
    <Suspense fallback={<div className="h-screen w-screen bg-black flex items-center justify-center text-white">Carregando...</div>}>
      <TVDisplayContent />
    </Suspense>
  );
}

