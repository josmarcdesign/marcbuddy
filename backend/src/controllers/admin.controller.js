import { query } from '../database/connection.js';
import { validationResult } from 'express-validator';

/**
 * Registrar ação administrativa nos logs
 */
const logAdminAction = async (adminUserId, actionType, targetType = null, targetId = null, description = null, metadata = {}, req = null) => {
  try {
    const logData = {
      admin_user_id: adminUserId,
      action_type: actionType,
      target_type: targetType,
      target_id: targetId,
      description,
      metadata: JSON.stringify(metadata),
      ip_address: req?.ip || req?.connection?.remoteAddress,
      user_agent: req?.get('User-Agent')
    };

    await query(
      `INSERT INTO admin.admin_logs
       (admin_user_id, action_type, target_type, target_id, description, metadata, ip_address, user_agent)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [
        logData.admin_user_id,
        logData.action_type,
        logData.target_type,
        logData.target_id,
        logData.description,
        logData.metadata,
        logData.ip_address,
        logData.user_agent
      ]
    );
  } catch (error) {
    console.error('Erro ao registrar log administrativo:', error);
    // Não falhar a operação principal por causa do log
  }
};

/**
 * Verificar se usuário é admin
 */
const checkAdminAccess = (user) => {
  if (!user || user.role !== 'admin') {
    throw new Error('Acesso negado. Apenas administradores podem acessar esta funcionalidade.');
  }
};

/**
 * Obter estatísticas do sistema
 */
export const getSystemStats = async (req, res) => {
  try {
    checkAdminAccess(req.user);

    // Estatísticas gerais
    const [usersResult, subscriptionsResult, plansResult, paymentsResult] = await Promise.all([
      query('SELECT COUNT(*) as total FROM marcbuddy.accounts'),
      query('SELECT status, COUNT(*) as count FROM marcbuddy.account_subscriptions GROUP BY status'),
      query('SELECT COUNT(*) as total FROM marcbuddy.subscription_plans WHERE plan_status = $1', ['active']),
      query('SELECT COUNT(*) as total FROM marcbuddy.payment_providers WHERE provider_enabled = true')
    ]);

    // Logs recentes (com fallback se tabela não existir)
    let recentLogs = { rows: [] };
    try {
      recentLogs = await query(`
        SELECT al.*, u.name as admin_name
        FROM admin.admin_logs al
        LEFT JOIN marcbuddy.accounts u ON al.admin_user_id = u.id
        ORDER BY al.created_at DESC
        LIMIT 10
      `);
    } catch (logError) {
      console.log('Tabela admin_logs não disponível:', logError.message);
    }

    res.json({
      success: true,
      data: {
        overview: {
          total_users: parseInt(usersResult.rows[0]?.total || 0),
          active_subscriptions: parseInt(subscriptionsResult.rows.find(r => r.status === 'active')?.count || 0),
          total_subscriptions: subscriptionsResult.rows.reduce((sum, r) => sum + parseInt(r.count || 0), 0),
          total_plans: parseInt(plansResult.rows[0]?.total || 0),
          enabled_payment_methods: parseInt(paymentsResult.rows[0]?.total || 0)
        },
        recent_activity: recentLogs.rows
      }
    });

    // Registrar log
    await logAdminAction(
      req.user.id,
      'view_system_stats',
      null,
      null,
      'Visualizou estatísticas do sistema',
      {},
      req
    );

  } catch (error) {
    console.error('Erro ao obter estatísticas do sistema:', error);
    res.status(error.message.includes('Acesso negado') ? 403 : 500).json({
      success: false,
      message: error.message.includes('Acesso negado') ? error.message : 'Erro ao obter estatísticas do sistema'
    });
  }
};

/**
 * Gerenciar configurações administrativas
 */
export const getAdminSettings = async (req, res) => {
  try {
    checkAdminAccess(req.user);

    const { category } = req.query;

    let queryText = 'SELECT * FROM admin.admin_settings';
    const params = [];

    if (category) {
      queryText += ' WHERE category = $1';
      params.push(category);
    }

    queryText += ' ORDER BY category, key';

    const result = await query(queryText, params);

    res.json({
      success: true,
      data: result.rows
    });

  } catch (error) {
    console.error('Erro ao obter configurações:', error);
    res.status(error.message.includes('Acesso negado') ? 403 : 500).json({
      success: false,
      message: error.message.includes('Acesso negado') ? error.message : 'Erro ao obter configurações'
    });
  }
};

export const updateAdminSetting = async (req, res) => {
  try {
    checkAdminAccess(req.user);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Dados inválidos',
        errors: errors.array()
      });
    }

    const { key, value, description } = req.body;

    // Verificar se a configuração existe
    const checkResult = await query(
      'SELECT * FROM admin.admin_settings WHERE key = $1',
      [key]
    );

    if (checkResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Configuração não encontrada'
      });
    }

    const oldValue = checkResult.rows[0].value;

    // Atualizar configuração
    await query(
      'UPDATE admin.admin_settings SET value = $1, description = $2, updated_at = CURRENT_TIMESTAMP WHERE key = $3',
      [JSON.stringify(value), description, key]
    );

    res.json({
      success: true,
      message: 'Configuração atualizada com sucesso'
    });

    // Registrar log
    await logAdminAction(
      req.user.id,
      'update_setting',
      'admin_setting',
      key,
      `Atualizou configuração: ${key}`,
      { old_value: oldValue, new_value: value },
      req
    );

  } catch (error) {
    console.error('Erro ao atualizar configuração:', error);
    res.status(error.message.includes('Acesso negado') ? 403 : 500).json({
      success: false,
      message: error.message.includes('Acesso negado') ? error.message : 'Erro ao atualizar configuração'
    });
  }
};

/**
 * Gerenciar notificações do sistema
 */
export const getSystemNotifications = async (req, res) => {
  try {
    checkAdminAccess(req.user);

    const { unread_only = false } = req.query;

    let queryText = 'SELECT * FROM admin.system_notifications';
    const params = [];

    if (unread_only === 'true') {
      queryText += ' WHERE is_read = false';
    }

    queryText += ' ORDER BY priority DESC, created_at DESC';

    const result = await query(queryText, params);

    res.json({
      success: true,
      data: result.rows
    });

  } catch (error) {
    console.error('Erro ao obter notificações:', error);
    res.status(error.message.includes('Acesso negado') ? 403 : 500).json({
      success: false,
      message: error.message.includes('Acesso negado') ? error.message : 'Erro ao obter notificações'
    });
  }
};

export const markNotificationAsRead = async (req, res) => {
  try {
    checkAdminAccess(req.user);

    const { id } = req.params;

    await query(
      'UPDATE admin.system_notifications SET is_read = true, read_by = $1, read_at = CURRENT_TIMESTAMP WHERE id = $2',
      [req.user.id, id]
    );

    res.json({
      success: true,
      message: 'Notificação marcada como lida'
    });

  } catch (error) {
    console.error('Erro ao marcar notificação como lida:', error);
    res.status(error.message.includes('Acesso negado') ? 403 : 500).json({
      success: false,
      message: error.message.includes('Acesso negado') ? error.message : 'Erro ao marcar notificação como lida'
    });
  }
};

export const createSystemNotification = async (req, res) => {
  try {
    checkAdminAccess(req.user);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Dados inválidos',
        errors: errors.array()
      });
    }

    const { title, message, type = 'info', priority = 1, expires_at } = req.body;

    const result = await query(
      `INSERT INTO admin.system_notifications (title, message, type, priority, expires_at)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [title, message, type, priority, expires_at]
    );

    res.status(201).json({
      success: true,
      message: 'Notificação criada com sucesso',
      data: result.rows[0]
    });

    // Registrar log
    await logAdminAction(
      req.user.id,
      'create_notification',
      'system_notification',
      result.rows[0].id,
      `Criou notificação: ${title}`,
      { type, priority },
      req
    );

  } catch (error) {
    console.error('Erro ao criar notificação:', error);
    res.status(error.message.includes('Acesso negado') ? 403 : 500).json({
      success: false,
      message: error.message.includes('Acesso negado') ? error.message : 'Erro ao criar notificação'
    });
  }
};

