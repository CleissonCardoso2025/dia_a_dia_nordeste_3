import { useEffect, useState } from 'react';
import { supabase, insertWebStory, deleteWebStory } from '@/lib/supabase';
import { convertToWebP } from '@/lib/imageProcessor';
import type { WebStory, StorySlide, Categoria } from '@/types';
import { Plus, Trash2, X, PlaySquare, Image as ImageIcon, Upload, Loader2 } from 'lucide-react';

interface WebStoriesManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function WebStoriesManagerModal({ isOpen, onClose }: WebStoriesManagerModalProps) {
  const [stories, setStories] = useState<WebStory[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);

  const [mostrarForm, setMostrarForm] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [uploadingState, setUploadingState] = useState<{ capa: boolean, slides: Record<number, boolean> }>({ capa: false, slides: {} });
  
  const [form, setForm] = useState<{
    titulo: string;
    categoriaId: string;
    capaUrl: string;
    slides: StorySlide[];
  }>({
    titulo: '',
    categoriaId: '',
    capaUrl: '',
    slides: [],
  });

  const carregarDados = async () => {
    setLoading(true);
    const [resStories, resCategorias] = await Promise.all([
      supabase.from('web_stories').select('*').order('criadoEm', { ascending: false }),
      supabase.from('categorias').select('*').eq('tipo', 'editorial').order('nome', { ascending: true })
    ]);

    if (resStories.data) setStories(resStories.data as WebStory[]);
    if (resCategorias.data) setCategorias(resCategorias.data as Categoria[]);
    setLoading(false);
  };

  useEffect(() => {
    if (isOpen) carregarDados();
  }, [isOpen]);

  const addSlide = () => {
    setForm(prev => ({
      ...prev,
      slides: [
        ...prev.slides,
        { id: `s-${Date.now()}`, imagemUrl: '', titulo: '', texto: '', linkSaibaMais: '' }
      ]
    }));
  };

  const updateSlide = (index: number, field: keyof StorySlide, value: string) => {
    const newSlides = [...form.slides];
    newSlides[index] = { ...newSlides[index], [field]: value };
    setForm(prev => ({ ...prev, slides: newSlides }));
  };

  const removeSlide = (index: number) => {
    const newSlides = [...form.slides];
    newSlides.splice(index, 1);
    setForm(prev => ({ ...prev, slides: newSlides }));
  };

