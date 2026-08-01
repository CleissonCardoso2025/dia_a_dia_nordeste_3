import type { WebStory } from '@/types';

export const MOCK_STORIES: WebStory[] = [
  {
    id: 'story-saude-1',
    titulo: 'Avanços na Saúde do Nordeste: Novas Unidades Móveis',
    categoria: 'Saúde',
    corCategoria: '#059669',
    capaUrl: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80',
    criadoEm: '2026-08-01T14:00:00Z',
    slides: [
      {
        id: 's1-1',
        imagemUrl: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1000&q=80',
        titulo: 'Caravanas de Saúde Chegam ao Sertão',
        texto: 'Novos veículos equipados oferecem exames e consultas especializadas diretamente nas comunidades rurais do Semiárido.',
      },
      {
        id: 's1-2',
        imagemUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1000&q=80',
        titulo: 'Telemedicina Integrada no SUS',
        texto: 'Pacientes agora contam com atendimento médico especializado via videoconferência em postos de saúde de todo o interior.',
      },
      {
        id: 's1-3',
        imagemUrl: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1000&q=80',
        titulo: 'Redução Histórica de Filas de Espera',
        texto: 'Mutirões estaduais já realizaram mais de 45 mil exames no primeiro semestre de 2026.',
        linkSaibaMais: '/busca?q=saude',
      },
    ],
  },
  {
    id: 'story-educacao-1',
    titulo: 'Escolas em Tempo Integral Batem Recordes de Matrículas',
    categoria: 'Educação',
    corCategoria: '#D97706',
    capaUrl: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80',
    criadoEm: '2026-08-01T12:30:00Z',
    slides: [
      {
        id: 's2-1',
        imagemUrl: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1000&q=80',
        titulo: 'Revolução no Ensino Público',
        texto: 'O modelo de escola em tempo integral expande e já atende 65% dos estudantes da rede pública no Semiárido.',
      },
      {
        id: 's2-2',
        imagemUrl: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1000&q=80',
        titulo: 'Laboratórios Digitais e Robótica',
        texto: 'Estudantes desenvolvem projetos tecnológicos para solucionar desafios do clima e da agricultura regional.',
      },
      {
        id: 's2-3',
        imagemUrl: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1000&q=80',
        titulo: 'Aumento na Nota do IDEB',
        texto: 'Indicadores de aprendizagem sobem 28% com alimentação balanceada e atividades no turno oposto.',
        linkSaibaMais: '/busca?q=educacao',
      },
    ],
  },
  {
    id: 'story-esportes-1',
    titulo: 'Atletas do Nordeste Conquistam Ouros em Campeonatos Nacionais',
    categoria: 'Esportes',
    corCategoria: '#2563EB',
    capaUrl: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=800&q=80',
    criadoEm: '2026-08-01T10:15:00Z',
    slides: [
      {
        id: 's3-1',
        imagemUrl: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1000&q=80',
        titulo: 'Pódio no Atletismo e Artes Martiais',
        texto: 'Jovens promessas do desporto nordestino trazem medalhas de ouro em torneios nacionais de judô e atletismo.',
      },
      {
        id: 's3-2',
        imagemUrl: 'https://images.unsplash.com/photo-1517649763962-0c623266010b?auto=format&fit=crop&w=1000&q=80',
        titulo: 'Arenas Esportivas Comunitárias',
        texto: 'Programa social instala complexos poliesportivos em mais de 30 municípios para incentivar a juventude.',
        linkSaibaMais: '/busca?q=esportes',
      },
    ],
  },
  {
    id: 'story-cultura-1',
    titulo: 'Patrimônio Vivo: A Arte do Couro e do Forró no Sertão',
    categoria: 'Cultura',
    corCategoria: '#8B5CF6',
    capaUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80',
    criadoEm: '2026-08-01T09:00:00Z',
    slides: [
      {
        id: 's4-1',
        imagemUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1000&q=80',
        titulo: 'Cultura Sertaneja Rumo ao Reconhecimento Global',
        texto: 'Mestres da xilogravura, artesanato em couro e repentistas ganham feira de arte internacional.',
      },
      {
        id: 's4-2',
        imagemUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1000&q=80',
        titulo: 'Festivais Tradicionais Movimentam a Economia',
        texto: 'Eventos culturais no Semiárido atraem milhares de turistas e valorizam as raízes nordestinas.',
        linkSaibaMais: '/busca?q=cultura',
      },
    ],
  },
  {
    id: 'story-economia-1',
    titulo: 'Recorde de Exportações na Fruticultura Irrigada',
    categoria: 'Economia',
    corCategoria: '#1E5C4E',
    capaUrl: 'https://images.unsplash.com/photo-1592417817098-8f3d6eb19655?auto=format&fit=crop&w=800&q=80',
    criadoEm: '2026-08-01T08:30:00Z',
    slides: [
      {
        id: 's5-1',
        imagemUrl: 'https://images.unsplash.com/photo-1592417817098-8f3d6eb19655?auto=format&fit=crop&w=1000&q=80',
        titulo: 'Agronegócio do Nordeste em Alta',
        texto: 'Exportações de frutas tropicais superam marcas históricas com apoio de tecnologias de irrigação sustentável.',
      },
      {
        id: 's5-2',
        imagemUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1000&q=80',
        titulo: 'Geração de Empregos Diretos',
        texto: 'Mais de 18 mil novos postos de trabalho foram criados no campo ao longo dos últimos 12 meses.',
        linkSaibaMais: '/busca?q=economia',
      },
    ],
  },
  {
    id: 'story-tecnologia-1',
    titulo: 'Energia Solar e Eólica Lideram a Matriz Regional',
    categoria: 'Tecnologia',
    corCategoria: '#EC4899',
    capaUrl: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=800&q=80',
    criadoEm: '2026-08-01T07:45:00Z',
    slides: [
      {
        id: 's6-1',
        imagemUrl: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=1000&q=80',
        titulo: 'Capital das Energias Renováveis',
        texto: 'Novos parques fotovoltaicos e eólicos fortalecem a liderança nacional do Nordeste na produção de energia limpa.',
      },
      {
        id: 's6-2',
        imagemUrl: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&w=1000&q=80',
        titulo: 'Hidrogênio Verde no Semiárido',
        texto: 'Projetos pioneiros atraem investimentos internacionais de alta tecnologia para a transição energética.',
        linkSaibaMais: '/busca?q=tecnologia',
      },
    ],
  },
];
