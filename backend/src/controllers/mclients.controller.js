import { query, getClient } from '../database/connection.js';
import { v4 as uuidv4 } from 'uuid';

// Helper para logs legíveis no terminal
const logAction = (label, { userId, userName, userEmail, info = {}, samples = {} }) => {
  const userLabel = userName || userEmail
    ? `${userId} (${userName || ''}${userName && userEmail ? ' - ' : ''}${userEmail || ''})`
    : userId;
  const parts = [`[MCLIENTS][${label}] user=${userLabel}`];
  const infoPairs = Object.entries(info);
  if (infoPairs.length) {
    parts.push(
      'counts=' +
        infoPairs
          .map(([k, v]) => `${k}=${v}`)
          .join(',')
    );
  }
  const samplePairs = Object.entries(samples)
    .filter(([, v]) => v !== undefined && v !== null);
  if (samplePairs.length) {
    parts.push(
      'samples=' +
        samplePairs
          .map(([k, v]) => `${k}=${v}`)
          .join(' | ')
    );
  }
  console.log(parts.join(' · '));
};

// ============================================
// Funções auxiliares para ler dados das tabelas
// ============================================

const loadClients = async (userId) => {
  const result = await query(
    `SELECT id, name, email, phone, company, address, notes, status, 
            lead_source, lead_source_details, created_at
     FROM mclients.mclients_clients 
     WHERE user_id = $1 
     ORDER BY created_at DESC`,
    [userId]
  );
  return result.rows.map(row => ({
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone,
    company: row.company,
    address: row.address,
    notes: row.notes,
    status: row.status,
    leadSource: row.lead_source,
    leadSourceDetails: row.lead_source_details,
    createdAt: row.created_at ? row.created_at.toISOString().split('T')[0] : null
  }));
};

const loadDemands = async (userId) => {
  const result = await query(
    `SELECT id, client_id, title, description, status, priority, due_date, created_at
     FROM mclients.mclients_demands 
     WHERE user_id = $1 
     ORDER BY created_at DESC`,
    [userId]
  );
  return result.rows.map(row => ({
    id: row.id,
    clientId: row.client_id,
    title: row.title,
    description: row.description,
    status: row.status,
    priority: row.priority,
    dueDate: row.due_date ? row.due_date.toISOString().split('T')[0] : null,
    createdAt: row.created_at ? row.created_at.toISOString().split('T')[0] : null,
    documents: [] // Será preenchido se necessário
  }));
};

const loadPayments = async (userId) => {
  const result = await query(
    `SELECT id, client_id, demand_id, amount, due_date, paid_date, status, 
            description, payment_method, sender_name, receiver_name, 
            sender_bank, receiver_bank, payment_time, created_at
     FROM mclients.mclients_payments 
     WHERE user_id = $1 
     ORDER BY created_at DESC`,
    [userId]
  );
  return result.rows.map(row => ({
    id: row.id,
    clientId: row.client_id,
    demandId: row.demand_id,
    amount: parseFloat(row.amount) || 0,
    dueDate: row.due_date ? row.due_date.toISOString().split('T')[0] : null,
    paidDate: row.paid_date ? row.paid_date.toISOString().split('T')[0] : null,
    status: row.status,
    description: row.description,
    paymentMethod: row.payment_method,
    senderName: row.sender_name,
    receiverName: row.receiver_name,
    senderBank: row.sender_bank,
    receiverBank: row.receiver_bank,
    paymentTime: row.payment_time ? row.payment_time.toISOString() : null
  }));
};

const loadDocuments = async (userId) => {
  const result = await query(
    `SELECT id, client_id, demand_id, name, type, size, category, content, uploaded_at
     FROM mclients.mclients_documents 
     WHERE user_id = $1 
     ORDER BY uploaded_at DESC`,
    [userId]
  );
  return result.rows.map(row => ({
    id: row.id,
    clientId: row.client_id,
    demandId: row.demand_id,
    name: row.name,
    type: row.type,
    size: row.size,
    category: row.category,
    content: row.content,
    uploadedAt: row.uploaded_at ? row.uploaded_at.toISOString().split('T')[0] : null
  }));
};

