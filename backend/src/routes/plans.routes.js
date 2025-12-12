import express from 'express';
import { getPlansConfig } from '../controllers/admin.controller.js';

const router = express.Router();

/**
 * Endpoint público para buscar planos (sem autenticação)
 */
router.get('/', getPlansConfig);

export default router;

