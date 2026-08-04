import { useEffect, useState } from 'react';
import { supabase, insertCategoria } from '@/lib/supabase';
import type { Categoria } from '@/types';
import { Plus, Trash2, X, Tag } from 'lucide-react';

interface CategoryManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CategoryManagerModal({ isOpen, onClose }: CategoryManagerModalProps) {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);

  const [mostrarForm, setMostrarForm] = useState(false);
  const [salvando, setSalvando] = useState(false);
  
  const [form, setForm] = useState<{
    nome: string;
    cor_hex: string;
    tipo: 'municipio' | 'editorial';
  }>({
    nome: '',
    cor_hex: '#1e3a8a',
    tipo: 'municipio',
  });

  const carregarCategorias = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('categorias')
      .select('*')
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

  const handleSalvar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nome) return;

    setSalvando(true);
    const slug = gerarSlug(form.nome);

    const { error } = await insertCategoria({
      nome: form.nome,
      slug,
      cor_hex: form.cor_hex,
      tipo: form.tipo
    });

    if (error) {
      alert('Erro ao salvar categoria: ' + error.message);
    } else {
      setForm({ nome: '', cor_hex: '#1e3a8a', tipo: 'municipio' });
      setMostrarForm(false);
      carregarCategorias();
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-brand-surface w-full max-w-4xl rounded-2xl border border-brand-border shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header Modal */}
        <div className="flex items-center justify-between p-6 border-b border-brand-border">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-brand-laranja/10 rounded-lg text-brand-laranja">
              <Tag size={24} />
            </div>
            <div>
              <h2 className="text-xl font-titulo font-bold text-brand-creme">Gerenciar Categorias</h2>
              <p className="text-sm text-brand-muted">Adicione ou remova cidades e editorias</p>
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
                Nova Categoria
              </button>
            </div>
          )}

          {/* Formulário */}
          {mostrarForm && (
            <div className="bg-brand-grafite p-6 rounded-xl border border-brand-border mb-6">
              <h3 className="text-brand-creme font-bold mb-4">Nova Categoria</h3>
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
                      placeholder="Ex: Piauí, Tecnologia, etc"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-brand-muted mb-1">Tipo *</label>
                    <select
                      value={form.tipo}
                      onChange={e => setForm({ ...form, tipo: e.target.value as 'municipio' | 'editorial' })}
                      className="w-full bg-brand-surface border border-brand-border rounded-lg px-4 py-2 text-brand-creme focus:outline-none focus:border-brand-laranja"
                    >
                      <option value="municipio">Município (Home - Cidades)</option>
                      <option value="editorial">Editorial (Home - Web Stories / Navbar)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-brand-muted mb-1">Cor Hexadecimal * (Usada nos cards e destaques)</label>
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
                      className="w-32 bg-brand-surface border border-brand-border rounded-lg px-4 py-2 text-brand-creme focus:outline-none focus:border-brand-laranja"
                      placeholder="#000000"
                    />
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
                    disabled={salvando}
                    className="bg-brand-laranja hover:bg-brand-laranja-dark text-white px-6 py-2 rounded-lg font-bold text-sm transition-colors disabled:opacity-50"
                  >
                    {salvando ? 'Salvando...' : 'Salvar Categoria'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Lista de Categorias */}
          {loading ? (
            <div className="text-center py-12 text-brand-muted">Carregando categorias...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-brand-muted uppercase bg-brand-grafite border-y border-brand-border">
                  <tr>
                    <th className="px-4 py-3">Cor</th>
                    <th className="px-4 py-3">Nome</th>
                    <th className="px-4 py-3">Slug</th>
                    <th className="px-4 py-3">Tipo</th>
                    <th className="px-4 py-3 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-border">
                  {categorias.map(cat => (
                    <tr key={cat.id} className="hover:bg-brand-grafite/50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="w-6 h-6 rounded-md shadow-sm" style={{ backgroundColor: cat.cor_hex }} />
                      </td>
                      <td className="px-4 py-3 font-semibold text-brand-creme">{cat.nome}</td>
                      <td className="px-4 py-3 text-brand-muted font-mono">{cat.slug}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded text-xs font-bold ${
                          cat.tipo === 'editorial' ? 'bg-purple-500/20 text-purple-400' : 'bg-blue-500/20 text-blue-400'
                        }`}>
                          {cat.tipo === 'editorial' ? 'Editorial' : 'Município'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => handleDelete(cat.id)}
                          className="text-red-400 hover:text-red-300 p-2 hover:bg-red-400/10 rounded-lg transition-colors"
                          title="Excluir"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
