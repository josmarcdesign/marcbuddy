import express from 'express';
import { body } from 'express-validator';
import {
  getEmailTemplates,
  getEmailTemplate,
  createEmailTemplate,
  updateEmailTemplate,
  deleteEmailTemplate,
  duplicateEmailTemplate,
  getEmailTemplateByType,
  testTemplateFiles,
  sendTestEmail
} from '../controllers/email.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = express.Router();

// Middleware de autenticação para todas as rotas
router.use(authenticateToken);

// Validações para criação/atualização
const emailTemplateValidations = [
  body('name')
    .trim()
    .isLength({ min: 1, max: 255 })
    .withMessage('Nome deve ter entre 1 e 255 caracteres'),
  body('type')
    .isIn(['welcome', 'confirmation', 'reset', 'newsletter', 'notification'])
    .withMessage('Tipo deve ser: welcome, confirmation, reset, newsletter ou notification'),
  body('subject')
    .trim()
    .isLength({ min: 1, max: 500 })
    .withMessage('Assunto deve ter entre 1 e 500 caracteres'),
  body('html_content')
    .optional()
    .isLength({ max: 50000 })
    .withMessage('Conteúdo HTML deve ter no máximo 50.000 caracteres'),
  body('variables')
    .optional()
    .isArray()
    .withMessage('Variáveis devem ser um array'),
  body('is_active')
    .optional()
    .isBoolean()
    .withMessage('Status ativo deve ser um booleano')
];

// Rotas para templates de email (apenas admin)
router.get('/admin/email-templates', getEmailTemplates);
router.get('/admin/email-templates/:id', getEmailTemplate);
router.post('/admin/email-templates', emailTemplateValidations, createEmailTemplate);
router.put('/admin/email-templates/:id', emailTemplateValidations, updateEmailTemplate);
router.delete('/admin/email-templates/:id', deleteEmailTemplate);
router.post('/admin/email-templates/:id/duplicate', duplicateEmailTemplate);

// Rota pública para buscar template por tipo (usado pelo sistema de emails)
router.get('/email-templates/type/:type', getEmailTemplateByType);

// Rota de teste para verificar leitura de arquivos (apenas desenvolvimento)
router.get('/test-templates', testTemplateFiles);

// Rota para enviar email de teste
router.post('/admin/email-templates/:id/send-test', sendTestEmail);

export default router;