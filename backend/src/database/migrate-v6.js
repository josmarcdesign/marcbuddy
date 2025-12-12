import { query } from './connection.js';

/**
 * Migração V6 - Tabela de Planos
 * Execute: npm run migrate:v6
 */
const migrateV6 = async () => {
  try {
    console.log('🔄 Iniciando migração V6 do banco de dados...');

    // Criar tabela de planos
    await query(`
      CREATE TABLE IF NOT EXISTS plans (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        price DECIMAL(10, 2) NOT NULL DEFAULT 0,
        price_annual DECIMAL(10, 2),
        price_annual_monthly DECIMAL(10, 2),
        features TEXT[] DEFAULT ARRAY[]::TEXT[],
        popular BOOLEAN DEFAULT false,
        featured BOOLEAN DEFAULT false,
        free_trial BOOLEAN DEFAULT false,
        free_trial_days INTEGER,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Tabela plans criada/verificada');

    // Criar índices
    await query(`
      CREATE INDEX IF NOT EXISTS idx_plans_active ON plans(is_active);
    `);
    console.log('✅ Índices criados/verificados');

    // Verificar se já existem planos
    const existingPlans = await query('SELECT id FROM plans');
    
    if (existingPlans.rows.length === 0) {
      // Inserir planos padrão
      const defaultPlans = [
        {
          id: 'basic',
          name: 'MBuddy Classic',
          description: 'Para profissionais',
          price: 29.90,
          price_annual: 299.00,
          price_annual_monthly: 24.92,
          features: [
            'Acesso completo às ferramentas básicas',
            'Uso ilimitado',
            'Suporte por email',
            'Projetos ilimitados',
            'Exportação de dados'
          ],
          popular: false,
          featured: false,
          free_trial: true,
          free_trial_days: 7,
          is_active: true
        },
        {
          id: 'premium',
          name: 'MBuddy Pro',
          description: 'Para profissionais avançados',
          price: 59.90,
          price_annual: 599.00,
          price_annual_monthly: 49.92,
          features: [
            'Todas as ferramentas',
            'Recursos avançados',
            'Suporte prioritário',
            'API access',
            'Integrações',
            'Análises avançadas'
          ],
          popular: false,
          featured: true,
          free_trial: false,
          free_trial_days: null,
          is_active: true
        },
        {
          id: 'enterprise',
          name: 'MBuddy Team',
          description: 'Para equipes',
          price: 149.90,
          price_annual: 1499.00,
          price_annual_monthly: 124.92,
          features: [
            'Tudo do MBuddy Pro',
            'Suporte dedicado',
            'Customizações',
            'SLA garantido',
            'Treinamento da equipe',
            'Gerente de conta'
          ],
          popular: false,
          featured: false,
          free_trial: false,
          free_trial_days: null,
          is_active: true
        }
      ];

      for (const plan of defaultPlans) {
        await query(`
          INSERT INTO plans 
          (id, name, description, price, price_annual, price_annual_monthly, features, 
           popular, featured, free_trial, free_trial_days, is_active)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        `, [
          plan.id,
          plan.name,
          plan.description,
          plan.price,
          plan.price_annual,
          plan.price_annual_monthly,
          plan.features,
          plan.popular,
          plan.featured,
          plan.free_trial,
          plan.free_trial_days,
          plan.is_active
        ]);
        console.log(`✅ Plano ${plan.name} inserido`);
      }
    } else {
      console.log('⏭️  Planos já existem no banco');
    }

    console.log('🎉 Migração V6 concluída com sucesso!');
  } catch (error) {
    console.error('❌ Erro na migração V6:', error);
    process.exit(1);
  }
};

migrateV6();

