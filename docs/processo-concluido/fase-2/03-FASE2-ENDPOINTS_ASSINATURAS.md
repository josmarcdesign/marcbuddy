# Fase 2.2: Endpoints de Assinaturas - Passo a Passo Completo

> **Status**: 📋 Pendente  
> **Fase**: 2 - Sistema de Planos e Pagamento  
> **Ordem**: 03

## 🎯 Objetivo

Criar endpoints completos no backend para criação e gerenciamento de assinaturas com geração de license keys.

## 📋 Passo 1: Instalar Dependências

No terminal do backend:

```bash
cd backend
npm install uuid
```

## 📋 Passo 2: Criar Utilitário de License Key

Crie o arquivo `backend/src/utils/licenseKey.js`:

```javascript
import { v4 as uuidv4 } from 'uuid';

/**
 * Gera uma license key única no formato MB-XXXX-XXXX-XXXX
 * @returns {string} License key formatada
 */
export const generateLicenseKey = () => {
  // Gerar UUID e remover hífens
  const uuid = uuidv4().replace(/-/g, '').toUpperCase();
  
  // Pegar os primeiros 12 caracteres e formatar como MB-XXXX-XXXX-XXXX
  const segments = [
    uuid.substring(0, 4),
    uuid.substring(4, 8),
    uuid.substring(8, 12)
  ];
  
  return `MB-${segments.join('-')}`;
};

/**
 * Valida o formato de uma license key
 * @param {string} licenseKey - License key para validar
 * @returns {boolean} True se válida
 */
export const validateLicenseKeyFormat = (licenseKey) => {
  const pattern = /^MB-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/;
  return pattern.test(licenseKey);
};
```

## 📋 Passo 3: Criar Controller de Subscriptions

Crie o arquivo `backend/src/controllers/subscription.controller.js`:

