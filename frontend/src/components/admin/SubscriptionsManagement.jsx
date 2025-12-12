import { useState, useEffect } from 'react';
import api from '../../services/api';
import { Edit2, Trash2, X, Save } from 'lucide-react';

const SubscriptionsManagement = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [editingSubscription, setEditingSubscription] = useState(null);
  const [formData, setFormData] = useState({
    plan_type: '',
    status: '',
    billing_period: '',
    amount: '',
    currency: 'BRL',
    start_date: '',
    end_date: '',
    renewal_date: '',
    auto_renew: false
  });
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    loadSubscriptions();
  }, [filterStatus, page]);

  const loadSubscriptions = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/subscriptions', {
        params: { 
          status: filterStatus === 'all' ? null : filterStatus,
          page,
          limit: 50
        }
      });
      setSubscriptions(response.data.data.subscriptions);
      setTotalPages(response.data.data.pagination.pages);
      setLoading(false);
    } catch (error) {
      console.error('Erro ao carregar assinaturas:', error);
      alert('Erro ao carregar assinaturas. Verifique se você tem permissão de admin.');
      setLoading(false);
    }
  };

  const handleEdit = (sub) => {
    setEditingSubscription(sub.id);
    setFormData({
      plan_type: sub.plan_type || '',
      status: sub.status || '',
      billing_period: sub.billing_period || '',
      amount: sub.amount || '',
      currency: sub.currency || 'BRL',
      start_date: sub.start_date ? sub.start_date.split('T')[0] : '',
      end_date: sub.end_date ? sub.end_date.split('T')[0] : '',
      renewal_date: sub.renewal_date ? sub.renewal_date.split('T')[0] : '',
      auto_renew: sub.auto_renew || false
    });
  };

  const handleCancelEdit = () => {
    setEditingSubscription(null);
    setFormData({
      plan_type: '',
      status: '',
      billing_period: '',
      amount: '',
      currency: 'BRL',
      start_date: '',
      end_date: '',
      renewal_date: '',
      auto_renew: false
    });
  };

  const handleSave = async (subscriptionId) => {
    try {
      setLoading(true);
      const updateData = {};
      
      // Só incluir campos que foram alterados
      if (formData.plan_type) updateData.plan_type = formData.plan_type;
      if (formData.status) updateData.status = formData.status;
      if (formData.billing_period) updateData.billing_period = formData.billing_period;
      if (formData.amount) updateData.amount = parseFloat(formData.amount);
      if (formData.currency) updateData.currency = formData.currency;
      if (formData.start_date) updateData.start_date = formData.start_date;
      if (formData.end_date) updateData.end_date = formData.end_date;
      if (formData.renewal_date) updateData.renewal_date = formData.renewal_date;
      updateData.auto_renew = formData.auto_renew;

      await api.put(`/admin/subscriptions/${subscriptionId}`, updateData);
      await loadSubscriptions();
      setEditingSubscription(null);
      alert('Assinatura atualizada com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar assinatura:', error);
      alert(error.response?.data?.message || 'Erro ao salvar assinatura');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (subscriptionId) => {
    if (!confirm('Tem certeza que deseja deletar esta assinatura? Esta ação não pode ser desfeita.')) {
      return;
    }

    try {
      setDeletingId(subscriptionId);
      await api.delete(`/admin/subscriptions/${subscriptionId}`);
      await loadSubscriptions();
      alert('Assinatura deletada com sucesso!');
    } catch (error) {
      console.error('Erro ao deletar assinatura:', error);
      alert(error.response?.data?.message || 'Erro ao deletar assinatura');
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const formatCurrency = (amount, currency = 'BRL') => {
    if (!amount) return 'N/A';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  const getStatusBadge = (status) => {
    const badges = {
      active: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      cancelled: 'bg-red-100 text-red-800',
      expired: 'bg-gray-100 text-gray-800'
    };
    return badges[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusLabel = (status) => {
    const labels = {
      active: 'Ativa',
      pending: 'Pendente',
      cancelled: 'Cancelada',
      expired: 'Expirada'
    };
    return labels[status] || status;
  };

  if (loading && subscriptions.length === 0) {
    return <div className="text-center py-8 font-poppins">Carregando assinaturas...</div>;
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
        <h2 className="text-xl sm:text-2xl font-bold text-brand-blue-900 font-poppins font-medium">
          Gerenciamento de Assinaturas
        </h2>
        <div className="flex gap-2 sm:gap-3 w-full sm:w-auto">
          <select
            value={filterStatus}
            onChange={(e) => {
              setFilterStatus(e.target.value);
              setPage(1);
            }}
            className="px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent font-poppins text-sm flex-1 sm:flex-none"
          >
            <option value="all">Todas</option>
            <option value="active">Ativas</option>
            <option value="pending">Pendentes</option>
            <option value="cancelled">Canceladas</option>
            <option value="expired">Expiradas</option>
          </select>
        </div>
      </div>

      {/* Mobile View - Cards */}
      <div className="lg:hidden space-y-3">
        {subscriptions.length === 0 ? (
          <div className="text-center py-8 text-gray-500 font-poppins text-sm">
            Nenhuma assinatura encontrada
          </div>
        ) : (
          subscriptions.map((sub) => (
            <div key={sub.id} className="bg-white border border-gray-200 rounded-lg p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-brand-blue-900 font-poppins font-medium text-sm sm:text-base truncate">
                    {sub.user_name || sub.user_email}
                  </h3>
                  <p className="text-xs text-gray-600 font-poppins truncate">{sub.user_email}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-semibold font-poppins font-medium flex-shrink-0 ${getStatusBadge(sub.status)}`}>
                  {getStatusLabel(sub.status)}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs font-poppins">
                <div>
                  <span className="text-gray-500">Plano:</span>
                  <span className="ml-1 font-semibold text-brand-blue-900 capitalize">{sub.plan_type}</span>
                </div>
                <div>
                  <span className="text-gray-500">Período:</span>
                  <span className="ml-1 font-semibold text-brand-blue-900">
                    {sub.billing_period === 'annual' ? 'Anual' : 'Mensal'}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">Valor:</span>
                  <span className="ml-1 font-semibold text-brand-blue-900">
                    {formatCurrency(sub.amount, sub.currency)}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">Início:</span>
                  <span className="ml-1 font-semibold text-brand-blue-900">{formatDate(sub.start_date)}</span>
                </div>
              </div>
              <div className="flex gap-2 pt-2 border-t border-gray-200">
                <button
                  onClick={() => handleEdit(sub)}
                  className="flex-1 px-3 py-2 bg-brand-green text-brand-blue-900 rounded hover:bg-brand-green-500 transition-colors text-xs font-semibold font-poppins font-medium"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(sub.id)}
                  disabled={deletingId === sub.id}
                  className="flex-1 px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors text-xs font-semibold font-poppins font-medium disabled:opacity-50"
                >
                  {deletingId === sub.id ? 'Deletando...' : 'Deletar'}
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Desktop View - Table */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b-2 border-gray-200">
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 font-poppins font-medium">Email</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 font-poppins font-medium">Nome</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 font-poppins font-medium">Plano</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 font-poppins font-medium">Período</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 font-poppins font-medium">Status</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 font-poppins font-medium">Valor</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 font-poppins font-medium">Início</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 font-poppins font-medium">Término</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 font-poppins font-medium">Renovação</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 font-poppins font-medium">Ações</th>
            </tr>
          </thead>
          <tbody>
            {subscriptions.length === 0 ? (
              <tr>
                <td colSpan="10" className="px-4 py-8 text-center text-gray-500 font-poppins">
                  Nenhuma assinatura encontrada
                </td>
              </tr>
            ) : (
              subscriptions.map((sub) => (
                <tr key={sub.id} className="border-b border-gray-200 hover:bg-gray-50">
                  {editingSubscription === sub.id ? (
                    // Modo de edição
                    <>
                      <td className="px-4 py-3 font-poppins">{sub.user_email}</td>
                      <td className="px-4 py-3 font-poppins">{sub.user_name}</td>
                      <td className="px-4 py-3">
                        <select
                          value={formData.plan_type}
                          onChange={(e) => setFormData({ ...formData, plan_type: e.target.value })}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm font-poppins"
                        >
                          <option value="free">MBuddy Free</option>
                          <option value="classic">MBuddy Classic</option>
                          <option value="pro">MBuddy Pro</option>
                          <option value="team">MBuddy Team</option>
                        </select>
                      </td>
                      <td className="px-4 py-3">
                        <select
                          value={formData.billing_period}
                          onChange={(e) => setFormData({ ...formData, billing_period: e.target.value })}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm font-poppins"
                        >
                          <option value="monthly">Mensal</option>
                          <option value="annual">Anual</option>
                        </select>
                      </td>
                      <td className="px-4 py-3">
                        <select
                          value={formData.status}
                          onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm font-poppins"
                        >
                          <option value="pending">Pendente</option>
                          <option value="active">Ativa</option>
                          <option value="cancelled">Cancelada</option>
                          <option value="expired">Expirada</option>
                        </select>
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="number"
                          step="0.01"
                          value={formData.amount}
                          onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm font-poppins"
                          placeholder="0.00"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="date"
                          value={formData.start_date}
                          onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm font-poppins"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="date"
                          value={formData.end_date}
                          onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm font-poppins"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="date"
                          value={formData.renewal_date}
                          onChange={(e) => setFormData({ ...formData, renewal_date: e.target.value })}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm font-poppins"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleSave(sub.id)}
                            disabled={loading}
                            className="p-2 bg-brand-green text-white rounded hover:bg-brand-green-500 transition-colors disabled:opacity-50"
                            title="Salvar"
                          >
                            <Save className="w-4 h-4" />
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            disabled={loading}
                            className="p-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors disabled:opacity-50"
                            title="Cancelar"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </>
                  ) : (
                    // Modo de visualização
                    <>
                      <td className="px-4 py-3 font-poppins">{sub.user_email}</td>
                      <td className="px-4 py-3 font-poppins">{sub.user_name}</td>
                      <td className="px-4 py-3 font-poppins capitalize">{sub.plan_type}</td>
                      <td className="px-4 py-3 font-poppins text-sm">
                        {sub.billing_period === 'annual' ? 'Anual' : 'Mensal'}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold font-poppins font-medium ${getStatusBadge(sub.status)}`}>
                          {getStatusLabel(sub.status)}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-poppins text-sm">
                        {formatCurrency(sub.amount, sub.currency)}
                      </td>
                      <td className="px-4 py-3 font-poppins text-sm text-gray-600">
                        {formatDate(sub.start_date)}
                      </td>
                      <td className="px-4 py-3 font-poppins text-sm text-gray-600">
                        {formatDate(sub.end_date)}
                      </td>
                      <td className="px-4 py-3 font-poppins text-sm text-gray-600">
                        {formatDate(sub.renewal_date)}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(sub)}
                            disabled={loading || deletingId === sub.id}
                            className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors disabled:opacity-50"
                            title="Editar"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(sub.id)}
                            disabled={loading || deletingId === sub.id}
                            className="p-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors disabled:opacity-50"
                            title="Deletar"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 flex-wrap">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 sm:px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 font-poppins text-xs sm:text-sm"
          >
            Anterior
          </button>
          <span className="px-3 sm:px-4 py-2 font-poppins text-xs sm:text-sm">
            Página {page} de {totalPages}
          </span>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-3 sm:px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 font-poppins text-xs sm:text-sm"
          >
            Próxima
          </button>
        </div>
      )}

      <div className="text-xs sm:text-sm text-gray-600 font-poppins">
        Total: {subscriptions.length} assinatura(s)
      </div>
    </div>
  );
};

export default SubscriptionsManagement;
