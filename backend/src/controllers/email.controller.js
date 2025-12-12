import { query } from '../database/connection.js';
import { validationResult } from 'express-validator';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import nodemailer from 'nodemailer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const templatesDir = path.join(__dirname, '../../templates/emails');

// Configuração do transporte SMTP para testes
const transporter = nodemailer.createTransport({
  host: 'smtp.hostinger.com',
  port: 465,
  secure: true,
  auth: {
    user: 'naoresponda@marcbuddy.com.br',
    pass: 'k2J$$:;@+wEk'
  },
  tls: {
    rejectUnauthorized: false
  }
});

/**
 * Lê o conteúdo HTML de um template
 */
const readTemplateFile = (templateType) => {
  try {
    const filePath = path.join(templatesDir, `${templateType}.html`);
    if (fs.existsSync(filePath)) {
      return fs.readFileSync(filePath, 'utf8');
    }
    return null;
  } catch (error) {
    console.error(`Erro ao ler template ${templateType}:`, error.message);
    return null;
  }
};

/**
 * Lista todos os templates disponíveis no sistema de arquivos
 */
const getAvailableTemplates = () => {
  try {
    const files = fs.readdirSync(templatesDir);
    return files
      .filter(file => file.endsWith('.html'))
      .map(file => file.replace('.html', ''));
  } catch (error) {
    console.error('Erro ao listar templates:', error);
    return [];
  }
};

/**
 * Listar todos os templates de email
 */