const loadServices = async (userId) => {
  const result = await query(
    `SELECT id, name, description, price, category, duration, active, created_at
     FROM mclients.mclients_services 
     WHERE user_id = $1 
     ORDER BY created_at DESC`,
    [userId]
  );
  return result.rows.map(row => ({
    id: row.id,
    name: row.name,
    description: row.description,
    price: parseFloat(row.price) || 0,
    category: row.category,
    duration: row.duration,
    active: row.active
  }));
};

const loadTasks = async (userId) => {
  const result = await query(
    `SELECT id, demand_id, title, completed, due_date, priority, created_at
     FROM mclients.mclients_tasks 
     WHERE user_id = $1 
     ORDER BY created_at DESC`,
    [userId]
  );
  return result.rows.map(row => ({
    id: row.id,
    demandId: row.demand_id,
    title: row.title,
    completed: row.completed,
    dueDate: row.due_date ? row.due_date.toISOString().split('T')[0] : null,
    priority: row.priority,
    createdAt: row.created_at ? row.created_at.toISOString().split('T')[0] : null
  }));
};

const loadTimeEntries = async (userId) => {
  const result = await query(
    `SELECT id, demand_id, description, hours, date, status, created_at
     FROM mclients.mclients_time_entries 
     WHERE user_id = $1 
     ORDER BY date DESC`,
    [userId]
  );
  return result.rows.map(row => ({
    id: row.id,
    demandId: row.demand_id,
    description: row.description,
    hours: parseFloat(row.hours) || 0,
    date: row.date ? row.date.toISOString().split('T')[0] : null,
    status: row.status
  }));
};

const loadActivities = async (userId) => {
  const result = await query(
    `SELECT id, type, demand_id, client_id, description, created_at
     FROM mclients.mclients_activities 
     WHERE user_id = $1 
     ORDER BY created_at DESC`,
    [userId]
  );
  return result.rows.map(row => ({
    id: row.id,
    type: row.type,
    demandId: row.demand_id,
    clientId: row.client_id,
    description: row.description,
    createdAt: row.created_at ? row.created_at.toISOString() : null
  }));
};

// ============================================
// Funções auxiliares para salvar dados
// ============================================

const saveClients = async (clientData, userId, clientId = null, dbClient = null) => {
  const execQuery = dbClient ? dbClient.query.bind(dbClient) : query;
  if (clientId) {
    // Update
    const result = await execQuery(
      `UPDATE mclients.mclients_clients 
       SET name = $1, email = $2, phone = $3, company = $4, address = $5, 
           notes = $6, status = $7, lead_source = $8, lead_source_details = $9,
           updated_at = NOW()
       WHERE id = $10 AND user_id = $11
       RETURNING id`,
      [clientData.name, clientData.email, clientData.phone, clientData.company, clientData.address,
       clientData.notes, clientData.status || 'active', clientData.leadSource, clientData.leadSourceDetails,
       clientId, userId]
    );
    return result.rows[0]?.id || clientId;
  } else {
    // Insert - verificar se já existe cliente com mesmo email para evitar duplicatas
    if (clientData.email) {
      const existing = await execQuery(
        'SELECT id FROM mclients.mclients_clients WHERE user_id = $1 AND email = $2',
        [userId, clientData.email]
      );
      if (existing.rows.length > 0) {
        // Cliente já existe, fazer UPDATE ao invés de INSERT
        const existingId = existing.rows[0].id;
        const result = await execQuery(
          `UPDATE mclients.mclients_clients 
           SET name = $1, phone = $2, company = $3, address = $4, 
               notes = $5, status = $6, lead_source = $7, lead_source_details = $8,
               updated_at = NOW()
           WHERE id = $9 AND user_id = $10
           RETURNING id`,
          [clientData.name, clientData.phone, clientData.company, clientData.address,
           clientData.notes, clientData.status || 'active', clientData.leadSource, clientData.leadSourceDetails,
           existingId, userId]
        );
        return result.rows[0]?.id || existingId;
      }
    }
    
    // Insert novo cliente
    const result = await execQuery(
      `INSERT INTO mclients.mclients_clients 
       (user_id, name, email, phone, company, address, notes, status, lead_source, lead_source_details)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING id`,
      [userId, clientData.name, clientData.email, clientData.phone, clientData.company, clientData.address,
       clientData.notes, clientData.status || 'active', clientData.leadSource, clientData.leadSourceDetails]
    );
    return result.rows[0].id;
  }
};

const cleanDate = (value) => {
  if (!value || value === '') return null;
  return value;
};

