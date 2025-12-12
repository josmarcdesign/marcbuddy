import express from 'express';
import { authenticateToken } from '../middleware/auth.middleware.js';
import { getMe } from '../controllers/auth.controller.js';
import { uploadAvatar, removeAvatar, updateProfile } from '../controllers/user.controller.js';
import { uploadAvatar as uploadAvatarMiddleware } from '../middleware/upload.middleware.js';

const router = express.Router();

// Todas as rotas deste arquivo requerem autenticação
router.use(authenticateToken);

// Rota para obter informações do usuário autenticado
router.get('/me', getMe);

// Rota para atualizar perfil (nome e email)
router.put('/profile', updateProfile);

// Rota para upload de foto de perfil
router.post('/avatar', uploadAvatarMiddleware, uploadAvatar);

// Rota para remover foto de perfil
router.delete('/avatar', removeAvatar);

export default router;

