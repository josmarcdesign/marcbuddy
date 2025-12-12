import { query } from '../database/connection.js';
import { 
  createCheckoutSession, 
  getStripePriceId, 
  hasStripePrice,
  constructWebhookEvent,
  cancelStripeSubscription
} from '../services/stripe.service.js';

/**
 * Criar Checkout Session do Stripe
 */
export const createStripeCheckout = async (req, res) => {
  try {
    const { subscription_id, payment_method, amount, coupon_code } = req.body;
    const userId = req.user.id;

    console.log('📝 Criando Checkout Session:', {
      subscription_id,
      payment_method,
      amount,
      coupon_code,
      userId
    });

    // Validar parâmetros obrigatórios
    if (!subscription_id) {
      return res.status(400).json({
        success: false,
        message: 'subscription_id é obrigatório'
      });
    }

    if (!payment_method) {
      return res.status(400).json({
        success: false,
        message: 'payment_method é obrigatório'
      });
    }

    // Buscar assinatura
    const subscriptionResult = await query(
      `SELECT id, plan_type, status, user_id, billing_cycle
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

    // Verificar se já está ativa
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

    // Verificar se o plano tem preço no Stripe
    if (!hasStripePrice(subscription.plan_type)) {
      return res.status(400).json({
        success: false,
        message: 'Plano não configurado no Stripe'
      });
    }

    // Obter email do usuário
    const userResult = await query(
      'SELECT email FROM marcbuddy.accounts WHERE id = $1',
      [userId]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }

    const userEmail = userResult.rows[0].email;

    // Obter preço do Stripe
    const priceId = getStripePriceId(subscription.plan_type);
    
    if (!priceId) {
      console.error('❌ PriceId não encontrado para o plano:', subscription.plan_type);
      return res.status(400).json({
        success: false,
        message: `Plano ${subscription.plan_type} não está configurado no Stripe`
      });
    }

    // URLs de sucesso e cancelamento
    const baseUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const successUrl = `${baseUrl}/stripe/return?session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${baseUrl}/stripe/return?canceled=true`;

    // Determinar tipos de pagamento baseado no método escolhido
    let paymentMethodTypes = ['card']; // padrão
    if (payment_method === 'pix') {
      paymentMethodTypes = ['pix'];
    } else if (payment_method === 'stripe' || payment_method === 'credit_card' || payment_method === 'debit_card') {
      paymentMethodTypes = ['card'];
    } else if (payment_method) {
      // Se for outro método, tentar mapear
      paymentMethodTypes = payment_method === 'pix' ? ['pix'] : ['card'];
    }

    // Criar Checkout Session
    // Para PIX: usar amount customizado (com cupom) se fornecido
    // Para Cartão: usar priceId normal (Stripe Checkout subscription não aceita customAmount)
    // O desconto do cupom será aplicado manualmente após o pagamento se necessário
    const finalAmount = payment_method === 'pix' && amount ? amount : null;
    
    const session = await createCheckoutSession(
      priceId,
      userId,
      userEmail,
      subscription.id,
      successUrl,
      cancelUrl,
      paymentMethodTypes,
      finalAmount, // valor com desconto (apenas para PIX)
      coupon_code // código do cupom (para referência)
    );

    res.json({
      success: true,
      message: 'Checkout Session criada com sucesso',
      data: {
        sessionId: session.id,
        url: session.url
      }
    });
  } catch (error) {
    console.error('Erro ao criar Checkout Session:', error);
    console.error('Detalhes do erro:', {
      message: error.message,
      stack: error.stack,
      subscription_id: req.body?.subscription_id,
      payment_method: req.body?.payment_method,
      amount: req.body?.amount,
      coupon_code: req.body?.coupon_code
    });
    res.status(500).json({
      success: false,
      message: 'Erro ao criar Checkout Session',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Erro interno do servidor'
    });
  }
};

/**
 * Webhook do Stripe para processar eventos
 */
export const handleStripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error('STRIPE_WEBHOOK_SECRET não configurado');
    return res.status(500).send('Webhook secret não configurado');
  }

  let event;

  try {
    event = constructWebhookEvent(req.body, sig, webhookSecret);
  } catch (err) {
    console.error('Erro ao verificar webhook:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    // Processar diferentes tipos de eventos
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object);
        break;

      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object);
        break;

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object);
        break;

      case 'invoice.payment_succeeded':
        await handleInvoicePaymentSucceeded(event.data.object);
        break;

      case 'invoice.payment_failed':
        await handleInvoicePaymentFailed(event.data.object);
        break;

      default:
        console.log(`Evento não tratado: ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Erro ao processar webhook:', error);
    res.status(500).json({ error: 'Erro ao processar webhook' });
  }
};

/**
 * Processar checkout completado
 */
const handleCheckoutCompleted = async (session) => {
  const subscriptionId = parseInt(session.client_reference_id);
  const userId = parseInt(session.metadata.user_id);

  if (!subscriptionId || !userId) {
    console.error('Dados inválidos no checkout:', session);
    return;
  }

  // Buscar assinatura
  const subscriptionResult = await query(
    `SELECT id, plan_type, billing_cycle, status
     FROM marcbuddy.account_subscriptions
     WHERE id = $1 AND user_id = $2`,
    [subscriptionId, userId]
  );

  if (subscriptionResult.rows.length === 0) {
    console.error('Assinatura não encontrada:', subscriptionId);
    return;
  }

  const subscription = subscriptionResult.rows[0];

  // Se já está ativa, não fazer nada
  if (subscription.status === 'active') {
    return;
  }

  // Calcular datas
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

  // Obter email do usuário
  const userResult = await query(
    'SELECT email FROM marcbuddy.accounts WHERE id = $1',
    [userId]
  );
  const userEmail = userResult.rows[0]?.email || null;

  // Verificar se o pagamento foi concluído
  if (session.payment_status !== 'paid') {
    console.log(`Pagamento ainda não concluído para sessão ${session.id} (status: ${session.payment_status})`);
    return;
  }

  // Obter valor do plano
  const PLAN_PRICES = {
    classic: 29.90,
    pro: 59.90,
    team: 149.90
  };
  const amount = PLAN_PRICES[subscription.plan_type] || 0;

  // Para PIX (pagamento único), session.subscription será null
  // Para cartão (assinatura), session.subscription terá o ID da assinatura
  const stripeSubscriptionId = session.subscription || null;

  // Ativar assinatura
  await query(
    `UPDATE marcbuddy.account_subscriptions
     SET status = 'active',
         subscription_start_date = $1,
         subscription_end_date = $2,
         renewal_date = $3,
         amount = $4,
         email = $5,
         stripe_subscription_id = COALESCE($6, stripe_subscription_id),
         updated_at = CURRENT_TIMESTAMP
     WHERE id = $7`,
    [startDate, endDate, renewalDate, amount, userEmail, stripeSubscriptionId, subscriptionId]
  );

  const paymentMethod = session.payment_method_types?.[0] || 'N/A';
  const mode = session.mode || 'N/A';
  console.log(`Assinatura ${subscriptionId} ativada via Stripe (modo: ${mode}, método: ${paymentMethod})`);
};

/**
 * Processar atualização de assinatura
 */
const handleSubscriptionUpdated = async (stripeSubscription) => {
  const subscriptionId = parseInt(stripeSubscription.metadata?.subscription_id);

  if (!subscriptionId) {
    console.error('Subscription ID não encontrado nos metadata');
    return;
  }

  // Atualizar status baseado no status do Stripe
  let status = 'pending';
  if (stripeSubscription.status === 'active') {
    status = 'active';
  } else if (stripeSubscription.status === 'canceled' || stripeSubscription.status === 'unpaid') {
    status = 'cancelled';
  } else if (stripeSubscription.status === 'past_due') {
    status = 'pending';
  }

  await query(
    `UPDATE marcbuddy.account_subscriptions
     SET status = $1,
         stripe_subscription_id = $2,
         updated_at = CURRENT_TIMESTAMP
     WHERE id = $3`,
    [status, stripeSubscription.id, subscriptionId]
  );

  console.log(`Assinatura ${subscriptionId} atualizada: ${status}`);
};

/**
 * Processar cancelamento de assinatura
 */
const handleSubscriptionDeleted = async (stripeSubscription) => {
  const subscriptionId = parseInt(stripeSubscription.metadata?.subscription_id);

  if (!subscriptionId) {
    console.error('Subscription ID não encontrado nos metadata');
    return;
  }

  await query(
    `UPDATE marcbuddy.account_subscriptions
     SET status = 'cancelled',
         updated_at = CURRENT_TIMESTAMP
     WHERE id = $1`,
    [subscriptionId]
  );

  console.log(`Assinatura ${subscriptionId} cancelada`);
};

/**
 * Processar pagamento de fatura bem-sucedido
 */
const handleInvoicePaymentSucceeded = async (invoice) => {
  // Renovação automática - atualizar datas de renovação
  if (invoice.subscription) {
    const subscriptionResult = await query(
      `SELECT id, billing_cycle
       FROM marcbuddy.account_subscriptions
       WHERE stripe_subscription_id = $1`,
      [invoice.subscription]
    );

    if (subscriptionResult.rows.length > 0) {
      const subscription = subscriptionResult.rows[0];
      const now = new Date();
      let renewalDate = null;
      let endDate = null;

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

      await query(
        `UPDATE marcbuddy.account_subscriptions
         SET subscription_start_date = $1,
             subscription_end_date = $2,
             renewal_date = $3,
             status = 'active',
             updated_at = CURRENT_TIMESTAMP
         WHERE stripe_subscription_id = $4`,
        [now, endDate, renewalDate, invoice.subscription]
      );

      console.log(`Assinatura renovada: ${subscription.id}`);
    }
  }
};

/**
 * Processar falha no pagamento
 */
const handleInvoicePaymentFailed = async (invoice) => {
  if (invoice.subscription) {
    await query(
      `UPDATE marcbuddy.account_subscriptions
       SET status = 'pending',
           updated_at = CURRENT_TIMESTAMP
       WHERE stripe_subscription_id = $1`,
      [invoice.subscription]
    );

    console.log(`Pagamento falhou para assinatura: ${invoice.subscription}`);
  }
};

/**
 * Cancelar assinatura Stripe
 */
export const cancelStripeSubscriptionController = async (req, res) => {
  try {
    const { subscription_id } = req.body;
    const userId = req.user.id;

    // Buscar assinatura
    const subscriptionResult = await query(
      `SELECT id, user_id, stripe_subscription_id, status
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

    if (!subscription.stripe_subscription_id) {
      return res.status(400).json({
        success: false,
        message: 'Esta assinatura não está vinculada ao Stripe'
      });
    }

    // Cancelar no Stripe
    await cancelStripeSubscription(subscription.stripe_subscription_id);

    // Atualizar status no banco (não cancelar imediatamente, apenas marcar para não renovar)
    // O Stripe manterá a assinatura ativa até o final do período pago
    await query(
      `UPDATE marcbuddy.account_subscriptions
       SET status = 'cancelled',
           cancellation_date = CURRENT_TIMESTAMP,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $1`,
      [subscription.id]
    );

    res.json({
      success: true,
      message: 'Assinatura cancelada com sucesso. Ela permanecerá ativa até o final do período pago.'
    });
  } catch (error) {
    console.error('Erro ao cancelar assinatura Stripe:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao cancelar assinatura',
      error: error.message
    });
  }
};
