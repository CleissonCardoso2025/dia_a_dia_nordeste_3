import { useEffect, useState, useRef } from 'react';
import { supabase, insertMidiaAvulsa, getMidiasAvulsas, deleteMidiaAvulsa } from '@/lib/supabase';
import { Image as ImageIcon, Upload, X, Copy, Check, Trash2, Loader2 } from 'lucide-react';

interface MediaManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MediaManagerModal({ isOpen, onClose }: MediaManagerModalProps) {
  const [midias, setMidias] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [uploading, setUploading] = useState(false);
  const [titulo, setTitulo] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const carregarDados = async () => {
    setLoading(true);
    const { data } = await getMidiasAvulsas();
    if (data) setMidias(data);
    setLoading(false);
  };

  useEffect(() => {
    if (isOpen) carregarDados();
  }, [isOpen]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!titulo.trim()) {
      alert('Por favor, digite um título para a imagem antes de fazer o upload.');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop() || 'jpg';
      const fileName = `galeria/${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('imagens')
        .upload(fileName, file, { cacheControl: '3600', upsert: true });

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage
        .from('imagens')
        .getPublicUrl(fileName);

      if (publicUrlData?.publicUrl) {
        const { error: dbError } = await insertMidiaAvulsa({
          titulo: titulo.trim(),
          url: publicUrlData.publicUrl
        });

        if (dbError) throw dbError;
        
        setTitulo('');
        if (fileInputRef.current) fileInputRef.current.value = '';
        carregarDados();
      }
    } catch (err: unknown) {
      const errorObj = err as { message?: string };
      alert('Erro ao enviar imagem: ' + (errorObj.message || 'Falha no upload'));
    } finally {
      setUploading(false);
    }
  };

  const handleCopyUrl = (id: string, url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta mídia do banco? (O arquivo original não será apagado)')) return;
    setLoading(true);
    await deleteMidiaAvulsa(id);
    carregarDados();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-brand-surface w-full max-w-4xl rounded-2xl border border-brand-border shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-brand-border">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-brand-laranja/10 rounded-lg text-brand-laranja">
              <ImageIcon size={24} />
            </div>
            <div>
              <h2 className="text-xl font-titulo font-bold text-brand-creme">Gerenciador de Mídia (Bucket)</h2>
              <p className="text-sm text-brand-muted">Faça upload de imagens e gere links diretos</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-brand-muted hover:text-brand-creme hover:bg-brand-grafite rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1">
          
          {/* Nova Mídia Upload */}
          <div className="bg-brand-grafite p-6 rounded-xl border border-brand-border mb-8">
            <h3 className="text-brand-creme font-bold mb-4">Adicionar Nova Imagem</h3>
            <div className="flex flex-col md:flex-row gap-4 items-end">
              <div className="flex-1 w-full">
                <label className="block text-xs font-semibold text-brand-muted mb-1">Título/Identificação da Imagem *</label>
                <input
                  type="text"
                  required
                  value={titulo}
                  onChange={e => setTitulo(e.target.value)}
                  className="w-full bg-brand-surface border border-brand-border rounded-lg px-4 py-2 text-brand-creme focus:outline-none focus:border-brand-laranja"
                  placeholder="Ex: Logo do Patrocinador 2026"
                />
              </div>
              <label className={`flex items-center justify-center gap-2 px-6 py-2 rounded-lg font-bold text-sm transition-colors cursor-pointer shrink-0 ${
                uploading || !titulo.trim()
                  ? 'bg-brand-laranja/50 text-white/50 cursor-not-allowed'
                  : 'bg-brand-laranja hover:bg-brand-laranja-dark text-white'
              }`}>
                {uploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
                {uploading ? 'Enviando...' : 'Fazer Upload para o Bucket'}
                <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handleFileUpload}
                  disabled={uploading || !titulo.trim()}
                  ref={fileInputRef}
                />
              </label>
            </div>
          </div>

          {/* Galeria */}
          <h3 className="text-brand-creme font-bold mb-4">Galeria de Mídias ({midias.length})</h3>
          
          {loading ? (
            <div className="text-center py-12 text-brand-muted">Carregando mídias...</div>
          ) : midias.length === 0 ? (
            <div className="text-center py-12 text-sm text-brand-muted bg-brand-grafite rounded-xl border border-dashed border-brand-border">
              Nenhuma mídia enviada ainda.
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {midias.map(midia => (
                <div key={midia.id} className="bg-brand-grafite rounded-xl overflow-hidden border border-brand-border group flex flex-col">
                  <div className="relative aspect-video bg-black/20">
                    <img src={midia.url} alt={midia.titulo} className="w-full h-full object-cover" />
                    <button
                      onClick={() => handleDelete(midia.id)}
                      className="absolute top-2 right-2 p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-all"
                      title="Excluir Mídia"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <div className="p-3 flex-1 flex flex-col justify-between">
                    <p className="text-sm font-bold text-brand-creme mb-3 line-clamp-2" title={midia.titulo}>
                      {midia.titulo}
                    </p>
                    <button
                      onClick={() => handleCopyUrl(midia.id, midia.url)}
                      className={`w-full flex items-center justify-center gap-2 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                        copiedId === midia.id 
                          ? 'bg-green-500/20 text-green-400 border border-green-500/50'
                          : 'bg-brand-surface border border-brand-border text-brand-muted hover:text-brand-creme hover:border-brand-laranja'
                      }`}
                    >
                      {copiedId === midia.id ? (
                        <>
                          <Check size={14} /> Copiado!
                        </>
                      ) : (
                        <>
                          <Copy size={14} /> Copiar URL
                        </>
                      )}
                    </button>
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
