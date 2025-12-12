import express from 'express';
import { body } from 'express-validator';
import { authenticateToken, requireAdmin } from '../middleware/auth.middleware.js';
import { generatePaymentQRCode, confirmPayment, processPayment } from '../controllers/payment.controller.js';

const router = express.Router();

// Todas as rotas requerem autenticação
router.use(authenticateToken);

// Validações
const generateQRCodeValidation = [
  body('subscription_id')
    .isInt()
    .withMessage('ID da assinatura inválido')
];

const confirmPaymentValidation = [
  body('subscription_id')
    .isInt()
    .withMessage('ID da assinatura inválido')
];

const processPaymentValidation = [
  body('subscription_id')
    .isInt()
    .withMessage('ID da assinatura inválido'),
  body('payment_method_id')
    .isInt()
    .withMessage('ID do método de pagamento inválido'),
  body('amount')
    .isFloat({ min: 0 })
    .withMessage('Valor inválido'),
  body('installments')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Número de parcelas inválido'),
  body('coupon_code')
    .optional()
    .isString()
    .withMessage('Código do cupom inválido')
];

// Rotas
router.post('/generate-qrcode', generateQRCodeValidation, generatePaymentQRCode);
router.post('/confirm', confirmPaymentValidation, requireAdmin, confirmPayment);
router.post('/process', processPaymentValidation, processPayment);

export default router;

