import { useState, useEffect, useRef, useCallback } from 'react';
import { getMClientsData, saveMClientsData } from '../services/mclientsApi';

/**
 * Hook customizado para gerenciar dados do MClients com cache e sincronização otimizada
 * - Mantém dados em memória
 * - Cache local (localStorage) para acesso rápido
 * - Sincroniza com backend apenas quando necessário (debounce + dirty flag)
 * - Carrega do backend apenas uma vez ao iniciar
 */
export const useMClientsData = () => {
  const [data, setData] = useState({
    clients: [],
    demands: [],
    payments: [],
    documents: [],
    services: [],
    tasks: [],
    pendingApprovals: [],
    timeEntries: [],
    activities: []
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const isDirtyRef = useRef(false);
  const saveTimeoutRef = useRef(null);
  const lastSaveRef = useRef(null);
  const isInitializedRef = useRef(false);

  // Carregar dados do backend (apenas uma vez)
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // Tentar carregar do cache local primeiro (para resposta instantânea)
        const cachedData = localStorage.getItem('mclients_cache');
        if (cachedData) {
          try {
            const parsed = JSON.parse(cachedData);
            const cacheTime = parsed.cacheTime || 0;
            const now = Date.now();
            
            // Se o cache tiver menos de 5 minutos, usar ele enquanto carrega do backend
            if (now - cacheTime < 5 * 60 * 1000) {
              setData(parsed.data);
              setLoading(false);
            }
          } catch (e) {
            console.warn('Erro ao ler cache:', e);
          }
        }
        
        // Carregar do backend
        const backendData = await getMClientsData();
        
        if (backendData) {
          setData(backendData);
          
          // Atualizar cache local
          localStorage.setItem('mclients_cache', JSON.stringify({
            data: backendData,
            cacheTime: Date.now()
          }));
        }
        
        isInitializedRef.current = true;
      } catch (error) {
        console.error('Erro ao carregar dados do MClients:', error);
        
        // Se falhar, tentar usar cache mesmo que antigo
        const cachedData = localStorage.getItem('mclients_cache');
        if (cachedData) {
          try {
            const parsed = JSON.parse(cachedData);
            setData(parsed.data);
          } catch (e) {
            // Ignorar erro
          }
        }
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []); // Executar apenas uma vez ao montar

  // Função para salvar dados (com debounce e dirty flag)
  const saveData = useCallback(async (newData, immediate = false) => {
    // Atualizar estado local imediatamente
    setData(newData);
    
    // Atualizar cache local imediatamente (para acesso rápido)
    localStorage.setItem('mclients_cache', JSON.stringify({
      data: newData,
      cacheTime: Date.now()
    }));
    
    // Marcar como "sujo" (precisa sincronizar com backend)
    isDirtyRef.current = true;
    
    // Limpar timeout anterior
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    
    // Se for imediato, salva já (sem timeout)
    if (immediate) {
      try {
        setSaving(true);
        await saveMClientsData(newData);
        isDirtyRef.current = false;
        lastSaveRef.current = Date.now();
      } catch (error) {
        console.error('Erro ao salvar dados:', error);
      } finally {
        setSaving(false);
      }
      return;
    }

    // Se passou mais de 30s desde o último save, salvar já
    const shouldSaveNow = lastSaveRef.current && Date.now() - lastSaveRef.current > 30000;
    if (shouldSaveNow) {
      try {
        setSaving(true);
        await saveMClientsData(newData);
        isDirtyRef.current = false;
        lastSaveRef.current = Date.now();
      } catch (error) {
        console.error('Erro ao salvar dados:', error);
      } finally {
        setSaving(false);
      }
      return;
    }

    // Caso normal: debounce curto (500ms)
    saveTimeoutRef.current = setTimeout(async () => {
      if (isDirtyRef.current) {
        try {
          setSaving(true);
          await saveMClientsData(newData);
          isDirtyRef.current = false;
          lastSaveRef.current = Date.now();
        } catch (error) {
          console.error('Erro ao salvar dados:', error);
        } finally {
          setSaving(false);
        }
      }
    }, 500);
  }, []);

  // Salvar dados pendentes antes de desmontar
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      
      // Salvar dados pendentes antes de desmontar
      if (isDirtyRef.current && isInitializedRef.current) {
        // Salvar de forma síncrona (não ideal, mas necessário)
        saveMClientsData(data).catch(console.error);
      }
    };
  }, [data, saveData]);

  // Sincronização periódica (a cada 60 segundos, se houver mudanças)
  useEffect(() => {
    if (!isInitializedRef.current) return;
    
    const interval = setInterval(() => {
      if (isDirtyRef.current) {
        saveMClientsData(data)
          .then(() => {
            isDirtyRef.current = false;
            lastSaveRef.current = Date.now();
          })
          .catch(console.error);
      }
    }, 60000); // A cada 60 segundos
    
    return () => clearInterval(interval);
  }, [data]);

  // Função para atualizar estado sem salvar (útil após DELETE)
  const setDataSilent = useCallback((newData) => {
    setData(newData);
    // Atualizar cache local também
    localStorage.setItem('mclients_cache', JSON.stringify({
      data: newData,
      cacheTime: Date.now()
    }));
    // NÃO marcar como dirty, NÃO salvar no backend
  }, []);

  // Função para recarregar dados do backend
  const refreshData = useCallback(async () => {
    try {
      setLoading(true);
      const backendData = await getMClientsData();
      if (backendData) {
        setData(backendData);
        // Atualizar cache local
        localStorage.setItem('mclients_cache', JSON.stringify({
          data: backendData,
          cacheTime: Date.now()
        }));
      }
    } catch (error) {
      console.error('Erro ao recarregar dados do MClients:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    data,
    setData: saveData, // Substituir setData pela função saveData
    setDataSilent, // Atualizar sem salvar (para uso após DELETE)
    refreshData, // Recarregar dados do backend
    loading,
    saving,
    isDirty: isDirtyRef.current
  };
};

