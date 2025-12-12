import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { CheckCircle2, XCircle, Loader2, ArrowLeft } from 'lucide-react';
import api from '../services/api';
import logoMobile from '@assets/logos/Isotipo+tipografia.svg';

const StripeReturn = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [status, setStatus] = useState('loading'); // 'loading', 'success', 'cancel', 'error'
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const sessionId = searchParams.get('session_id');
    const canceled = searchParams.get('canceled');

    if (canceled === 'true') {
      setStatus('cancel');
      setMessage('Pagamento cancelado. Você pode tentar novamente quando quiser.');
      return;
    }

    if (sessionId) {
      // Verificar status da assinatura
      checkSubscriptionStatus();
    } else {
      setStatus('error');
      setMessage('Sessão de pagamento não encontrada.');
    }
  }, [searchParams, user, navigate]);

  const checkSubscriptionStatus = async () => {
    try {
      const response = await api.get('/subscriptions/active');
      
      if (response.data.success && response.data.data.subscription) {
        const subscription = response.data.data.subscription;
        
        if (subscription.status === 'active') {
          setStatus('success');
          setMessage('Pagamento processado com sucesso! Sua assinatura está ativa.');
        } else {
          setStatus('loading');
          // Aguardar um pouco e verificar novamente (webhook pode estar processando)
          setTimeout(() => {
            checkSubscriptionStatus();
          }, 2000);
        }
      } else {
        setStatus('loading');
        // Aguardar um pouco e verificar novamente
        setTimeout(() => {
          checkSubscriptionStatus();
        }, 2000);
      }
    } catch (error) {
      console.error('Erro ao verificar assinatura:', error);
      setStatus('error');
      setMessage('Erro ao verificar status da assinatura. Verifique seu dashboard.');
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 sm:p-8 text-center">
          <Loader2 className="animate-spin h-12 w-12 text-brand-green mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2 font-poppins font-medium">
            Processando pagamento...
          </h2>
          <p className="text-sm text-gray-600 font-poppins">
            Aguarde enquanto confirmamos seu pagamento.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 sm:p-8">
        {/* Logo Mobile */}
        <div className="mb-6 text-center">
          <Link to="/">
            <img 
              src={logoMobile} 
              alt="MarcBuddy Logo" 
              className="h-6 w-auto mx-auto"
            />
          </Link>
        </div>

        {/* Status Icon */}
        <div className="text-center mb-6">
          {status === 'success' ? (
            <CheckCircle2 className="w-16 h-16 text-brand-green mx-auto mb-4" strokeWidth={1.5} />
          ) : status === 'cancel' ? (
            <XCircle className="w-16 h-16 text-yellow-500 mx-auto mb-4" strokeWidth={1.5} />
          ) : (
            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" strokeWidth={1.5} />
          )}
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-4 font-poppins font-medium">
          {status === 'success' && 'Pagamento Confirmado!'}
          {status === 'cancel' && 'Pagamento Cancelado'}
          {status === 'error' && 'Erro no Pagamento'}
        </h2>

        {/* Message */}
        <p className="text-center text-gray-600 mb-6 font-poppins">
          {message}
        </p>

        {/* Actions */}
        <div className="space-y-3">
          {status === 'success' && (
            <button
              onClick={() => navigate('/dashboard')}
              className="w-full bg-brand-green text-brand-blue-900 py-3 px-4 rounded-lg text-sm font-semibold hover:bg-brand-green-500 transition-all font-poppins font-medium"
            >
              Ir para Dashboard
            </button>
          )}

          {status === 'cancel' && (
            <>
              <button
                onClick={() => navigate('/plans')}
                className="w-full bg-brand-green text-brand-blue-900 py-3 px-4 rounded-lg text-sm font-semibold hover:bg-brand-green-500 transition-all font-poppins font-medium"
              >
                Ver Planos Novamente
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                className="w-full bg-gray-200 text-gray-800 py-3 px-4 rounded-lg text-sm font-semibold hover:bg-gray-300 transition-all font-poppins font-medium"
              >
                Voltar ao Dashboard
              </button>
            </>
          )}

          {status === 'error' && (
            <>
              <button
                onClick={() => navigate('/dashboard')}
                className="w-full bg-brand-green text-brand-blue-900 py-3 px-4 rounded-lg text-sm font-semibold hover:bg-brand-green-500 transition-all font-poppins font-medium"
              >
                Ir para Dashboard
              </button>
              <Link
                to="/plans"
                className="block w-full text-center text-sm text-brand-green hover:underline font-poppins"
              >
                <ArrowLeft className="w-4 h-4 inline mr-1" />
                Voltar para Planos
              </Link>
            </>
          )}
        </div>

        {/* Support */}
        <div className="mt-6 pt-6 border-t border-gray-200 text-center">
          <p className="text-xs text-gray-500 font-poppins">
            Precisa de ajuda?{' '}
            <a href="mailto:suporte@marcbuddy.com" className="text-brand-green hover:underline font-semibold">
              Entre em contato
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default StripeReturn;
