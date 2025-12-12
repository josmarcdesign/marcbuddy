import { useState, useEffect } from 'react';
import api from '../../services/api';

const UsersManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    loadUsers();
  }, [searchQuery, filterStatus]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/users', {
        params: { search: searchQuery, status: filterStatus }
      });
      setUsers(response.data.data.users);
      setLoading(false);
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
      alert('Erro ao carregar usuários. Verifique se você tem permissão de admin.');
      setLoading(false);
    }
  };

  const handleBanUser = async (userId) => {
    if (!confirm('Tem certeza que deseja banir este usuário?')) {
      return;
    }

    try {
      await api.post(`/admin/users/${userId}/ban`);
      await loadUsers(); // Recarregar lista
      alert('Usuário banido com sucesso!');
    } catch (error) {
      console.error('Erro ao banir usuário:', error);
      alert(error.response?.data?.message || 'Erro ao banir usuário');
    }
  };

  const handleUnbanUser = async (userId) => {
    try {
      await api.post(`/admin/users/${userId}/unban`);
      await loadUsers(); // Recarregar lista
      alert('Usuário desbanido com sucesso!');
    } catch (error) {
      console.error('Erro ao desbanir usuário:', error);
      alert(error.response?.data?.message || 'Erro ao desbanir usuário');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!confirm('Tem certeza que deseja remover este usuário? Esta ação não pode ser desfeita.')) {
      return;
    }

    try {
      await api.delete(`/admin/users/${userId}`);
      await loadUsers(); // Recarregar lista
      alert('Usuário removido com sucesso!');
    } catch (error) {
      console.error('Erro ao remover usuário:', error);
      alert(error.response?.data?.message || 'Erro ao remover usuário');
    }
  };

  const handleChangeSubscription = async (userId, newPlan) => {
    try {
      await api.put(`/admin/users/${userId}/subscription`, { plan_type: newPlan });
      await loadUsers(); // Recarregar lista
      alert('Assinatura alterada com sucesso!');
    } catch (error) {
      console.error('Erro ao alterar assinatura:', error);
      alert(error.response?.data?.message || 'Erro ao alterar assinatura');
    }
  };

  // Os filtros agora são feitos no backend, então usamos os usuários diretamente
  const filteredUsers = users;

  if (loading) {
    return <div className="text-center py-8 font-poppins">Carregando usuários...</div>;
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
        <h2 className="text-xl sm:text-2xl font-bold text-brand-blue-900 font-nunito">
          Gerenciamento de Usuários
        </h2>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Buscar usuários..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent font-poppins text-sm"
          />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent font-poppins text-sm"
          >
            <option value="all">Todos</option>
            <option value="active">Ativos</option>
            <option value="inactive">Inativos</option>
            <option value="banned">Banidos</option>
          </select>
        </div>
      </div>

      {/* Mobile View - Cards */}
      <div className="lg:hidden space-y-3">
        {filteredUsers.length === 0 ? (
          <div className="text-center py-8 text-gray-500 font-poppins">
            Nenhum usuário encontrado
          </div>
        ) : (
          filteredUsers.map((user) => (
            <div key={user.id} className="bg-white border border-gray-200 rounded-lg p-4 space-y-3">
              <div>
                <h3 className="font-semibold text-brand-blue-900 font-nunito">{user.name}</h3>
                <p className="text-sm text-gray-600 font-poppins">{user.email}</p>
              </div>
              <div className="space-y-2">
                <div>
                  <label className="text-xs text-gray-500 font-poppins mb-1 block">Plano</label>
                  <select
                    value={user.plan_type || 'free'}
                    onChange={(e) => handleChangeSubscription(user.id, e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent font-poppins text-sm"
                  >
                    <option value="free">MBuddy Free</option>
                    <option value="classic">MBuddy Classic</option>
                    <option value="pro">MBuddy Pro</option>
                    <option value="team">MBuddy Team</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-500 font-poppins mb-1 block">Status</label>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold font-nunito ${
                    user.banned
                      ? 'bg-red-100 text-red-800'
                      : user.subscription_status === 'active'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {user.banned ? 'Banido' : user.subscription_status === 'active' ? 'Ativo' : 'Inativo'}
                  </span>
                </div>
                {user.subscription_end_date && (
                  <div className="text-xs text-gray-500 font-poppins">
                    Vence em: {new Date(user.subscription_end_date).toLocaleDateString('pt-BR')}
                  </div>
                )}
              </div>
              <div className="flex gap-2 pt-2 border-t border-gray-200">
                {user.banned ? (
                  <button
                    onClick={() => handleUnbanUser(user.id)}
                    className="flex-1 px-3 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors text-xs font-semibold font-nunito"
                  >
                    Desbanir
                  </button>
                ) : (
                  <button
                    onClick={() => handleBanUser(user.id)}
                    className="flex-1 px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors text-xs font-semibold font-nunito"
                  >
                    Banir
                  </button>
                )}
                <button
                  onClick={() => handleDeleteUser(user.id)}
                  className="flex-1 px-3 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors text-xs font-semibold font-nunito"
                >
                  Remover
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
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 font-nunito">Nome</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 font-nunito">Email</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 font-nunito">Plano</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 font-nunito">Status / Período</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 font-nunito">Ações</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-4 py-8 text-center text-gray-500 font-poppins">
                  Nenhum usuário encontrado
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => (
                <tr key={user.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="px-4 py-3 font-poppins">{user.name}</td>
                  <td className="px-4 py-3 font-poppins">{user.email}</td>
                  <td className="px-4 py-3">
                    <div className="space-y-1">
                      <select
                        value={user.plan_type || 'free'}
                        onChange={(e) => handleChangeSubscription(user.id, e.target.value)}
                        className="w-full px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent font-poppins text-sm"
                      >
                        <option value="free">MBuddy Free</option>
                        <option value="classic">MBuddy Classic</option>
                        <option value="pro">MBuddy Pro</option>
                        <option value="team">MBuddy Team</option>
                      </select>
                      <div className="text-xs text-gray-500 font-poppins">
                        Mensal
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="space-y-1">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold font-nunito ${
                        user.banned
                          ? 'bg-red-100 text-red-800'
                          : user.subscription_status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {user.banned ? 'Banido' : user.subscription_status === 'active' ? 'Ativo' : 'Inativo'}
                      </span>
                      {user.subscription_end_date && (
                        <div className="text-xs text-gray-500 font-poppins">
                          Vence: {new Date(user.subscription_end_date).toLocaleDateString('pt-BR')}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      {user.banned ? (
                        <button
                          onClick={() => handleUnbanUser(user.id)}
                          className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition-colors text-xs font-semibold font-nunito"
                        >
                          Desbanir
                        </button>
                      ) : (
                        <button
                          onClick={() => handleBanUser(user.id)}
                          className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors text-xs font-semibold font-nunito"
                        >
                          Banir
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors text-xs font-semibold font-nunito"
                      >
                        Remover
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="text-xs sm:text-sm text-gray-600 font-poppins">
        Total: {users.length} usuário(s)
      </div>
    </div>
  );
};

export default UsersManagement;