```javascript
import { query } from '../database/connection.js';
import { generateLicenseKey, validateLicenseKeyFormat } from '../utils/licenseKey.js';
import { validationResult } from 'express-validator';

// Planos válidos
const VALID_PLANS = ['free', 'basic', 'premium', 'enterprise'];
const VALID_STATUSES = ['pending', 'active', 'cancelled', 'expired'];

/**
 * Criar nova assinatura
 */
export const createSubscription = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Dados inválidos',
        errors: errors.array()
      });
    }

    const { plan_type } = req.body;
    const userId = req.user.id;

    // Validar plano
    if (!VALID_PLANS.includes(plan_type)) {
      return res.status(400).json({
        success: false,
        message: 'Plano inválido. Planos disponíveis: free, basic, premium, enterprise'
      });
    }

    // Verificar se usuário já tem assinatura ativa
    const existingActive = await query(
      `SELECT id FROM subscriptions 
       WHERE user_id = $1 AND status = 'active'`,
      [userId]
    );

    if (existingActive.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Você já possui uma assinatura ativa. Cancele a atual antes de criar uma nova.'
      });
    }

    // Gerar license key única
    let licenseKey;
    let isUnique = false;
    let attempts = 0;
    const maxAttempts = 10;

    while (!isUnique && attempts < maxAttempts) {
      licenseKey = generateLicenseKey();
      const existing = await query(
        'SELECT id FROM subscriptions WHERE license_key = $1',
        [licenseKey]
      );
      if (existing.rows.length === 0) {
        isUnique = true;
      }
      attempts++;
    }

    if (!isUnique) {
      return res.status(500).json({
        success: false,
        message: 'Erro ao gerar license key única'
      });
    }

    // Calcular datas
    const now = new Date();
    const startDate = plan_type === 'free' ? now : null; // Free ativa imediatamente
    const endDate = plan_type === 'free' ? null : null; // Será definido após pagamento
    const renewalDate = plan_type === 'free' ? null : null;

    // Criar assinatura
    const result = await query(
      `INSERT INTO subscriptions 
       (user_id, plan_type, status, license_key, start_date, end_date, renewal_date)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id, user_id, plan_type, status, license_key, start_date, end_date, renewal_date, created_at`,
      [
        userId,
        plan_type,
        plan_type === 'free' ? 'active' : 'pending', // Free ativa automaticamente
        licenseKey,
        startDate,
        endDate,
        renewalDate
      ]
    );

    res.status(201).json({
      success: true,
      message: 'Assinatura criada com sucesso',
      data: {
        subscription: result.rows[0]
      }
    });
  } catch (error) {
    console.error('Erro ao criar assinatura:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao criar assinatura'
    });
  }
};

/**
 * Listar assinaturas do usuário autenticado
 */
export const getMySubscriptions = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await query(
      `SELECT id, plan_type, status, license_key, start_date, end_date, renewal_date, created_at
       FROM subscriptions
       WHERE user_id = $1
       ORDER BY created_at DESC`,
      [userId]
    );

    res.json({
      success: true,
      data: {
        subscriptions: result.rows
      }
    });
  } catch (error) {
    console.error('Erro ao buscar assinaturas:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar assinaturas'
    });
  }
};

/**
 * Obter assinatura específica
 */
export const getSubscriptionById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const result = await query(
      `SELECT id, plan_type, status, license_key, start_date, end_date, renewal_date, created_at
       FROM subscriptions
       WHERE id = $1 AND user_id = $2`,
      [id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Assinatura não encontrada'
      });
    }

    res.json({
      success: true,
      data: {
        subscription: result.rows[0]
      }
    });
  } catch (error) {
    console.error('Erro ao buscar assinatura:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar assinatura'
    });
  }
};

/**
 * Obter assinatura ativa do usuário
 */
export const getActiveSubscription = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await query(
      `SELECT id, plan_type, status, license_key, start_date, end_date, renewal_date, created_at
       FROM subscriptions
       WHERE user_id = $1 AND status = 'active'
       ORDER BY created_at DESC
       LIMIT 1`,
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Nenhuma assinatura ativa encontrada'
      });
    }

    res.json({
      success: true,
      data: {
        subscription: result.rows[0]
      }
    });
  } catch (error) {
    console.error('Erro ao buscar assinatura ativa:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar assinatura ativa'
    });
  }
};

/**
 * Obter license key do usuário
 */
export const getMyLicenseKey = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await query(
      `SELECT license_key, plan_type, status
       FROM subscriptions
       WHERE user_id = $1 AND status = 'active'
       ORDER BY created_at DESC
       LIMIT 1`,
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Nenhuma assinatura ativa encontrada'
      });
    }

    res.json({
      success: true,
      data: {
        license_key: result.rows[0].license_key,
        plan_type: result.rows[0].plan_type,
        status: result.rows[0].status
      }
    });
  } catch (error) {
    console.error('Erro ao buscar license key:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar license key'
    });
  }
};

/**
 * Atualizar status da assinatura (para confirmação de pagamento)
 */
export const updateSubscriptionStatus = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Dados inválidos',
        errors: errors.array()
      });
    }

    const { id } = req.params;
    const { status } = req.body;
    const userId = req.user.id;

    // Validar status
    if (!VALID_STATUSES.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Status inválido'
      });
    }

    // Verificar se assinatura pertence ao usuário
    const subscription = await query(
      'SELECT id, user_id FROM subscriptions WHERE id = $1',
      [id]
    );

    if (subscription.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Assinatura não encontrada'
      });
    }

    // Se não for admin, verificar se é o dono da assinatura
    if (req.user.role !== 'admin' && subscription.rows[0].user_id !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Você não tem permissão para atualizar esta assinatura'
      });
    }

    // Se ativando, definir datas
    let startDate = null;
    let endDate = null;
    let renewalDate = null;

    if (status === 'active') {
      const now = new Date();
      startDate = now;
      
      // Calcular data de renovação (30 dias)
      renewalDate = new Date(now);
      renewalDate.setDate(renewalDate.getDate() + 30);
      
      // Calcular data de expiração (se necessário)
      endDate = null; // Pode ser null para assinaturas recorrentes
    }

    // Atualizar assinatura
    const result = await query(
      `UPDATE subscriptions
       SET status = $1, start_date = COALESCE($2, start_date), 
           end_date = COALESCE($3, end_date), renewal_date = COALESCE($4, renewal_date),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $5
       RETURNING id, plan_type, status, license_key, start_date, end_date, renewal_date, updated_at`,
      [status, startDate, endDate, renewalDate, id]
    );

    res.json({
      success: true,
      message: 'Status da assinatura atualizado com sucesso',
      data: {
        subscription: result.rows[0]
      }
    });
  } catch (error) {
    console.error('Erro ao atualizar assinatura:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao atualizar assinatura'
    });
  }
};

/**
 * Cancelar assinatura
 */
export const cancelSubscription = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Verificar se assinatura pertence ao usuário
    const subscription = await query(
      'SELECT id, user_id, status FROM subscriptions WHERE id = $1',
      [id]
    );

    if (subscription.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Assinatura não encontrada'
      });
    }

    if (subscription.rows[0].user_id !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Você não tem permissão para cancelar esta assinatura'
      });
    }

    if (subscription.rows[0].status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Assinatura já está cancelada'
      });
    }

    // Cancelar assinatura
    const result = await query(
      `UPDATE subscriptions
       SET status = 'cancelled', updated_at = CURRENT_TIMESTAMP
       WHERE id = $1
       RETURNING id, plan_type, status, updated_at`,
      [id]
    );

    res.json({
      success: true,
      message: 'Assinatura cancelada com sucesso',
      data: {
        subscription: result.rows[0]
      }
    });
  } catch (error) {
    console.error('Erro ao cancelar assinatura:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao cancelar assinatura'
    });
  }
};
```

