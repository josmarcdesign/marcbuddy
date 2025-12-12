import { useState, useEffect } from 'react';
import api from '../../services/api';

const AdminPayments = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPendingSubscriptions();
  }, []);

  const loadPendingSubscriptions = async () => {
    try {
      // Endpoint para listar todas as assinaturas pendentes (admin)
      const response = await api.get('/subscriptions/admin/pending');
      setSubscriptions(response.data.data.subscriptions);
      setLoading(false);
    } catch (error) {
      console.error('Erro:', error);
      setLoading(false);
    }
  };

  const handleConfirmPayment = async (subscriptionId) => {
    try {
      await api.post('/payments/confirm', {
        subscription_id: subscriptionId
      });
      alert('Pagamento confirmado!');
      loadPendingSubscriptions();
    } catch (error) {
      alert('Erro ao confirmar pagamento');
    }
  };

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 font-poppins font-medium text-brand-blue-900">Confirmação de Pagamentos</h1>
      
      {subscriptions.length === 0 ? (
        <div className="bg-white p-6 rounded-lg shadow text-center font-poppins text-gray-500">
          Nenhuma assinatura pendente
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse bg-white rounded-lg shadow">
            <thead>
              <tr className="bg-gray-50 border-b-2 border-gray-200">
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 font-poppins font-medium">Email</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 font-poppins font-medium">Nome</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 font-poppins font-medium">Plano</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 font-poppins font-medium">Status</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 font-poppins font-medium">Criado em</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 font-poppins font-medium">Ações</th>
              </tr>
            </thead>
            <tbody>
              {subscriptions.map((sub) => (
                <tr key={sub.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="px-4 py-3 font-poppins">{sub.user_email || 'N/A'}</td>
                  <td className="px-4 py-3 font-poppins">{sub.user_name || 'N/A'}</td>
                  <td className="px-4 py-3 font-poppins capitalize">{sub.plan_type}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold font-poppins font-medium ${
                      sub.status === 'active' 
                        ? 'bg-green-100 text-green-800'
                        : sub.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {sub.status === 'active' ? 'Ativa' : sub.status === 'pending' ? 'Pendente' : sub.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-poppins text-sm text-gray-600">
                    {sub.created_at ? new Date(sub.created_at).toLocaleDateString('pt-BR') : 'N/A'}
                  </td>
                  <td className="px-4 py-3">
                    {sub.status === 'pending' && (
                      <button
                        onClick={() => handleConfirmPayment(sub.id)}
                        className="px-4 py-2 bg-brand-green text-white rounded-lg hover:bg-brand-green-500 transition-colors text-sm font-semibold font-poppins font-medium"
                      >
                        Confirmar Pagamento
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminPayments;