/**
 * Obter logs administrativos
 */
export const getAdminLogs = async (req, res) => {
  try {
    checkAdminAccess(req.user);

    const { page = 1, limit = 50, action_type, admin_user_id, date_from, date_to } = req.query;
    const offset = (page - 1) * limit;

    let whereClause = '';
    const params = [];
    let paramCount = 0;

    if (action_type) {
      whereClause += ` AND action_type = $${++paramCount}`;
      params.push(action_type);
    }

    if (admin_user_id) {
      whereClause += ` AND admin_user_id = $${++paramCount}`;
      params.push(admin_user_id);
    }

    if (date_from) {
      whereClause += ` AND created_at >= $${++paramCount}`;
      params.push(date_from);
    }

    if (date_to) {
      whereClause += ` AND created_at <= $${++paramCount}`;
      params.push(date_to);
    }

    // Obter total para paginação
    const countQuery = `SELECT COUNT(*) as total FROM admin.admin_logs WHERE 1=1 ${whereClause}`;
    const countResult = await query(countQuery, params);
    const total = parseInt(countResult.rows[0].total);

    // Obter logs com paginação
    const logsQuery = `
      SELECT al.*, u.name as admin_name
      FROM admin.admin_logs al
      LEFT JOIN marcbuddy.accounts u ON al.admin_user_id = u.id
      WHERE 1=1 ${whereClause}
      ORDER BY al.created_at DESC
      LIMIT $${++paramCount} OFFSET $${++paramCount}
    `;

    params.push(limit, offset);
    const logsResult = await query(logsQuery, params);

    res.json({
      success: true,
      data: {
        logs: logsResult.rows,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });

  } catch (error) {
    console.error('Erro ao obter logs administrativos:', error);
    res.status(error.message.includes('Acesso negado') ? 403 : 500).json({
      success: false,
      message: error.message.includes('Acesso negado') ? error.message : 'Erro ao obter logs administrativos'
    });
  }
};

/**
 * Obter usuários (para administração)
 */
export const getUsers = async (req, res) => {
  try {
    checkAdminAccess(req.user);

    const { page = 1, limit = 50, role, is_active, search } = req.query;
    const offset = (page - 1) * limit;

    let whereClause = '';
    const params = [];
    let paramCount = 0;

    if (role) {
      whereClause += ` AND role = $${++paramCount}`;
      params.push(role);
    }

    if (is_active !== undefined) {
      whereClause += ` AND is_active = $${++paramCount}`;
      params.push(is_active === 'true');
    }

    if (search) {
      whereClause += ` AND (name ILIKE $${++paramCount} OR email ILIKE $${++paramCount})`;
      params.push(`%${search}%`);
      paramCount++; // Incrementa para o segundo parâmetro
      params.push(`%${search}%`);
    }

    // Obter total para paginação
    const countQuery = `SELECT COUNT(*) as total FROM marcbuddy.accounts WHERE 1=1 ${whereClause}`;
    const countResult = await query(countQuery, params);
    const total = parseInt(countResult.rows[0].total);

    // Obter usuários com paginação
    const usersQuery = `
      SELECT u.*, s.plan_type, s.status as subscription_status, s.subscription_end_date
      FROM marcbuddy.accounts u
      LEFT JOIN marcbuddy.account_subscriptions s ON u.id = s.user_id AND (s.status = 'active' OR s.status IS NULL)
      WHERE 1=1 ${whereClause}
      ORDER BY u.created_at DESC
      LIMIT $${++paramCount} OFFSET $${++paramCount}
    `;

    params.push(limit, offset);
    const usersResult = await query(usersQuery, params);

    res.json({
      success: true,
      data: {
        users: usersResult.rows,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });

  } catch (error) {
    console.error('Erro ao obter usuários:', error);
    res.status(error.message.includes('Acesso negado') ? 403 : 500).json({
      success: false,
      message: error.message.includes('Acesso negado') ? error.message : 'Erro ao obter usuários'
    });
  }
};

/**
 * Atualizar usuário (admin)
 */
export const updateUser = async (req, res) => {
  try {
    checkAdminAccess(req.user);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Dados inválidos',
        errors: errors.array()
      });
    }

    const { userId } = req.params;
    const { name, email, role, is_active } = req.body;

    // Verificar se o usuário existe
    const userCheck = await query('SELECT * FROM marcbuddy.accounts WHERE id = $1', [userId]);
    if (userCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }

    const oldUser = userCheck.rows[0];

    // Atualizar usuário
    await query(
      'UPDATE marcbuddy.accounts SET name = $1, email = $2, role = $3, is_active = $4, updated_at = CURRENT_TIMESTAMP WHERE id = $5',
      [name, email, role, is_active, userId]
    );

    res.json({
      success: true,
      message: 'Usuário atualizado com sucesso'
    });

    // Registrar log
    await logAdminAction(
      req.user.id,
      'update_user',
      'user',
      userId,
      `Atualizou usuário: ${name} (${email})`,
      {
        old_data: { name: oldUser.name, email: oldUser.email, role: oldUser.role, is_active: oldUser.is_active },
        new_data: { name, email, role, is_active }
      },
      req
    );

  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    res.status(error.message.includes('Acesso negado') ? 403 : 500).json({
      success: false,
      message: error.message.includes('Acesso negado') ? error.message : 'Erro ao atualizar usuário'
    });
  }
};