const saveDemand = async (demand, userId, demandId = null, dbClient = null) => {
  const execQuery = dbClient ? dbClient.query.bind(dbClient) : query;
  if (demandId) {
    await execQuery(
      `UPDATE mclients.mclients_demands 
       SET client_id = $1, title = $2, description = $3, status = $4, 
           priority = $5, due_date = $6, updated_at = NOW()
       WHERE id = $7 AND user_id = $8
       RETURNING id`,
      [demand.clientId, demand.title, demand.description, demand.status,
       demand.priority, demand.dueDate, demandId, userId]
    );
    return demandId;
  } else {
    const result = await execQuery(
      `INSERT INTO mclients.mclients_demands (user_id, client_id, title, description, status, priority, due_date)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id`,
      [userId, demand.clientId, demand.title, demand.description,
       demand.status || 'pending', demand.priority || 'medium', cleanDate(demand.dueDate)]
    );
    return result.rows[0].id;
  }
};

const savePayment = async (payment, userId, paymentId = null, dbClient = null) => {
  const execQuery = dbClient ? dbClient.query.bind(dbClient) : query;
  if (paymentId) {
    await execQuery(
      `UPDATE mclients.mclients_payments 
       SET client_id = $1, demand_id = $2, amount = $3, due_date = $4, paid_date = $5,
           status = $6, description = $7, payment_method = $8, sender_name = $9,
           receiver_name = $10, sender_bank = $11, receiver_bank = $12, 
           payment_time = $13, updated_at = NOW()
       WHERE id = $14 AND user_id = $15
       RETURNING id`,
      [payment.clientId, payment.demandId, payment.amount, payment.dueDate,
       payment.paidDate, payment.status, payment.description, payment.paymentMethod,
       payment.senderName, payment.receiverName, payment.senderBank, payment.receiverBank,
       payment.paymentTime, paymentId, userId]
    );
    return paymentId;
  } else {
    const result = await execQuery(
      `INSERT INTO mclients.mclients_payments 
       (user_id, client_id, demand_id, amount, due_date, paid_date, status, description, 
        payment_method, sender_name, receiver_name, sender_bank, receiver_bank, payment_time)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
       RETURNING id`,
      [userId, payment.clientId, payment.demandId, payment.amount, payment.dueDate,
       payment.paidDate, payment.status || 'pending', payment.description,
       payment.paymentMethod || 'pix', payment.senderName, payment.receiverName,
       payment.senderBank, payment.receiverBank, payment.paymentTime]
    );
    return result.rows[0].id;
  }
};

const saveDocument = async (doc, userId, docId = null, dbClient = null) => {
  const execQuery = dbClient ? dbClient.query.bind(dbClient) : query;
  if (docId) {
    await execQuery(
      `UPDATE mclients.mclients_documents 
       SET client_id = $1, demand_id = $2, name = $3, type = $4, size = $5,
           category = $6, content = $7, updated_at = NOW()
       WHERE id = $8 AND user_id = $9
       RETURNING id`,
      [doc.clientId, doc.demandId, doc.name, doc.type, doc.size,
       doc.category, doc.content, docId, userId]
    );
    return docId;
  } else {
    const result = await execQuery(
      `INSERT INTO mclients.mclients_documents (user_id, client_id, demand_id, name, type, size, category, content)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING id`,
      [userId, doc.clientId, doc.demandId, doc.name, doc.type, doc.size, doc.category, doc.content]
    );
    return result.rows[0].id;
  }
};

const saveService = async (service, userId, serviceId = null, dbClient = null) => {
  const execQuery = dbClient ? dbClient.query.bind(dbClient) : query;
  if (serviceId) {
    await execQuery(
      `UPDATE mclients.mclients_services 
       SET name = $1, description = $2, price = $3, category = $4, duration = $5, 
           active = $6, updated_at = NOW()
       WHERE id = $7 AND user_id = $8
       RETURNING id`,
      [service.name, service.description, service.price, service.category,
       service.duration, service.active !== false, serviceId, userId]
    );
    return serviceId;
  } else {
    const result = await execQuery(
      `INSERT INTO mclients.mclients_services (user_id, name, description, price, category, duration, active)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id`,
      [userId, service.name, service.description, service.price, service.category,
       service.duration, service.active !== false]
    );
    return result.rows[0].id;
  }
};