## 📋 Passo 4: Criar Rotas de Subscriptions

Crie o arquivo `backend/src/routes/subscription.routes.js`:

```javascript
import express from 'express';
import { body } from 'express-validator';
import { authenticateToken } from '../middleware/auth.middleware.js';
import {
  createSubscription,
  getMySubscriptions,
  getSubscriptionById,
  getActiveSubscription,
  getMyLicenseKey,
  updateSubscriptionStatus,
  cancelSubscription
} from '../controllers/subscription.controller.js';

const router = express.Router();

// Todas as rotas requerem autenticação
router.use(authenticateToken);

// Validações
const createSubscriptionValidation = [
  body('plan_type')
    .isIn(['free', 'basic', 'premium', 'enterprise'])
    .withMessage('Plano inválido')
];

const updateStatusValidation = [
  body('status')
    .isIn(['pending', 'active', 'cancelled', 'expired'])
    .withMessage('Status inválido')
];

// Rotas
router.post('/', createSubscriptionValidation, createSubscription);
router.get('/', getMySubscriptions);
router.get('/active', getActiveSubscription);
router.get('/license-key', getMyLicenseKey);
router.get('/:id', getSubscriptionById);
router.patch('/:id/status', updateStatusValidation, updateSubscriptionStatus);
router.post('/:id/cancel', cancelSubscription);

export default router;
```

## 📋 Passo 5: Registrar Rotas no Server

Atualize `backend/src/server.js`:

```javascript
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import subscriptionRoutes from './routes/subscription.routes.js'; // Adicionar

// ... resto do código ...

// Rotas
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/subscriptions', subscriptionRoutes); // Adicionar

// ... resto do código ...
```

## 📋 Passo 6: Testar Endpoints

### Teste 1: Criar Assinatura Free

```bash
curl -X POST http://localhost:3001/api/subscriptions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -d '{
    "plan_type": "free"
  }'
```

### Teste 2: Criar Assinatura Premium

```bash
curl -X POST http://localhost:3001/api/subscriptions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -d '{
    "plan_type": "premium"
  }'
```

### Teste 3: Listar Assinaturas

```bash
curl -X GET http://localhost:3001/api/subscriptions \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

### Teste 4: Obter License Key

```bash
curl -X GET http://localhost:3001/api/subscriptions/license-key \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

### Teste 5: Atualizar Status (Ativar)

```bash
curl -X PATCH http://localhost:3001/api/subscriptions/1/status \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -d '{
    "status": "active"
  }'
```

## ✅ Checklist de Conclusão

- [x] Dependência uuid instalada
- [x] Utilitário de license key criado
- [x] Controller de subscriptions criado
- [x] Rotas de subscriptions criadas
- [x] Rotas registradas no server.js
- [x] Endpoints testados e funcionando

## 🐛 Problemas Comuns

### Erro: "Plano inválido"
- Verifique se está enviando um dos planos válidos: free, basic, premium, enterprise
- Confirme que a validação está funcionando

### Erro: "License key já existe"
- O sistema tenta gerar uma única até 10 vezes
- Se persistir, verifique a função de geração

### Erro: "Assinatura ativa já existe"
- Um usuário só pode ter uma assinatura ativa por vez
- Cancele a atual antes de criar nova

---

**Próximo**: Seguir para `04-FASE2-INTEGRACAO_PIX.md` para implementar integração com Pix
