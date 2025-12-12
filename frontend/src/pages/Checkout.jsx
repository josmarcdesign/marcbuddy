import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { usePlans } from '../contexts/PlansContext';
import { getPlanPrice } from '../utils/planPricing';
import { PaymentIcon } from '../utils/paymentIcons';
import { CheckCircle2, ArrowLeft, Lock, Loader2 } from 'lucide-react';
import api from '../services/api';
import subscriptionService from '../services/subscription.service';
import logoMobile from '@assets/logos/Isotipo+tipografia.svg';
import logoWhite from '@assets/logos/Isotipo+tipografia-white.svg';

const Checkout = () => {
  const { planId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { getPlanById } = usePlans();
  const [billingPeriod, setBillingPeriod] = useState(location.state?.billingPeriod || 'monthly');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [installments, setInstallments] = useState(1);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [paymentMethodsLoaded, setPaymentMethodsLoaded] = useState(false); // Adicionar esta linha
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [couponData, setCouponData] = useState(null);
  const [validatingCoupon, setValidatingCoupon] = useState(false);
  const [couponError, setCouponError] = useState('');

  const plan = getPlanById(planId);
  const priceInfo = plan ? getPlanPrice(planId, billingPeriod, plan) : null;

  useEffect(() => {
    if (!user) {
      navigate('/login', { state: { from: location.pathname } });
      return;
    }

    if (!plan) {
      navigate('/plans');
      return;
    }

    // Só carregar se ainda não foi carregado
    if (plan && priceInfo && !paymentMethodsLoaded) {
      loadPaymentMethods();
    }
  }, [user, plan, priceInfo, location, navigate, paymentMethodsLoaded]); // Adicionar paymentMethodsLoaded

  const loadPaymentMethods = async () => {
    try {
      const response = await api.get('/admin/payment-methods');
      // Mapear campos do backend para o formato esperado pelo frontend
      const methods = response.data.data.paymentMethods.map(m => ({
        ...m,
        code: m.provider_code || m.code,
        name: m.provider_name || m.name,
        description: m.provider_description || m.description,
        enabled: m.provider_enabled !== undefined ? m.provider_enabled : m.enabled,
        fee_percentage: m.processing_fee_percentage || m.fee_percentage || 0,
        fee_fixed: m.processing_fee_fixed || m.fee_fixed || 0,
        max_installments: m.max_installments || (m.supports_credit_card ? 12 : 1),
        min_installment_value: m.min_installment_amount || m.min_installment_value || 0
      }));
      const enabledMethods = methods.filter(m => m.enabled);
      setPaymentMethods(enabledMethods);
      setPaymentMethodsLoaded(true); // Marcar como carregado
      
      // Selecionar PIX por padrão se disponível
      const pixMethod = enabledMethods.find(m => m.code === 'pix');
      if (pixMethod) {
        setPaymentMethod(pixMethod.id.toString());
      } else if (enabledMethods.length > 0) {
        setPaymentMethod(enabledMethods[0].id.toString());
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Erro ao carregar formas de pagamento:', error);
      setError('Erro ao carregar formas de pagamento');
      setLoading(false);
    }
  };

  const handleValidateCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponError('Digite um código de cupom');
      return;
    }

    setValidatingCoupon(true);
    setCouponError('');

    try {
      const response = await api.post('/coupons/validate', {
        code: couponCode.trim(),
        planId: planId,
        amount: priceInfo.price
      });

      if (response.data.success) {
        const coupon = response.data.data.coupon;
        // O backend já calcula discount_amount e final_amount
        setCouponData(coupon);
        setCouponError('');
      }
    } catch (error) {
      setCouponError(error.response?.data?.message || 'Cupom inválido ou expirado');
      setCouponData(null);
    } finally {
      setValidatingCoupon(false);
    }
  };

  // Recalcular cupom quando billingPeriod mudar (mas não quando priceInfo mudar para evitar loop)
  useEffect(() => {
    if (couponData && couponCode && priceInfo) {
      // Revalidar cupom com novo preço quando o período mudar
      const validateCoupon = async () => {
        if (!priceInfo?.price) return;
        setValidatingCoupon(true);
        setCouponError('');
        try {
          const response = await api.post('/coupons/validate', {
            code: couponCode.trim(),
            planId: planId,
            amount: priceInfo.price
          });
          if (response.data.success) {
            setCouponData(response.data.data.coupon);
            setCouponError('');
          }
        } catch (error) {
          setCouponError(error.response?.data?.message || 'Cupom inválido ou expirado');
          setCouponData(null);
        } finally {
          setValidatingCoupon(false);
        }
      };
      validateCoupon();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [billingPeriod]);

  const handleRemoveCoupon = () => {
    setCouponCode('');
    setCouponData(null);
    setCouponError('');
  };

  const selectedPaymentMethod = paymentMethods.find(m => m.id.toString() === paymentMethod);

  // Calcular valor base (após desconto do cupom)
  const calculateBaseAmount = () => {
    if (!priceInfo) return 0;
    
    // Se houver cupom aplicado, usar o final_amount calculado pelo backend
    if (couponData && couponData.final_amount !== undefined) {
      return couponData.final_amount;
    }
    
    // Caso contrário, retornar o preço original
    return priceInfo.price;
  };

  // Calcular total com taxas
  const calculateTotal = () => {
    if (!selectedPaymentMethod || !priceInfo) return priceInfo.price;

    let total = calculateBaseAmount();
    
    // Adicionar taxa percentual (aplicada sobre o valor base após desconto)
    if (selectedPaymentMethod.fee_percentage > 0) {
      total += (calculateBaseAmount() * selectedPaymentMethod.fee_percentage) / 100;
    }
    
    // Adicionar taxa fixa
    if (selectedPaymentMethod.fee_fixed > 0) {
      total += selectedPaymentMethod.fee_fixed;
    }
    
    return total;
  };

  // Calcular valor da parcela com juros
  const calculateInstallmentValue = () => {
    const baseTotal = calculateTotal();
    
    if (installments === 1) {
      return baseTotal;
    }

    // Se houver taxa percentual e parcelamento, aplicar juros sobre o total
    if (selectedPaymentMethod && selectedPaymentMethod.fee_percentage > 0) {
      // Taxa percentual aplicada sobre o valor total quando parcelado
      // Exemplo: 2.99% sobre R$ 100 = R$ 102.99 total, dividido em N parcelas
      const totalWithInterest = baseTotal * (1 + (selectedPaymentMethod.fee_percentage / 100));
      return totalWithInterest / installments;
    }
    
    // Sem juros, apenas dividir
    return baseTotal / installments;
  };

  // Calcular total com juros quando parcelado
  const calculateTotalWithInterest = () => {
    if (installments === 1) {
      return calculateTotal();
    }
    
    const baseTotal = calculateTotal();
    
    // Se houver taxa percentual, aplicar sobre o total
    if (selectedPaymentMethod && selectedPaymentMethod.fee_percentage > 0) {
      return baseTotal * (1 + (selectedPaymentMethod.fee_percentage / 100));
    }
    
    return baseTotal;
  };

  const maxInstallments = selectedPaymentMethod 
    ? Math.min(selectedPaymentMethod.max_installments, priceInfo.price >= 100 ? 12 : 6)
    : 1;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setProcessing(true);

    try {
      // Criar assinatura
      const subscriptionResponse = await api.post('/subscriptions', {
        plan_type: planId,
        billing_period: billingPeriod
      });

      const subscription = subscriptionResponse.data.data.subscription;

      // Se for plano free, redirecionar
      if (planId === 'free') {
        navigate('/dashboard');
        return;
      }

      // Calcular valor final (sem parcelamento, pois Stripe Checkout não suporta)
      const finalAmount = calculateTotal();

      // Se o valor final for 0 (cupom 100%), ativar assinatura diretamente
      if (finalAmount <= 0) {
        // Ativar assinatura sem processar pagamento
        await api.patch(`/subscriptions/${subscription.id}/status`, {
          status: 'active'
        });

        navigate('/dashboard', { 
          state: { 
            message: 'Assinatura ativada com sucesso! Obrigado pela sua assinatura.' 
          } 
        });
        return;
      }

      // SEMPRE usar Stripe Checkout (PIX e Cartão)
      const selectedMethod = paymentMethods.find(m => m.id.toString() === paymentMethod);
      if (!selectedMethod) {
        setError('Método de pagamento não selecionado');
        setProcessing(false);
        return;
      }

      // Mapear código do método para o formato do Stripe
      let paymentMethodCode = selectedMethod.code;
      if (paymentMethodCode === 'pix') {
        paymentMethodCode = 'pix';
      } else if (paymentMethodCode === 'credit_card' || paymentMethodCode === 'debit_card') {
        paymentMethodCode = 'stripe'; // Stripe usa 'card' internamente
      }

      // Criar checkout no Stripe com o método escolhido
      // Passar valor final (com desconto) e código do cupom se houver
      const checkoutResponse = await subscriptionService.createStripeCheckout(
        subscription.id,
        paymentMethodCode,
        finalAmount, // valor final com desconto
        couponData ? couponData.code : null // código do cupom
      );

      if (checkoutResponse.success && checkoutResponse.data.url) {
        window.location.href = checkoutResponse.data.url;
        return;
      } else {
        setError(checkoutResponse.message || 'Erro ao criar checkout do Stripe');
        setProcessing(false);
        return;
      }
    } catch (error) {
      console.error('Erro ao processar pagamento:', error);
      setError(error.response?.data?.message || 'Erro ao processar pagamento');
    } finally {
      setProcessing(false);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value || 0);
  };

  if (loading || !plan) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin h-12 w-12 text-brand-green mx-auto mb-4" />
          <p className="text-sm text-gray-600 font-poppins">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row lg:h-screen lg:overflow-hidden">
      {/* Coluna Esquerda - Detalhes do Plano */}
      <div className="hidden lg:flex lg:w-1/2 bg-brand-blue-900 p-6 lg:p-8 text-brand-white relative lg:h-screen lg:overflow-hidden">
        {/* Padrão de fundo */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-1/2 translate-y-1/2"></div>
        </div>

        {/* Logo no topo */}
        <div className="absolute top-6 left-6 z-10">
          <Link to="/">
            <img 
              src={logoWhite} 
              alt="MarcBuddy Logo" 
              className="h-7 w-auto"
            />
          </Link>
        </div>

        {/* Conteúdo */}
        <div className="relative z-10 flex flex-col justify-center w-full max-w-lg mx-auto py-4 h-full">
          {/* Ícone */}
          <div className="mb-4">
            <CheckCircle2 className="w-14 h-14 text-brand-green" strokeWidth={1.5} />
          </div>

          {/* Título */}
          <h1 className="text-2xl font-bold mb-2 font-poppins font-medium text-brand-white">
            Finalize sua assinatura
          </h1>
          <p className="text-base text-gray-200 mb-4 font-poppins">
            Você está assinando o plano <strong>{plan.name}</strong>
          </p>

          {/* Resumo do Plano */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 mb-4 border border-white/20">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-gray-200 font-poppins">Plano</span>
              <span className="text-lg font-bold font-poppins font-medium">{plan.name}</span>
            </div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-gray-200 font-poppins">Período</span>
              <span className="text-sm font-semibold font-poppins">
                {billingPeriod === 'annual' ? 'Anual' : 
                 billingPeriod === 'biennial' ? '2 Anos' :
                 billingPeriod === 'triennial' ? '3 Anos' : 'Mensal'}
              </span>
            </div>
            {(billingPeriod === 'annual' || billingPeriod === 'biennial' || billingPeriod === 'triennial') && priceInfo.discountPercentage && priceInfo.originalPrice && (
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-gray-200 font-poppins">Desconto</span>
                <span className="text-xl font-bold text-brand-green font-poppins font-medium">
                  {formatCurrency(priceInfo.originalPrice - priceInfo.price)}
                </span>
              </div>
            )}
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-gray-200 font-poppins">Valor</span>
              <span className="text-xl font-bold text-brand-green font-poppins font-medium">
                {formatCurrency(priceInfo.price)}
              </span>
            </div>
            {(billingPeriod === 'annual' || billingPeriod === 'biennial' || billingPeriod === 'triennial') && priceInfo.monthlyPrice && (
              <div className="pt-3 border-t border-white/20">
                <p className="text-xs text-gray-300 font-poppins">
                  Equivale a <strong>{formatCurrency(priceInfo.monthlyPrice)}</strong> por mês
                </p>
                {priceInfo.discountPercentage && (
                  <p className="text-xs text-brand-green font-semibold mt-1 font-poppins">
                    Economize {priceInfo.discountPercentage.toFixed(1)}% {billingPeriod === 'biennial' ? 'no plano de 2 anos' : billingPeriod === 'triennial' ? 'no plano de 3 anos' : 'no plano anual'}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Features do Plano */}
          <div>
            <h3 className="text-sm font-semibold mb-2 font-poppins font-medium">O que está incluído:</h3>
            <ul className="space-y-1.5 max-h-48 overflow-y-auto">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <CheckCircle2 className="w-4 h-4 text-brand-green mr-2 flex-shrink-0 mt-0.5" strokeWidth={2} />
                  <span className="text-xs text-gray-200 font-poppins">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Coluna Direita - Formulário de Pagamento */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-6 lg:p-4 bg-brand-white lg:h-screen lg:overflow-hidden overflow-x-hidden">
        <div 
          className="w-full max-w-md lg:flex lg:flex-col min-w-0 lg:overflow-y-auto"
          style={{
            scrollbarWidth: 'none', /* Firefox */
            msOverflowStyle: 'none', /* IE and Edge */
          }}
        >
          <style>{`
            [class*="max-w-md"]::-webkit-scrollbar {
              display: none; /* Chrome, Safari, Opera */
              width: 0;
              height: 0;
            }
          `}</style>
          {/* Botão Voltar */}
          <div className="mb-3 lg:mb-2">
            <Link
              to="/plans"
              className="inline-flex items-center text-xs text-gray-600 hover:text-brand-green transition-colors font-poppins"
            >
              <ArrowLeft className="w-3 h-3 mr-1" />
              Voltar para planos
            </Link>
          </div>

          {/* Logo Mobile */}
          <div className="lg:hidden mb-6">
            <Link to="/">
              <img 
                src={logoMobile} 
                alt="MarcBuddy Logo" 
                className="h-6 w-auto"
              />
            </Link>
          </div>

          {/* Título */}
          <div className="mb-3 lg:mb-2">
            <h2 className="text-lg lg:text-xl font-bold text-brand-blue-900 mb-0.5 font-poppins font-medium">Checkout</h2>
            <p className="text-xs text-gray-600 font-poppins">Complete seu pagamento</p>
          </div>

          {/* Erro */}
          {error && (
            <div className="mb-3 lg:mb-2 p-2.5 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-start text-xs">
              <svg className="w-4 h-4 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span className="font-poppins">{error}</span>
            </div>
          )}

           {/* Formulário */}
           <form onSubmit={handleSubmit} className="space-y-2.5 lg:space-y-2 lg:flex-1 lg:flex lg:flex-col">
            {/* Período de Cobrança */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5 font-poppins">
                Período de Cobrança
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setBillingPeriod('monthly')}
                  className={`px-3 py-2 rounded-lg border-2 text-sm font-semibold transition-all font-poppins font-medium ${
                    billingPeriod === 'monthly'
                      ? 'border-brand-green bg-brand-green text-brand-blue-900'
                      : 'border-gray-300 text-gray-700 hover:border-gray-400'
                  }`}
                >
                  Mensal
                </button>
                <button
                  type="button"
                  onClick={() => setBillingPeriod('annual')}
                  className={`px-3 py-2 rounded-lg border-2 text-sm font-semibold transition-all font-poppins font-medium ${
                    billingPeriod === 'annual'
                      ? 'border-brand-green bg-brand-green text-brand-blue-900'
                      : 'border-gray-300 text-gray-700 hover:border-gray-400'
                  }`}
                >
                  Anual
                  {plan.annualDiscountPercentage && (
                    <span className="block text-xs mt-0.5 opacity-90">
                      {plan.annualDiscountPercentage.toFixed(1)}% de desconto
                    </span>
                  )}
                </button>
                {plan.biennialDiscountPercentage && (
                  <button
                    type="button"
                    onClick={() => setBillingPeriod('biennial')}
                    className={`px-3 py-2 rounded-lg border-2 text-sm font-semibold transition-all font-poppins font-medium ${
                      billingPeriod === 'biennial'
                        ? 'border-brand-green bg-brand-green text-brand-blue-900'
                        : 'border-gray-300 text-gray-700 hover:border-gray-400'
                    }`}
                  >
                    2 Anos
                    <span className="block text-xs mt-0.5 opacity-90">
                      {plan.biennialDiscountPercentage.toFixed(1)}% de desconto
                    </span>
                  </button>
                )}
                {plan.triennialDiscountPercentage && (
                  <button
                    type="button"
                    onClick={() => setBillingPeriod('triennial')}
                    className={`px-3 py-2 rounded-lg border-2 text-sm font-semibold transition-all font-poppins font-medium ${
                      billingPeriod === 'triennial'
                        ? 'border-brand-green bg-brand-green text-brand-blue-900'
                        : 'border-gray-300 text-gray-700 hover:border-gray-400'
                    }`}
                  >
                    3 Anos
                    <span className="block text-xs mt-0.5 opacity-90">
                      {plan.triennialDiscountPercentage.toFixed(1)}% de desconto
                    </span>
                  </button>
                )}
              </div>
            </div>

            {/* Forma de Pagamento */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5 font-poppins">
                Forma de Pagamento
              </label>
              <div className="space-y-1.5">
                {paymentMethods.map((method) => (
                  <label
                    key={method.id}
                    className={`flex items-center p-2 border-2 rounded-lg cursor-pointer transition-all ${
                      paymentMethod === method.id.toString()
                        ? 'border-brand-green bg-green-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={method.id}
                      checked={paymentMethod === method.id.toString()}
                      onChange={(e) => {
                        setPaymentMethod(e.target.value);
                        setInstallments(1); // Reset parcelas ao mudar método
                      }}
                      className="w-3.5 h-3.5 text-brand-green border-gray-300 focus:ring-brand-green"
                    />
                    <div className="ml-2 flex-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <PaymentIcon code={method.code} className="w-5 h-5 mr-1.5 text-gray-700" />
                          <span className="text-sm font-semibold text-gray-900 font-poppins font-medium">{method.name}</span>
                        </div>
                      </div>
                      {method.description && (
                        <p className="text-xs text-gray-600 mt-0.5 font-poppins">{method.description}</p>
                      )}
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Cupom de Desconto */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1 font-poppins">
                Cupom de Desconto
              </label>
              {!couponData ? (
                <div className="flex gap-1.5 w-full min-w-0">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    onKeyPress={(e) => e.key === 'Enter' && handleValidateCoupon()}
                    placeholder="Digite o código do cupom"
                    className="flex-1 min-w-0 px-2 sm:px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent outline-none transition-all font-poppins"
                  />
                  <button
                    type="button"
                    onClick={handleValidateCoupon}
                    disabled={validatingCoupon || !couponCode.trim()}
                    className="px-2 sm:px-4 py-2 text-xs sm:text-sm bg-brand-green text-brand-blue-900 rounded-lg font-semibold hover:bg-brand-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-poppins font-medium whitespace-nowrap flex-shrink-0"
                  >
                    {validatingCoupon ? (
                      <Loader2 className="animate-spin h-4 w-4" />
                    ) : (
                      'Aplicar'
                    )}
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between p-2 bg-green-50 border-2 border-brand-green rounded-lg">
                  <div>
                    <p className="text-xs font-semibold text-brand-green font-poppins font-medium">
                      Cupom {couponData.code} aplicado!
                    </p>
                    <p className="text-xs text-gray-600 font-poppins">
                      Desconto: {formatCurrency(couponData.discount_amount)}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveCoupon}
                    className="text-red-500 hover:text-red-700 font-poppins text-xs"
                  >
                    Remover
                  </button>
                </div>
              )}
              {couponError && (
                <p className="text-xs text-red-600 mt-1 font-poppins">{couponError}</p>
              )}
            </div>

            {/* Parcelas (desabilitado para Stripe Checkout - não suporta parcelamento) */}
            {/* O Stripe Checkout não suporta parcelamento diretamente, então desabilitamos essa opção */}
            {false && selectedPaymentMethod && selectedPaymentMethod.code !== 'pix' && maxInstallments > 1 && (
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1 font-poppins">
                  Parcelas
                </label>
                <select
                  value={installments}
                  onChange={(e) => setInstallments(parseInt(e.target.value))}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent outline-none transition-all font-poppins"
                >
                  {Array.from({ length: maxInstallments }, (_, i) => i + 1).map((num) => {
                    const tempInstallments = num;
                    const baseTotal = calculateTotal();
                    let installmentValue;
                    let totalWithInterest;
                    
                    if (tempInstallments === 1) {
                      installmentValue = baseTotal;
                      totalWithInterest = baseTotal;
                    } else {
                      // Aplicar juros sobre o total quando parcelado
                      if (selectedPaymentMethod.fee_percentage > 0) {
                        totalWithInterest = baseTotal * (1 + (selectedPaymentMethod.fee_percentage / 100));
                        installmentValue = totalWithInterest / tempInstallments;
                      } else {
                        installmentValue = baseTotal / tempInstallments;
                        totalWithInterest = baseTotal;
                      }
                    }
                    
                    return (
                      <option key={num} value={num}>
                        {num}x de {formatCurrency(installmentValue)}
                        {selectedPaymentMethod.fee_percentage > 0 && num > 1 && (
                          <span> (Total: {formatCurrency(totalWithInterest)})</span>
                        )}
                      </option>
                    );
                  })}
                </select>
                {selectedPaymentMethod.min_installment_value > 0 && (
                  <p className="text-xs text-gray-500 mt-1 font-poppins">
                    Valor mínimo da parcela: {formatCurrency(selectedPaymentMethod.min_installment_value)}
                  </p>
                )}
              </div>
            )}

            {/* Resumo do Pagamento */}
            <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
              <h3 className="text-sm font-semibold text-brand-blue-900 mb-2 font-poppins font-medium">Resumo do Pagamento</h3>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-600 font-poppins">Subtotal</span>
                  <span className="font-semibold font-poppins">{formatCurrency(priceInfo.price)}</span>
                </div>
                {couponData && (
                  <div className="flex items-center justify-between text-green-600 text-xs">
                    <span className="font-poppins">Desconto ({couponData.code})</span>
                    <span className="font-semibold font-poppins">
                      -{formatCurrency(couponData.discount_amount)}
                    </span>
                  </div>
                )}
                {selectedPaymentMethod && (
                  <>
                    {selectedPaymentMethod.fee_percentage > 0 && (
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-600 font-poppins">
                          Taxa ({selectedPaymentMethod.fee_percentage}%)
                        </span>
                        <span className="font-semibold font-poppins">
                          {formatCurrency((calculateBaseAmount() * selectedPaymentMethod.fee_percentage) / 100)}
                        </span>
                      </div>
                    )}
                    {selectedPaymentMethod.fee_fixed > 0 && (
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-600 font-poppins">Taxa fixa</span>
                        <span className="font-semibold font-poppins">
                          {formatCurrency(selectedPaymentMethod.fee_fixed)}
                        </span>
                      </div>
                    )}
                  </>
                )}
                <div className="pt-2 border-t border-gray-300">
                  <div className="flex items-center justify-between">
                    <span className="text-base font-bold text-brand-blue-900 font-poppins font-medium">Total</span>
                    <span className="text-xl font-bold text-brand-green font-poppins font-medium">
                      {formatCurrency(installments > 1 ? calculateTotalWithInterest() : calculateTotal())}
                    </span>
                  </div>
                  {installments > 1 && (
                    <p className="text-xs text-gray-600 mt-1 font-poppins">
                      {installments}x de {formatCurrency(calculateInstallmentValue())}
                      {selectedPaymentMethod.fee_percentage > 0 && (
                        <span className="text-xs text-gray-500 ml-1">
                          (Total: {formatCurrency(calculateTotalWithInterest())})
                        </span>
                      )}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Botão de Pagamento */}
            <button
              type="submit"
              disabled={processing || !paymentMethod}
              className="w-full bg-brand-green text-brand-blue-900 py-2 px-4 rounded-lg text-sm font-semibold hover:bg-brand-green-500 focus:outline-none focus:ring-2 focus:ring-brand-green focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-poppins font-medium mt-auto"
            >
              {processing ? (
                <span className="flex items-center justify-center">
                  <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                  Processando...
                </span>
              ) : (
                'Finalizar Compra'
              )}
            </button>

            {/* Segurança e Políticas */}
            <div className="space-y-2 mt-2">
              {/* Selo de Segurança */}
              <div className="flex items-center justify-center gap-1.5 text-xs text-gray-500 font-poppins">
                <Lock className="w-3 h-3" />
                <span>Pagamento 100% seguro e criptografado</span>
              </div>
              
              {/* Selos de Confiança */}
              <div className="flex items-center justify-center gap-3 text-xs text-gray-400">
                <div className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>SSL Seguro</span>
                </div>
                <div className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Garantia</span>
                </div>
              </div>
              
              {/* Links de Políticas */}
              <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-gray-500 pt-1 border-t border-gray-200">
                <Link to="/privacidade" className="hover:text-brand-green transition-colors font-poppins">
                  Política de Privacidade
                </Link>
                <span className="text-gray-300">•</span>
                <Link to="/termos" className="hover:text-brand-green transition-colors font-poppins">
                  Termos de Uso
                </Link>
                <span className="text-gray-300">•</span>
                <Link to="/reembolso" className="hover:text-brand-green transition-colors font-poppins">
                  Política de Reembolso
                </Link>
              </div>
              
              {/* Suporte */}
              <div className="text-center pt-1">
                <p className="text-xs text-gray-500 font-poppins">
                  Precisa de ajuda?{' '}
                  <a href="mailto:suporte@marcbuddy.com" className="text-brand-green hover:underline font-semibold">
                    Entre em contato
                  </a>
                </p>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Checkout;

