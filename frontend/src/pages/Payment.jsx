import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import QRCode from '../components/QRCode';

const Payment = () => {
  const { planId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [paymentData, setPaymentData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    // Primeiro criar a assinatura, depois gerar QR code
    createSubscriptionAndGenerateQR();
  }, [planId, user]);

  const createSubscriptionAndGenerateQR = async () => {
    try {
      setLoading(true);
      
      // 1. Criar assinatura
      const subscriptionResponse = await api.post('/subscriptions', {
        plan_type: planId
      });

      const subscription = subscriptionResponse.data.data.subscription;

      // 2. Se for plano free, redirecionar
      if (planId === 'free') {
        navigate('/dashboard');
        return;
      }

      // 3. Gerar QR Code
      const qrResponse = await api.post('/payments/generate-qrcode', {
        subscription_id: subscription.id
      });

      setPaymentData(qrResponse.data.data);
      setLoading(false);
    } catch (error) {
      console.error('Erro:', error);
      setError(error.response?.data?.message || 'Erro ao processar pagamento');
      setLoading(false);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-sm text-gray-600 font-poppins">Processando pagamento...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-4 sm:p-6">
          <div className="text-center">
            <div className="text-red-500 text-3xl sm:text-4xl mb-4">⚠️</div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 font-poppins font-medium">Erro</h2>
            <p className="text-sm sm:text-base text-gray-600 mb-4 font-poppins">{error}</p>
            <button
              onClick={() => navigate('/plans')}
              className="w-full sm:w-auto bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors font-semibold font-poppins font-medium"
            >
              Voltar para Planos
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6 sm:py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 lg:p-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6 text-center font-poppins font-medium">
            Finalizar Pagamento
          </h1>

          <div className="text-center mb-6 sm:mb-8">
            <p className="text-base sm:text-lg text-gray-700 mb-2 font-poppins">
              Valor a pagar: <span className="font-bold text-xl sm:text-2xl text-primary-600 font-poppins font-medium">
                {formatCurrency(paymentData?.amount)}
              </span>
            </p>
            <p className="text-xs sm:text-sm text-gray-600 font-poppins">{paymentData?.description}</p>
          </div>

          <div className="flex justify-center mb-6 sm:mb-8">
            <div className="w-full max-w-xs sm:max-w-sm">
              <QRCode qrCodeDataURL={paymentData?.qrCode} />
            </div>
          </div>

          <div className="bg-gray-100 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
            <p className="text-xs sm:text-sm text-gray-700 mb-2 font-poppins">
              <strong className="font-semibold">Chave Pix:</strong>
            </p>
            <p className="text-xs sm:text-sm font-mono text-gray-900 break-all mb-3 font-poppins">
              {paymentData?.pixKey}
            </p>
            <button
              onClick={() => {
                navigator.clipboard.writeText(paymentData?.pixKey);
                alert('Chave Pix copiada!');
              }}
              className="w-full sm:w-auto bg-brand-green text-brand-blue-900 px-4 py-2 rounded-lg hover:bg-brand-green-500 transition-colors text-sm font-semibold font-poppins font-medium"
            >
              Copiar chave Pix
            </button>
          </div>

          <div className="text-center">
            <p className="text-xs sm:text-sm text-gray-600 mb-4 font-poppins leading-relaxed">
              Após realizar o pagamento, aguarde a confirmação. Você receberá um email quando sua assinatura for ativada.
            </p>
            <button
              onClick={() => navigate('/dashboard')}
              className="w-full sm:w-auto bg-gray-200 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors font-semibold font-poppins font-medium"
            >
              Voltar ao Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;