/**
 * Banir usuário (desativar)
 */
export const banUser = async (req, res) => {
  try {
    checkAdminAccess(req.user);

    const { userId } = req.params;

    // Verificar se o usuário existe
    const userCheck = await query('SELECT * FROM marcbuddy.accounts WHERE id = $1', [userId]);
    if (userCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }

    const user = userCheck.rows[0];

    // Não permitir banir admin
    if (user.role === 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Não é possível banir um administrador'
      });
    }

    // Desativar usuário
    await query(
      'UPDATE marcbuddy.accounts SET is_active = false, updated_at = CURRENT_TIMESTAMP WHERE id = $1',
      [userId]
    );

    res.json({
      success: true,
      message: 'Usuário banido com sucesso'
    });

    // Registrar log
    await logAdminAction(
      req.user.id,
      'ban_user',
      'user',
      userId,
      `Baniu usuário: ${user.name} (${user.email})`,
      { user_id: userId, user_email: user.email },
      req
    );

  } catch (error) {
    console.error('Erro ao banir usuário:', error);
    res.status(error.message.includes('Acesso negado') ? 403 : 500).json({
      success: false,
      message: error.message.includes('Acesso negado') ? error.message : 'Erro ao banir usuário'
    });
  }
};

/**
 * Desbanir usuário (reativar)
 */
