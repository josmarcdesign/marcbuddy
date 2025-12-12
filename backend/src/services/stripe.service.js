import Stripe from 'stripe';

// Inicializar Stripe
if (!process.env.STRIPE_SECRET_KEY) {
  console.error('❌ STRIPE_SECRET_KEY não configurado no .env');
  throw new Error('STRIPE_SECRET_KEY é obrigatório');
}

// Inicializar Stripe sem especificar versão da API (usa a mais recente estável)
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Mapeamento entre planos do sistema e preços do Stripe
const STRIPE_PRICE_IDS = {
  classic: 'price_1SdLs63HuSgjUVZNoHFiM9c3', // MBuddy Classic - R$ 29,90/mês
  pro: 'price_1SdLsB3HuSgjUVZNn8BXkf3E',      // MBuddy Pro - R$ 59,90/mês
  team: 'price_1SdLsF3HuSgjUVZNK4Kwh8xv',      // MBuddy Team - R$ 149,90/mês
};

/**
 * Criar Checkout Session para assinatura
 * @param {string} priceId - ID do preço no Stripe
 * @param {number} userId - ID do usuário
 * @param {string} userEmail - Email do usuário
 * @param {number} subscriptionId - ID da assinatura
 * @param {string} successUrl - URL de sucesso
 * @param {string} cancelUrl - URL de cancelamento
 * @param {string[]} paymentMethodTypes - Tipos de pagamento ['card', 'pix']
 * @param {number} customAmount - Valor customizado (com desconto de cupom, opcional)
 * @param {string} couponCode - Código do cupom (opcional)
 */
