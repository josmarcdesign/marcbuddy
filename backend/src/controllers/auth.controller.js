import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query } from '../database/connection.js';
import { validationResult } from 'express-validator';
import { sendConfirmationEmail, sendPasswordResetEmail } from '../services/email.service.js';

const ACCESS_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '15m';
const REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '30d';
const RESET_EXPIRES_IN = process.env.JWT_RESET_EXPIRES_IN || '15m';

const signAccessToken = (user) =>
  jwt.sign(
    { userId: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: ACCESS_EXPIRES_IN }
  );

const signRefreshToken = (user) =>
  jwt.sign(
    { userId: user.id, email: user.email, role: user.role, type: 'refresh' },
    process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
    { expiresIn: REFRESH_EXPIRES_IN }
  );

const signResetToken = (user) =>
  jwt.sign(
    { userId: user.id, email: user.email, type: 'reset' },
    process.env.JWT_RESET_SECRET || process.env.JWT_SECRET,
    { expiresIn: RESET_EXPIRES_IN }
  );

const signEmailToken = (user) =>
  jwt.sign(
    { userId: user.id, email: user.email, type: 'email_confirmation' },
    process.env.JWT_SECRET,
    { expiresIn: '24h' } // Token válido por 24 horas
  );

const setRefreshCookie = (res, refreshToken) => {
  res.cookie('refresh_token', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge:
      typeof REFRESH_EXPIRES_IN === 'string' && REFRESH_EXPIRES_IN.endsWith('d')
        ? parseInt(REFRESH_EXPIRES_IN) * 24 * 60 * 60 * 1000
        : 30 * 24 * 60 * 60 * 1000, // fallback 30d
    path: '/api/auth',
  });
};

const buildAuthResponse = (user, token) => ({
  user: {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    avatar_url: user.avatar_url || null,
  },
  token,
});

/**
 * Controller para registro de novos usuários
 */