export const unbanUser = async (req, res) => {
  try {
    checkAdminAccess(req.user);

    const { userId } = req.params;

    // Verificar se o usuário existe
    const userCheck = await query('SELECT * FROM marcbuddy.accounts WHERE id = $1', [userId]);
    if (userCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }

    const user = userCheck.rows[0];

    // Reativar usuário
    await query(
      'UPDATE marcbuddy.accounts SET is_active = true, updated_at = CURRENT_TIMESTAMP WHERE id = $1',
      [userId]
    );

    res.json({
      success: true,
      message: 'Usuário desbanido com sucesso'
    });

    // Registrar log
    await logAdminAction(
      req.user.id,
      'unban_user',
      'user',
      userId,
      `Desbaniu usuário: ${user.name} (${user.email})`,
      { user_id: userId, user_email: user.email },
      req
    );

  } catch (error) {
    console.error('Erro ao desbanir usuário:', error);
    res.status(error.message.includes('Acesso negado') ? 403 : 500).json({
      success: false,
      message: error.message.includes('Acesso negado') ? error.message : 'Erro ao desbanir usuário'
    });
  }
};

/**
 * Deletar usuário
 */
export const deleteUser = async (req, res) => {
  try {
    checkAdminAccess(req.user);

    const { userId } = req.params;

    // Verificar se o usuário existe
    const userCheck = await query('SELECT * FROM marcbuddy.accounts WHERE id = $1', [userId]);
    if (userCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }

    const user = userCheck.rows[0];

    // Não permitir deletar admin
    if (user.role === 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Não é possível deletar um administrador'
      });
    }

    // Não permitir deletar a si mesmo
    if (parseInt(userId) === req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Não é possível deletar sua própria conta'
      });
    }

    // Deletar usuário (CASCADE irá deletar assinaturas relacionadas)
    await query('DELETE FROM marcbuddy.accounts WHERE id = $1', [userId]);

    res.json({
      success: true,
      message: 'Usuário deletado com sucesso'
    });

    // Registrar log
    await logAdminAction(
      req.user.id,
      'delete_user',
      'user',
      userId,
      `Deletou usuário: ${user.name} (${user.email})`,
      { user_id: userId, user_email: user.email, user_role: user.role },
      req
    );

  } catch (error) {
    console.error('Erro ao deletar usuário:', error);
    res.status(error.message.includes('Acesso negado') ? 403 : 500).json({
      success: false,
      message: error.message.includes('Acesso negado') ? error.message : 'Erro ao deletar usuário'
    });
  }
};

