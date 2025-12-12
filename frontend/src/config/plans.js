export const PLANS = {
  free: {
    id: 'free',
    name: 'MBuddy Free',
    price: 0.00,
    annualDiscountPercentage: 0,
    biennialDiscountPercentage: 0,
    triennialDiscountPercentage: 0,
    period: 'mês',
    description: 'Plano gratuito básico para começar',
    features: [
      'Acesso básico à plataforma',
      'Até 3 projetos',
      '1GB de armazenamento',
      'Suporte via email'
    ],
    popular: false,
    color: 'gray',
    freeTrial: false,
    freeTrialDays: 0
  },
  classic: {
    id: 'classic',
    name: 'MBuddy Classic',
    price: 29.90,
    annualDiscountPercentage: 15,
    biennialDiscountPercentage: 20,
    triennialDiscountPercentage: 25,
    period: 'mês',
    description: 'Para profissionais',
    features: [
      'Acesso completo às ferramentas básicas',
      'Uso ilimitado',
      'Suporte por email',
      'Projetos ilimitados',
      'Exportação de dados'
    ],
    popular: false,
    color: 'blue',
    freeTrial: true,
    freeTrialDays: 7
  },
  pro: {
    id: 'pro',
    name: 'MBuddy Pro',
    price: 59.90,
    annualDiscountPercentage: 15,
    biennialDiscountPercentage: 20,
    triennialDiscountPercentage: 25,
    period: 'mês',
    description: 'Para profissionais avançados',
    features: [
      'Todas as ferramentas',
      'Recursos avançados',
      'Suporte prioritário',
      'Integrações',
      'Análises avançadas'
    ],
    popular: false,
    featured: true,
    color: 'purple',
    freeTrial: false,
    freeTrialDays: 0
  },
  team: {
    id: 'team',
    name: 'MBuddy Team',
    price: 149.90,
    annualDiscountPercentage: 15,
    biennialDiscountPercentage: 20,
    triennialDiscountPercentage: 25,
    period: 'mês',
    description: 'Para equipes',
    features: [
      'Tudo do MBuddy Pro',
      'Suporte dedicado',
      'Customizações',
      'SLA garantido',
      'Treinamento da equipe',
      'Gerente de conta'
    ],
    popular: false,
    color: 'gold',
    freeTrial: false,
    freeTrialDays: 0
  }
};

export const getPlanById = (id) => PLANS[id] || null;
export const getAllPlans = () => Object.values(PLANS);

