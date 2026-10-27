// Fase 1: textos de exemplo. Na Fase 2 isto passa a vir do Supabase e a ser editado no painel admin.
const EHD = typeof window !== 'undefined' && window.__DEMO__
export const content = {
  noivo: 'Nome do Noivo', noiva: 'Nome da Noiva',
  data: '2027-06-12T16:00:00-03:00', cidade: 'Cidade, UF',
  foto: 'foto-casal.jpg',
  galeria: EHD ? ['', '', '', ''] : [],
  livreMin: 20,
  presentes: EHD ? [
    { id: 'p1', nome: 'Jantar romântico na lua de mel', valor: 250, descricao: 'Uma noite especial só nossa.' },
    { id: 'p2', nome: 'Cafeteira para a nossa cozinha', valor: 180, descricao: 'Para os cafés da manhã a dois.' },
    { id: 'p3', nome: 'Passeio de balão', valor: 500, descricao: 'Uma lembrança lá do alto.' },
  ] : [],
  convite: 'Depois de tantos caminhos, escolhemos caminhar juntos. Queremos você ao nosso lado no dia em que a nossa história ganha um novo capítulo.',
  historia: [
    { quando: '2019', titulo: 'Nos conhecemos', texto: 'Conte aqui como e onde vocês se encontraram.' },
    { quando: '2021', titulo: 'O primeiro “eu te amo”', texto: 'Um momento marcante da relação de vocês.' },
    { quando: '2025', titulo: 'O pedido', texto: 'Como foi o pedido de casamento.' },
  ],
  eventos: [
    { titulo: 'Cerimônia', hora: '16h', local: 'Nome do local', endereco: 'Rua Exemplo, 123 – Cidade, UF', mapa: '#' },
    { titulo: 'Recepção', hora: '18h30', local: 'Nome do espaço', endereco: 'Av. Exemplo, 456 – Cidade, UF', mapa: '#' },
  ],
  grupos: [
    { id: 'madrinhas', titulo: 'Madrinhas', pessoas: ['Madrinha 1', 'Madrinha 2', 'Madrinha 3'] },
    { id: 'padrinhos', titulo: 'Padrinhos', pessoas: ['Padrinho 1', 'Padrinho 2', 'Padrinho 3'] },
    { id: 'cortejo', titulo: 'Pajem e damas de honra', pessoas: ['Pajem', 'Dama de honra 1', 'Dama de honra 2'] },
  ],
  familias: [
    { titulo: 'Pais da noiva', pessoas: ['Mãe da noiva', 'Pai da noiva'] },
    { titulo: 'Pais do noivo', pessoas: ['Mãe do noivo', 'Pai do noivo'] },
  ],
}