/**
 * Atualizar assinatura de um usuário
 */
export const updateUserSubscription = async (req, res) => {
  try {
    checkAdminAccess(req.user);

    const { userId } = req.params;
    const { plan_type, status = 'active', subscription_end_date } = req.body;

    // Verificar se o usuário existe
    const userCheck = await query('SELECT * FROM marcbuddy.accounts WHERE id = $1', [userId]);
    if (userCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }

    // Verificar se há assinatura ativa
    const subCheck = await query(
      'SELECT * FROM marcbuddy.account_subscriptions WHERE user_id = $1 ORDER BY created_at DESC LIMIT 1',
      [userId]
    );

    let subscriptionId;

    if (subCheck.rows.length > 0) {
      // Atualizar assinatura existente
      subscriptionId = subCheck.rows[0].id;
      await query(
        'UPDATE marcbuddy.account_subscriptions SET plan_type = $1, status = $2, subscription_end_date = $3, updated_at = CURRENT_TIMESTAMP WHERE id = $4',
        [plan_type, status, subscription_end_date, subscriptionId]
      );
    } else {
      // Criar nova assinatura
      const result = await query(
        'INSERT INTO marcbuddy.account_subscriptions (user_id, plan_type, status, subscription_start_date, subscription_end_date) VALUES ($1, $2, $3, CURRENT_TIMESTAMP, $4) RETURNING id',
        [userId, plan_type, status, subscription_end_date]
      );
      subscriptionId = result.rows[0].id;
      console.log('New subscription created:', subscriptionId);
    }

    res.json({
      success: true,
      message: 'Assinatura atualizada com sucesso',
      data: { subscription_id: subscriptionId }
    });

    // Registrar log
    await logAdminAction(
      req.user.id,
      'update_user_subscription',
      'subscription',
      subscriptionId,
      `Atualizou assinatura do usuário ID ${userId}`,
      { user_id: userId, plan_type, status, subscription_end_date },
      req
    );

  } catch (error) {
    console.error('Erro ao atualizar assinatura:', error);
    res.status(error.message.includes('Acesso negado') ? 403 : 500).json({
      success: false,
      message: error.message.includes('Acesso negado') ? error.message : 'Erro ao atualizar assinatura'
    });
  }
};

// ============================================
// PLANOS
// ============================================

/**
 * Obter configuração de planos (público ou admin)
 */
export const getPlansConfig = async (req, res) => {
  try {
    // Não verificar acesso admin - essa rota pode ser pública
    const plans = await query('SELECT * FROM marcbuddy.subscription_plans WHERE plan_status = $1 ORDER BY sort_order, id', ['active']);
    res.json({ success: true, data: { plans: plans.rows } });
  } catch (error) {
    console.error('Erro ao buscar configuração de planos:', error);
    res.status(500).json({ success: false, message: 'Erro ao buscar planos' });
  }
};

/**
 * Obter todos os planos
 */
export const getAllPlans = async (req, res) => {
  try {
    const plans = await query('SELECT * FROM marcbuddy.subscription_plans ORDER BY sort_order, id');
    res.json({ success: true, data: { plans: plans.rows } });
  } catch (error) {
    console.error('Erro ao buscar planos:', error);
    res.status(500).json({ success: false, message: 'Erro ao buscar planos' });
  }
};

/**
 * Atualizar plano
 */
export const updatePlan = async (req, res) => {
  try {
    checkAdminAccess(req.user);
    
    const { planId } = req.params;
    const updates = req.body;
    
    const fields = [];
    const values = [];
    let paramIndex = 1;
    
    Object.keys(updates).forEach(key => {
      fields.push(`${key} = $${paramIndex}`);
      values.push(updates[key]);
      paramIndex++;
    });
    
    values.push(planId);
    
    await query(
      `UPDATE marcbuddy.subscription_plans SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = $${paramIndex}`,
      values
    );
    
    res.json({ success: true, message: 'Plano atualizado com sucesso' });
    
    await logAdminAction(req.user.id, 'update_plan', 'plan', planId, `Atualizou plano ${planId}`, updates, req);
  } catch (error) {
    console.error('Erro ao atualizar plano:', error);
    res.status(500).json({ success: false, message: 'Erro ao atualizar plano' });
  }
};