export const register = async (req, res) => {
  try {
    // Verificar erros de validação
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Dados inválidos',
        errors: errors.array()
      });
    }

    const { firstName, lastName, name, email, phone, password } = req.body;

    // Verificar se o email já está cadastrado (garantir que está na tabela marcbuddy.accounts)
    const existingUser = await query(
      'SELECT id FROM marcbuddy.accounts WHERE email = $1',
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Email já cadastrado'
      });
    }

    // Hash da senha
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Capturar IP do usuário
    const userIP = req.ip || req.connection?.remoteAddress || req.socket?.remoteAddress || '127.0.0.1';

    // Criar usuário (inserir na tabela marcbuddy.accounts)
    const result = await query(
      `INSERT INTO marcbuddy.accounts (first_name, last_name, name, email, phone, password_hash, role, is_active, registration_ip)
       VALUES ($1, $2, $3, $4, $5, $6, 'user', true, $7)
       RETURNING id, name, email, role, created_at`,
      [firstName, lastName, name || `${firstName} ${lastName}`, email, phone, passwordHash, userIP]
    );

    const user = result.rows[0];

    // Gerar token de confirmação de email
    const emailToken = signEmailToken(user);

    // Salvar token no banco
    await query(
      'UPDATE marcbuddy.accounts SET email_verification_token = $1 WHERE id = $2',
      [emailToken, user.id]
    );

    // Enviar email de confirmação (não bloqueia o registro se falhar)
    try {
      await sendConfirmationEmail(user.email, user.name || user.first_name, emailToken);
      console.log(`✅ Email de confirmação enviado para ${user.email}`);
    } catch (emailError) {
      console.error(`⚠️ Falha ao enviar email de confirmação para ${user.email}:`, emailError);
      // Não falha o registro por causa do email
    }

    // Criar assinatura gratuita padrão para o novo usuário
    try {
      const licenseKey = `FREE-${Math.random().toString(36).substring(2, 10).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
      
      await query(
        `INSERT INTO marcbuddy.account_subscriptions 
         (user_id, plan_type, status, license_key, subscription_start_date, billing_cycle, email)
         VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP, $5, $6)`,
        [user.id, 'free', 'active', licenseKey, 'monthly', email]
      );
      
      console.log(`✅ Assinatura gratuita criada para usuário ${user.email} (ID: ${user.id})`);
    } catch (subError) {
      console.error('⚠️ Erro ao criar assinatura gratuita para novo usuário:', subError);
      // Não bloqueia o registro se falhar - usuário ainda é criado
    }

    // Tokens
    const token = signAccessToken(user);
    const refreshToken = signRefreshToken(user);
    setRefreshCookie(res, refreshToken);

    res.status(201).json({
      success: true,
      message: 'Usuário cadastrado com sucesso',
      data: buildAuthResponse(user, token)
    });
  } catch (error) {
    console.error('Erro no registro:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao cadastrar usuário'
    });
  }
};

/**
 * Controller para login de usuários
 */
export const login = async (req, res) => {
  try {
    // Verificar erros de validação
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Dados inválidos',
        errors: errors.array()
      });
    }

    const { email, password } = req.body;

    // Buscar usuário pelo email
    const result = await query(
      'SELECT id, name, email, password_hash, role, is_active, avatar_url FROM marcbuddy.accounts WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Email ou senha incorretos'
      });
    }

    const user = result.rows[0];

    // Verificar se o usuário está ativo
    if (!user.is_active) {
      return res.status(403).json({
        success: false,
        message: 'Conta desativada. Entre em contato com o suporte.'
      });
    }

    // Verificar senha
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Email ou senha incorretos'
      });
    }

    // Verificar se usuário tem assinatura ativa, se não tiver, criar uma gratuita
    try {
      const subscriptionCheck = await query(
        'SELECT id FROM marcbuddy.account_subscriptions WHERE user_id = $1 AND status = $2',
        [user.id, 'active']
      );

      if (subscriptionCheck.rows.length === 0) {
        console.log(`⚠️ Usuário ${user.email} (ID: ${user.id}) sem assinatura ativa. Criando assinatura gratuita...`);
        
        const licenseKey = `FREE-${Math.random().toString(36).substring(2, 10).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
        
        await query(
          `INSERT INTO marcbuddy.account_subscriptions 
           (user_id, plan_type, status, license_key, subscription_start_date, billing_cycle, email)
           VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP, $5, $6)`,
          [user.id, 'mbuddy_free', 'active', licenseKey, 'monthly', user.email]
        );
        
        console.log(`✅ Assinatura gratuita criada para usuário ${user.email} (ID: ${user.id})`);
      }
    } catch (subError) {
      console.error('⚠️ Erro ao verificar/criar assinatura no login:', subError);
      // Não bloqueia o login se falhar
    }

    // Capturar IP e atualizar último login
    const userIP = req.ip || req.connection?.remoteAddress || req.socket?.remoteAddress || '127.0.0.1';

    await query(
      'UPDATE marcbuddy.accounts SET last_login_ip = $1, last_login_at = CURRENT_TIMESTAMP WHERE id = $2',
      [userIP, user.id]
    );

    // Tokens
    const token = signAccessToken(user);
    const refreshToken = signRefreshToken(user);
    setRefreshCookie(res, refreshToken);

    res.json({
      success: true,
      message: 'Login realizado com sucesso',
      data: buildAuthResponse(user, token),
    });
  } catch (error) {
    console.error('Erro no login:', error);
    console.error('Stack:', error.stack);
    res.status(500).json({
      success: false,
      message: 'Erro ao fazer login',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Controller para obter informações do usuário autenticado
 */
export const getMe = async (req, res) => {
  try {
    const result = await query(
      'SELECT id, name, email, role, avatar_url, created_at FROM marcbuddy.accounts WHERE id = $1',
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }

    res.json({
      success: true,
      data: {
        user: result.rows[0]
      }
    });
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar informações do usuário'
    });
  }
};

export const refreshToken = async (req, res) => {
  try {
    const token = req.cookies?.refresh_token;
    if (!token) {
      return res.status(401).json({ success: false, message: 'Refresh token não fornecido' });
    }

    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET);
    if (decoded.type !== 'refresh') {
      return res.status(403).json({ success: false, message: 'Token inválido' });
    }

    const userResult = await query('SELECT id, name, email, role, avatar_url FROM marcbuddy.accounts WHERE id = $1', [decoded.userId]);
    if (userResult.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Usuário não encontrado' });
    }

    const user = userResult.rows[0];
    const newAccess = signAccessToken(user);
    const newRefresh = signRefreshToken(user);
    setRefreshCookie(res, newRefresh);

    return res.json({
      success: true,
      data: buildAuthResponse(user, newAccess),
    });
  } catch (error) {
    console.error('Erro no refresh token:', error);
    return res.status(401).json({ success: false, message: 'Refresh token inválido ou expirado' });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: 'Dados inválidos', errors: errors.array() });
    }

    const { email } = req.body;
    const result = await query('SELECT id, email, name, first_name FROM marcbuddy.accounts WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      // Resposta genérica para não revelar usuários
      return res.json({ success: true, message: 'Se o email existir, enviaremos instruções de reset.' });
    }

    const user = result.rows[0];
    const resetToken = signResetToken(user);

    await query('UPDATE marcbuddy.accounts SET password_reset_token = $1, password_reset_expires = $2 WHERE id = $3', [
      resetToken,
      new Date(Date.now() + 15 * 60 * 1000), // 15 minutos
      user.id
    ]);

    // Enviar email de recuperação de senha
    try {
      await sendPasswordResetEmail(user.email, user.name || user.first_name || 'Usuário', resetToken);
      console.log(`✅ Email de recuperação enviado para ${user.email}`);
    } catch (emailError) {
      console.error(`⚠️ Falha ao enviar email de recuperação para ${user.email}:`, emailError);
      // Não falha a operação por causa do email
    }

    res.json({ success: true, message: 'Instruções de reset enviadas para seu email.' });
  } catch (error) {
    console.error('Erro no forgot password:', error);
    res.status(500).json({ success: false, message: 'Erro interno do servidor' });
  }
};

