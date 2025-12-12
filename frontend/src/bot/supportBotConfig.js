const supportBotConfig = {
  name: 'Suporte / Bot',
  subtitle: 'Aproxima a equipe ou uma IA (futuro)',
  assistantName: 'assistente',
  initialMessage:
    'Olá! Sou seu assistente. Conte o que precisa e eu encaminho. Em breve você poderá plugar uma IA aqui.',
  topics: [
    { value: 'duvidas', label: 'Dúvidas gerais' },
    { value: 'pagamentos', label: 'Pagamentos/planos' },
    { value: 'mclients', label: 'MClients e briefings' },
    { value: 'plugins', label: 'Plugins e integrações' },
    { value: 'bugs', label: 'Problemas técnicos/bugs' },
  ],
  quickReplies: [
    'Quero ajuda com pagamento',
    'Como usar o MClients?',
    'Problema com plugin',
    'Fale com humano',
  ],
  colors: {
    headerFrom: 'from-brand-blue-900',
    headerTo: 'to-brand-green',
    userBubble: 'bg-brand-blue-900 text-white shadow-sm',
    botBubble: 'bg-white text-gray-800 border border-gray-200 shadow-sm',
    border: 'border-gray-100',
    chipBorder: 'border-gray-200',
    chipHover: 'hover:border-brand-green/60 hover:text-brand-blue-900',
  },
  colorsHex: {
    headerFrom: '#011526',
    headerTo: '#87c508',
    userBubbleBg: '#011526',
    userBubbleColor: '#ffffff',
    botBubbleBg: '#F5F5F5',
    botBubbleColor: '#111827',
    border: '#E5E7EB',
    chipBorder: '#E5E7EB',
  },
  trigger: {
    title: 'Suporte / Bot',
    subtitle: 'Configure com IA depois',
  },
  avatarUrl: null,
};

export default supportBotConfig;

