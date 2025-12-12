import { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, X } from 'lucide-react';
import { healthApi } from '../services/api';

/**
 * Indicador visual do status do backend
 * Mostra um aviso se o backend não estiver rodando
 */
export const BackendStatusIndicator = () => {
  const [backendStatus, setBackendStatus] = useState('checking'); // 'checking', 'online', 'offline'
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    checkBackendStatus();
    
    // Verificar status a cada 30 segundos
    const interval = setInterval(checkBackendStatus, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const checkBackendStatus = async () => {
    try {
      const response = await healthApi.get('/health');
      // Verificar se a resposta é válida (status 200 e dados corretos)
      if (response.status === 200 && response.data?.status === 'ok') {
      setBackendStatus('online');
      setShowWarning(false);
      } else {
        setBackendStatus('offline');
        setShowWarning(true);
      }
    } catch (error) {
      // Se for erro 401 (não autorizado), pode ser que a rota esteja protegida
      // Mas isso não significa que o backend está offline, apenas que precisa de auth
      if (error.response?.status === 401) {
        // Backend está online, mas a rota requer autenticação
        // Isso é um problema de configuração, não de backend offline
        setBackendStatus('online');
        setShowWarning(false);
      } else {
        // Outros erros (404, 500, ECONNREFUSED, etc) = backend offline
      setBackendStatus('offline');
      setShowWarning(true);
      }
    }
  };

  if (backendStatus === 'checking' || backendStatus === 'online') {
    return null;
  }

  if (!showWarning) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-[9999] max-w-md animate-fadeIn">
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 shadow-lg rounded-lg">
        <div className="flex items-start">
          <AlertCircle className="h-6 w-6 text-yellow-400 mt-0.5" />
          <div className="ml-3 flex-1">
            <h3 className="text-sm font-semibold text-yellow-800">
              Backend Offline
            </h3>
            <p className="text-xs text-yellow-700 mt-1">
              O servidor backend não está rodando. Inicie o backend para usar todas as funcionalidades:
            </p>
            <code className="block bg-yellow-100 text-yellow-900 px-2 py-1 rounded mt-2 text-xs font-mono">
              cd backend && npm run dev
            </code>
          </div>
          <button
            onClick={() => setShowWarning(false)}
            className="ml-2 text-yellow-400 hover:text-yellow-600 transition-colors"
            aria-label="Fechar aviso"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

/**
 * Badge de status do backend (para usar em navbar/footer)
 */
export const BackendStatusBadge = () => {
  const [backendStatus, setBackendStatus] = useState('checking');

  useEffect(() => {
    checkStatus();
    const interval = setInterval(checkStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  const checkStatus = async () => {
    try {
      const response = await healthApi.get('/health');
      if (response.status === 200 && response.data?.status === 'ok') {
        setBackendStatus('online');
      } else {
        setBackendStatus('offline');
      }
    } catch (error) {
      // Se for erro 401, backend está online mas rota requer auth
      if (error.response?.status === 401) {
      setBackendStatus('online');
      } else {
      setBackendStatus('offline');
      }
    }
  };

  if (backendStatus === 'checking') {
    return (
      <div className="flex items-center gap-2 text-xs text-gray-500">
        <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse"></div>
        <span>Verificando...</span>
      </div>
    );
  }

  if (backendStatus === 'online') {
    return (
      <div className="flex items-center gap-2 text-xs text-green-600">
        <CheckCircle className="w-3 h-3" />
        <span>Backend Online</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 text-xs text-yellow-600">
      <AlertCircle className="w-3 h-3" />
      <span>Backend Offline</span>
    </div>
  );
};