const saveTask = async (task, userId, taskId = null, dbClient = null) => {
  const execQuery = dbClient ? dbClient.query.bind(dbClient) : query;
  if (taskId) {
    await execQuery(
      `UPDATE mclients.mclients_tasks 
       SET demand_id = $1, title = $2, completed = $3, due_date = $4, priority = $5, updated_at = NOW()
       WHERE id = $6 AND user_id = $7
       RETURNING id`,
      [task.demandId, task.title, task.completed || false, task.dueDate,
       task.priority || 'medium', taskId, userId]
    );
    return taskId;
  } else {
    const result = await execQuery(
      `INSERT INTO mclients.mclients_tasks (user_id, demand_id, title, completed, due_date, priority)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id`,
      [userId, task.demandId, task.title, task.completed || false, task.dueDate, task.priority || 'medium']
    );
    return result.rows[0].id;
  }
};

const saveTimeEntry = async (entry, userId, entryId = null, dbClient = null) => {
  const execQuery = dbClient ? dbClient.query.bind(dbClient) : query;
  if (entryId) {
    await execQuery(
      `UPDATE mclients.mclients_time_entries 
       SET demand_id = $1, description = $2, hours = $3, date = $4, status = $5, updated_at = NOW()
       WHERE id = $6 AND user_id = $7
       RETURNING id`,
      [entry.demandId, entry.description, entry.hours, entry.date,
       entry.status || 'completed', entryId, userId]
    );
    return entryId;
  } else {
    const result = await execQuery(
      `INSERT INTO mclients.mclients_time_entries (user_id, demand_id, description, hours, date, status)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id`,
      [userId, entry.demandId, entry.description, entry.hours || 0, entry.date, entry.status || 'completed']
    );
    return result.rows[0].id;
  }
};

const saveActivity = async (activity, userId, dbClient = null) => {
  const execQuery = dbClient ? dbClient.query.bind(dbClient) : query;
  await execQuery(
    `INSERT INTO mclients.mclients_activities (user_id, type, demand_id, client_id, description)
     VALUES ($1, $2, $3, $4, $5)`,
    [userId, activity.type, activity.demandId, activity.clientId, activity.description]
  );
};

// ============================================
// Endpoints
// ============================================

// Obter todos os dados do MClients para um usuário
export const getMClientsData = async (req, res) => {
  try {
    const userId = req.user.id;
    const userInfo = await query('SELECT name, email FROM marcbuddy.accounts WHERE id = $1', [userId]).then(r => r.rows[0] || {});

    const [
      clients,
      demands,
      payments,
      documents,
      services,
      tasks,
      timeEntries,
      activities
    ] = await Promise.all([
      loadClients(userId),
      loadDemands(userId),
      loadPayments(userId),
      loadDocuments(userId),
      loadServices(userId),
      loadTasks(userId),
      loadTimeEntries(userId),
      loadActivities(userId)
    ]);

    res.json({
      clients,
      demands,
      payments,
      documents,
      services,
      tasks,
      timeEntries,
      activities,
      lastUpdated: new Date().toISOString()
    });
    logAction('get', {
      userId,
      userName: userInfo.name,
      userEmail: userInfo.email,
      info: {
        clients: clients.length,
        demands: demands.length,
        payments: payments.length,
        docs: documents.length
      }
    });
  } catch (error) {
    console.error('Erro ao obter dados do MClients:', error);
    res.status(500).json({ error: 'Erro ao obter dados do MClients' });
  }
};

