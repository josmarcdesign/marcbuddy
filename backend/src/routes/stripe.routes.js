import express from 'express';
import { body } from 'express-validator';
import { authenticateToken } from '../middleware/auth.middleware.js';
import { createStripeCheckout, handleStripeWebhook, cancelStripeSubscriptionController } from '../controllers/stripe.controller.js';

const router = express.Router();

// Webhook do Stripe (não requer autenticação JWT, usa assinatura do Stripe)
router.post('/webhook', express.raw({ type: 'application/json' }), handleStripeWebhook);

// Criar Checkout Session (requer autenticação)
router.post(
  '/create-checkout',
  authenticateToken,
  [
    body('subscription_id')
      .isInt()
      .withMessage('ID da assinatura inválido')
  ],
  createStripeCheckout
);

// Cancelar assinatura Stripe (requer autenticação)
router.post(
  '/cancel-subscription',
  authenticateToken,
  [
    body('subscription_id')
      .isInt()
      .withMessage('ID da assinatura inválido')
  ],
  cancelStripeSubscriptionController
);

export default router;