// ============================================
// FORMAS DE PAGAMENTO
// ============================================

/**
 * Obter todas as formas de pagamento
 */
export const getPaymentMethods = async (req, res) => {
  try {
    const methods = await query('SELECT * FROM marcbuddy.payment_providers ORDER BY id');
    res.json({ success: true, data: { paymentMethods: methods.rows } });
  } catch (error) {
    console.error('Erro ao buscar formas de pagamento:', error);
    res.status(500).json({ success: false, message: 'Erro ao buscar formas de pagamento' });
  }
};

/**
 * Obter uma forma de pagamento
 */
export const getPaymentMethod = async (req, res) => {
  try {
    const { methodId } = req.params;
    const result = await query('SELECT * FROM marcbuddy.payment_providers WHERE id = $1', [methodId]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Forma de pagamento não encontrada' });
    }
    
    res.json({ success: true, data: { payment_method: result.rows[0] } });
  } catch (error) {
    console.error('Erro ao buscar forma de pagamento:', error);
    res.status(500).json({ success: false, message: 'Erro ao buscar forma de pagamento' });
  }
};

/**
 * Atualizar forma de pagamento
 */
export const updatePaymentMethod = async (req, res) => {
  try {
    checkAdminAccess(req.user);
    
    const { methodId } = req.params;
    const updates = req.body;
    
    const fields = [];
    const values = [];
    let paramIndex = 1;
    
    Object.keys(updates).forEach(key => {
      fields.push(`${key} = $${paramIndex}`);
      values.push(updates[key]);
      paramIndex++;
    });
    
    values.push(methodId);
    
    await query(
      `UPDATE marcbuddy.payment_providers SET ${fields.join(', ')} WHERE id = $${paramIndex}`,
      values
    );
    
    res.json({ success: true, message: 'Forma de pagamento atualizada' });
    
    await logAdminAction(req.user.id, 'update_payment_method', 'payment_method', methodId, `Atualizou forma de pagamento ${methodId}`, updates, req);
  } catch (error) {
    console.error('Erro ao atualizar forma de pagamento:', error);
    res.status(500).json({ success: false, message: 'Erro ao atualizar forma de pagamento' });
  }
};

/**
 * Ativar/Desativar forma de pagamento
 */
export const togglePaymentMethod = async (req, res) => {
  try {
    checkAdminAccess(req.user);
    
    const { methodId } = req.params;
    const { enabled } = req.body;
    
    await query(
      'UPDATE marcbuddy.payment_providers SET provider_enabled = $1 WHERE id = $2',
      [enabled, methodId]
    );
    
    res.json({ success: true, message: `Forma de pagamento ${enabled ? 'ativada' : 'desativada'}` });
    
    await logAdminAction(req.user.id, 'toggle_payment_method', 'payment_method', methodId, `${enabled ? 'Ativou' : 'Desativou'} forma de pagamento ${methodId}`, { enabled }, req);
  } catch (error) {
    console.error('Erro ao alternar forma de pagamento:', error);
    res.status(500).json({ success: false, message: 'Erro ao alternar forma de pagamento' });
  }
};

// ============================================
// FERRAMENTAS
// ============================================

/**
 * Obter ferramentas
 */
export const getTools = async (req, res) => {
  try {
    // Como não temos tabela de ferramentas, retornar hardcoded
    const tools = [
      { id: 'mclients', name: 'MClients', enabled: true, description: 'Gerenciamento de clientes' },
      { id: 'colorbuddy', name: 'ColorBuddy', enabled: true, description: 'Extrator de paleta de cores' },
    ];
    
    res.json({ success: true, data: { tools } });
  } catch (error) {
    console.error('Erro ao buscar ferramentas:', error);
    res.status(500).json({ success: false, message: 'Erro ao buscar ferramentas' });
  }
};

/**
 * Ativar/Desativar ferramenta
 */
export const toggleTool = async (req, res) => {
  try {
    checkAdminAccess(req.user);
    
    const { toolId } = req.params;
    const { enabled } = req.body;
    
    // Aqui você implementaria a lógica real quando tiver tabela de ferramentas
    res.json({ success: true, message: `Ferramenta ${enabled ? 'ativada' : 'desativada'}` });
    
    await logAdminAction(req.user.id, 'toggle_tool', 'tool', toolId, `${enabled ? 'Ativou' : 'Desativou'} ferramenta ${toolId}`, { enabled }, req);
  } catch (error) {
    console.error('Erro ao alternar ferramenta:', error);
    res.status(500).json({ success: false, message: 'Erro ao alternar ferramenta' });
  }
};