// Salvar todos os dados do MClients para um usuário
export const saveMClientsData = async (req, res) => {
  const client = await getClient();
  try {
    await client.query('BEGIN');
    const userId = req.user.id;
    const userInfo = await query('SELECT name, email FROM marcbuddy.accounts WHERE id = $1', [userId]).then(r => r.rows[0] || {});
    const data = req.body || {};

    // Helpers
    const uniqueBy = (arr, keyFn) => {
      const seen = new Set();
      return arr.filter((item) => {
        const key = keyFn(item);
        if (!key) return false;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });
    };

    // Normalizar arrays para evitar undefined
    data.clients = Array.isArray(data.clients) ? data.clients : [];
    data.demands = Array.isArray(data.demands) ? data.demands : [];
    data.payments = Array.isArray(data.payments) ? data.payments : [];
    data.documents = Array.isArray(data.documents) ? data.documents : [];
    data.services = Array.isArray(data.services) ? data.services : [];
    data.tasks = Array.isArray(data.tasks) ? data.tasks : [];
    data.timeEntries = Array.isArray(data.timeEntries) ? data.timeEntries : [];
    data.activities = Array.isArray(data.activities) ? data.activities : [];

    const totalCount =
      data.clients.length +
      data.demands.length +
      data.payments.length +
      data.documents.length +
      data.services.length +
      data.tasks.length +
      data.timeEntries.length +
      data.activities.length;

    // Limpar dados atuais do usuário para regravar tudo (evita conflitos de ID)
    await client.query('DELETE FROM mclients.mclients_activities WHERE user_id = $1', [userId]);
    await client.query('DELETE FROM mclients.mclients_time_entries WHERE user_id = $1', [userId]);
    await client.query('DELETE FROM mclients.mclients_tasks WHERE user_id = $1', [userId]);
    await client.query('DELETE FROM mclients.mclients_documents WHERE user_id = $1', [userId]);
    await client.query('DELETE FROM mclients.mclients_payments WHERE user_id = $1', [userId]);
    await client.query('DELETE FROM mclients.mclients_demands WHERE user_id = $1', [userId]);
    await client.query('DELETE FROM mclients.mclients_services WHERE user_id = $1', [userId]);
    await client.query('DELETE FROM mclients.mclients_clients WHERE user_id = $1', [userId]);

    // Se o payload está vazio, apenas limpar e concluir
    if (totalCount === 0) {
      await client.query('COMMIT');
      res.json({ message: 'Dados limpos com sucesso', lastUpdated: new Date().toISOString() });
      logAction('save', {
        userId,
        userName: userInfo.name,
        userEmail: userInfo.email,
        info: { cleared: true },
        samples: {}
      });
      return;
    }

    // Mapear IDs antigos para novos
    const idMappings = {
      clients: {},
      demands: {},
      payments: {},
      documents: {},
      services: {},
      tasks: {},
      timeEntries: {}
    };

    // Salvar Clients
    if (data.clients) {
      for (const clientData of data.clients) {
        const oldId = clientData.id;
        // Forçar insert (ids serão novos) passando null
        const newId = await saveClients(clientData, userId, null, client);
        if (oldId && oldId !== newId) {
          idMappings.clients[oldId] = newId;
        }
      }
    }

    // Salvar Demands (pular se clientId inválido para evitar FK)
    if (data.demands) {
      for (const demand of data.demands) {
        let resolvedClientId = null;

        if (demand.clientId) {
          const clientKey = demand.clientId.toString();

          // Tentar pelo idMappings (cliente salvo nesta transação)
          if (idMappings.clients[clientKey]) {
            resolvedClientId = idMappings.clients[clientKey];
          } else {
            // Verificar no banco se o clientId existe para este user
            const isNumeric = /^\d+$/.test(clientKey);
            if (isNumeric) {
              const clientResult = await client.query(
                'SELECT id FROM mclients.mclients_clients WHERE id = $1 AND user_id = $2',
                [parseInt(clientKey, 10), userId]
              );
              if (clientResult.rows.length > 0) {
                resolvedClientId = clientResult.rows[0].id;
              }
            }
          }
        }

        // Se não houver clientId válido, pular a demanda para evitar FK
        if (!resolvedClientId) {
          console.warn('[MCLIENTS][save] ⚠️ Pulando demanda por clientId inválido ou ausente:', demand.clientId);
          continue;
        }

        demand.clientId = resolvedClientId;

        const oldId = demand.id;
        const newId = await saveDemand(demand, userId, null, client);
        if (oldId && oldId !== newId) {
          idMappings.demands[oldId] = newId;
        }
      }
    }

    // Salvar Payments
    if (data.payments) {
      for (const payment of data.payments) {
        if (payment.clientId && idMappings.clients[payment.clientId]) {
          payment.clientId = idMappings.clients[payment.clientId];
        }
        if (payment.demandId && idMappings.demands[payment.demandId]) {
          payment.demandId = idMappings.demands[payment.demandId];
        }
        const oldId = payment.id;
        const newId = await savePayment(payment, userId, null, client);
        if (oldId && oldId !== newId) {
          idMappings.payments[oldId] = newId;
        }
      }
    }

    // Salvar Documents
    if (data.documents) {
      for (const doc of data.documents) {
        if (doc.clientId && idMappings.clients[doc.clientId]) {
          doc.clientId = idMappings.clients[doc.clientId];
        }
        if (doc.demandId && idMappings.demands[doc.demandId]) {
          doc.demandId = idMappings.demands[doc.demandId];
        }
        const oldId = doc.id;
        const newId = await saveDocument(doc, userId, null, client);
        if (oldId && oldId !== newId) {
          idMappings.documents[oldId] = newId;
        }
      }
    }

    // Salvar Services
    if (data.services) {
      for (const service of data.services) {
        const oldId = service.id;
        const newId = await saveService(service, userId, null, client);
        if (oldId && oldId !== newId) {
          idMappings.services[oldId] = newId;
        }
      }
    }

    // Salvar Tasks
    if (data.tasks) {
      for (const task of data.tasks) {
        if (task.demandId && idMappings.demands[task.demandId]) {
          task.demandId = idMappings.demands[task.demandId];
        }
        const oldId = task.id;
        const newId = await saveTask(task, userId, null, client);
        if (oldId && oldId !== newId) {
          idMappings.tasks[oldId] = newId;
        }
      }
    }

    // Salvar Time Entries
    if (data.timeEntries) {
      for (const entry of data.timeEntries) {
        if (entry.demandId && idMappings.demands[entry.demandId]) {
          entry.demandId = idMappings.demands[entry.demandId];
        }
        const oldId = entry.id;
        const newId = await saveTimeEntry(entry, userId, null, client);
        if (oldId && oldId !== newId) {
          idMappings.timeEntries[oldId] = newId;
        }
      }
    }

    // Salvar Activities
    if (data.activities) {
      for (const activity of data.activities) {
        if (activity.demandId && idMappings.demands[activity.demandId]) {
          activity.demandId = idMappings.demands[activity.demandId];
        }
        if (activity.clientId && idMappings.clients[activity.clientId]) {
          activity.clientId = idMappings.clients[activity.clientId];
        }
        await saveActivity(activity, userId, client);
      }
    }

    await client.query('COMMIT');
    
    res.json({ message: 'Dados salvos com sucesso', lastUpdated: new Date().toISOString() });
    logAction('save', {
      userId,
      userName: userInfo.name,
      userEmail: userInfo.email,
      info: {
        clients: data.clients?.length || 0,
        demands: data.demands?.length || 0,
        payments: data.payments?.length || 0,
        docs: data.documents?.length || 0
      }
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('[MCLIENTS][save] ❌ Erro ao salvar dados do MClients:', error);
    console.error('[MCLIENTS][save] Stack:', error.stack);
    res.status(500).json({ error: 'Erro ao salvar dados do MClients', details: error.message });
  } finally {
    client.release();
  }
};

// Deletar cliente
export const deleteClient = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Tentar converter para número (se for UUID, vai dar NaN, mas não importa)
    const numericId = parseInt(id);
    const isNumeric = !isNaN(numericId);

    // Verificar se o cliente pertence ao usuário
    // Se for numérico, buscar por ID; se não, pode ser UUID (mas clientes não têm UUID, então sempre será numérico)
    const checkResult = await query(
      'SELECT id FROM mclients.mclients_clients WHERE id = $1 AND user_id = $2',
      [isNumeric ? numericId : id, userId]
    );

    if (checkResult.rows.length === 0) {
      return res.status(404).json({ error: 'Cliente não encontrado' });
    }

    const clientId = checkResult.rows[0].id;

    // Deletar cliente (CASCADE vai deletar demandas, pagamentos, etc.)
    const deleteResult = await query(
      'DELETE FROM mclients.mclients_clients WHERE id = $1 AND user_id = $2',
      [clientId, userId]
    );

    if (deleteResult.rowCount === 0) {
      return res.status(404).json({ error: 'Cliente não encontrado' });
    }

    // Buscar informações do usuário para log
    const userResult = await query('SELECT name, email FROM marcbuddy.accounts WHERE id = $1', [userId]);
    const userName = userResult.rows[0]?.name || null;
    const userEmail = userResult.rows[0]?.email || null;

    res.status(204).send();
    logAction('deleteClient', { 
      userId, 
      userName, 
      userEmail, 
      info: { clientId: clientId, rowsDeleted: deleteResult.rowCount } 
    });
  } catch (error) {
    console.error('Erro ao deletar cliente:', error);
    res.status(500).json({ error: 'Erro ao deletar cliente', details: error.message });
  }
};