  const handleSalvar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.titulo || !form.categoriaId || !form.capaUrl || form.slides.length === 0) {
      alert('Preencha os campos obrigatórios e adicione pelo menos 1 slide.');
      return;
    }

    setSalvando(true);
    const cat = categorias.find(c => c.id === form.categoriaId);
    
    if (!cat) {
      alert('Categoria inválida.');
      setSalvando(false);
      return;
    }

    const { error } = await insertWebStory({
      titulo: form.titulo,
      categoria: cat.nome,
      corCategoria: cat.cor_hex,
      capaUrl: form.capaUrl,
      slides: form.slides
    });

    if (error) {
      alert('Erro ao salvar story: ' + error.message);
    } else {
      setForm({ titulo: '', categoriaId: '', capaUrl: '', slides: [] });
      setMostrarForm(false);
      carregarDados();
    }
    setSalvando(false);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'capa' | 'slide', index?: number) => {
    let file = e.target.files?.[0];
    if (!file) return;

    if (type === 'capa') {
      setUploadingState(prev => ({ ...prev, capa: true }));
    } else if (index !== undefined) {
      setUploadingState(prev => ({ ...prev, slides: { ...prev.slides, [index]: true } }));
    }

    try {
      file = await convertToWebP(file);
      const fileExt = file.name.split('.').pop() || 'webp';
      const fileName = `webstories/${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('imagens')
        .upload(fileName, file, { cacheControl: '3600', upsert: true });

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage
        .from('imagens')
        .getPublicUrl(fileName);

      if (publicUrlData?.publicUrl) {
        if (type === 'capa') {
          setForm(prev => ({ ...prev, capaUrl: publicUrlData.publicUrl }));
        } else if (index !== undefined) {
          updateSlide(index, 'imagemUrl', publicUrlData.publicUrl);
        }
      }
    } catch (err: unknown) {
      const errorObj = err as { message?: string };
      alert('Erro ao enviar imagem: ' + (errorObj.message || 'Falha no upload'));
    } finally {
      if (type === 'capa') {
        setUploadingState(prev => ({ ...prev, capa: false }));
      } else if (index !== undefined) {
        setUploadingState(prev => ({ ...prev, slides: { ...prev.slides, [index]: false } }));
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este Story?')) return;
    
    setLoading(true);
    const { error } = await deleteWebStory(id);
    if (error) alert('Erro ao deletar: ' + error.message);
    else carregarDados();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-brand-surface w-full max-w-5xl rounded-2xl border border-brand-border shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header Modal */}
        <div className="flex items-center justify-between p-6 border-b border-brand-border">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-brand-laranja/10 rounded-lg text-brand-laranja">
              <PlaySquare size={24} />
            </div>
            <div>
              <h2 className="text-xl font-titulo font-bold text-brand-creme">Gerenciar Web Stories</h2>
              <p className="text-sm text-brand-muted">Adicione ou remova stories da página inicial</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-brand-muted hover:text-brand-creme hover:bg-brand-grafite rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content Modal */}
        <div className="p-6 overflow-y-auto flex-1">
          {/* Header Ações */}
          {!mostrarForm && (
            <div className="flex justify-end mb-6">
              <button
                onClick={() => setMostrarForm(true)}
                className="flex items-center gap-2 bg-brand-laranja hover:bg-brand-laranja-dark text-white px-4 py-2 rounded-lg font-bold text-sm transition-colors"
              >
                <Plus size={16} />
                Novo Story
              </button>
            </div>
          )}

          {/* Formulário */}
          {mostrarForm && (
            <div className="bg-brand-grafite p-6 rounded-xl border border-brand-border mb-6">
              <h3 className="text-brand-creme font-bold mb-4">Novo Web Story</h3>
              <form onSubmit={handleSalvar} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-brand-muted mb-1">Título da Capa *</label>
                    <input
                      type="text"
                      required
                      value={form.titulo}
                      onChange={e => setForm({ ...form, titulo: e.target.value })}
                      className="w-full bg-brand-surface border border-brand-border rounded-lg px-4 py-2 text-brand-creme focus:outline-none focus:border-brand-laranja"
                      placeholder="Ex: Avanços na Saúde..."
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-brand-muted mb-1">Editorial (Categoria) *</label>
                    <select
                      required
                      value={form.categoriaId}
                      onChange={e => setForm({ ...form, categoriaId: e.target.value })}
                      className="w-full bg-brand-surface border border-brand-border rounded-lg px-4 py-2 text-brand-creme focus:outline-none focus:border-brand-laranja"
                    >
                      <option value="" disabled>Selecione uma categoria...</option>
                      {categorias.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.nome}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-brand-muted mb-1">Imagem de Capa *</label>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      required
                      value={form.capaUrl}
                      onChange={e => setForm({ ...form, capaUrl: e.target.value })}
                      className="flex-1 bg-brand-surface border border-brand-border rounded-lg px-4 py-2 text-brand-creme focus:outline-none focus:border-brand-laranja"
                      placeholder="URL da imagem (https://...)"
                    />
                    <label className="flex items-center gap-2 bg-brand-grafite border border-brand-border hover:border-brand-laranja text-brand-creme px-4 py-2 rounded-lg cursor-pointer transition-colors shrink-0">
                      {uploadingState.capa ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
                      <span className="text-sm font-bold">{uploadingState.capa ? 'Enviando...' : 'Upload'}</span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={e => handleFileUpload(e, 'capa')}
                        disabled={uploadingState.capa}
                      />
                    </label>
                  </div>
                  {form.capaUrl && (
                    <div className="mt-2 w-32 h-48 rounded-lg overflow-hidden border border-brand-border relative group">
                      <img src={form.capaUrl} alt="Capa preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>

                {/* Slides Section */}
                <div className="border-t border-brand-border pt-4 mt-4">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-bold text-brand-creme">Slides do Story ({form.slides.length})</h4>
                    <button
                      type="button"
                      onClick={addSlide}
                      className="flex items-center gap-2 text-xs font-bold bg-brand-surface border border-brand-border hover:border-brand-laranja text-brand-creme px-3 py-1.5 rounded-lg transition-colors"
                    >
                      <Plus size={14} /> Adicionar Slide
                    </button>
                  </div>

                  {form.slides.length === 0 && (
                    <div className="text-center py-6 text-sm text-brand-muted bg-brand-surface rounded-lg border border-dashed border-brand-border">
                      Nenhum slide adicionado. Adicione pelo menos 1 slide para continuar.
                    </div>
                  )}

                  <div className="space-y-4">
                    {form.slides.map((slide, index) => (
                      <div key={slide.id || index} className="bg-brand-surface p-4 rounded-lg border border-brand-border relative group">
                        <button
                          type="button"
                          onClick={() => removeSlide(index)}
                          className="absolute top-2 right-2 p-1.5 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white rounded-md transition-colors opacity-0 group-hover:opacity-100"
                          title="Remover Slide"
                        >
                          <Trash2 size={14} />
                        </button>
                        
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                          <div className="md:col-span-3">
                            <label className="block text-xs font-semibold text-brand-muted mb-1">Imagem URL *</label>
                            
                            <div className="flex gap-2">
                              <input
                                type="url"
                                required
                                value={slide.imagemUrl}
                                onChange={e => updateSlide(index, 'imagemUrl', e.target.value)}
                                className="w-full bg-brand-grafite border border-brand-border rounded-lg px-3 py-1.5 text-sm text-brand-creme"
                                placeholder="URL da imagem..."
                              />
                              <label className="flex items-center justify-center bg-brand-grafite border border-brand-border hover:border-brand-laranja text-brand-creme px-2 py-1.5 rounded-lg cursor-pointer transition-colors shrink-0" title="Fazer Upload">
                                {uploadingState.slides[index] ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
                                <input 
                                  type="file" 
                                  accept="image/*" 
                                  className="hidden" 
                                  onChange={e => handleFileUpload(e, 'slide', index)}
                                  disabled={uploadingState.slides[index]}
                                />
                              </label>
                            </div>

                            {slide.imagemUrl ? (
                              <img src={slide.imagemUrl} className="mt-2 w-full h-32 object-cover rounded-lg border border-brand-border" />
                            ) : (
                              <div className="mt-2 w-full h-32 bg-brand-grafite rounded-lg border border-brand-border flex items-center justify-center text-brand-muted relative">
                                {uploadingState.slides[index] ? <Loader2 size={24} className="animate-spin text-brand-laranja" /> : <ImageIcon size={24} />}
                              </div>
                            )}
                          </div>
                          <div className="md:col-span-9 space-y-3">
                            <div>
                              <label className="block text-xs font-semibold text-brand-muted mb-1">Título do Slide *</label>
                              <input
                                type="text"
                                required
                                value={slide.titulo}
                                onChange={e => updateSlide(index, 'titulo', e.target.value)}
                                className="w-full bg-brand-grafite border border-brand-border rounded-lg px-3 py-1.5 text-sm text-brand-creme"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-semibold text-brand-muted mb-1">Texto *</label>
                              <textarea
                                required
                                rows={2}
                                value={slide.texto}
                                onChange={e => updateSlide(index, 'texto', e.target.value)}
                                className="w-full bg-brand-grafite border border-brand-border rounded-lg px-3 py-1.5 text-sm text-brand-creme"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-semibold text-brand-muted mb-1">Link "Saiba Mais" (Opcional)</label>
                              <input
                                type="text"
                                value={slide.linkSaibaMais || ''}
                                onChange={e => updateSlide(index, 'linkSaibaMais', e.target.value)}
                                className="w-full bg-brand-grafite border border-brand-border rounded-lg px-3 py-1.5 text-sm text-brand-creme"
                                placeholder="/categoria ou https://..."
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-brand-border">
                  <button
                    type="button"
                    onClick={() => setMostrarForm(false)}
                    className="px-4 py-2 text-sm font-bold text-brand-muted hover:text-brand-creme transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={salvando || form.slides.length === 0}
                    className="bg-brand-laranja hover:bg-brand-laranja-dark text-white px-6 py-2 rounded-lg font-bold text-sm transition-colors disabled:opacity-50"
                  >
                    {salvando ? 'Salvando...' : 'Salvar Story'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Lista de Stories */}
          {loading ? (
            <div className="text-center py-12 text-brand-muted">Carregando stories...</div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {stories.map(story => (
                <div key={story.id} className="bg-brand-grafite rounded-xl overflow-hidden border border-brand-border group">
                  <div className="relative aspect-9/16">
                    <img src={story.capaUrl} alt={story.titulo} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute top-2 left-2">
                      <span className="px-2 py-1 rounded text-[10px] font-bold text-white shadow-sm" style={{ backgroundColor: story.corCategoria }}>
                        {story.categoria}
                      </span>
                    </div>
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => story.id && handleDelete(story.id)}
                        className="p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-md shadow-lg transition-colors"
                        title="Excluir"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                    <div className="absolute bottom-2 left-2 right-2">
                      <p className="text-xs font-bold text-white line-clamp-3 leading-tight">
                        {story.titulo}
                      </p>
                      <p className="text-[10px] text-brand-muted mt-1">
                        {story.slides.length} slides
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
