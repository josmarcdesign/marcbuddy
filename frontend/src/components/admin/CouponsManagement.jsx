import { useState, useEffect } from 'react';
import api from '../../services/api';
import { Plus, Edit2, Trash2, X, Save, Tag, Calendar, Percent, DollarSign } from 'lucide-react';

const CouponsManagement = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    code: '',
    description: '',
    discount_type: 'percentage',
    discount_value: '',
    min_purchase_value: '',
    max_discount_value: '',
    applicable_plans: [],
    applicable_to_all_plans: true,
    usage_limit: '',
    usage_limit_per_user: 1,
    valid_from: '',
    valid_until: '',
    is_active: true
  });

  useEffect(() => {
    loadCoupons();
  }, []);

  const loadCoupons = async () => {
    try {
      const response = await api.get('/admin/coupons');
      setCoupons(response.data.data.coupons);
      setLoading(false);
    } catch (error) {
      console.error('Erro ao carregar cupons:', error);
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setShowCreateForm(true);
    setEditingCoupon(null);
    setFormData({
      code: '',
      description: '',
      discount_type: 'percentage',
      discount_value: '',
      min_purchase_value: '',
      max_discount_value: '',
      applicable_plans: [],
      applicable_to_all_plans: true,
      usage_limit: '',
      usage_limit_per_user: 1,
      valid_from: '',
      valid_until: '',
      is_active: true
    });
  };

  const handleEdit = (coupon) => {
    setEditingCoupon(coupon.id);
    setShowCreateForm(false);
    setFormData({
      code: coupon.code,
      description: coupon.description || '',
      discount_type: coupon.discount_type,
      discount_value: coupon.discount_value,
      min_purchase_value: coupon.min_purchase_value || '',
      max_discount_value: coupon.max_discount_value || '',
      applicable_plans: coupon.applicable_plans || [],
      applicable_to_all_plans: coupon.applicable_to_all_plans,
      usage_limit: coupon.usage_limit || '',
      usage_limit_per_user: coupon.usage_limit_per_user || 1,
      valid_from: coupon.valid_from ? new Date(coupon.valid_from).toISOString().split('T')[0] : '',
      valid_until: coupon.valid_until ? new Date(coupon.valid_until).toISOString().split('T')[0] : '',
      is_active: coupon.is_active
    });
  };

  const handleSave = async () => {
    try {
      const data = {
        ...formData,
        discount_value: parseFloat(formData.discount_value),
        min_purchase_value: formData.min_purchase_value ? parseFloat(formData.min_purchase_value) : 0,
        max_discount_value: formData.max_discount_value ? parseFloat(formData.max_discount_value) : null,
        usage_limit: formData.usage_limit ? parseInt(formData.usage_limit) : null,
        usage_limit_per_user: parseInt(formData.usage_limit_per_user),
        valid_from: formData.valid_from || null,
        valid_until: formData.valid_until || null
      };

      if (editingCoupon) {
        await api.put(`/admin/coupons/${editingCoupon}`, data);
      } else {
        await api.post('/admin/coupons', data);
      }

      await loadCoupons();
      setEditingCoupon(null);
      setShowCreateForm(false);
      alert(editingCoupon ? 'Cupom atualizado com sucesso!' : 'Cupom criado com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar cupom:', error);
      alert(error.response?.data?.message || 'Erro ao salvar cupom');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Tem certeza que deseja deletar este cupom?')) {
      return;
    }

    try {
      await api.delete(`/admin/coupons/${id}`);
      await loadCoupons();
      alert('Cupom deletado com sucesso!');
    } catch (error) {
      console.error('Erro ao deletar cupom:', error);
      alert(error.response?.data?.message || 'Erro ao deletar cupom');
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value || 0);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Sem data';
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  if (loading) {
    return <div className="text-center py-8 font-poppins">Carregando...</div>;
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-brand-blue-900 font-poppins font-medium">
            Gerenciamento de Cupons
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 font-poppins mt-1">
            Crie e gerencie cupons de desconto para os planos
          </p>
        </div>
        <button
          onClick={handleCreate}
          className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-brand-green text-brand-blue-900 rounded-lg hover:bg-brand-green-500 transition-colors font-semibold font-poppins font-medium text-sm sm:text-base w-full sm:w-auto"
        >
          <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
          Novo Cupom
        </button>
      </div>

      {/* Formulário de Criação/Edição */}
      {(showCreateForm || editingCoupon) && (
        <div className="bg-white rounded-lg shadow-sm border-2 border-gray-200 p-4 sm:p-6">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h3 className="text-base sm:text-lg font-semibold text-brand-blue-900 font-poppins font-medium">
              {editingCoupon ? 'Editar Cupom' : 'Novo Cupom'}
            </h3>
            <button
              onClick={() => {
                setShowCreateForm(false);
                setEditingCoupon(null);
              }}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 font-poppins">
                Código do Cupom *
              </label>
              <input
                type="text"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent font-poppins"
                placeholder="EXEMPLO123"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 font-poppins">
                Descrição
              </label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent font-poppins"
                placeholder="Desconto de lançamento"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 font-poppins">
                Tipo de Desconto *
              </label>
              <select
                value={formData.discount_type}
                onChange={(e) => setFormData({ ...formData, discount_type: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent font-poppins"
              >
                <option value="percentage">Percentual (%)</option>
                <option value="fixed">Valor Fixo (R$)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 font-poppins">
                Valor do Desconto *
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.discount_value}
                onChange={(e) => setFormData({ ...formData, discount_value: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent font-poppins"
                placeholder={formData.discount_type === 'percentage' ? '10' : '50.00'}
              />
              <p className="text-xs text-gray-500 mt-1 font-poppins">
                {formData.discount_type === 'percentage' ? 'Percentual (ex: 10 para 10%)' : 'Valor em reais'}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 font-poppins">
                Valor Mínimo de Compra
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.min_purchase_value}
                onChange={(e) => setFormData({ ...formData, min_purchase_value: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent font-poppins"
                placeholder="0.00"
              />
            </div>

            {formData.discount_type === 'percentage' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 font-poppins">
                  Valor Máximo de Desconto
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.max_discount_value}
                  onChange={(e) => setFormData({ ...formData, max_discount_value: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent font-poppins"
                  placeholder="Sem limite"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 font-poppins">
                Limite de Uso Total
              </label>
              <input
                type="number"
                value={formData.usage_limit}
                onChange={(e) => setFormData({ ...formData, usage_limit: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent font-poppins"
                placeholder="Sem limite"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 font-poppins">
                Limite de Uso por Usuário
              </label>
              <input
                type="number"
                value={formData.usage_limit_per_user}
                onChange={(e) => setFormData({ ...formData, usage_limit_per_user: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent font-poppins"
                placeholder="1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 font-poppins">
                Válido a partir de
              </label>
              <input
                type="date"
                value={formData.valid_from}
                onChange={(e) => setFormData({ ...formData, valid_from: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent font-poppins"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 font-poppins">
                Válido até
              </label>
              <input
                type="date"
                value={formData.valid_until}
                onChange={(e) => setFormData({ ...formData, valid_until: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent font-poppins"
              />
            </div>

            <div className="md:col-span-2">
              <label className="flex items-center gap-2 font-poppins">
                <input
                  type="checkbox"
                  checked={formData.applicable_to_all_plans}
                  onChange={(e) => setFormData({ ...formData, applicable_to_all_plans: e.target.checked })}
                  className="w-4 h-4 text-brand-green border-gray-300 rounded focus:ring-brand-green"
                />
                <span className="text-sm text-gray-700">Aplicável a todos os planos</span>
              </label>
            </div>

            <div className="md:col-span-2">
              <label className="flex items-center gap-2 font-poppins">
                <input
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="w-4 h-4 text-brand-green border-gray-300 rounded focus:ring-brand-green"
                />
                <span className="text-sm text-gray-700">Cupom ativo</span>
              </label>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-6 py-2 bg-brand-green text-brand-blue-900 rounded-lg hover:bg-brand-green-500 transition-colors font-semibold font-poppins font-medium"
            >
              <Save className="w-4 h-4" />
              Salvar
            </button>
            <button
              onClick={() => {
                setShowCreateForm(false);
                setEditingCoupon(null);
              }}
              className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-semibold font-poppins font-medium"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Lista de Cupons - Mobile View */}
      <div className="lg:hidden space-y-3">
        {coupons.length === 0 ? (
          <div className="text-center py-8 text-gray-500 font-poppins text-sm">
            Nenhum cupom cadastrado
          </div>
        ) : (
          coupons.map((coupon) => (
            <div key={coupon.id} className="bg-white border border-gray-200 rounded-lg p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <Tag className="w-4 h-4 text-brand-green flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-brand-blue-900 font-poppins font-medium text-sm sm:text-base">
                      {coupon.code}
                    </h3>
                    {coupon.description && (
                      <p className="text-xs text-gray-500 font-poppins mt-1">
                        {coupon.description}
                      </p>
                    )}
                  </div>
                </div>
                <span
                  className={`px-2 py-1 text-xs font-semibold rounded-full font-poppins flex-shrink-0 ${
                    coupon.is_active
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {coupon.is_active ? 'Ativo' : 'Inativo'}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs font-poppins">
                <div>
                  <span className="text-gray-500">Desconto:</span>
                  <div className="flex items-center gap-1 mt-1">
                    {coupon.discount_type === 'percentage' ? (
                      <Percent className="w-3 h-3 text-brand-green" />
                    ) : (
                      <DollarSign className="w-3 h-3 text-brand-green" />
                    )}
                    <span className="font-semibold text-brand-blue-900">
                      {coupon.discount_type === 'percentage'
                        ? `${coupon.discount_value}%`
                        : formatCurrency(coupon.discount_value)}
                    </span>
                  </div>
                </div>
                <div>
                  <span className="text-gray-500">Uso:</span>
                  <span className="ml-1 font-semibold text-brand-blue-900">
                    {coupon.total_usage || 0}
                    {coupon.usage_limit && ` / ${coupon.usage_limit}`}
                  </span>
                </div>
                <div className="col-span-2">
                  <span className="text-gray-500">Validade:</span>
                  <div className="flex items-center gap-1 mt-1">
                    <Calendar className="w-3 h-3 text-gray-400" />
                    <span className="font-semibold text-brand-blue-900">{formatDate(coupon.valid_until)}</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 pt-2 border-t border-gray-200">
                <button
                  onClick={() => handleEdit(coupon)}
                  className="flex-1 px-3 py-2 bg-brand-green text-brand-blue-900 rounded hover:bg-brand-green-500 transition-colors text-xs font-semibold font-poppins font-medium flex items-center justify-center gap-1"
                >
                  <Edit2 className="w-3 h-3" />
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(coupon.id)}
                  className="flex-1 px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors text-xs font-semibold font-poppins font-medium flex items-center justify-center gap-1"
                >
                  <Trash2 className="w-3 h-3" />
                  Deletar
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Lista de Cupons - Desktop View */}
      <div className="hidden lg:block bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-poppins font-medium">
                  Código
                </th>
                <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-poppins font-medium">
                  Desconto
                </th>
                <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-poppins font-medium">
                  Uso
                </th>
                <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-poppins font-medium">
                  Validade
                </th>
                <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-poppins font-medium">
                  Status
                </th>
                <th className="px-4 lg:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider font-poppins font-medium">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {coupons.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-500 font-poppins">
                    Nenhum cupom cadastrado
                  </td>
                </tr>
              ) : (
                coupons.map((coupon) => (
                  <tr key={coupon.id} className="hover:bg-gray-50">
                    <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Tag className="w-4 h-4 text-brand-green" />
                        <span className="font-semibold text-brand-blue-900 font-poppins font-medium">
                          {coupon.code}
                        </span>
                      </div>
                      {coupon.description && (
                        <p className="text-xs text-gray-500 font-poppins mt-1">
                          {coupon.description}
                        </p>
                      )}
                    </td>
                    <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {coupon.discount_type === 'percentage' ? (
                          <Percent className="w-4 h-4 text-brand-green" />
                        ) : (
                          <DollarSign className="w-4 h-4 text-brand-green" />
                        )}
                        <span className="font-poppins">
                          {coupon.discount_type === 'percentage'
                            ? `${coupon.discount_value}%`
                            : formatCurrency(coupon.discount_value)}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-poppins">
                      {coupon.total_usage || 0}
                      {coupon.usage_limit && ` / ${coupon.usage_limit}`}
                    </td>
                    <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-poppins">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span>{formatDate(coupon.valid_until)}</span>
                      </div>
                    </td>
                    <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full font-poppins ${
                          coupon.is_active
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {coupon.is_active ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>
                    <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(coupon)}
                          className="text-brand-green hover:text-brand-green-500 transition-colors"
                          title="Editar"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(coupon.id)}
                          className="text-red-500 hover:text-red-700 transition-colors"
                          title="Deletar"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CouponsManagement;

