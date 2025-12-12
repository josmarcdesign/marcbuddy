import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { PLANS } from '../config/plans'; // Fallback

const PlansContext = createContext();

export const usePlans = () => {
  const context = useContext(PlansContext);
  if (!context) {
    throw new Error('usePlans deve ser usado dentro de PlansProvider');
  }
  return context;
};

export const PlansProvider = ({ children }) => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadPlans = async () => {
    try {
      setLoading(true);
      // Usar endpoint público de planos
      const response = await api.get('/plans');
      const plansData = response.data.data.plans;
      
      // Converter para o formato esperado pelo frontend
      const formattedPlans = plansData.reduce((acc, plan) => {
        acc[plan.id] = {
          id: plan.id,
          name: plan.plan_name,
          price: parseFloat(plan.monthly_price || 0),
          priceAnnual: parseFloat(plan.annual_price || 0),
          priceAnnualMonthly: null, // Campo não existe no banco
          annualDiscountPercentage: parseFloat(plan.annual_savings_percentage || 0),
          biennialDiscountPercentage: null, // Campo não existe no banco
          triennialDiscountPercentage: null, // Campo não existe no banco
          period: 'mês',
          description: plan.plan_description || '',
          features: plan.features_list || [],
          popular: plan.is_popular || false,
          featured: plan.is_featured || false,
          freeTrial: plan.trial_days > 0,
          freeTrialDays: plan.trial_days || null,
          maxUsers: plan.max_users,
          maxProjects: plan.max_projects,
          maxStorageGb: parseFloat(plan.max_storage_gb || 0),
          supportLevel: 'community', // Campo não existe no banco
          color: plan.id === 'classic' ? 'blue' : plan.id === 'pro' ? 'purple' : plan.id === 'team' ? 'gold' : 'gray'
        };
        return acc;
      }, {});
      
      setPlans(formattedPlans);
      setError(null);
    } catch (error) {
      console.error('Erro ao carregar planos do backend:', error);
      // Fallback para planos do config
      setPlans(PLANS);
      setError('Erro ao carregar planos, usando valores padrão');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPlans();
  }, []);

  const getPlanById = (id) => {
    return plans[id] || null;
  };

  const getAllPlans = () => {
    return Object.values(plans);
  };

  const refreshPlans = () => {
    loadPlans();
  };

  return (
    <PlansContext.Provider value={{
      plans,
      loading,
      error,
      getPlanById,
      getAllPlans,
      refreshPlans
    }}>
      {children}
    </PlansContext.Provider>
  );
};