export const confirmEmail = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ success: false, message: 'Token é obrigatório' });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (decoded.type !== 'email_confirmation') {
        return res.status(400).json({ success: false, message: 'Token inválido' });
      }

      const result = await query('SELECT id FROM marcbuddy.accounts WHERE id = $1 AND email_verification_token = $2', [
        decoded.userId,
        token
      ]);

      if (result.rows.length === 0) {
        return res.status(400).json({ success: false, message: 'Token expirado ou inválido' });
      }

      await query('UPDATE marcbuddy.accounts SET email_verified = true, email_verification_token = NULL WHERE id = $1', [
        decoded.userId
      ]);

      res.json({ success: true, message: 'Email confirmado com sucesso! Você pode fazer login agora.' });
    } catch (tokenError) {
      return res.status(400).json({ success: false, message: 'Token inválido ou expirado' });
    }
  } catch (error) {
    console.error('Erro em confirmEmail:', error);
    res.status(500).json({ success: false, message: 'Erro interno do servidor' });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: 'Dados inválidos', errors: errors.array() });
    }

    const { token, password } = req.body;
    if (!token) {
      return res.status(400).json({ success: false, message: 'Token não fornecido' });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_RESET_SECRET || process.env.JWT_SECRET);
    } catch (error) {
      return res.status(401).json({ success: false, message: 'Token inválido ou expirado' });
    }

    if (decoded.type !== 'reset') {
      return res.status(403).json({ success: false, message: 'Token inválido' });
    }

    const userResult = await query('SELECT id FROM marcbuddy.accounts WHERE id = $1 AND password_reset_token = $2 AND password_reset_expires > $3', [
      decoded.userId,
      token,
      new Date()
    ]);
    if (userResult.rows.length === 0) {
      return res.status(400).json({ success: false, message: 'Token expirado ou inválido' });
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);
    await query('UPDATE marcbuddy.accounts SET password_hash = $1, password_reset_token = NULL, password_reset_expires = NULL WHERE id = $2', [
      passwordHash,
      decoded.userId
    ]);

    res.json({ success: true, message: 'Senha redefinida com sucesso' });
  } catch (error) {
    console.error('Erro em resetPassword:', error);
    return res.status(500).json({ success: false, message: 'Erro ao redefinir senha' });
  }
};

