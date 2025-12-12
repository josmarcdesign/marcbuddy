import express from 'express';
import { body } from 'express-validator';
import { authenticateToken, requireAdmin } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validation.middleware.js';
import {
  // Sistema
  getSystemStats,
  // Configurações Admin
  getAdminSettings,
  updateAdminSetting,
  // Notificações do Sistema
  getSystemNotifications,
  markNotificationAsRead,
  createSystemNotification,
  // Logs Administrativos
  getAdminLogs,
  // Usuários
  getUsers,
  updateUser,
  updateUserSubscription,
  banUser,
  unbanUser,
  deleteUser,
  // Planos
  getPlansConfig,
  getAllPlans,
  updatePlan,
  // Formas de Pagamento
  getPaymentMethods,
  getPaymentMethod,
  updatePaymentMethod,
  togglePaymentMethod,
  // Ferramentas
  getTools,
  toggleTool,
  // Assinaturas
  getAllSubscriptions,
  updateSubscription,
  deleteSubscription,
  // Estatísticas
  getStats,
  // Cupons
  getCoupons,
  getCoupon,
  createCoupon,
  updateCoupon,
  deleteCoupon
} from '../controllers/admin.controller.js';
import { getBotConfig, updateBotConfig } from '../controllers/botConfig.controller.js';

const router = express.Router();

// ============================================
// ROTAS PÚBLICAS (sem autenticação)
// ============================================
// Buscar planos (público - para página de pricing)
router.get('/plans', getPlansConfig);

// Buscar métodos de pagamento (público - para página de checkout)  
router.get('/payment-methods', getPaymentMethods);

// Buscar cupons (público - para validação de cupons)
router.get('/coupons', getCoupons);

// ============================================
// TODAS AS OUTRAS ROTAS REQUEREM ADMIN
// ============================================
router.use(authenticateToken);
router.use(requireAdmin);

/**
 * ============================================
 * GERENCIAMENTO DE ASSINATURAS
 * ============================================
 */
router.get('/subscriptions', getAllSubscriptions);
router.put('/subscriptions/:id',
  [
    body('plan_type')
      .optional()
      .isIn(['free', 'classic', 'pro', 'team'])
      .withMessage('Tipo de plano inválido'),
    body('status')
      .optional()
      .isIn(['pending', 'active', 'cancelled', 'expired', 'suspended'])
      .withMessage('Status inválido'),
    body('billing_cycle')
      .optional()
      .isIn(['monthly', 'annual'])
      .withMessage('Período de cobrança inválido')
  ],
  validate,
  updateSubscription
);
router.delete('/subscriptions/:id', deleteSubscription);

/**
 * ============================================
 * ESTATÍSTICAS
 * ============================================
 */
router.get('/stats', getStats);

/**
 * ============================================
 * GERENCIAMENTO DE USUÁRIOS
 * ============================================
 */
router.get('/users', getUsers);
router.put('/users/:userId/subscription',
  [
    body('plan_type')
      .isIn(['free', 'classic', 'pro', 'team'])
      .withMessage('Tipo de plano inválido')
  ],
  validate,
  updateUserSubscription
);
router.post('/users/:userId/ban', banUser);
router.post('/users/:userId/unban', unbanUser);
router.delete('/users/:userId', deleteUser);

// Bot config
router.get('/bot-config', getBotConfig);
router.post('/bot-config', updateBotConfig);

/**
 * ============================================
 * GERENCIAMENTO DE PLANOS
 * ============================================
 */
