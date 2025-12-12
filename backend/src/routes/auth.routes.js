import express from 'express';
import { body } from 'express-validator';
import { register, login, getMe, refreshToken, forgotPassword, resetPassword, confirmEmail } from '../controllers/auth.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';
import { rateLimit } from 'express-rate-limit';

const router = express.Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Muitas tentativas. Tente novamente em alguns minutos.' },
});

// Validações para registro
const registerValidation = [
  body('firstName')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Primeiro nome é obrigatório e deve ter no máximo 100 caracteres'),
  body('lastName')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Sobrenome é obrigatório e deve ter no máximo 100 caracteres'),
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 255 })
    .withMessage('Nome deve ter entre 2 e 255 caracteres'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Email inválido'),
  body('phone')
    .optional()
    .matches(/^[\d\s\-\+\(\)]+$/)
    .withMessage('Telefone deve conter apenas números, espaços, hífens, parênteses e sinal de mais'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Senha deve ter pelo menos 6 caracteres')
];

// Validações para login
const loginValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Email inválido'),
  body('password')
    .notEmpty()
    .withMessage('Senha é obrigatória')
];

const forgotValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Email inválido'),
];

const resetValidation = [
  body('token').notEmpty().withMessage('Token é obrigatório'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Senha deve ter pelo menos 6 caracteres'),
];

const confirmEmailValidation = [
  body('token').notEmpty().withMessage('Token é obrigatório'),
];

// Rotas públicas
router.post('/register', authLimiter, registerValidation, register);
router.post('/login', authLimiter, loginValidation, login);
router.post('/refresh', authLimiter, refreshToken);
router.post('/forgot-password', authLimiter, forgotValidation, forgotPassword);
router.post('/reset-password', authLimiter, resetValidation, resetPassword);
router.post('/confirm-email', authLimiter, confirmEmailValidation, confirmEmail);

// Rota protegida - requer autenticação
router.get('/me', authenticateToken, getMe);

export default router;

