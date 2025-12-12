import { useState, useEffect } from 'react';
import api from '../../services/api';
import { usePlans } from '../../contexts/PlansContext';

const PlansManagement = () => {
  const { getAllPlans, refreshPlans } = usePlans();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingPlan, setEditingPlan] = useState(null);
  const [formData, setFormData] = useState({
    price: '',
    priceAnnual: '',
    priceAnnualMonthly: '',
    annualDiscountPercentage: '',
    biennialDiscountPercentage: '',
    triennialDiscountPercentage: '',
    isActive: true,
    isAvailable: true,
    maxUsers: '',
    sortOrder: 0,
    maxProjects: '',
    maxStorageGb: '',
    supportLevel: 'community',
    apiAccess: false,
    customDomain: false,
    whiteLabel: false
  });

  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = async () => {
    try {
      const response = await api.get('/admin/plans/all');

      // Transformar dados do banco para o formato esperado pelo componente
      const transformedPlans = response.data.data.plans.map(plan => ({
        id: plan.id,
        name: plan.plan_name,
        price: parseFloat(plan.monthly_price || 0),
        priceAnnual: parseFloat(plan.annual_price || 0),
        priceAnnualMonthly: null, // Campo não existe no banco
        annualDiscountPercentage: parseFloat(plan.annual_savings_percentage || 0),
        biennialDiscountPercentage: null, // Campo não existe no banco
        triennialDiscountPercentage: null, // Campo não existe no banco
        isActive: plan.plan_status === 'active',
        isAvailable: true, // Campo não existe, default true
        maxUsers: plan.max_users,
        sortOrder: plan.sort_order || 0,
        maxProjects: plan.max_projects,
        maxStorageGb: parseFloat(plan.max_storage_gb || 0),
        supportLevel: 'community', // Campo não existe, default community
        apiAccess: false, // Campo não existe, default false
        customDomain: false, // Campo não existe, default false
        whiteLabel: false, // Campo não existe, default false
        description: plan.plan_description || '',
        features: plan.features_list || [],
        currentUsers: 0 // TODO: implementar contagem de usuários por plano
      }));

      setPlans(transformedPlans);
      setLoading(false);
    } catch (error) {
      console.error('Erro ao carregar planos:', error);
      // Fallback para planos do contexto
      setPlans(getAllPlans());
      setLoading(false);
    }
  };

  const handleEdit = (plan) => {
    setEditingPlan(plan.id);
    setFormData({
      price: plan.price,
      priceAnnual: plan.priceAnnual || '',
      priceAnnualMonthly: plan.priceAnnualMonthly || '',
      annualDiscountPercentage: plan.annualDiscountPercentage || '',
      biennialDiscountPercentage: plan.biennialDiscountPercentage || '',
      triennialDiscountPercentage: plan.triennialDiscountPercentage || '',
      isActive: plan.isActive !== undefined ? plan.isActive : true,
      isAvailable: plan.isAvailable !== undefined ? plan.isAvailable : true,
      maxUsers: plan.maxUsers || '',
      sortOrder: plan.sortOrder || 0,
      maxProjects: plan.maxProjects || '',
      maxStorageGb: plan.maxStorageGb || '',
      supportLevel: plan.supportLevel || 'community',
      apiAccess: plan.apiAccess || false,
      customDomain: plan.customDomain || false,
      whiteLabel: plan.whiteLabel || false
    });
  };

  // Calcula os valores sugeridos baseados no preço mensal
  const calculateSuggestedPrices = (monthlyPrice) => {
    if (!monthlyPrice || monthlyPrice <= 0) {
      return {
        priceAnnual: '',
        priceAnnualMonthly: ''
      };
    }

    // Preço anual = 10 meses (2 meses grátis)
    const annualPrice = monthlyPrice * 10;
    // Preço mensal equivalente = anual / 12
    const annualMonthlyPrice = annualPrice / 12;

    return {
      priceAnnual: parseFloat(annualPrice.toFixed(2)),
      priceAnnualMonthly: parseFloat(annualMonthlyPrice.toFixed(2))
    };
  };

  const handleMonthlyPriceChange = (value) => {
    const monthlyPrice = parseFloat(value) || 0;
    const suggested = calculateSuggestedPrices(monthlyPrice);
    
    setFormData({
      ...formData,
      price: monthlyPrice,
      priceAnnual: suggested.priceAnnual || formData.priceAnnual,
      priceAnnualMonthly: suggested.priceAnnualMonthly || formData.priceAnnualMonthly,
    });
  };

  const handleSave = async (planId) => {
    try {
      // Preparar dados, convertendo strings vazias para null ou undefined
      const dataToSend = {
        price: formData.price ? parseFloat(formData.price) : undefined,
        priceAnnual: formData.priceAnnual ? parseFloat(formData.priceAnnual) : undefined,
        priceAnnualMonthly: formData.priceAnnualMonthly ? parseFloat(formData.priceAnnualMonthly) : undefined,
        annualDiscountPercentage: formData.annualDiscountPercentage && formData.annualDiscountPercentage !== '' ? parseFloat(formData.annualDiscountPercentage) : null,
        biennialDiscountPercentage: formData.biennialDiscountPercentage && formData.biennialDiscountPercentage !== '' ? parseFloat(formData.biennialDiscountPercentage) : null,
        triennialDiscountPercentage: formData.triennialDiscountPercentage && formData.triennialDiscountPercentage !== '' ? parseFloat(formData.triennialDiscountPercentage) : null,
        isActive: formData.isActive,
        isAvailable: formData.isAvailable,
        maxUsers: formData.maxUsers && formData.maxUsers !== '' ? parseInt(formData.maxUsers) : null,
        maxProjects: formData.maxProjects && formData.maxProjects !== '' ? parseInt(formData.maxProjects) : null,
        maxStorageGb: formData.maxStorageGb && formData.maxStorageGb !== '' ? parseFloat(formData.maxStorageGb) : null,
        sortOrder: parseInt(formData.sortOrder) || 0,
        supportLevel: formData.supportLevel,
        apiAccess: formData.apiAccess,
        customDomain: formData.customDomain,
        whiteLabel: formData.whiteLabel
      };
      
      // Remover campos undefined para não enviá-los
      Object.keys(dataToSend).forEach(key => {
        if (dataToSend[key] === undefined) {
          delete dataToSend[key];
        }
      });
      
      await api.put(`/admin/plans/${planId}`, dataToSend);
      await loadPlans(); // Recarregar planos do admin
      refreshPlans(); // Atualizar contexto global de planos
      setEditingPlan(null);
      alert('Plano atualizado com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar plano:', error);
      const errorMessage = error.response?.data?.errors 
        ? error.response.data.errors.map(e => e.msg).join(', ')
        : error.response?.data?.message || 'Erro ao salvar plano';
      alert(errorMessage);
    }
  };

  const handleCancel = () => {
    setEditingPlan(null);
    setFormData({
      price: '',
      priceAnnual: '',
      priceAnnualMonthly: '',
      annualDiscountPercentage: '',
      biennialDiscountPercentage: '',
      triennialDiscountPercentage: '',
      isActive: true,
      isAvailable: true,
      maxUsers: '',
      sortOrder: 0,
      maxProjects: '',
      maxStorageGb: '',
      supportLevel: 'community',
      apiAccess: false,
      customDomain: false,
      whiteLabel: false
    });
  };

  if (loading) {
    return <div className="text-center py-8 font-poppins">Carregando...</div>;
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl sm:text-2xl font-bold text-brand-blue-900 font-poppins font-medium">
          Gerenciamento de Planos
        </h2>
      </div>

      <div className="space-y-3 sm:space-y-4">
        {plans.length === 0 ? (
          <div className="text-center py-8 text-gray-500 font-poppins">
            Nenhum plano encontrado
          </div>
        ) : (
          plans.map((plan) => (
          <div
            key={plan.id}
            className="border-2 border-gray-200 rounded-lg p-3 sm:p-4 lg:p-6 hover:border-brand-green transition-colors"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 mb-3 sm:mb-4">
              <div className="flex-1">
                <h3 className="text-lg sm:text-xl font-bold text-brand-blue-900 mb-1 font-poppins font-medium">
                  {plan.name}
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 font-poppins">{plan.description}</p>
              </div>
              {editingPlan !== plan.id && (
                <button
                  onClick={() => handleEdit(plan)}
                  className="px-3 sm:px-4 py-1.5 sm:py-2 bg-brand-green text-brand-blue-900 rounded-lg hover:bg-brand-green-500 transition-colors font-semibold font-poppins font-medium text-xs sm:text-sm w-full sm:w-auto"
                >
                  Editar
                </button>
              )}
            </div>

            {/* Informações do plano */}
            {!editingPlan || editingPlan !== plan.id ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-3 sm:mb-4">
                <div>
                  <div className="text-xs text-gray-600 font-poppins mb-1">Preço Mensal</div>
                  <div className="text-base font-bold text-brand-blue-900 font-poppins font-medium">
                    R$ {plan.price?.toFixed(2) || '0.00'}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-600 font-poppins mb-1">Usuários</div>
                  <div className="text-base font-bold text-brand-blue-900 font-poppins font-medium">
                    {plan.currentUsers || 0} / {plan.maxUsers ? plan.maxUsers : '∞'}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-600 font-poppins mb-1">Status</div>
                  <div className="flex gap-2">
                    <span className={`px-2 py-1 text-xs rounded font-poppins ${
                      plan.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {plan.isActive ? 'Ativo' : 'Inativo'}
                    </span>
                    <span className={`px-2 py-1 text-xs rounded font-poppins ${
                      plan.isAvailable ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {plan.isAvailable ? 'Disponível' : 'Indisponível'}
                    </span>
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-600 font-poppins mb-1">Suporte</div>
                  <div className="text-sm font-semibold text-brand-blue-900 font-poppins capitalize">
                    {plan.supportLevel || 'community'}
                  </div>
                </div>
              </div>
            ) : null}

            {editingPlan === plan.id ? (
              <div className="space-y-3 sm:space-y-4">
                {/* Preços */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 font-poppins">
                      Preço Mensal (R$)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => handleMonthlyPriceChange(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent font-poppins"
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 font-poppins">
                      Preço Anual (R$)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.priceAnnual}
                      onChange={(e) => setFormData({ ...formData, priceAnnual: parseFloat(e.target.value) || 0 })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent font-poppins"
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 font-poppins">
                      Preço Mensal Equivalente (R$)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.priceAnnualMonthly}
                      onChange={(e) => setFormData({ ...formData, priceAnnualMonthly: parseFloat(e.target.value) || 0 })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent font-poppins"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                {/* Descontos */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 font-poppins">
                      Desconto Anual (%)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      max="100"
                      value={formData.annualDiscountPercentage}
                      onChange={(e) => setFormData({ ...formData, annualDiscountPercentage: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent font-poppins"
                      placeholder="Ex: 16.67"
                    />
                    <p className="text-xs text-gray-500 mt-1 font-poppins">Ex: 16.67% = 2 meses grátis</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 font-poppins">
                      Desconto 2 Anos (%)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      max="100"
                      value={formData.biennialDiscountPercentage}
                      onChange={(e) => setFormData({ ...formData, biennialDiscountPercentage: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent font-poppins"
                      placeholder="Ex: 25.00"
                    />
                    <p className="text-xs text-gray-500 mt-1 font-poppins">Desconto para plano de 2 anos</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 font-poppins">
                      Desconto 3 Anos (%)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      max="100"
                      value={formData.triennialDiscountPercentage}
                      onChange={(e) => setFormData({ ...formData, triennialDiscountPercentage: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent font-poppins"
                      placeholder="Ex: 30.00"
                    />
                    <p className="text-xs text-gray-500 mt-1 font-poppins">Desconto para plano de 3 anos</p>
                  </div>
                </div>

                {/* Configurações Gerais */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 font-poppins">
                      Limite de Usuários
                    </label>
                    <input
                      type="number"
                      value={formData.maxUsers}
                      onChange={(e) => setFormData({ ...formData, maxUsers: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent font-poppins"
                      placeholder="Ilimitado (deixe vazio)"
                    />
                    <p className="text-xs text-gray-500 mt-1 font-poppins">Deixe vazio para ilimitado</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 font-poppins">
                      Limite de Projetos
                    </label>
                    <input
                      type="number"
                      value={formData.maxProjects}
                      onChange={(e) => setFormData({ ...formData, maxProjects: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent font-poppins"
                      placeholder="Ilimitado (deixe vazio)"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 font-poppins">
                      Armazenamento (GB)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.maxStorageGb}
                      onChange={(e) => setFormData({ ...formData, maxStorageGb: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent font-poppins"
                      placeholder="Ilimitado (deixe vazio)"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 font-poppins">
                      Ordem de Exibição
                    </label>
                    <input
                      type="number"
                      value={formData.sortOrder}
                      onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value) || 0 })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent font-poppins"
                    />
                  </div>
                </div>

                {/* Nível de Suporte */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 font-poppins">
                    Nível de Suporte
                  </label>
                  <select
                    value={formData.supportLevel}
                    onChange={(e) => setFormData({ ...formData, supportLevel: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent font-poppins"
                  >
                    <option value="community">Comunidade</option>
                    <option value="email">Email</option>
                    <option value="priority">Prioritário</option>
                    <option value="dedicated">Dedicado</option>
                  </select>
                </div>

                {/* Checkboxes */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <label className="flex items-center gap-2 font-poppins">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                      className="w-4 h-4 text-brand-green border-gray-300 rounded focus:ring-brand-green"
                    />
                    <span className="text-sm text-gray-700">Plano Ativo</span>
                  </label>
                  <label className="flex items-center gap-2 font-poppins">
                    <input
                      type="checkbox"
                      checked={formData.isAvailable}
                      onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
                      className="w-4 h-4 text-brand-green border-gray-300 rounded focus:ring-brand-green"
                    />
                    <span className="text-sm text-gray-700">Disponível para Novos Usuários</span>
                  </label>
                  <label className="flex items-center gap-2 font-poppins">
                    <input
                      type="checkbox"
                      checked={formData.customDomain}
                      onChange={(e) => setFormData({ ...formData, customDomain: e.target.checked })}
                      className="w-4 h-4 text-brand-green border-gray-300 rounded focus:ring-brand-green"
                    />
                    <span className="text-sm text-gray-700">Domínio Customizado</span>
                  </label>
                  <label className="flex items-center gap-2 font-poppins">
                    <input
                      type="checkbox"
                      checked={formData.whiteLabel}
                      onChange={(e) => setFormData({ ...formData, whiteLabel: e.target.checked })}
                      className="w-4 h-4 text-brand-green border-gray-300 rounded focus:ring-brand-green"
                    />
                    <span className="text-sm text-gray-700">White Label</span>
                  </label>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => handleSave(plan.id)}
                    className="px-6 py-2 bg-brand-green text-brand-blue-900 rounded-lg hover:bg-brand-green-500 transition-colors font-semibold font-poppins font-medium"
                  >
                    Salvar
                  </button>
                  <button
                    onClick={handleCancel}
                    className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-semibold font-poppins font-medium"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        ))
        )}
      </div>
    </div>
  );
};

export default PlansManagement;