// Rota pública já definida acima, antes do middleware de auth
router.get('/plans/all', getAllPlans); // Admin - todos os planos (incluindo inativos)
router.put('/plans/:planId',
  authenticateToken,
  requireAdmin,
  [
    body('price')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('Preço mensal inválido'),
    body('priceAnnual')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('Preço anual inválido'),
    body('priceAnnualMonthly')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('Preço mensal equivalente inválido'),
    body('isActive')
      .optional()
      .isBoolean()
      .withMessage('isActive deve ser booleano'),
    body('isAvailable')
      .optional()
      .isBoolean()
      .withMessage('isAvailable deve ser booleano'),
    body('maxUsers')
      .optional()
      .custom((value) => {
        if (value === null || value === undefined || value === '') {
          return true; // Permite null/undefined/string vazia
        }
        const numValue = parseInt(value);
        return !isNaN(numValue) && numValue >= 0;
      })
      .withMessage('maxUsers deve ser um inteiro positivo ou null'),
    body('sortOrder')
      .optional()
      .isInt({ min: 0 })
      .withMessage('sortOrder deve ser um inteiro positivo'),
    body('maxProjects')
      .optional()
      .custom((value) => {
        if (value === null || value === undefined || value === '') {
          return true; // Permite null/undefined/string vazia
        }
        const numValue = parseInt(value);
        return !isNaN(numValue) && numValue >= 0;
      })
      .withMessage('maxProjects deve ser um inteiro positivo ou null'),
    body('maxStorageGb')
      .optional()
      .custom((value) => {
        if (value === null || value === undefined || value === '') {
          return true; // Permite null/undefined/string vazia
        }
        const numValue = parseFloat(value);
        return !isNaN(numValue) && numValue >= 0;
      })
      .withMessage('maxStorageGb deve ser um número positivo ou null'),
    body('supportLevel')
      .optional()
      .isIn(['community', 'email', 'priority', 'dedicated'])
      .withMessage('supportLevel inválido'),
    body('apiAccess')
      .optional()
      .isBoolean()
      .withMessage('apiAccess deve ser booleano'),
    body('customDomain')
      .optional()
      .isBoolean()
      .withMessage('customDomain deve ser booleano'),
    body('whiteLabel')
      .optional()
      .isBoolean()
      .withMessage('whiteLabel deve ser booleano'),
    body('annualDiscountPercentage')
      .optional()
      .custom((value) => {
        if (value === null || value === undefined || value === '') {
          return true;
        }
        const numValue = parseFloat(value);
        return !isNaN(numValue) && numValue >= 0 && numValue <= 100;
      })
      .withMessage('annualDiscountPercentage deve ser um número entre 0 e 100 ou null'),
    body('biennialDiscountPercentage')
      .optional()
      .custom((value) => {
        if (value === null || value === undefined || value === '') {
          return true;
        }
        const numValue = parseFloat(value);
        return !isNaN(numValue) && numValue >= 0 && numValue <= 100;
      })
      .withMessage('biennialDiscountPercentage deve ser um número entre 0 e 100 ou null'),
    body('triennialDiscountPercentage')
      .optional()
      .custom((value) => {
        if (value === null || value === undefined || value === '') {
          return true;
        }
        const numValue = parseFloat(value);
        return !isNaN(numValue) && numValue >= 0 && numValue <= 100;
      })
      .withMessage('triennialDiscountPercentage deve ser um número entre 0 e 100 ou null')
  ],
  validate,
  updatePlan
);

/**
 * ============================================
 * GERENCIAMENTO DE FORMAS DE PAGAMENTO
 * ============================================
 */
// Rota pública já definida acima
router.get('/payment-methods/:methodId', getPaymentMethod);
router.put('/payment-methods/:methodId',
  [
    body('name')
      .optional()
      .isString()
      .withMessage('Nome deve ser uma string'),
    body('enabled')
      .optional()
      .isBoolean()
      .withMessage('Campo enabled deve ser booleano'),
    body('max_installments')
      .optional()
      .isInt({ min: 1, max: 24 })
      .withMessage('Número máximo de parcelas deve ser entre 1 e 24'),
    body('min_installment_value')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('Valor mínimo da parcela deve ser positivo'),
    body('fee_percentage')
      .optional()
      .isFloat({ min: 0, max: 100 })
      .withMessage('Taxa percentual deve ser entre 0 e 100'),
    body('fee_fixed')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('Taxa fixa deve ser positiva'),
    body('accepts_credit')
      .optional()
      .isBoolean()
      .withMessage('Campo accepts_credit deve ser booleano'),
    body('accepts_debit')
      .optional()
      .isBoolean()
      .withMessage('Campo accepts_debit deve ser booleano')
  ],
  validate,
  updatePaymentMethod
);
router.put('/payment-methods/:methodId/toggle',
  [
    body('enabled')
      .isBoolean()
      .withMessage('Campo enabled deve ser booleano')
  ],
  validate,
  togglePaymentMethod
);

/**
 * ============================================
 * GERENCIAMENTO DE FERRAMENTAS
 * ============================================
 */
router.get('/tools', getTools);
router.put('/tools/:toolId/toggle',
  [
    body('enabled')
      .isBoolean()
      .withMessage('Campo enabled deve ser booleano')
  ],
  validate,
  toggleTool
);

/**
 * ============================================
 * GERENCIAMENTO DE CUPONS
 * ============================================
 */
