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
  cancelSubscription,
  getAllPendingSubscriptions
} from '../controllers/subscription.controller.js';

const router = express.Router();

// Todas as rotas requerem autenticação
router.use(authenticateToken);

// Validações
const createSubscriptionValidation = [
  body('plan_type')
    .isIn(['free', 'classic', 'pro', 'team'])
    .withMessage('Plano inválido'),
  body('billing_period')
    .optional()
    .isIn(['monthly', 'annual', 'biennial', 'triennial'])
    .withMessage('Período de cobrança inválido')
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
router.get('/admin/pending', getAllPendingSubscriptions); // Admin only
router.get('/:id', getSubscriptionById);
router.patch('/:id/status', updateStatusValidation, updateSubscriptionStatus);
router.post('/:id/cancel', cancelSubscription);

export default router;

