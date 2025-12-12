import express from 'express';
import { authenticateToken } from '../middleware/auth.middleware.js';
import {
  getMClientsData,
  saveMClientsData,
  deleteClient
} from '../controllers/mclients.controller.js';

const router = express.Router();

// Rotas protegidas (requerem autenticação)
router.get('/data', authenticateToken, getMClientsData);
router.post('/data', authenticateToken, saveMClientsData);
router.delete('/clients/:id', authenticateToken, deleteClient);

export default router;