// ============================================
// ASSINATURAS
// ============================================

/**
 * Obter todas as assinaturas
 */
export const getAllSubscriptions = async (req, res) => {
  try {
    checkAdminAccess(req.user);
    
    const { status, page = 1, limit = 50 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);
    
    let whereClause = '';
    const params = [];
    
    if (status && status !== 'all') {
      whereClause = 'WHERE s.status = $1';
      params.push(status);
    }
    
    // Buscar total de registros
    const countQuery = `
      SELECT COUNT(*) as total
      FROM marcbuddy.account_subscriptions s
      ${whereClause}
    `;
    const countResult = await query(countQuery, params);
    const total = parseInt(countResult.rows[0].total);
    
    // Buscar assinaturas com paginação
    const subscriptionsQuery = `
      SELECT 
        s.*,
        a.name as user_name,
        a.email as user_email,
        sp.plan_name
      FROM marcbuddy.account_subscriptions s
      LEFT JOIN marcbuddy.accounts a ON s.user_id = a.id
      LEFT JOIN marcbuddy.subscription_plans sp ON s.plan_type = sp.id
      ${whereClause}
      ORDER BY s.created_at DESC
      LIMIT $${params.length + 1} OFFSET $${params.length + 2}
    `;
    
    const subscriptions = await query(subscriptionsQuery, [...params, parseInt(limit), offset]);
    
    res.json({ 
      success: true, 
      data: { 
        subscriptions: subscriptions.rows,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit))
        }
      } 
    });
  } catch (error) {
    console.error('Erro ao buscar assinaturas:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erro ao buscar assinaturas',
      error: error.message 
    });
  }
};

/**
 * Atualizar assinatura
 */
export const updateSubscription = async (req, res) => {
  try {
    checkAdminAccess(req.user);
    
    const { id } = req.params;
    const updates = req.body;
    
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Nenhum campo para atualizar' 
      });
    }
    
    const fields = [];
    const values = [];
    let paramIndex = 1;
    
    Object.keys(updates).forEach(key => {
      fields.push(`${key} = $${paramIndex}`);
      values.push(updates[key]);
      paramIndex++;
    });
    
    values.push(id);
    
    await query(
      `UPDATE marcbuddy.account_subscriptions SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = $${paramIndex}`,
      values
    );
    
    res.json({ success: true, message: 'Assinatura atualizada' });
    
    await logAdminAction(req.user.id, 'update_subscription', 'subscription', id, `Atualizou assinatura ${id}`, updates, req);
  } catch (error) {
    console.error('Erro ao atualizar assinatura:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erro ao atualizar assinatura',
      error: error.message 
    });
  }
};

/**
 * Deletar assinatura
 */
export const deleteSubscription = async (req, res) => {
  try {
    checkAdminAccess(req.user);
    
    const { id } = req.params;
    
    await query('DELETE FROM marcbuddy.account_subscriptions WHERE id = $1', [id]);
    
    res.json({ success: true, message: 'Assinatura deletada' });
    
    await logAdminAction(req.user.id, 'delete_subscription', 'subscription', id, `Deletou assinatura ${id}`, {}, req);
  } catch (error) {
    console.error('Erro ao deletar assinatura:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erro ao deletar assinatura',
      error: error.message 
    });
  }
};

// ============================================
// ESTATÍSTICAS
// ============================================

/**
 * Obter estatísticas gerais
 */
export const getStats = async (req, res) => {
  try {
    checkAdminAccess(req.user);
    
    // Estatísticas gerais
    const [usersResult, subscriptionsResult, plansResult, paymentProvidersResult] = await Promise.all([
      query('SELECT COUNT(*) as total FROM marcbuddy.accounts'),
      query('SELECT status, COUNT(*) as count FROM marcbuddy.account_subscriptions GROUP BY status'),
      query('SELECT COUNT(*) as total FROM marcbuddy.subscription_plans WHERE plan_status = $1', ['active']),
      query('SELECT COUNT(*) as total FROM marcbuddy.payment_providers WHERE provider_enabled = true')
    ]);

    const stats = {
      totalUsers: parseInt(usersResult.rows[0]?.total || 0),
      totalActiveSubscriptions: parseInt(subscriptionsResult.rows.find(r => r.status === 'active')?.count || 0),
      activeTools: parseInt(paymentProvidersResult.rows[0]?.total || 0), // Temporariamente usando payment providers como placeholder
      monthlyRevenue: '0.00' // Temporariamente fixo, precisa implementar cálculo real
    };

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erro ao buscar estatísticas',
      error: error.message 
    });
  }
};

