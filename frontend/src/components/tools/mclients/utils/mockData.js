// Dados mock iniciais para MClients
export const initialClients = [
  {
    id: 1,
    name: 'João Silva',
    email: 'joao@exemplo.com',
    phone: '(11) 99999-9999',
    company: 'Tech Solutions',
    address: 'Rua Exemplo, 123 - São Paulo, SP',
    notes: 'Cliente preferencial',
    createdAt: '2025-01-15',
    status: 'active',
    leadSource: 'instagram',
    leadSourceDetails: 'Anúncio patrocinado'
  },
  {
    id: 2,
    name: 'Maria Santos',
    email: 'maria@exemplo.com',
    phone: '(11) 88888-8888',
    company: 'Design Studio',
    address: 'Av. Principal, 456 - Rio de Janeiro, RJ',
    notes: '',
    createdAt: '2025-01-10',
    status: 'active',
    leadSource: 'indicacao',
    leadSourceDetails: 'Indicado por João Silva'
  }
];

export const initialDemands = [
  {
    id: 1,
    clientId: 1,
    title: 'Criação de Logo',
    description: 'Desenvolvimento de identidade visual completa',
    status: 'in_progress',
    priority: 'high',
    dueDate: '2025-02-01',
    createdAt: '2025-01-15',
    documents: [1, 2]
  },
  {
    id: 2,
    clientId: 2,
    title: 'Redesign de Site',
    description: 'Atualização completa do site institucional',
    status: 'pending',
    priority: 'medium',
    dueDate: '2025-02-15',
    createdAt: '2025-01-10',
    documents: []
  }
];

export const initialPayments = [
  {
    id: 1,
    clientId: 1,
    demandId: 1,
    amount: 2500.00,
    dueDate: '2025-02-01',
    paidDate: null,
    status: 'pending',
    description: 'Pagamento inicial - Logo',
    paymentMethod: 'pix'
  },
  {
    id: 2,
    clientId: 2,
    demandId: 2,
    amount: 5000.00,
    dueDate: '2025-02-15',
    paidDate: null,
    status: 'pending',
    description: 'Pagamento inicial - Redesign',
    paymentMethod: 'bank_transfer'
  }
];

export const initialServices = [
  {
    id: 1,
    name: 'Criação de Logo',
    description: 'Desenvolvimento de identidade visual',
    price: 2500.00,
    category: 'branding',
    duration: '15 dias',
    active: true
  },
  {
    id: 2,
    name: 'Redesign de Site',
    description: 'Atualização completa de site',
    price: 5000.00,
    category: 'web',
    duration: '30 dias',
    active: true
  },
  {
    id: 3,
    name: 'Social Media',
    description: 'Gestão de redes sociais',
    price: 1500.00,
    category: 'marketing',
    duration: 'Mensal',
    active: true
  }
];


export const initialDocuments = [
  {
    id: 1,
    clientId: 1,
    demandId: 1,
    name: 'Briefing_Cliente.pdf',
    type: 'pdf',
    size: '2.5 MB',
    uploadedAt: '2025-01-15',
    content: 'Conteúdo do documento...',
    category: 'briefing'
  }
];

export const initialTasks = [
  {
    id: 1,
    demandId: 1,
    title: 'Criar moodboard inicial',
    completed: false,
    dueDate: '2025-01-20',
    priority: 'high',
    createdAt: '2025-01-15'
  }
];

export const initialComments = [
  {
    id: 1,
    demandId: 1,
    clientId: 1,
    content: 'Gostei muito da primeira opção!',
    author: 'João Silva',
    createdAt: '2025-01-16T10:30:00',
    type: 'client'
  }
];

export const initialActivities = [
  {
    id: 1,
    type: 'demand_created',
    demandId: 1,
    clientId: 1,
    description: 'Demanda "Criação de Logo" criada',
    createdAt: '2025-01-15T09:00:00'
  }
];

export const initialTags = [
  { id: 1, name: 'Urgente', color: 'red' },
  { id: 2, name: 'Novo Cliente', color: 'blue' }
];

export const initialClientTags = [
  { clientId: 1, tagId: 2 }
];

export const initialTimeEntries = [
  {
    id: 1,
    demandId: 1,
    description: 'Desenvolvimento de logo',
    hours: 4.5,
    date: '2025-01-15',
    status: 'completed'
  }
];

export const initialTemplates = [
  {
    id: 1,
    name: 'Proposta Logo Básico',
    content: 'Prezado(a) {cliente}...',
    category: 'proposal',
    active: true
  }
];

export const initialApprovals = [
  {
    id: 1,
    demandId: 1,
    documentId: 1,
    status: 'pending',
    requestedAt: '2025-01-16',
    approvedAt: null,
    comments: ''
  }
];

export const mockData = {
  clients: initialClients,
  demands: initialDemands,
  payments: initialPayments,
  documents: initialDocuments,
  services: initialServices,
  tasks: initialTasks,
  comments: initialComments,
  activities: initialActivities,
  tags: initialTags,
  clientTags: initialClientTags,
  timeEntries: initialTimeEntries,
  templates: initialTemplates,
  approvals: initialApprovals,
};

