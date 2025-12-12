import { query } from '../database/connection.js';
import { generatePixQRCode, isQRCodeValid } from '../services/pix.service.js';
import { getPlanById } from '../utils/plans.js'; // Criar este arquivo também

// Preços dos planos (em reais)
const PLAN_PRICES = {
  free: 0,
  basic: 29.90,
  premium: 59.90,
  enterprise: 149.90
};

/**
 * Gerar QR Code Pix para pagamento
 */
export const generatePaymentQRCode = async (req, res) => {
  try {
    const { subscription_id } = req.body;
    const userId = req.user.id;

    // Buscar assinatura
    const subscriptionResult = await query(
      `SELECT id, plan_type, status, user_id
       FROM marcbuddy.account_subscriptions
       WHERE id = $1 AND user_id = $2`,
      [subscription_id, userId]
    );

    if (subscriptionResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Assinatura não encontrada'
      });
    }

    const subscription = subscriptionResult.rows[0];

    // Verificar se já está paga
    if (subscription.status === 'active') {
      return res.status(400).json({
        success: false,
        message: 'Assinatura já está ativa'
      });
    }

    // Verificar se é plano free
    if (subscription.plan_type === 'free') {
      return res.status(400).json({
        success: false,
        message: 'Plano gratuito não requer pagamento'
      });
    }

    // Obter preço do plano
    const amount = PLAN_PRICES[subscription.plan_type];
    if (!amount) {
      return res.status(400).json({
        success: false,
        message: 'Plano inválido'
      });
    }

    // Gerar QR Code
    const qrCodeData = await generatePixQRCode(
      amount,
      `Assinatura MarcBuddy - ${subscription.plan_type}`,
      `SUB-${subscription.id}`
    );

    // Salvar informações do pagamento (opcional - criar tabela payments se necessário)
    // Por enquanto, apenas retornar o QR code

    res.json({
      success: true,
      message: 'QR Code gerado com sucesso',
      data: {
        qrCode: qrCodeData.qrCode,
        pixKey: qrCodeData.pixKey,
        amount: qrCodeData.amount,
        description: qrCodeData.description,
        expiresAt: qrCodeData.expiresAt,
        subscriptionId: subscription.id
      }
    });
  } catch (error) {
    console.error('Erro ao gerar QR Code:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao gerar QR Code'
    });
  }
};

/**
 * Confirmar pagamento (manual - para admin)
 */
export const confirmPayment = async (req, res) => {
  try {
    const { subscription_id } = req.body;

    // Verificar se é admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Apenas administradores podem confirmar pagamentos'
      });
    }

    // Buscar assinatura
    const subscriptionResult = await query(
      'SELECT id, status FROM marcbuddy.account_subscriptions WHERE id = $1',
      [subscription_id]
    );

    if (subscriptionResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Assinatura não encontrada'
      });
    }

    const subscription = subscriptionResult.rows[0];

    if (subscription.status === 'active') {
      return res.status(400).json({
        success: false,
        message: 'Assinatura já está ativa'
      });
    }

    // Buscar informações completas da assinatura
    const subInfo = await query(
      'SELECT plan_type, billing_cycle, user_id FROM marcbuddy.account_subscriptions WHERE id = $1',
      [subscription_id]
    );

    if (subInfo.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Assinatura não encontrada'
      });
    }

    const { plan_type, billing_cycle } = subInfo.rows[0];

    // Calcular datas baseado no período de cobrança
    const now = new Date();
    const startDate = now;
    
    let endDate = null;
    let renewalDate = null;
    
    if (billing_cycle === 'annual') {
      // Assinatura anual: 12 meses
      renewalDate = new Date(now);
      renewalDate.setMonth(renewalDate.getMonth() + 12);
      endDate = new Date(renewalDate);
    } else if (billing_cycle === 'biennial') {
      // Assinatura de 2 anos: 24 meses
      renewalDate = new Date(now);
      renewalDate.setMonth(renewalDate.getMonth() + 24);
      endDate = new Date(renewalDate);
    } else if (billing_cycle === 'triennial') {
      // Assinatura de 3 anos: 36 meses
      renewalDate = new Date(now);
      renewalDate.setMonth(renewalDate.getMonth() + 36);
      endDate = new Date(renewalDate);
    } else {
      // Assinatura mensal: 1 mês
      renewalDate = new Date(now);
      renewalDate.setMonth(renewalDate.getMonth() + 1);
      endDate = new Date(renewalDate);
    }

    // Calcular valor baseado no plano e período
    const PLAN_PRICES_MONTHLY = {
      basic: 29.90,
      premium: 59.90,
      enterprise: 149.90
    };
    
    const PLAN_PRICES_ANNUAL = {
      basic: 299.00,
      premium: 599.00,
      enterprise: 1499.00
    };

    const amount = billing_cycle === 'annual' 
      ? PLAN_PRICES_ANNUAL[plan_type] || 0
      : PLAN_PRICES_MONTHLY[plan_type] || 0;

    // Buscar email do usuário
    const userResult = await query(
      'SELECT email FROM marcbuddy.accounts WHERE id = $1',
      [subInfo.rows[0].user_id]
    );
    const userEmail = userResult.rows[0]?.email || null;

    const result = await query(
      `UPDATE marcbuddy.account_subscriptions
       SET status = 'active', 
           subscription_start_date = $1, 
           subscription_end_date = $2, 
           renewal_date = $3,
           amount = $4,
           email = $5,
           billing_cycle = COALESCE(billing_cycle, 'monthly'),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $6
       RETURNING id, plan_type, status, license_key, subscription_start_date, subscription_end_date, renewal_date, billing_cycle, amount, email`,
      [startDate, endDate, renewalDate, amount, userEmail, subscription_id]
    );

    res.json({
      success: true,
      message: 'Pagamento confirmado e assinatura ativada',
      data: {
        subscription: result.rows[0]
      }
    });
  } catch (error) {
    console.error('Erro ao confirmar pagamento:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao confirmar pagamento'
    });
  }
};