// ============================================
// CUPONS
// ============================================

/**
 * Obter todos os cupons
 */
export const getCoupons = async (req, res) => {
  try {
    const coupons = await query('SELECT * FROM marcbuddy.discount_coupons ORDER BY id DESC');
    res.json({ success: true, data: { coupons: coupons.rows } });
  } catch (error) {
    console.error('Erro ao buscar cupons:', error);
    res.status(500).json({ success: false, message: 'Erro ao buscar cupons' });
  }
};

/**
 * Obter um cupom
 */
export const getCoupon = async (req, res) => {
  try {
    const { couponId } = req.params;
    const result = await query('SELECT * FROM marcbuddy.discount_coupons WHERE id = $1', [couponId]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Cupom não encontrado' });
    }
    
    res.json({ success: true, data: { coupon: result.rows[0] } });
  } catch (error) {
    console.error('Erro ao buscar cupom:', error);
    res.status(500).json({ success: false, message: 'Erro ao buscar cupom' });
  }
};

/**
 * Criar cupom
 */
export const createCoupon = async (req, res) => {
  try {
    checkAdminAccess(req.user);
    
    const { coupon_code, coupon_name, coupon_description, minimum_purchase_amount, maximum_discount_amount, applies_to_all_plans, max_uses_per_user, coupon_active } = req.body;
    
    const result = await query(
      'INSERT INTO marcbuddy.discount_coupons (coupon_code, coupon_name, coupon_description, minimum_purchase_amount, maximum_discount_amount, applies_to_all_plans, max_uses_per_user, coupon_active) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
      [coupon_code, coupon_name, coupon_description, minimum_purchase_amount, maximum_discount_amount, applies_to_all_plans, max_uses_per_user, coupon_active]
    );
    
    res.json({ success: true, message: 'Cupom criado', data: { coupon: result.rows[0] } });
    
    await logAdminAction(req.user.id, 'create_coupon', 'coupon', result.rows[0].id, `Criou cupom ${coupon_code}`, req.body, req);
  } catch (error) {
    console.error('Erro ao criar cupom:', error);
    res.status(500).json({ success: false, message: 'Erro ao criar cupom' });
  }
};

/**
 * Atualizar cupom
 */
export const updateCoupon = async (req, res) => {
  try {
    checkAdminAccess(req.user);
    
    const { couponId } = req.params;
    const updates = req.body;
    
    const fields = [];
    const values = [];
    let paramIndex = 1;
    
    Object.keys(updates).forEach(key => {
      fields.push(`${key} = $${paramIndex}`);
      values.push(updates[key]);
      paramIndex++;
    });
    
    values.push(couponId);
    
    await query(
      `UPDATE marcbuddy.discount_coupons SET ${fields.join(', ')} WHERE id = $${paramIndex}`,
      values
    );
    
    res.json({ success: true, message: 'Cupom atualizado' });
    
    await logAdminAction(req.user.id, 'update_coupon', 'coupon', couponId, `Atualizou cupom ${couponId}`, updates, req);
  } catch (error) {
    console.error('Erro ao atualizar cupom:', error);
    res.status(500).json({ success: false, message: 'Erro ao atualizar cupom' });
  }
};

/**
 * Deletar cupom
 */
export const deleteCoupon = async (req, res) => {
  try {
    checkAdminAccess(req.user);
    
    const { couponId } = req.params;
    
    await query('DELETE FROM marcbuddy.discount_coupons WHERE id = $1', [couponId]);
    
    res.json({ success: true, message: 'Cupom deletado' });
    
    await logAdminAction(req.user.id, 'delete_coupon', 'coupon', couponId, `Deletou cupom ${couponId}`, {}, req);
  } catch (error) {
    console.error('Erro ao deletar cupom:', error);
    res.status(500).json({ success: false, message: 'Erro ao deletar cupom' });
  }
};