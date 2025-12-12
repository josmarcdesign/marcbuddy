/**
 * Calcula o preço do plano baseado no período de cobrança
 * @param {string} planId - ID do plano (free, basic, premium, enterprise)
 * @param {string} billingPeriod - 'monthly' ou 'annual'
 * @param {object} plan - Objeto do plano (opcional, se não fornecido busca do contexto)
 * @returns {object} Informações de preço
 */
export const getPlanPrice = (planId, billingPeriod = 'monthly', plan = null) => {
  if (!plan) {
    // Fallback se o plano não for fornecido
    return { price: 0, period: 'mês', installments: null, monthlyPrice: 0 };
  }
  
  // Calcular preço para 2 anos
  if (billingPeriod === 'biennial') {
    if (plan.biennialDiscountPercentage && plan.price) {
      const biennialPriceWithoutDiscount = plan.price * 24;
      const discountAmount = (biennialPriceWithoutDiscount * plan.biennialDiscountPercentage) / 100;
      const biennialPriceWithDiscount = biennialPriceWithoutDiscount - discountAmount;
      const monthlyPriceWithDiscount = biennialPriceWithDiscount / 24;
      
      return {
        price: biennialPriceWithDiscount,
        monthlyPrice: monthlyPriceWithDiscount,
        period: '2 anos',
        installments: {
          total: biennialPriceWithDiscount,
          monthly: monthlyPriceWithDiscount,
          count: 24
        },
        originalPrice: biennialPriceWithoutDiscount,
        discountPercentage: plan.biennialDiscountPercentage
      };
    }
  }
  
  // Calcular preço para 3 anos
  if (billingPeriod === 'triennial') {
    if (plan.triennialDiscountPercentage && plan.price) {
      const triennialPriceWithoutDiscount = plan.price * 36;
      const discountAmount = (triennialPriceWithoutDiscount * plan.triennialDiscountPercentage) / 100;
      const triennialPriceWithDiscount = triennialPriceWithoutDiscount - discountAmount;
      const monthlyPriceWithDiscount = triennialPriceWithDiscount / 36;
      
      return {
        price: triennialPriceWithDiscount,
        monthlyPrice: monthlyPriceWithDiscount,
        period: '3 anos',
        installments: {
          total: triennialPriceWithDiscount,
          monthly: monthlyPriceWithDiscount,
          count: 36
        },
        originalPrice: triennialPriceWithoutDiscount,
        discountPercentage: plan.triennialDiscountPercentage
      };
    }
  }
  
  if (billingPeriod === 'annual') {
    // Se tem desconto anual, calcular o preço com desconto
    if (plan.annualDiscountPercentage && plan.price) {
      const annualPriceWithoutDiscount = plan.price * 12;
      const discountAmount = (annualPriceWithoutDiscount * plan.annualDiscountPercentage) / 100;
      const annualPriceWithDiscount = annualPriceWithoutDiscount - discountAmount;
      const monthlyPriceWithDiscount = annualPriceWithDiscount / 12;
      
      return {
        price: annualPriceWithDiscount,
        monthlyPrice: monthlyPriceWithDiscount,
        period: 'ano',
        installments: {
          total: annualPriceWithDiscount,
          monthly: monthlyPriceWithDiscount,
          count: 12
        },
        originalPrice: annualPriceWithoutDiscount,
        discountPercentage: plan.annualDiscountPercentage
      };
    }
    
    // Se tem priceAnnual definido, usar ele
    if (plan.priceAnnual) {
      return {
        price: plan.priceAnnual,
        monthlyPrice: plan.priceAnnualMonthly || (plan.priceAnnual / 12),
        period: 'ano',
        installments: {
          total: plan.priceAnnual,
          monthly: plan.priceAnnualMonthly || (plan.priceAnnual / 12),
          count: 12
        }
      };
    }
  }
  
  return {
    price: plan.price,
    period: 'mês',
    installments: null,
    monthlyPrice: plan.price
  };
};

/**
 * Formata preço para exibição (R$ X,XX)
 * @param {number} price - Preço a ser formatado
 * @returns {string} Preço formatado
 */
export const formatPrice = (price) => {
  if (price === null || price === undefined || isNaN(price)) {
    return '0,00';
  }
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;
  if (isNaN(numPrice)) {
    return '0,00';
  }
  return numPrice.toFixed(2).replace('.', ',');
};

