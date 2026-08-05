import { Link } from 'react-router-dom';
import { MessageCircle, Mail, Instagram, Share2 } from 'lucide-react';

const SECOES = [
  { nome: 'Início / Destaques', href: '/#destaques' },
  { nome: 'Notícias por Município', href: '/#municipios' },
  { nome: 'Web Stories', href: '/#stories' },
  { nome: 'Mais Acessadas', href: '/#mais-acessadas' },
  { nome: 'Pesquisar Notícias', href: '/busca' },
  { nome: 'Feed RSS 2.0', href: '/rss' },
];

const REDES = [
  { icon: <Instagram size={18} />, href: 'https://instagram.com/diaadianordeste.ba', label: 'Instagram' },
  { icon: <Share2 size={18} />, href: '#', label: 'Compartilhar' },
];

export default function Footer() {
  const ano = new Date().getFullYear();

  const handleShare = (e: React.MouseEvent, label: string) => {
    if (label === 'Compartilhar') {
      e.preventDefault();
      if (navigator.share) {
        navigator.share({
          title: 'Dia a Dia Nordeste',
          url: window.location.origin
        });
      }
    }
  };

  return (
    <footer className="bg-brand-surface border-t border-brand-border mt-12">
      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Sobre */}
          <div className="lg:col-span-1">
            <Link to="/" className="inline-block mb-4">
              <img
                src="https://mkbnqyhvaozqfpmcyoyw.supabase.co/storage/v1/object/public/logo/logo_%20diaadia.png"
                alt="Dia a Dia Nordeste"
                className="h-10 w-auto object-contain"
              />
            </Link>
            <p className="text-xs text-brand-muted leading-relaxed mb-4">
              <strong className="text-brand-creme block mb-1">Conectando o Semiárido</strong>
              Portal de notícias focado na região Semiárido Nordeste II da Bahia. Cobertura ágil e precisa das histórias dos 18 municípios da nossa região.
            </p>
            {/* Redes sociais */}
            <div className="flex items-center gap-2">
              {REDES.map(rede => (
                <a
                  key={rede.label}
                  href={rede.href}
                  onClick={(e) => handleShare(e, rede.label)}
                  target={rede.label !== 'Compartilhar' ? "_blank" : undefined}
                  rel={rede.label !== 'Compartilhar' ? "noopener noreferrer" : undefined}
                  aria-label={rede.label}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-grafite border border-brand-border text-brand-muted hover:border-brand-laranja hover:text-brand-laranja transition-colors"
                >
                  {rede.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Seções do Site */}
          <div>
            <h3 className="font-titulo font-bold text-brand-creme text-sm uppercase tracking-wide mb-4">
              Seções do Site
            </h3>
            <ul className="space-y-2">
              {SECOES.map(secao => (
                <li key={secao.nome}>
                  {secao.href.startsWith('/#') ? (
                    <a
                      href={secao.href}
                      className="text-sm text-brand-muted hover:text-brand-laranja transition-colors"
                    >
                      {secao.nome}
                    </a>
                  ) : (
                    <Link
                      to={secao.href}
                      className="text-sm text-brand-muted hover:text-brand-laranja transition-colors"
                    >
                      {secao.nome}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Institucional */}
          <div>
            <h3 className="font-titulo font-bold text-brand-creme text-sm uppercase tracking-wide mb-4">
              Institucional
            </h3>
            <ul className="space-y-2">
              {[
                { label: 'Sobre o Portal', href: '/sobre' },
                { label: 'Política Editorial', href: '/politica-editorial' },
                { label: 'Política de Privacidade', href: '/privacidade' },
                { label: 'Termos de Uso', href: '/termos' },
                { label: 'Fale Conosco', href: '/contato' },
                { label: 'Anuncie', href: '/anuncie' },
              ].map(link => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-brand-muted hover:text-brand-laranja transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contato / Pauta */}
          <div>
            <h3 className="font-titulo font-bold text-brand-creme text-sm uppercase tracking-wide mb-4">
              Contato
            </h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm text-brand-muted">
                <Mail size={14} className="text-brand-laranja shrink-0" />
                <a href="mailto:redacao@diaadianordeste.com.br" className="hover:text-brand-laranja transition-colors">
                  redacao@diaadianordeste.com.br
                </a>
              </li>
            </ul>

            <div className="mt-4 p-3 rounded-lg bg-brand-grafite border border-brand-border">
              <p className="text-xs text-brand-muted mb-2">
                📢 Tem uma pauta? Envie pelo WhatsApp!
              </p>
              <a
                href="https://wa.me/5500000000000"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-semibold text-[#25D366] hover:underline"
              >
                Enviar pauta →
              </a>
            </div>
          </div>
        </div>

        {/* Rodapé final */}
        <div className="mt-8 pt-6 border-t border-brand-border flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-brand-muted">
          <p>© {ano} Dia a Dia Nordeste. Todos os direitos reservados.</p>
          <p>Criado por Agência Cleisson Cardoso</p>
        </div>
      </div>
    </footer>
  );
}
