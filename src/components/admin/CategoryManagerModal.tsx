import { useEffect, useState } from 'react';
import { supabase, insertCategoria, updateCategoria } from '@/lib/supabase';
import type { Categoria } from '@/types';
import { Plus, Trash2, X, Tag, Copy, Check, Edit2, Zap, User } from 'lucide-react';

interface CategoryManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AUTOR_PADRAO_ID = '1e79060a-b850-4054-ae69-783db846d5fd';

export default function CategoryManagerModal({ isOpen, onClose }: CategoryManagerModalProps) {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);

  const [mostrarForm, setMostrarForm] = useState(false);
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [salvando, setSalvando] = useState(false);
  const [copiadoId, setCopiadoId] = useState<string | null>(null);
  
  const [form, setForm] = useState<{
    nome: string;
    cor_hex: string;
    tipo: 'municipio' | 'editorial';
  }>({
    nome: '',
    cor_hex: '#1e3a8a',
    tipo: 'editorial',
  });

  const carregarCategorias = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('categorias')
      .select('*')
      .order('tipo', { ascending: false })
      .order('nome', { ascending: true });

    if (data) setCategorias(data as Categoria[]);
    setLoading(false);
  };

  useEffect(() => {
    if (isOpen) carregarCategorias();
  }, [isOpen]);

  const gerarSlug = (nome: string) => {
    return nome
      .toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, "")
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-');
  };

  const handleCopiar = (texto: string, id: string) => {
    navigator.clipboard.writeText(texto);
    setCopiadoId(id);
    setTimeout(() => {
      setCopiadoId(null);
    }, 2000);
  };

  const handleIniciarEdicao = (cat: Categoria) => {
    setEditandoId(cat.id);
    setForm({
      nome: cat.nome,
      cor_hex: cat.cor_hex || '#1e3a8a',
      tipo: cat.tipo || 'editorial',
    });
    setMostrarForm(true);
  };

  const handleCancelarForm = () => {
    setMostrarForm(false);
    setEditandoId(null);
    setForm({ nome: '', cor_hex: '#1e3a8a', tipo: 'editorial' });
  };

  const handleSalvar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nome) return;

    setSalvando(true);
    const slug = gerarSlug(form.nome);

    if (editandoId) {
      // Atualização
      const { error } = await updateCategoria(editandoId, {
        nome: form.nome,
        slug,
        cor_hex: form.cor_hex,
        tipo: form.tipo,
      });

      if (error) {
        alert('Erro ao atualizar categoria: ' + error.message);
      } else {
        handleCancelarForm();
        carregarCategorias();
      }
    } else {
      // Inserção
      const { error } = await insertCategoria({
        nome: form.nome,
        slug,
        cor_hex: form.cor_hex,
        tipo: form.tipo,
      });

      if (error) {
        alert('Erro ao salvar categoria: ' + error.message);
      } else {
        handleCancelarForm();
        carregarCategorias();
      }
    }
    setSalvando(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza? Notícias vinculadas a esta categoria ficarão sem categoria. Esta ação não pode ser desfeita.')) return;
    
    setLoading(true);
    const { error } = await supabase.from('categorias').delete().eq('id', id);
    if (error) alert('Erro ao deletar: ' + error.message);
    else carregarCategorias();
  };

  if (!isOpen) return null;

  // Categorias principais para retaguarda n8n
  const catBahia = categorias.find(c => c.slug === 'bahia' || c.nome.toLowerCase().includes('bahia'));
  const catBrasil = categorias.find(c => c.slug === 'brasil' || c.nome.toLowerCase().includes('brasil'));
  const catGeral = categorias.find(c => c.slug === 'geral' || c.nome.toLowerCase() === 'geral');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-brand-surface w-full max-w-5xl rounded-2xl border border-brand-border shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header Modal */}
        <div className="flex items-center justify-between p-6 border-b border-brand-border">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-brand-laranja/10 rounded-lg text-brand-laranja">
              <Tag size={24} />
            </div>
            <div>
              <h2 className="text-xl font-titulo font-bold text-brand-creme">Gerenciar Categorias & Retaguarda</h2>
              <p className="text-sm text-brand-muted">Consulte os IDs para os nós do n8n, edite nomes e padronize editorias</p>
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
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          
          {/* Card de Destaque: IDs Rápidos para os Nodes do n8n */}
          <div className="bg-brand-grafite/80 border border-brand-border rounded-xl p-4 sm:p-5">
            <div className="flex items-center gap-2 mb-3">
              <Zap size={18} className="text-brand-laranja" />
              <h3 className="font-titulo font-bold text-brand-creme text-sm uppercase tracking-wider">
                IDs Rápidos para Postagens Automáticas (n8n / Supabase)
              </h3>
            </div>
            <p className="text-xs text-brand-muted mb-4">
              Copie o ID diretamente para o campo <code className="text-brand-laranja font-mono bg-black/30 px-1 py-0.5 rounded">categoria_id</code> ou <code className="text-brand-laranja font-mono bg-black/30 px-1 py-0.5 rounded">autor_id</code> no node do Supabase:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* Bahia em Pauta */}
              <div className="bg-brand-surface border border-brand-border rounded-lg p-3 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-blue-400">Bahia em Pauta</span>
                    <span className="text-[10px] bg-blue-500/20 text-blue-300 px-1.5 py-0.5 rounded">Estadual</span>
                  </div>
                  <p className="text-[11px] font-mono text-brand-muted truncate mb-2">
                    {catBahia?.id || '91925efe-8c0d-42a7-8e21-1d167b8f670b'}
                  </p>
                </div>
                <button
                  onClick={() => handleCopiar(catBahia?.id || '91925efe-8c0d-42a7-8e21-1d167b8f670b', 'bahia')}
                  className="flex items-center justify-center gap-1.5 w-full py-1.5 px-2 bg-brand-grafite hover:bg-brand-laranja/20 hover:text-brand-laranja border border-brand-border rounded text-xs font-semibold text-brand-creme transition-colors"
                >
                  {copiadoId === 'bahia' ? <Check size={13} className="text-green-400" /> : <Copy size={13} />}
                  <span>{copiadoId === 'bahia' ? 'Copiado!' : 'Copiar ID'}</span>
                </button>
              </div>

              {/* Panorama Brasil */}
              <div className="bg-brand-surface border border-brand-border rounded-lg p-3 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-yellow-400">Panorama Brasil</span>
                    <span className="text-[10px] bg-yellow-500/20 text-yellow-300 px-1.5 py-0.5 rounded">Nacional</span>
                  </div>
                  <p className="text-[11px] font-mono text-brand-muted truncate mb-2">
                    {catBrasil?.id || '29041cc7-195c-4973-b71d-c3c5e37c70bf'}
                  </p>
                </div>
                <button
                  onClick={() => handleCopiar(catBrasil?.id || '29041cc7-195c-4973-b71d-c3c5e37c70bf', 'brasil')}
                  className="flex items-center justify-center gap-1.5 w-full py-1.5 px-2 bg-brand-grafite hover:bg-brand-laranja/20 hover:text-brand-laranja border border-brand-border rounded text-xs font-semibold text-brand-creme transition-colors"
                >
                  {copiadoId === 'brasil' ? <Check size={13} className="text-green-400" /> : <Copy size={13} />}
                  <span>{copiadoId === 'brasil' ? 'Copiado!' : 'Copiar ID'}</span>
                </button>
              </div>

              {/* Geral */}
              <div className="bg-brand-surface border border-brand-border rounded-lg p-3 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-purple-400">Geral</span>
                    <span className="text-[10px] bg-purple-500/20 text-purple-300 px-1.5 py-0.5 rounded">Editorial</span>
                  </div>
                  <p className="text-[11px] font-mono text-brand-muted truncate mb-2">
                    {catGeral?.id || 'f81c2e96-05fa-4855-aa9b-13397b237ead'}
                  </p>
                </div>
                <button
                  onClick={() => handleCopiar(catGeral?.id || 'f81c2e96-05fa-4855-aa9b-13397b237ead', 'geral')}
                  className="flex items-center justify-center gap-1.5 w-full py-1.5 px-2 bg-brand-grafite hover:bg-brand-laranja/20 hover:text-brand-laranja border border-brand-border rounded text-xs font-semibold text-brand-creme transition-colors"
                >
                  {copiadoId === 'geral' ? <Check size={13} className="text-green-400" /> : <Copy size={13} />}
                  <span>{copiadoId === 'geral' ? 'Copiado!' : 'Copiar ID'}</span>
                </button>
              </div>

              {/* Autor Padrão (Redação) */}
              <div className="bg-brand-surface border border-brand-border rounded-lg p-3 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-brand-laranja flex items-center gap-1">
                      <User size={12} /> Redação (Autor)
                    </span>
                    <span className="text-[10px] bg-brand-laranja/20 text-brand-laranja px-1.5 py-0.5 rounded">Padrão</span>
                  </div>
                  <p className="text-[11px] font-mono text-brand-muted truncate mb-2">
                    {AUTOR_PADRAO_ID}
                  </p>
                </div>
                <button
                  onClick={() => handleCopiar(AUTOR_PADRAO_ID, 'autor')}
                  className="flex items-center justify-center gap-1.5 w-full py-1.5 px-2 bg-brand-grafite hover:bg-brand-laranja/20 hover:text-brand-laranja border border-brand-border rounded text-xs font-semibold text-brand-creme transition-colors"
                >
                  {copiadoId === 'autor' ? <Check size={13} className="text-green-400" /> : <Copy size={13} />}
                  <span>{copiadoId === 'autor' ? 'Copiado!' : 'Copiar ID'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Header Ações */}
          {!mostrarForm && (
            <div className="flex justify-between items-center">
              <span className="text-xs text-brand-muted">
                Total de categorias: <strong className="text-brand-creme">{categorias.length}</strong>
              </span>
              <button
                onClick={() => {
                  setEditandoId(null);
                  setForm({ nome: '', cor_hex: '#1e3a8a', tipo: 'editorial' });
                  setMostrarForm(true);
                }}
                className="flex items-center gap-2 bg-brand-laranja hover:bg-brand-laranja-dark text-white px-4 py-2 rounded-lg font-bold text-sm transition-colors shadow-sm"
              >
                <Plus size={16} />
                Nova Categoria
              </button>
            </div>
          )}

          {/* Formulário de Criação / Edição */}
          {mostrarForm && (
            <div className="bg-brand-grafite p-6 rounded-xl border border-brand-border">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-brand-creme font-bold">
                  {editandoId ? 'Editar Categoria' : 'Nova Categoria'}
                </h3>
                {editandoId && (
                  <span className="text-xs font-mono text-brand-muted">ID: {editandoId}</span>
                )}
              </div>
              <form onSubmit={handleSalvar} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-brand-muted mb-1">Nome *</label>
                    <input
                      type="text"
                      required
                      value={form.nome}
                      onChange={e => setForm({ ...form, nome: e.target.value })}
                      className="w-full bg-brand-surface border border-brand-border rounded-lg px-4 py-2 text-brand-creme focus:outline-none focus:border-brand-laranja"
                      placeholder="Ex: Bahia em Pauta, Panorama Brasil, etc"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-brand-muted mb-1">Tipo *</label>
                    <select
                      value={form.tipo}
                      onChange={e => setForm({ ...form, tipo: e.target.value as 'municipio' | 'editorial' })}
                      className="w-full bg-brand-surface border border-brand-border rounded-lg px-4 py-2 text-brand-creme focus:outline-none focus:border-brand-laranja"
                    >
                      <option value="editorial">Editorial (Bahia, Brasil, Geral e Editorias)</option>
                      <option value="municipio">Município (Semiárido Nordeste II - Carrossel)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-brand-muted mb-1">Cor Hexadecimal * (Usada nos badges e cards)</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      required
                      value={form.cor_hex}
                      onChange={e => setForm({ ...form, cor_hex: e.target.value })}
                      className="h-10 w-16 bg-brand-surface border border-brand-border rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      required
                      value={form.cor_hex}
                      onChange={e => setForm({ ...form, cor_hex: e.target.value })}
                      className="w-32 bg-brand-surface border border-brand-border rounded-lg px-4 py-2 text-brand-creme focus:outline-none focus:border-brand-laranja font-mono"
                      placeholder="#000000"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-brand-border">
                  <button
                    type="button"
                    onClick={handleCancelarForm}
                    className="px-4 py-2 text-sm font-bold text-brand-muted hover:text-brand-creme transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={salvando}
                    className="bg-brand-laranja hover:bg-brand-laranja-dark text-white px-6 py-2 rounded-lg font-bold text-sm transition-colors disabled:opacity-50"
                  >
                    {salvando ? 'Salvando...' : editandoId ? 'Atualizar Categoria' : 'Salvar Categoria'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Lista Completa de Categorias */}
          {loading ? (
            <div className="text-center py-12 text-brand-muted">Carregando categorias...</div>
          ) : (
            <div className="overflow-x-auto border border-brand-border rounded-xl">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-brand-muted uppercase bg-brand-grafite border-b border-brand-border">
                  <tr>
                    <th className="px-3 py-3 w-12">Cor</th>
                    <th className="px-4 py-3">Nome</th>
                    <th className="px-4 py-3">Slug</th>
                    <th className="px-4 py-3">Tipo</th>
                    <th className="px-4 py-3">ID Supabase (para n8n)</th>
                    <th className="px-4 py-3 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-border bg-brand-surface">
                  {categorias.map(cat => {
                    const isPrincipal = ['bahia', 'brasil', 'geral'].includes(cat.slug) || 
                                       cat.nome.toLowerCase().includes('bahia') || 
                                       cat.nome.toLowerCase().includes('brasil');
                    return (
                      <tr 
                        key={cat.id} 
                        className={`hover:bg-brand-grafite/50 transition-colors ${
                          isPrincipal ? 'bg-brand-laranja/5' : ''
                        }`}
                      >
                        <td className="px-3 py-3">
                          <div className="w-5 h-5 rounded-md shadow-sm border border-black/20" style={{ backgroundColor: cat.cor_hex }} />
                        </td>
                        <td className="px-4 py-3 font-semibold text-brand-creme">
                          <div className="flex items-center gap-1.5">
                            <span>{cat.nome}</span>
                            {isPrincipal && (
                              <span className="text-[10px] bg-brand-laranja/20 text-brand-laranja px-1.5 py-0.2 rounded font-bold">
                                Destaque
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-brand-muted font-mono text-xs">{cat.slug}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                            cat.tipo === 'editorial' ? 'bg-purple-500/20 text-purple-400' : 'bg-blue-500/20 text-blue-400'
                          }`}>
                            {cat.tipo === 'editorial' ? 'Editorial' : 'Município'}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <code className="text-xs font-mono text-brand-muted truncate max-w-35 sm:max-w-50" title={cat.id}>
                              {cat.id}
                            </code>
                            <button
                              onClick={() => handleCopiar(cat.id, cat.id)}
                              className="p-1 hover:bg-brand-grafite text-brand-muted hover:text-brand-creme rounded transition-colors"
                              title="Copiar UUID para o n8n"
                            >
                              {copiadoId === cat.id ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                            </button>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => handleIniciarEdicao(cat)}
                              className="text-brand-muted hover:text-brand-creme p-1.5 hover:bg-brand-grafite rounded-lg transition-colors"
                              title="Editar Nome/Cor/Tipo"
                            >
                              <Edit2 size={15} />
                            </button>
                            <button
                              onClick={() => handleDelete(cat.id)}
                              className="text-red-400 hover:text-red-300 p-1.5 hover:bg-red-400/10 rounded-lg transition-colors"
                              title="Excluir Categoria"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