/**
 * Processar pagamento (endpoint usado pelo checkout)
 */
export const processPayment = async (req, res) => {
  try {
    const { subscription_id, payment_method_id, installments, amount, coupon_code } = req.body;
    const userId = req.user.id;

    // Validar dados
    if (!subscription_id || !payment_method_id || !amount) {
      return res.status(400).json({
        success: false,
        message: 'Dados inválidos. subscription_id, payment_method_id e amount são obrigatórios'
      });
    }

    // Buscar assinatura
    const subscriptionResult = await query(
      `SELECT id, plan_type, billing_cycle, status, user_id 
       FROM marcbuddy.account_subscriptions 
       WHERE id = $1 AND user_id = $2`,
      [subscription_id, userId]
    );

    if (subscriptionResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Assinatura não encontrada'
      });
    }

    const subscription = subscriptionResult.rows[0];

    if (subscription.status === 'active') {
      return res.status(400).json({
        success: false,
        message: 'Assinatura já está ativa'
      });
    }

    // Calcular datas baseado no período de cobrança
    const now = new Date();
    const startDate = now;
    
    let endDate = null;
    let renewalDate = null;
    
    if (subscription.billing_cycle === 'annual') {
      renewalDate = new Date(now);
      renewalDate.setMonth(renewalDate.getMonth() + 12);
      endDate = new Date(renewalDate);
    } else if (subscription.billing_cycle === 'biennial') {
      renewalDate = new Date(now);
      renewalDate.setMonth(renewalDate.getMonth() + 24);
      endDate = new Date(renewalDate);
    } else if (subscription.billing_cycle === 'triennial') {
      renewalDate = new Date(now);
      renewalDate.setMonth(renewalDate.getMonth() + 36);
      endDate = new Date(renewalDate);
    } else {
      renewalDate = new Date(now);
      renewalDate.setMonth(renewalDate.getMonth() + 1);
      endDate = new Date(renewalDate);
    }

    // Buscar email do usuário
    const userResult = await query(
      'SELECT email FROM marcbuddy.accounts WHERE id = $1',
      [userId]
    );
    const userEmail = userResult.rows[0]?.email || null;

    // Atualizar assinatura com o amount enviado pelo frontend (já calculado com descontos)
    const result = await query(
      `UPDATE marcbuddy.account_subscriptions
       SET status = 'active', 
           subscription_start_date = $1, 
           subscription_end_date = $2, 
           renewal_date = $3,
           amount = $4,
           email = $5,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $6
       RETURNING id, plan_type, status, license_key, subscription_start_date, subscription_end_date, renewal_date, billing_cycle, amount, email`,
      [startDate, endDate, renewalDate, amount, userEmail, subscription_id]
    );

    // TODO: Salvar informações do pagamento em uma tabela payments (payment_method_id, installments, coupon_code, etc.)

    res.json({
      success: true,
      message: 'Pagamento processado e assinatura ativada com sucesso',
      data: {
        subscription: result.rows[0]
      }
    });
  } catch (error) {
    console.error('Erro ao processar pagamento:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao processar pagamento'
    });
  }
};

