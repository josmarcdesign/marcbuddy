import { useState, useEffect } from 'react';
import api from '../../services/api';
import { PaymentIcon } from '../../utils/paymentIcons';

const PaymentMethodsManagement = () => {
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingMethod, setEditingMethod] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    enabled: true,
    icon: '',
    description: '',
    max_installments: 1,
    min_installment_value: 0,
    fee_percentage: 0,
    fee_fixed: 0,
    accepts_credit: false,
    accepts_debit: false,
    code: ''
  });

  useEffect(() => {
    loadPaymentMethods();
  }, []);

  const loadPaymentMethods = async () => {
    try {
      const response = await api.get('/admin/payment-methods');
      setPaymentMethods(response.data.data.paymentMethods || []);
      setLoading(false);
    } catch (error) {
      console.error('Erro ao carregar formas de pagamento:', error);
      setPaymentMethods([]); // Garantir array vazio em caso de erro
      alert('Erro ao carregar formas de pagamento. Verifique se você tem permissão de admin.');
      setLoading(false);
    }
  };

  const handleEdit = (method) => {
    setEditingMethod(method.id);
    setFormData({
      name: method.name || '',
      enabled: method.enabled !== undefined ? method.enabled : true,
      icon: method.icon || '',
      description: method.description || '',
      max_installments: method.max_installments || 1,
      min_installment_value: method.min_installment_value || 0,
      fee_percentage: method.fee_percentage || 0,
      fee_fixed: method.fee_fixed || 0,
      accepts_credit: method.accepts_credit || false,
      accepts_debit: method.accepts_debit || false,
      code: method.code || ''
    });
  };

  const handleCancelEdit = () => {
    setEditingMethod(null);
    setFormData({
      name: '',
      enabled: true,
      icon: '',
      description: '',
      max_installments: 1,
      min_installment_value: 0,
      fee_percentage: 0,
      fee_fixed: 0,
      accepts_credit: false,
      accepts_debit: false,
      code: ''
    });
  };

  const handleSave = async (methodId) => {
    try {
      setLoading(true);
      await api.put(`/admin/payment-methods/${methodId}`, formData);
      await loadPaymentMethods();
      setEditingMethod(null);
      alert('Forma de pagamento atualizada com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar forma de pagamento:', error);
      alert(error.response?.data?.message || 'Erro ao salvar forma de pagamento');
    } finally {
      setLoading(false);
    }
  };

  const togglePaymentMethod = async (methodId) => {
    try {
      setLoading(true);
      const method = paymentMethods.find(m => m.id === methodId);
      await api.put(`/admin/payment-methods/${methodId}/toggle`, {
        enabled: !method.enabled
      });
      await loadPaymentMethods();
    } catch (error) {
      console.error('Erro ao atualizar forma de pagamento:', error);
      alert(error.response?.data?.message || 'Erro ao atualizar forma de pagamento');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value || 0);
  };

  if (loading && paymentMethods.length === 0) {
    return <div className="text-center py-8 font-poppins">Carregando formas de pagamento...</div>;
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl sm:text-2xl font-bold text-brand-blue-900 font-poppins font-medium">
          Formas de Pagamento
        </h2>
      </div>

      <div className="space-y-3 sm:space-y-4">
        {paymentMethods.map((method) => (
          <div
            key={method.id}
            className={`p-3 sm:p-4 lg:p-6 border-2 rounded-lg transition-all ${
              editingMethod === method.id
                ? 'border-brand-green bg-green-50'
                : 'border-gray-200 hover:border-brand-green/50'
            }`}
          >
            {editingMethod === method.id ? (
              // Modo de edição
              <div className="space-y-3 sm:space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 font-poppins">
                      Nome
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent font-poppins"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 font-poppins">
                      Código da Forma de Pagamento
                    </label>
                    <input
                      type="text"
                      value={formData.code || ''}
                      onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent font-poppins"
                      placeholder="pix, credit_card, debit_card, etc."
                      disabled
                    />
                    <p className="text-xs text-gray-500 mt-1 font-poppins">
                      O ícone é determinado automaticamente pelo código
                    </p>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2 font-poppins">
                      Descrição
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={2}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent font-poppins"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 font-poppins">
                      Máximo de Parcelas
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="24"
                      value={formData.max_installments}
                      onChange={(e) => setFormData({ ...formData, max_installments: parseInt(e.target.value) || 1 })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent font-poppins"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 font-poppins">
                      Valor Mínimo da Parcela (R$)
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.min_installment_value}
                      onChange={(e) => setFormData({ ...formData, min_installment_value: parseFloat(e.target.value) || 0 })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent font-poppins"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 font-poppins">
                      Taxa Percentual (%)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="0.01"
                      value={formData.fee_percentage}
                      onChange={(e) => setFormData({ ...formData, fee_percentage: parseFloat(e.target.value) || 0 })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent font-poppins"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 font-poppins">
                      Taxa Fixa (R$)
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.fee_fixed}
                      onChange={(e) => setFormData({ ...formData, fee_fixed: parseFloat(e.target.value) || 0 })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent font-poppins"
                    />
                  </div>

                  <div className="flex items-center gap-6">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.accepts_credit}
                        onChange={(e) => setFormData({ ...formData, accepts_credit: e.target.checked })}
                        className="w-4 h-4 text-brand-green border-gray-300 rounded focus:ring-brand-green"
                      />
                      <span className="ml-2 text-sm text-gray-700 font-poppins">Aceita Crédito</span>
                    </label>

                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.accepts_debit}
                        onChange={(e) => setFormData({ ...formData, accepts_debit: e.target.checked })}
                        className="w-4 h-4 text-brand-green border-gray-300 rounded focus:ring-brand-green"
                      />
                      <span className="ml-2 text-sm text-gray-700 font-poppins">Aceita Débito</span>
                    </label>

                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.enabled}
                        onChange={(e) => setFormData({ ...formData, enabled: e.target.checked })}
                        className="w-4 h-4 text-brand-green border-gray-300 rounded focus:ring-brand-green"
                      />
                      <span className="ml-2 text-sm text-gray-700 font-poppins">Ativo</span>
                    </label>
                  </div>
                </div>

                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => handleSave(method.id)}
                    disabled={loading}
                    className="px-6 py-2 bg-brand-green text-brand-blue-900 rounded-lg hover:bg-brand-green-500 transition-colors font-semibold font-poppins font-medium disabled:opacity-50"
                  >
                    Salvar
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    disabled={loading}
                    className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-semibold font-poppins font-medium disabled:opacity-50"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            ) : (
              // Modo de visualização
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
                <div className="flex items-start gap-3 sm:gap-4 flex-1 w-full sm:w-auto">
                  <div className="flex-shrink-0">
                    <PaymentIcon code={method.code} className="w-10 h-10 sm:w-12 sm:h-12 text-brand-blue-900" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                      <h3 className="text-base sm:text-lg font-bold text-brand-blue-900 font-poppins font-medium">
                        {method.name}
                      </h3>
                      <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-semibold font-poppins font-medium w-fit ${
                        method.enabled
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {method.enabled ? 'Ativo' : 'Inativo'}
                      </span>
                    </div>
                    {method.description && (
                      <p className="text-xs sm:text-sm text-gray-600 font-poppins mb-2 sm:mb-3">
                        {method.description}
                      </p>
                    )}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 text-xs sm:text-sm font-poppins">
                      <div>
                        <span className="text-gray-500">Máx. Parcelas:</span>
                        <span className="ml-2 font-semibold text-brand-blue-900">{method.max_installments}x</span>
                      </div>
                      {method.min_installment_value > 0 && (
                        <div>
                          <span className="text-gray-500">Valor Mín. Parcela:</span>
                          <span className="ml-2 font-semibold text-brand-blue-900">
                            {formatCurrency(method.min_installment_value)}
                          </span>
                        </div>
                      )}
                      {method.fee_percentage > 0 && (
                        <div>
                          <span className="text-gray-500">Taxa %:</span>
                          <span className="ml-2 font-semibold text-brand-blue-900">
                            {method.fee_percentage}%
                          </span>
                        </div>
                      )}
                      {method.fee_fixed > 0 && (
                        <div>
                          <span className="text-gray-500">Taxa Fixa:</span>
                          <span className="ml-2 font-semibold text-brand-blue-900">
                            {formatCurrency(method.fee_fixed)}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex gap-4 mt-3 text-xs text-gray-600 font-poppins">
                      {method.accepts_credit && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded">Crédito</span>
                      )}
                      {method.accepts_debit && (
                        <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded">Débito</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-between sm:justify-end sm:ml-4">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={method.enabled}
                      onChange={() => togglePaymentMethod(method.id)}
                      disabled={loading}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-green/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-green"></div>
                  </label>
                  <button
                    onClick={() => handleEdit(method)}
                    className="px-3 sm:px-4 py-1.5 sm:py-2 bg-brand-blue-900 text-white rounded-lg hover:bg-brand-blue-800 transition-colors font-semibold font-poppins font-medium text-xs sm:text-sm"
                  >
                    Editar
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
        <p className="text-sm text-blue-800 font-poppins">
          <strong>Dica:</strong> Configure as taxas e limites de parcelas para cada forma de pagamento. Apenas formas de pagamento ativas estarão disponíveis para os usuários durante o checkout.
        </p>
      </div>
    </div>
  );
};

export default PaymentMethodsManagement;
