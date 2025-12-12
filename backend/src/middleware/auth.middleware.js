import jwt from 'jsonwebtoken';

/**
 * Middleware de autenticação JWT
 * Verifica se o token é válido e adiciona o usuário ao request
 */
export const authenticateToken = (req, res, next) => {
  // Obter token do header Authorization
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Formato: "Bearer TOKEN"

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Token de acesso não fornecido'
    });
  }

  try {
    // Verificar e decodificar o token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Adicionar informações do usuário ao request
    req.user = {
      id: decoded.userId,
      email: decoded.email,
      role: decoded.role
    };

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expirado'
      });
    }
    
    return res.status(403).json({
      success: false,
      message: 'Token inválido'
    });
  }
};

/**
 * Middleware para verificar se o usuário é admin
 */
export const requireAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: 'Acesso negado. Apenas administradores podem acessar este recurso.'
    });
  }
};

/**
 * Middleware de autenticação opcional
 * Não retorna erro se não houver token, apenas adiciona o usuário se existir
 */
export const optionalAuth = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    req.user = null;
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = {
      id: decoded.userId,
      email: decoded.email,
      role: decoded.role
    };
    next();
  } catch (error) {
    // Se o token for inválido, apenas continua sem usuário
    req.user = null;
    next();
  }
};