// Rota pública já definida acima
router.get('/coupons/:id', getCoupon);
router.post('/coupons',
  [
    body('code')
      .isString()
      .isLength({ min: 3, max: 50 })
      .withMessage('Código do cupom deve ter entre 3 e 50 caracteres'),
    body('discount_type')
      .isIn(['percentage', 'fixed'])
      .withMessage('Tipo de desconto deve ser "percentage" ou "fixed"'),
    body('discount_value')
      .isFloat({ min: 0 })
      .withMessage('Valor do desconto deve ser positivo'),
    body('min_purchase_value')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('Valor mínimo de compra deve ser positivo'),
    body('max_discount_value')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('Valor máximo de desconto deve ser positivo'),
    body('usage_limit')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Limite de uso deve ser um número inteiro positivo'),
    body('usage_limit_per_user')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Limite de uso por usuário deve ser um número inteiro positivo'),
    body('is_active')
      .optional()
      .isBoolean()
      .withMessage('Campo is_active deve ser booleano')
  ],
  validate,
  createCoupon
);
router.put('/coupons/:id',
  [
    body('code')
      .optional()
      .isString()
      .isLength({ min: 3, max: 50 })
      .withMessage('Código do cupom deve ter entre 3 e 50 caracteres'),
    body('discount_type')
      .optional()
      .isIn(['percentage', 'fixed'])
      .withMessage('Tipo de desconto deve ser "percentage" ou "fixed"'),
    body('discount_value')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('Valor do desconto deve ser positivo'),
    body('min_purchase_value')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('Valor mínimo de compra deve ser positivo'),
    body('max_discount_value')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('Valor máximo de desconto deve ser positivo'),
    body('usage_limit')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Limite de uso deve ser um número inteiro positivo'),
    body('usage_limit_per_user')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Limite de uso por usuário deve ser um número inteiro positivo'),
    body('is_active')
      .optional()
      .isBoolean()
      .withMessage('Campo is_active deve ser booleano')
  ],
  validate,
  updateCoupon
);
router.delete('/coupons/:id', deleteCoupon);

/**
 * ============================================
 * DASHBOARD ADMINISTRATIVO
 * ============================================
 */
router.get('/dashboard/stats', getSystemStats);

/**
 * ============================================
 * CONFIGURAÇÕES ADMINISTRATIVAS
 * ============================================
 */
router.get('/settings', getAdminSettings);
router.put('/settings/:key',
  [
    body('value')
      .exists()
      .withMessage('Valor é obrigatório'),
    body('description')
      .optional()
      .isString()
      .withMessage('Descrição deve ser uma string')
  ],
  validate,
  updateAdminSetting
);

/**
 * ============================================
 * NOTIFICAÇÕES DO SISTEMA
 * ============================================
 */
router.get('/notifications', getSystemNotifications);
router.post('/notifications',
  [
    body('title')
      .isString()
      .isLength({ min: 1, max: 255 })
      .withMessage('Título deve ter entre 1 e 255 caracteres'),
    body('message')
      .isString()
      .isLength({ min: 1 })
      .withMessage('Mensagem é obrigatória'),
    body('type')
      .optional()
      .isIn(['info', 'warning', 'error', 'success'])
      .withMessage('Tipo deve ser info, warning, error ou success'),
    body('priority')
      .optional()
      .isInt({ min: 1, max: 4 })
      .withMessage('Prioridade deve ser entre 1 e 4'),
    body('expires_at')
      .optional()
      .isISO8601()
      .withMessage('Data de expiração deve ser uma data válida')
  ],
  validate,
  createSystemNotification
);
router.put('/notifications/:id/read', markNotificationAsRead);

/**
 * ============================================
 * LOGS ADMINISTRATIVOS
 * ============================================
 */
router.get('/logs', getAdminLogs);

/**
 * ============================================
 * GERENCIAMENTO AVANÇADO DE USUÁRIOS
 * ============================================
 */
router.put('/users/:userId',
  [
    body('name')
      .isString()
      .isLength({ min: 1, max: 255 })
      .withMessage('Nome deve ter entre 1 e 255 caracteres'),
    body('email')
      .isEmail()
      .withMessage('Email deve ser válido'),
    body('role')
      .isIn(['user', 'admin'])
      .withMessage('Role deve ser user ou admin'),
    body('is_active')
      .isBoolean()
      .withMessage('is_active deve ser booleano')
  ],
  validate,
  updateUser
);

export default router;

