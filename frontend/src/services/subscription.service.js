import api from './api';

export const subscriptionService = {
  // Criar assinatura
  create: async (planType) => {
    const response = await api.post('/subscriptions', {
      plan_type: planType
    });
    return response.data;
  },

  // Listar assinaturas do usuário
  getMySubscriptions: async () => {
    const response = await api.get('/subscriptions');
    return response.data;
  },

  // Obter assinatura ativa
  getActive: async () => {
    const response = await api.get('/subscriptions/active');
    return response.data;
  },

  // Obter license key
  getLicenseKey: async () => {
    const response = await api.get('/subscriptions/license-key');
    return response.data;
  },

  // Cancelar assinatura
  cancel: async (subscriptionId) => {
    const response = await api.post(`/subscriptions/${subscriptionId}/cancel`);
    return response.data;
  },

  // Criar checkout session do Stripe
  createStripeCheckout: async (subscriptionId, paymentMethod = 'stripe', amount = null, couponCode = null) => {
    const response = await api.post('/stripe/create-checkout', {
      subscription_id: subscriptionId,
      payment_method: paymentMethod,
      amount: amount, // valor final com desconto (opcional)
      coupon_code: couponCode // código do cupom (opcional)
    });
    return response.data;
  }
};

export default subscriptionService;