export const createCheckoutSession = async (priceId, userId, userEmail, subscriptionId, successUrl, cancelUrl, paymentMethodTypes = ['card'], customAmount = null, couponCode = null) => {
  try {
    // Mapear códigos do sistema para tipos do Stripe
    const stripePaymentTypes = paymentMethodTypes.map(type => {
      if (type === 'pix') return 'pix';
      if (type === 'stripe' || type === 'credit_card' || type === 'debit_card') return 'card';
      return 'card'; // padrão
    });

    // PIX não suporta assinaturas recorrentes, usar modo 'payment' (pagamento único)
    // Cartão suporta assinaturas, usar modo 'subscription'
    const isPixOnly = stripePaymentTypes.length === 1 && stripePaymentTypes[0] === 'pix';
    const mode = isPixOnly ? 'payment' : 'subscription';

    // Para PIX, precisamos criar um line_item com price_data (pagamento único)
    // Para cartão, usamos o priceId diretamente (assinatura recorrente)
    let lineItems;
    if (isPixOnly) {
      // Buscar o preço para obter o amount base
      const price = await stripe.prices.retrieve(priceId);
      // Se houver valor customizado (com cupom), usar ele; senão usar o valor do preço
      const finalAmount = customAmount ? Math.round(customAmount * 100) : price.unit_amount;
      
      lineItems = [
        {
          price_data: {
            currency: 'brl',
            product_data: {
              name: `Assinatura MarcBuddy`,
            },
            unit_amount: finalAmount, // em centavos
            // Não incluir 'recurring' para pagamento único
          },
          quantity: 1,
        },
      ];
    } else {
      // Para cartão (subscription), não podemos usar customAmount diretamente
      // O Stripe Checkout em modo subscription requer um priceId válido
      // Se houver cupom, precisamos criar um coupon no Stripe ou usar discounts
      // Por enquanto, vamos usar o preço normal e aplicar desconto depois se necessário
      // NOTA: Para aplicar desconto em subscription, precisaríamos criar um coupon no Stripe
      lineItems = [
        {
          price: priceId,
          quantity: 1,
        },
      ];
      
      // Se houver cupom e customAmount, podemos tentar aplicar via discounts
      // Mas isso requer criar um coupon no Stripe primeiro
      // Por enquanto, vamos apenas usar o priceId e aplicar desconto manualmente depois
    }

    const sessionConfig = {
      payment_method_types: stripePaymentTypes,
      line_items: lineItems,
      mode: mode,
      customer_email: userEmail,
      client_reference_id: subscriptionId.toString(),
      metadata: {
        user_id: userId.toString(),
        subscription_id: subscriptionId.toString(),
      },
      success_url: successUrl,
      cancel_url: cancelUrl,
    };

    // Adicionar subscription_data apenas para modo subscription
    if (mode === 'subscription') {
      sessionConfig.subscription_data = {
        metadata: {
          user_id: userId.toString(),
          subscription_id: subscriptionId.toString(),
        },
      };
      // Habilitar cobrança automática de invoices
      // NOTA: invoice_creation só funciona no modo 'payment'
      // No modo 'subscription', invoices são criados automaticamente pelo Stripe
      sessionConfig.payment_method_collection = 'always';
    }
    
    // Configurar invoices automáticos apenas para modo payment (PIX)
    if (mode === 'payment') {
      sessionConfig.invoice_creation = {
        enabled: true,
      };
    }

    // Configurações específicas para PIX
    if (stripePaymentTypes.includes('pix')) {
      sessionConfig.payment_method_options = {
        pix: {
          expires_after_days: 1, // PIX expira em 1 dia
        },
      };
    }

    // Validar configuração antes de criar
    if (!priceId) {
      throw new Error('PriceId é obrigatório');
    }
    
    if (!userEmail) {
      throw new Error('Email do usuário é obrigatório');
    }

    if (!subscriptionId) {
      throw new Error('SubscriptionId é obrigatório');
    }

    console.log('Criando Checkout Session:', {
      priceId,
      mode,
      paymentMethodTypes: stripePaymentTypes,
      customAmount,
      isPixOnly,
      subscriptionId,
      userEmail: userEmail.substring(0, 5) + '...' // Log parcial do email por segurança
    });

    try {
      const session = await stripe.checkout.sessions.create(sessionConfig);
      console.log('✅ Checkout Session criada com sucesso:', session.id);
      return session;
    } catch (stripeError) {
      console.error('❌ Erro do Stripe ao criar Checkout Session:', {
        type: stripeError.type,
        code: stripeError.code,
        message: stripeError.message,
        param: stripeError.param,
        decline_code: stripeError.decline_code
      });
      throw stripeError;
    }
  } catch (error) {
    console.error('Erro ao criar Checkout Session:', error);
    console.error('Detalhes:', {
      message: error.message,
      type: error.type,
      code: error.code,
      param: error.param
    });
    throw error;
  }
};

/**
 * Obter preço do Stripe baseado no tipo de plano
 */
export const getStripePriceId = (planType) => {
  return STRIPE_PRICE_IDS[planType] || null;
};

/**
 * Verificar se o plano tem preço no Stripe
 */
export const hasStripePrice = (planType) => {
  return STRIPE_PRICE_IDS.hasOwnProperty(planType);
};

/**
 * Processar webhook do Stripe
 */
export const constructWebhookEvent = (payload, signature, secret) => {
  try {
    return stripe.webhooks.constructEvent(payload, signature, secret);
  } catch (error) {
    console.error('Erro ao verificar webhook:', error);
    throw error;
  }
};

/**
 * Obter assinatura do Stripe
 */
export const getStripeSubscription = async (subscriptionId) => {
  try {
    return await stripe.subscriptions.retrieve(subscriptionId);
  } catch (error) {
    console.error('Erro ao buscar assinatura do Stripe:', error);
    throw error;
  }
};

/**
 * Cancelar assinatura no Stripe
 */
export const cancelStripeSubscription = async (subscriptionId) => {
  try {
    return await stripe.subscriptions.cancel(subscriptionId);
  } catch (error) {
    console.error('Erro ao cancelar assinatura no Stripe:', error);
    throw error;
  }
};

/**
 * Obter customer do Stripe
 */
export const getStripeCustomer = async (customerId) => {
  try {
    return await stripe.customers.retrieve(customerId);
  } catch (error) {
    console.error('Erro ao buscar customer do Stripe:', error);
    throw error;
  }
};

export default stripe;