export const getEmailTemplates = async (req, res) => {
  try {
    const { user } = req;
    const { type, active } = req.query;

    // Verificar se usuário é admin
    if (!user || user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Acesso negado. Apenas administradores podem acessar templates de email.'
      });
    }

    let sql = `
      SELECT
        id,
        name,
        type,
        subject,
        variables,
        is_active,
        created_at,
        updated_at,
        created_by
      FROM email_templates
      WHERE 1=1
    `;
    const params = [];
    let paramIndex = 1;

    // Filtros opcionais
    if (type) {
      sql += ` AND type = $${paramIndex}`;
      params.push(type);
      paramIndex++;
    }

    if (active !== undefined) {
      sql += ` AND is_active = $${paramIndex}`;
      params.push(active === 'true');
      paramIndex++;
    }

    sql += ' ORDER BY updated_at DESC';

    const result = await query(sql, params);

    // Adicionar conteúdo HTML dos arquivos para cada template
    const templatesWithContent = result.rows.map(template => ({
      ...template,
      html_content: readTemplateFile(template.type) || template.html_content
    }));

    res.json({
      success: true,
      data: templatesWithContent,
      message: `${templatesWithContent.length} templates encontrados`
    });

  } catch (error) {
    console.error('Erro ao buscar templates de email:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Buscar template específico por ID
 */
export const getEmailTemplate = async (req, res) => {
  try {
    const { user } = req;
    const { id } = req.params;

    // Verificar se usuário é admin
    if (!user || user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Acesso negado. Apenas administradores podem acessar templates de email.'
      });
    }

    const result = await query(`
      SELECT
        id,
        name,
        type,
        subject,
        html_content,
        variables,
        is_active,
        created_at,
        updated_at,
        created_by
      FROM email_templates
      WHERE id = $1
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Template não encontrado'
      });
    }

    const template = result.rows[0];
    const htmlContent = readTemplateFile(template.type);

    res.json({
      success: true,
      data: {
        ...template,
        html_content: htmlContent || template.html_content
      }
    });

  } catch (error) {
    console.error('Erro ao buscar template de email:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Criar novo template de email
 */
export const createEmailTemplate = async (req, res) => {
  try {
    const { user } = req;
    const { name, type, subject, variables } = req.body;

    // Verificar se usuário é admin
    if (!user || user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Acesso negado. Apenas administradores podem criar templates de email.'
      });
    }

    // Validações
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Dados inválidos',
        errors: errors.array()
      });
    }

    // Verificar se o arquivo de template existe
    const templateFile = readTemplateFile(type);
    if (!templateFile) {
      return res.status(400).json({
        success: false,
        message: `Template ${type}.html não encontrado na pasta templates/emails`
      });
    }

    // Verificar se template com mesmo nome já existe
    const existingTemplate = await query(
      'SELECT id FROM email_templates WHERE name = $1',
      [name]
    );

    if (existingTemplate.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Já existe um template com este nome'
      });
    }

    // Inserir template (sem html_content, pois vem do arquivo)
    const result = await query(`
      INSERT INTO email_templates (
        name,
        type,
        subject,
        variables,
        created_by
      ) VALUES ($1, $2, $3, $4, $5)
      RETURNING id, name, type, subject, variables, is_active, created_at, updated_at
    `, [
      name,
      type,
      subject,
      JSON.stringify(variables || []),
      user.id
    ]);

    res.status(201).json({
      success: true,
      data: {
        ...result.rows[0],
        html_content: templateFile
      },
      message: 'Template criado com sucesso'
    });

  } catch (error) {
    console.error('Erro ao criar template de email:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Atualizar template de email
 */
export const updateEmailTemplate = async (req, res) => {
  try {
    const { user } = req;
    const { id } = req.params;
    const { name, type, subject, variables, is_active } = req.body;

    // Verificar se usuário é admin
    if (!user || user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Acesso negado. Apenas administradores podem editar templates de email.'
      });
    }

    // Validações
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Dados inválidos',
        errors: errors.array()
      });
    }

    // Verificar se template existe
    const existingTemplate = await query(
      'SELECT id, type FROM email_templates WHERE id = $1',
      [id]
    );

    if (existingTemplate.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Template não encontrado'
      });
    }

    // Se o type foi alterado, verificar se o arquivo existe
    if (type !== undefined && type !== existingTemplate.rows[0].type) {
      const templateFile = readTemplateFile(type);
      if (!templateFile) {
        return res.status(400).json({
          success: false,
          message: `Template ${type}.html não encontrado na pasta templates/emails`
        });
      }
    }

    // Verificar se nome já existe (exceto para o próprio template)
    if (name) {
      const nameCheck = await query(
        'SELECT id FROM email_templates WHERE name = $1 AND id != $2',
        [name, id]
      );

      if (nameCheck.rows.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'Já existe um template com este nome'
        });
      }
    }

    // Atualizar template
    const updateFields = [];
    const updateValues = [];
    let paramIndex = 1;

    if (name !== undefined) {
      updateFields.push(`name = $${paramIndex}`);
      updateValues.push(name);
      paramIndex++;
    }

    if (type !== undefined) {
      updateFields.push(`type = $${paramIndex}`);
      updateValues.push(type);
      paramIndex++;
    }

    if (subject !== undefined) {
      updateFields.push(`subject = $${paramIndex}`);
      updateValues.push(subject);
      paramIndex++;
    }

    if (variables !== undefined) {
      updateFields.push(`variables = $${paramIndex}`);
      updateValues.push(JSON.stringify(variables));
      paramIndex++;
    }

    if (is_active !== undefined) {
      updateFields.push(`is_active = $${paramIndex}`);
      updateValues.push(is_active);
      paramIndex++;
    }

    if (updateFields.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Nenhum campo para atualizar'
      });
    }

    updateValues.push(id); // ID sempre no final

    const result = await query(`
      UPDATE email_templates
      SET ${updateFields.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING id, name, type, subject, variables, is_active, updated_at
    `, updateValues);

    // Adicionar conteúdo HTML do arquivo
    const template = result.rows[0];
    const htmlContent = readTemplateFile(template.type);

    res.json({
      success: true,
      data: {
        ...template,
        html_content: htmlContent
      },
      message: 'Template atualizado com sucesso'
    });

  } catch (error) {
    console.error('Erro ao atualizar template de email:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Excluir template de email
 */
export const deleteEmailTemplate = async (req, res) => {
  try {
    const { user } = req;
    const { id } = req.params;

    // Verificar se usuário é admin
    if (!user || user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Acesso negado. Apenas administradores podem excluir templates de email.'
      });
    }

    // Verificar se template existe
    const existingTemplate = await query(
      'SELECT id, name FROM email_templates WHERE id = $1',
      [id]
    );

    if (existingTemplate.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Template não encontrado'
      });
    }

    // Excluir template
    await query('DELETE FROM email_templates WHERE id = $1', [id]);

    res.json({
      success: true,
      message: `Template "${existingTemplate.rows[0].name}" excluído com sucesso`
    });

  } catch (error) {
    console.error('Erro ao excluir template de email:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Duplicar template de email
 */
export const duplicateEmailTemplate = async (req, res) => {
  try {
    const { user } = req;
    const { id } = req.params;

    // Verificar se usuário é admin
    if (!user || user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Acesso negado. Apenas administradores podem duplicar templates de email.'
      });
    }

    // Buscar template original
    const originalTemplate = await query(`
      SELECT name, type, subject, variables
      FROM email_templates
      WHERE id = $1
    `, [id]);

    if (originalTemplate.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Template não encontrado'
      });
    }

    const template = originalTemplate.rows[0];

    // Criar nome único para cópia
    let newName = `${template.name} (Cópia)`;
    let counter = 1;

    while (true) {
      const nameCheck = await query(
        'SELECT id FROM email_templates WHERE name = $1',
        [newName]
      );

      if (nameCheck.rows.length === 0) break;

      counter++;
      newName = `${template.name} (Cópia ${counter})`;
    }

    // Criar cópia (sem html_content, pois vem do arquivo)
    const result = await query(`
      INSERT INTO email_templates (
        name,
        type,
        subject,
        variables,
        created_by
      ) VALUES ($1, $2, $3, $4, $5)
      RETURNING id, name, type, subject, variables, is_active, created_at, updated_at
    `, [
      newName,
      template.type,
      template.subject,
      template.variables,
      user.id
    ]);

    // Adicionar conteúdo HTML do arquivo
    const duplicatedTemplate = result.rows[0];
    const htmlContent = readTemplateFile(duplicatedTemplate.type);

    res.status(201).json({
      success: true,
      data: {
        ...duplicatedTemplate,
        html_content: htmlContent
      },
      message: 'Template duplicado com sucesso'
    });

  } catch (error) {
    console.error('Erro ao duplicar template de email:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Buscar template por tipo (para uso público)
 */
export const getEmailTemplateByType = async (req, res) => {
  try {
    const { type } = req.params;

    // Buscar template ativo pelo tipo
    const result = await query(`
      SELECT
        id,
        name,
        type,
        subject,
        html_content,
        variables
      FROM email_templates
      WHERE type = $1 AND is_active = true
      ORDER BY updated_at DESC
      LIMIT 1
    `, [type]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: `Nenhum template ativo encontrado para o tipo: ${type}`
      });
    }

    const template = result.rows[0];
    const htmlContent = readTemplateFile(type);

    res.json({
      success: true,
      data: {
        ...template,
        html_content: htmlContent || template.html_content
      }
    });

  } catch (error) {
    console.error('Erro ao buscar template por tipo:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Enviar email de teste usando template específico
 */
export const sendTestEmail = async (req, res) => {
  try {
    const { user } = req;
    const { templateId, testEmail } = req.body;

    // Verificar se usuário é admin
    if (!user || user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Acesso negado. Apenas administradores podem enviar emails de teste.'
      });
    }

    // Validações
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Dados inválidos',
        errors: errors.array()
      });
    }

    // Buscar template
    const templateResult = await query(
      'SELECT id, name, type, subject, variables FROM email_templates WHERE id = $1',
      [templateId]
    );

    if (templateResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Template não encontrado'
      });
    }

    const template = templateResult.rows[0];
    const htmlContent = readTemplateFile(template.type);

    if (!htmlContent) {
      return res.status(404).json({
        success: false,
        message: `Arquivo de template ${template.type}.html não encontrado`
      });
    }

    // Substituir variáveis de teste
    let processedHtml = htmlContent;
    let processedSubject = template.subject;

    // Valores de teste
    const testValues = {
      '{{user_name}}': 'José Márcio',
      '{{confirmation_url}}': 'https://marcbuddy.com.br/confirm?token=test123',
      '{{reset_url}}': 'https://marcbuddy.com.br/reset?token=test123',
      '{{dashboard_url}}': 'https://marcbuddy.com.br/dashboard',
      '{{support_url}}': 'https://marcbuddy.com.br/suporte',
      '{{privacy_url}}': 'https://marcbuddy.com.br/privacidade',
      '{{terms_url}}': 'https://marcbuddy.com.br/termos',
      '{{order_id}}': 'PED-2025-001',
      '{{order_total}}': 'R$ 299,90',
      '{{content}}': 'Conteúdo personalizado do email'
    };

    // Substituir no conteúdo HTML
    Object.keys(testValues).forEach(key => {
      processedHtml = processedHtml.replace(new RegExp(key, 'g'), testValues[key]);
    });

    // Substituir no assunto
    Object.keys(testValues).forEach(key => {
      processedSubject = processedSubject.replace(new RegExp(key, 'g'), testValues[key]);
    });

    // Configurar email
    const mailOptions = {
      from: {
        name: 'MarcBuddy',
        address: 'naoresponda@marcbuddy.com.br'
      },
      to: testEmail,
      subject: processedSubject,
      html: processedHtml
    };

    // Enviar email
    const info = await transporter.sendMail(mailOptions);

    console.log('✅ Email de teste enviado:', info.messageId);

    res.json({
      success: true,
      message: `Email de teste enviado com sucesso para ${testEmail}`,
      data: {
        messageId: info.messageId,
        template: template.name,
        recipient: testEmail
      }
    });

  } catch (error) {
    console.error('Erro ao enviar email de teste:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao enviar email de teste',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Endpoint de teste para verificar leitura de arquivos
 */
export const testTemplateFiles = async (req, res) => {
  try {
    const availableTemplates = getAvailableTemplates();
    const testResults = {};

    for (const templateType of availableTemplates) {
      if (templateType !== 'README.md') {
        const content = readTemplateFile(templateType.replace('.html', ''));
        testResults[templateType] = {
          exists: content !== null,
          length: content ? content.length : 0,
          preview: content ? content.substring(0, 100) + '...' : null
        };
      }
    }

    res.json({
      success: true,
      data: {
        templatesDir,
        availableTemplates,
        testResults,
        __dirname
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro no teste',
      error: error.message
    });
  }
};