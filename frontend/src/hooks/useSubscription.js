import { useState, useEffect } from 'react';
import subscriptionService from '../services/subscription.service';

export const useSubscription = () => {
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadSubscription();
  }, []);

  const loadSubscription = async () => {
    try {
      setLoading(true);
      const response = await subscriptionService.getActive();
      setSubscription(response.data.subscription);
      setError(null);
    } catch (err) {
      setSubscription(null);
      setError(err.response?.data?.message || 'Erro ao carregar assinatura');
    } finally {
      setLoading(false);
    }
  };

  return { subscription, loading, error, refetch: loadSubscription };
};

