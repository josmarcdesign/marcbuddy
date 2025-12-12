import express from 'express';
import { body } from 'express-validator';
import { authenticateToken, requireAdmin } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validation.middleware.js';
import { updateSupportBotConfig } from '../controllers/supportbot.controller.js';

const router = express.Router();

router.use(authenticateToken, requireAdmin);

router.post(
  '/config',
  [
    body('name').optional().isString(),
    body('subtitle').optional().isString(),
    body('assistantName').optional().isString(),
    body('initialMessage').optional().isString(),
    body('avatarUrl').optional().isString(),
    body('topics').optional().isArray(),
    body('quickReplies').optional().isArray(),
    body('colors').optional().isObject(),
    body('trigger').optional().isObject(),
  ],
  validate,
  updateSupportBotConfig
);

export default router;

