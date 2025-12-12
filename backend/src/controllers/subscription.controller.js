import { query } from '../database/connection.js';
import { generateLicenseKey, validateLicenseKeyFormat } from '../utils/licenseKey.js';
import { validationResult } from 'express-validator';

// Planos válidos
const VALID_PLANS = ['free', 'classic', 'pro', 'team'];
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

    const { plan_type, billing_cycle = 'monthly' } = req.body;
    const userId = req.user.id;

    // Validar plano
    if (!VALID_PLANS.includes(plan_type)) {
      return res.status(400).json({
        success: false,
        message: 'Plano inválido. Planos disponíveis: free, classic, pro, team'
      });
    }

    // Validar período de cobrança
    if (!['monthly', 'annual', 'biennial', 'triennial'].includes(billing_cycle)) {
      return res.status(400).json({
        success: false,
        message: 'Período de cobrança inválido. Períodos disponíveis: monthly, annual, biennial, triennial'
      });
    }

    // Verificar se usuário já tem assinatura ativa
    const existingActive = await query(
      `SELECT id FROM marcbuddy.account_subscriptions 
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
        'SELECT id FROM marcbuddy.account_subscriptions WHERE license_key = $1',
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

    // Buscar email do usuário
    const userResult = await query(
      'SELECT email FROM marcbuddy.accounts WHERE id = $1',
      [userId]
    );
    const userEmail = userResult.rows[0]?.email || null;

    // Criar assinatura
    const result = await query(
      `INSERT INTO marcbuddy.account_subscriptions 
       (user_id, plan_type, status, license_key, subscription_start_date, subscription_end_date, renewal_date, email, billing_cycle)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING id, user_id, plan_type, status, license_key, subscription_start_date, subscription_end_date, renewal_date, email, billing_cycle, created_at`,
      [
        userId,
        plan_type,
        plan_type === 'free' ? 'active' : 'pending', // Free ativa automaticamente
        licenseKey,
        startDate,
        endDate,
        renewalDate,
        userEmail,
        billing_cycle
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
      `SELECT id, plan_type, status, license_key, subscription_start_date, subscription_end_date, renewal_date, created_at, billing_cycle, stripe_subscription_id
       FROM marcbuddy.account_subscriptions
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
      `SELECT id, plan_type, status, license_key, subscription_start_date, subscription_end_date, renewal_date, created_at
       FROM marcbuddy.account_subscriptions
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
      `SELECT id, plan_type, status, license_key, subscription_start_date, subscription_end_date, renewal_date, created_at, billing_cycle, stripe_subscription_id
       FROM marcbuddy.account_subscriptions
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
       FROM marcbuddy.account_subscriptions
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
      'SELECT id, user_id FROM marcbuddy.account_subscriptions WHERE id = $1',
      [id]
    );

    // Buscar email do usuário se estiver atualizando
    let userEmail = null;
    if (subscription.rows.length > 0) {
      const userResult = await query(
        'SELECT email FROM marcbuddy.accounts WHERE id = $1',
        [subscription.rows[0].user_id]
      );
      userEmail = userResult.rows[0]?.email || null;
    }

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

    // Se ativando, definir datas baseado no billing_cycle
    let startDate = null;
    let endDate = null;
    let renewalDate = null;

    if (status === 'active') {
      const now = new Date();
      startDate = now;
      
      // Buscar billing_cycle da assinatura
      const subResult = await query(
        'SELECT billing_cycle FROM marcbuddy.account_subscriptions WHERE id = $1',
        [id]
      );
      
      const billingCycle = subResult.rows[0]?.billing_cycle || 'monthly';
      
      // Calcular datas baseado no período de cobrança
      renewalDate = new Date(now);
      if (billingCycle === 'annual') {
        renewalDate.setMonth(renewalDate.getMonth() + 12);
        endDate = new Date(renewalDate);
      } else if (billingCycle === 'biennial') {
        renewalDate.setMonth(renewalDate.getMonth() + 24);
        endDate = new Date(renewalDate);
      } else if (billingCycle === 'triennial') {
        renewalDate.setMonth(renewalDate.getMonth() + 36);
        endDate = new Date(renewalDate);
      } else {
        // monthly
        renewalDate.setMonth(renewalDate.getMonth() + 1);
        endDate = new Date(renewalDate);
      }
    }

    // Atualizar assinatura
    const result = await query(
      `UPDATE marcbuddy.account_subscriptions
       SET status = $1, subscription_start_date = COALESCE($2, subscription_start_date), 
           subscription_end_date = COALESCE($3, subscription_end_date), renewal_date = COALESCE($4, renewal_date),
           email = COALESCE($5, email),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $6
       RETURNING id, plan_type, status, license_key, subscription_start_date, subscription_end_date, renewal_date, email, updated_at`,
      [status, startDate, endDate, renewalDate, userEmail, id]
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
      'SELECT id, user_id, status FROM marcbuddy.account_subscriptions WHERE id = $1',
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
      `UPDATE marcbuddy.account_subscriptions
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

/**
 * Listar todas assinaturas pendentes (apenas admin)
 */
export const getAllPendingSubscriptions = async (req, res) => {
  try {
    // Verificar se é admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Acesso negado. Apenas administradores podem acessar este recurso.'
      });
    }

    const result = await query(
      `SELECT s.id, s.user_id, s.plan_type, s.status, s.license_key, s.created_at,
              u.name as user_name, u.email as user_email
       FROM marcbuddy.account_subscriptions s
       JOIN users u ON s.user_id = u.id
       WHERE s.status = 'pending'
       ORDER BY s.created_at DESC`
    );

    res.json({
      success: true,
      data: {
        subscriptions: result.rows
      }
    });
  } catch (error) {
    console.error('Erro ao buscar assinaturas pendentes:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar assinaturas pendentes'
    });
  }
};

