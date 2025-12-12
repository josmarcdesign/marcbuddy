import express from 'express';
import { body } from 'express-validator';
import { optionalAuth } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validation.middleware.js';
import { validateCoupon } from '../controllers/coupon.controller.js';

const router = express.Router();

/**
 * Validar cupom (rota pública, mas pode usar autenticação opcional)
 */
router.post('/validate',
  [
    body('code')
      .isString()
      .isLength({ min: 3, max: 50 })
      .withMessage('Código do cupom é obrigatório'),
    body('planId')
      .isString()
      .withMessage('ID do plano é obrigatório'),
    body('amount')
      .isFloat({ min: 0 })
      .withMessage('Valor deve ser positivo')
  ],
  validate,
  optionalAuth, // Opcional - se não autenticado, não verifica limite por usuário
  validateCoupon
);

export default router;

