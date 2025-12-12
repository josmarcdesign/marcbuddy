import { query } from '../database/connection.js';
import path from 'path';
import fs from 'fs';

/**
 * Controller para upload de foto de perfil
 */
export const uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Nenhuma imagem enviada'
      });
    }

    const userId = req.user.id;
    const filename = req.file.filename;
    const avatarUrl = `/uploads/avatars/${filename}`;

    // Buscar avatar antigo do usuário para deletar
    const userResult = await query(
      'SELECT avatar_url FROM marcbuddy.accounts WHERE id = $1',
      [userId]
    );

    const oldAvatarUrl = userResult.rows[0]?.avatar_url;

    // Atualizar avatar_url no banco de dados
    await query(
      'UPDATE marcbuddy.accounts SET avatar_url = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
      [avatarUrl, userId]
    );

    // Deletar avatar antigo se existir
    if (oldAvatarUrl && oldAvatarUrl.startsWith('/uploads/avatars/')) {
      const oldAvatarPath = path.join(process.cwd(), oldAvatarUrl);
      if (fs.existsSync(oldAvatarPath)) {
        fs.unlinkSync(oldAvatarPath);
      }
    }

    res.json({
      success: true,
      message: 'Foto de perfil atualizada com sucesso',
      data: {
        avatar_url: avatarUrl
      }
    });
  } catch (error) {
    console.error('Erro ao fazer upload do avatar:', error);
    
    // Deletar arquivo se houver erro
    if (req.file) {
      const filePath = path.join(process.cwd(), 'uploads', 'avatars', req.file.filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    res.status(500).json({
      success: false,
      message: 'Erro ao fazer upload da foto de perfil'
    });
  }
};

/**
 * Controller para remover foto de perfil
 */
export const removeAvatar = async (req, res) => {
  try {
    const userId = req.user.id;

    // Buscar avatar atual do usuário
    const userResult = await query(
      'SELECT avatar_url FROM marcbuddy.accounts WHERE id = $1',
      [userId]
    );

    const avatarUrl = userResult.rows[0]?.avatar_url;

    // Remover avatar_url do banco de dados
    await query(
      'UPDATE marcbuddy.accounts SET avatar_url = NULL, updated_at = CURRENT_TIMESTAMP WHERE id = $1',
      [userId]
    );

    // Deletar arquivo se existir
    if (avatarUrl && avatarUrl.startsWith('/uploads/avatars/')) {
      const avatarPath = path.join(process.cwd(), avatarUrl);
      if (fs.existsSync(avatarPath)) {
        fs.unlinkSync(avatarPath);
      }
    }

    res.json({
      success: true,
      message: 'Foto de perfil removida com sucesso'
    });
  } catch (error) {
    console.error('Erro ao remover avatar:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao remover foto de perfil'
    });
  }
};

/**
 * Controller para atualizar perfil (nome e email)
 */
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, email } = req.body;

    // Verificar se email já está em uso por outro usuário
    if (email) {
      const emailCheck = await query(
        'SELECT id FROM marcbuddy.accounts WHERE email = $1 AND id != $2',
        [email, userId]
      );

      if (emailCheck.rows.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'Email já está em uso por outro usuário'
        });
      }
    }

    // Atualizar perfil
    const updateFields = [];
    const values = [];
    let paramCount = 1;

    if (name) {
      updateFields.push(`name = $${paramCount++}`);
      values.push(name);
    }

    if (email) {
      updateFields.push(`email = $${paramCount++}`);
      values.push(email);
    }

    if (updateFields.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Nenhum campo para atualizar'
      });
    }

    updateFields.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(userId);

    await query(
      `UPDATE marcbuddy.accounts SET ${updateFields.join(', ')} WHERE id = $${paramCount}`,
      values
    );

    // Buscar usuário atualizado
    const userResult = await query(
      'SELECT id, name, email, role, avatar_url, created_at FROM marcbuddy.accounts WHERE id = $1',
      [userId]
    );

    res.json({
      success: true,
      message: 'Perfil atualizado com sucesso',
      data: {
        user: userResult.rows[0]
      }
    });
  } catch (error) {
    console.error('Erro ao atualizar perfil:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao atualizar perfil'
    });
  }
};

