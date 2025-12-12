import { query } from '../database/connection.js';

/**
 * Validar e aplicar cupom de desconto
 */
export const validateCoupon = async (req, res) => {
  try {
    const { code, planId, amount } = req.body;
    const userId = req.user ? req.user.id : null; // Pode ser null se não autenticado

    if (!code || !planId || !amount) {
      return res.status(400).json({
        success: false,
        message: 'Código do cupom, ID do plano e valor são obrigatórios'
      });
    }

    // Buscar cupom
    const couponResult = await query(
      'SELECT * FROM marcbuddy.discount_coupons WHERE coupon_code = $1 AND coupon_active = true',
      [code.toUpperCase()]
    );

    if (couponResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Cupom não encontrado ou inativo'
      });
    }

    const coupon = couponResult.rows[0];

    // Verificar validade
    const now = new Date();
    if (coupon.valid_from && new Date(coupon.valid_from) > now) {
      return res.status(400).json({
        success: false,
        message: 'Cupom ainda não está válido'
      });
    }

    if (coupon.valid_until && new Date(coupon.valid_until) < now) {
      return res.status(400).json({
        success: false,
        message: 'Cupom expirado'
      });
    }

    // Verificar limite de uso
    if (coupon.usage_limit) {
      if (coupon.usage_count >= coupon.usage_limit) {
        return res.status(400).json({
          success: false,
          message: 'Cupom atingiu o limite de uso'
        });
      }
    }

    // Verificar se aplica ao plano
    if (!coupon.applicable_to_all_plans) {
      if (!coupon.applicable_plans || !coupon.applicable_plans.includes(planId)) {
        return res.status(400).json({
          success: false,
          message: 'Cupom não é válido para este plano'
        });
      }
    }

    // Verificar valor mínimo de compra
    if (coupon.min_purchase_value && parseFloat(amount) < parseFloat(coupon.min_purchase_value)) {
      return res.status(400).json({
        success: false,
        message: `Valor mínimo de compra: R$ ${parseFloat(coupon.min_purchase_value).toFixed(2)}`
      });
    }

    // Verificar limite de uso por usuário (se autenticado)
    if (userId) {
      const userUsage = await query(
        'SELECT COUNT(*) as count FROM marcbuddy.discount_coupon_usage WHERE coupon_id = $1 AND account_id = $2',
        [coupon.id, userId]
      );

      const usageCount = parseInt(userUsage.rows[0].count);
      if (usageCount >= (coupon.usage_limit_per_user || 1)) {
        return res.status(400).json({
          success: false,
          message: 'Você já utilizou este cupom o máximo de vezes permitido'
        });
      }
    }

    // Calcular desconto
    let discountAmount = 0;
    if (coupon.discount_type === 'percentage') {
      discountAmount = (parseFloat(amount) * parseFloat(coupon.discount_value)) / 100;
      
      // Aplicar limite máximo de desconto se existir
      if (coupon.max_discount_value && discountAmount > parseFloat(coupon.max_discount_value)) {
        discountAmount = parseFloat(coupon.max_discount_value);
      }
    } else {
      discountAmount = parseFloat(coupon.discount_value);
    }

    const finalAmount = Math.max(0, parseFloat(amount) - discountAmount);

    res.json({
      success: true,
      data: {
        coupon: {
          id: coupon.id,
          code: coupon.coupon_code,
          discount_type: coupon.discount_type,
          discount_value: parseFloat(coupon.discount_value),
          discount_amount: discountAmount,
          original_amount: parseFloat(amount),
          final_amount: finalAmount
        }
      }
    });
  } catch (error) {
    console.error('Erro ao validar cupom:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao validar cupom'
    });
  }
};

