'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase, getCategorias } from '@/lib/supabase';
import { convertToWebP } from '@/lib/imageProcessor';
import type { Categoria, Noticia } from '@/types';
import { ArrowLeft, Save, Upload, Image as ImageIcon, Link as LinkIcon, Trash2, Check, Loader2, Share2 } from 'lucide-react';
import { sendNewsWebhookPayload, type RedeSocialDestino } from '@/lib/webhook';

function slugify(texto: string) {
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

export default function ArticleEditor() {
  const { id } = useParams<{ id?: string }>();
  const router = useRouter();
  const isEdicao = !!id;

  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [modoImagem, setModoImagem] = useState<'upload' | 'url'>('upload');

  // Redes Sociais selecionadas para o Webhook do n8n
  const [destinosRedes, setDestinosRedes] = useState<RedeSocialDestino[]>([
    'instagram',
    'x',
    'whatsapp',
    'facebook',
  ]);

  const [form, setForm] = useState<Partial<Noticia>>({
    titulo: '',
    slug: '',
    resumo: '',
    conteudo: '',
    imagem_url: '',
    categoria_id: '',
    destaque: false,
    meta_title: '',
    meta_description: '',
  });

  useEffect(() => {
    getCategorias().then(({ data }) => {
      if (data) setCategorias(data as Categoria[]);
    });

    if (isEdicao && id) {
      setLoading(true);
      supabase.from('noticias').select('*').eq('id', id).single().then(({ data }) => {
        if (data) {
          setForm(data as Noticia);
          if (data.imagem_url) setModoImagem('url');
        }
        setLoading(false);
      });
    }
  }, [id, isEdicao]);

  const handleChange = (field: keyof Noticia, value: string | boolean) => {
    setForm(prev => ({
      ...prev,
      [field]: value,
      ...(field === 'titulo' && !isEdicao ? { slug: slugify(value as string) } : {}),
    }));
  };

  const processFile = async (file: File | undefined | null) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Por favor, selecione um arquivo de imagem válido (JPG, PNG, WEBP, etc).');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert('A imagem é muito grande. Escolha uma imagem de até 10MB.');
      return;
    }

    setUploading(true);
    try {
      // Converte para WebP antes do upload
      const finalFile = await convertToWebP(file);

      const fileExt = finalFile.name.split('.').pop() || 'webp';
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
      const filePath = `noticias/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('imagens')
        .upload(filePath, finalFile, { cacheControl: '3600', upsert: true });

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage
        .from('imagens')
        .getPublicUrl(filePath);

      if (publicUrlData?.publicUrl) {
        handleChange('imagem_url', publicUrlData.publicUrl);
      }
    } catch (err: unknown) {
      const errorObj = err as { message?: string };
      console.error('Erro no upload:', err);
      alert('Erro ao enviar imagem: ' + (errorObj.message || 'Falha de conexão com o armazenamento.'));
    } finally {
      setUploading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    await processFile(e.target.files?.[0]);
  };

  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      await processFile(e.dataTransfer.files[0]);
    }
  };

  const toggleRede = (rede: RedeSocialDestino) => {
    setDestinosRedes(prev =>
      prev.includes(rede) ? prev.filter(r => r !== rede) : [...prev, rede]
    );
  };

  const handleSalvar = async (e: React.FormEvent) => {
    e.preventDefault();
    setSalvando(true);

    const dataPublicacao = form.data_publicacao || new Date().toISOString();

    const payload: Partial<Noticia> & { fts?: any } = {
      ...form,
      data_publicacao: dataPublicacao,
    };

    // Remove campos que não podem ser atualizados diretamente (gerados pelo banco)
    delete payload.fts;

    let error;
    if (isEdicao) {
      ({ error } = await supabase.from('noticias').update(payload).eq('id', id!));
    } else {
      ({ error } = await supabase.from('noticias').insert(payload));
    }

    setSalvando(false);
    if (error) {
      alert('Erro ao salvar notícia: ' + error.message);
    } else {
      // Disparar Webhook de notícias se houver redes sociais selecionadas
      if (destinosRedes.length > 0) {
        const catEncontrada = categorias.find(c => c.id === form.categoria_id);
        const catSlug = catEncontrada?.slug || 'geral';
        const catNome = catEncontrada?.nome || 'Geral';
        const origin = window.location.origin;
        const urlMateria = `${origin}/noticia/${catSlug}/${form.slug}`;

        sendNewsWebhookPayload(destinosRedes, {
          id: id || undefined,
          manchete: form.titulo || '',
          resumo: form.resumo || '',
          corpo: form.conteudo || '',
          slug: form.slug || '',
          url_materia: urlMateria,
          categoria: catNome,
          imagem_url: form.imagem_url || null,
          data_publicacao: dataPublicacao,
        }).catch(err => console.error('[Webhook Notícia] Erro ao disparar:', err));
      }

      router.push('/admin');
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-brand-grafite flex items-center justify-center text-brand-muted">Carregando notícia...</div>;
  }

  const secoesEditoriais = categorias.filter(c => c.tipo === 'editorial');
  const municipiosRegiao = categorias.filter(c => c.tipo === 'municipio');

  return (
    <div className="min-h-screen bg-brand-grafite text-brand-creme">
      <header className="bg-brand-surface border-b border-brand-border px-6 py-4 flex items-center gap-4">
        <Link href="/admin" className="flex items-center gap-1.5 text-brand-muted hover:text-brand-creme transition-colors text-sm">
          <ArrowLeft size={16} />
          Voltar ao Painel
        </Link>
        <h1 className="font-titulo font-bold text-brand-creme">
          {isEdicao ? 'Editar Notícia' : 'Nova Notícia'}
        </h1>
      </header>

      <form onSubmit={handleSalvar} className="max-w-3xl mx-auto px-6 py-8 space-y-6">
        {/* Título */}
        <div>
          <label className="block text-xs font-semibold text-brand-muted mb-1">Título da Matéria *</label>
          <input
            type="text"
            value={form.titulo}
            onChange={e => handleChange('titulo', e.target.value)}
            required
            className="w-full rounded-lg bg-brand-surface border border-brand-border px-3 py-2.5 text-brand-creme focus:outline-none focus:border-brand-laranja transition-colors"
            placeholder="Ex: Novo investimento em infraestrutura no Semiárido Nordeste II"
          />
        </div>

        {/* Slug */}
        <div>
          <label className="block text-xs font-semibold text-brand-muted mb-1">Slug (URL amigável)</label>
          <input
            type="text"
            value={form.slug}
            onChange={e => handleChange('slug', e.target.value)}
            className="w-full rounded-lg bg-brand-surface border border-brand-border px-3 py-2.5 text-brand-creme font-mono text-sm focus:outline-none focus:border-brand-laranja transition-colors"
            placeholder="url-da-noticia"
          />
        </div>

        {/* Categoria / Seção + Destaque */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-brand-muted mb-1">Seção / Categoria *</label>
            <select
              value={form.categoria_id}
              onChange={e => handleChange('categoria_id', e.target.value)}
              required
              className="w-full rounded-lg bg-brand-surface border border-brand-border px-3 py-2.5 text-brand-creme focus:outline-none focus:border-brand-laranja transition-colors"
            >
              <option value="">Selecionar seção ou município...</option>
              <optgroup label="ðŸ“Œ Seções e Editoriais do Portal">
                {secoesEditoriais.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.nome}</option>
                ))}
              </optgroup>
              <optgroup label="ðŸ™️ Municípios do Semiárido">
                {municipiosRegiao.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.nome}</option>
                ))}
              </optgroup>
            </select>
          </div>
          <div className="flex items-end gap-2 pb-1">
            <label className="flex items-center gap-2 cursor-pointer text-sm text-brand-creme select-none">
              <input
                type="checkbox"
                checked={form.destaque}
                onChange={e => handleChange('destaque', e.target.checked)}
                className="accent-brand-laranja h-4 w-4 rounded"
              />
              ⭐ Destaque / Manchete Principal
            </label>
          </div>
        </div>

        {/* ── CAMPO DE IMAGEM COM UPLOAD & LINK ── */}
        <div className="rounded-xl bg-brand-surface border border-brand-border p-5 space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-brand-creme flex items-center gap-2">
              <ImageIcon size={16} className="text-brand-laranja" />
              Imagem de Capa da Notícia
            </label>

            {/* Abas: Upload vs URL */}
            <div className="flex bg-brand-grafite rounded-lg p-0.5 border border-brand-border text-xs">
              <button
                type="button"
                onClick={() => setModoImagem('upload')}
                className={`flex items-center gap-1 px-3 py-1 rounded-md transition-colors ${
                  modoImagem === 'upload'
                    ? 'bg-brand-laranja text-white font-bold'
                    : 'text-brand-muted hover:text-brand-creme'
                }`}
              >
                <Upload size={13} />
                Fazer Upload
              </button>
              <button
                type="button"
                onClick={() => setModoImagem('url')}
                className={`flex items-center gap-1 px-3 py-1 rounded-md transition-colors ${
                  modoImagem === 'url'
                    ? 'bg-brand-laranja text-white font-bold'
                    : 'text-brand-muted hover:text-brand-creme'
                }`}
              >
                <LinkIcon size={13} />
                URL da Imagem
              </button>
            </div>
          </div>

          {/* Opção 1: Upload de Arquivo */}
          {modoImagem === 'upload' ? (
            <div className="space-y-3">
              <label 
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`relative flex flex-col items-center justify-center w-full h-36 border-2 border-dashed rounded-xl cursor-pointer transition-all group ${
                  isDragging 
                    ? 'border-brand-laranja bg-brand-laranja/10' 
                    : 'border-brand-border hover:border-brand-laranja bg-brand-grafite/50 hover:bg-brand-grafite'
                }`}
              >
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  disabled={uploading}
                  className="hidden"
                />
                <div className="flex flex-col items-center justify-center p-4 text-center">
                  {uploading ? (
                    <>
                      <Loader2 className="h-8 w-8 text-brand-laranja animate-spin mb-2" />
                      <p className="text-xs font-bold text-brand-creme">Enviando imagem para a nuvem...</p>
                    </>
                  ) : (
                    <>
                      <Upload className="h-8 w-8 text-brand-muted group-hover:text-brand-laranja transition-colors mb-2" />
                      <p className="text-sm font-semibold text-brand-creme">
                        Clique aqui para escolher uma imagem
                      </p>
                      <p className="text-xs text-brand-muted mt-1">
                        Formatos aceitos: JPG, PNG, WEBP (Máx: 10MB)
                      </p>
                    </>
                  )}
                </div>
              </label>
            </div>
          ) : (
            /* Opção 2: URL Externa */
            <div className="space-y-2">
              <input
                type="url"
                value={form.imagem_url ?? ''}
                onChange={e => handleChange('imagem_url', e.target.value)}
                className="w-full rounded-lg bg-brand-grafite border border-brand-border px-3 py-2.5 text-brand-creme focus:outline-none focus:border-brand-laranja transition-colors text-sm"
                placeholder="Cole o endereço da imagem (ex: https://site.com/foto.jpg)"
              />
            </div>
          )}

          {/* Preview da Imagem Carregada */}
          {form.imagem_url && (
            <div className="relative group rounded-xl overflow-hidden border border-brand-border max-h-64 bg-black/40">
              <img
                src={form.imagem_url}
                alt="Preview da capa"
                className="w-full h-full object-cover max-h-64"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=1400&q=80';
                }}
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => handleChange('imagem_url', '')}
                  className="flex items-center gap-1.5 rounded-full bg-red-600 px-4 py-2 text-xs font-bold text-white hover:bg-red-700 transition-colors shadow-lg cursor-pointer"
                >
                  <Trash2 size={14} />
                  Remover Imagem
                </button>
              </div>
              <div className="absolute bottom-2 left-2 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-md text-[10px] text-brand-creme flex items-center gap-1">
                <Check size={12} className="text-green-400" />
                Imagem pronta para publicação
              </div>
            </div>
          )}
        </div>

        {/* Resumo */}
        <div>
          <label className="block text-xs font-semibold text-brand-muted mb-1">Resumo da Notícia *</label>
          <textarea
            value={form.resumo}
            onChange={e => handleChange('resumo', e.target.value)}
            required
            rows={3}
            className="w-full rounded-lg bg-brand-surface border border-brand-border px-3 py-2.5 text-brand-creme focus:outline-none focus:border-brand-laranja transition-colors resize-none"
            placeholder="Escreva um breve resumo da notícia (será exibido nos cards e no modo TV)"
          />
        </div>

        {/* Conteúdo */}
        <div>
          <label className="block text-xs font-semibold text-brand-muted mb-1">Conteúdo Completo (HTML ou Texto) *</label>
          <textarea
            value={form.conteudo}
            onChange={e => handleChange('conteudo', e.target.value)}
            required
            rows={12}
            className="w-full rounded-lg bg-brand-surface border border-brand-border px-3 py-2.5 text-brand-creme font-mono text-sm focus:outline-none focus:border-brand-laranja transition-colors resize-y"
            placeholder="<p>Escreva aqui a matéria completa...</p>"
          />
        </div>

        {/* SEO Avançado */}
        <details className="rounded-xl bg-brand-surface border border-brand-border p-4">
          <summary className="cursor-pointer text-sm font-semibold text-brand-muted">âš™️ SEO Avançado (Opcional)</summary>
          <div className="mt-4 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-brand-muted mb-1">Meta Title</label>
              <input
                type="text"
                value={form.meta_title ?? ''}
                onChange={e => handleChange('meta_title', e.target.value)}
                maxLength={70}
                className="w-full rounded-lg bg-brand-grafite border border-brand-border px-3 py-2.5 text-brand-creme focus:outline-none focus:border-brand-laranja transition-colors"
                placeholder="Título SEO (máx 70 caracteres)"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-brand-muted mb-1">Meta Description</label>
              <textarea
                value={form.meta_description ?? ''}
                onChange={e => handleChange('meta_description', e.target.value)}
                rows={2}
                maxLength={160}
                className="w-full rounded-lg bg-brand-grafite border border-brand-border px-3 py-2.5 text-brand-creme focus:outline-none focus:border-brand-laranja transition-colors resize-none"
                placeholder="Descrição SEO (máx 160 caracteres)"
              />
            </div>
          </div>
        </details>

        {/* ── SEÇÍO PUBLICAR NAS REDES SOCIAIS (WEBHOOK N8N) ── */}
        <div className="rounded-xl bg-brand-surface border border-brand-border p-5 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-brand-border pb-2.5">
            <label className="text-xs font-bold text-brand-creme flex items-center gap-2">
              <Share2 size={16} className="text-brand-laranja" />
              Publicar em Redes Sociais via Webhook (n8n)
            </label>
            <div className="flex items-center gap-2 text-xs">
              <button
                type="button"
                onClick={() => setDestinosRedes(['instagram', 'x', 'whatsapp', 'facebook'])}
                className="text-brand-laranja hover:underline font-semibold cursor-pointer"
              >
                Selecionar Todos
              </button>
              <span className="text-brand-muted">”¢</span>
              <button
                type="button"
                onClick={() => setDestinosRedes([])}
                className="text-brand-muted hover:underline cursor-pointer"
              >
                Desmarcar Todos
              </button>
            </div>
          </div>

          <p className="text-[11px] text-brand-muted">
            Selecione as redes sociais para onde o payload completo da notícia será enviado automaticamente ao salvar:
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { id: 'instagram', label: 'Instagram', icon: 'ðŸ“¸' },
              { id: 'x', label: 'X (Twitter)', icon: 'ð•' },
              { id: 'whatsapp', label: 'WhatsApp', icon: 'ðŸ’¬' },
              { id: 'facebook', label: 'Facebook', icon: 'ðŸ“˜' },
            ].map(rede => {
              const selecionado = destinosRedes.includes(rede.id as RedeSocialDestino);
              return (
                <label
                  key={rede.id}
                  className={`flex items-center gap-2.5 p-3 rounded-xl border cursor-pointer select-none transition-all ${
                    selecionado
                      ? 'bg-brand-laranja/15 border-brand-laranja text-white font-bold shadow-md'
                      : 'bg-brand-grafite border-brand-border text-brand-muted hover:text-brand-creme'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selecionado}
                    onChange={() => toggleRede(rede.id as RedeSocialDestino)}
                    className="accent-brand-laranja h-4 w-4 rounded"
                  />
                  <span className="text-base">{rede.icon}</span>
                  <span className="text-xs">{rede.label}</span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Botão Salvar */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-brand-border">
          <Link
            href="/admin"
            className="rounded-full border border-brand-border px-5 py-2.5 text-sm text-brand-muted hover:text-brand-creme transition-colors"
          >
            Cancelar
          </Link>
          <button
            type="submit"
            disabled={salvando || uploading}
            className="flex items-center gap-2 rounded-full bg-brand-laranja px-6 py-2.5 text-sm font-bold text-white hover:bg-brand-laranja-dark transition-colors disabled:opacity-60 cursor-pointer shadow-lg"
          >
            {salvando ? (
              <div className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
            ) : (
              <>
                <Save size={16} />
                {isEdicao ? 'Salvar Alterações' : 'Publicar Notícia'}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

