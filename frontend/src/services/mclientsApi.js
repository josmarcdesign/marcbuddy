import axios from 'axios';

// Usar sempre rota relativa para aproveitar proxy do Vite/NGINX e evitar problemas http/https
const api = axios.create({
  baseURL: '/api/mclients',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para adicionar token de autenticação
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Obter todos os dados do MClients
export const getMClientsData = async () => {
  try {
    const response = await api.get('/data');
    return response.data;
  } catch (error) {
    console.error('Erro ao obter dados do MClients:', error?.response?.data || error);
    // Propagar erro para que o hook use cache ou trate autenticação
    throw error;
  }
};

// Salvar todos os dados do MClients
export const saveMClientsData = async (data) => {
  try {
    const response = await api.post('/data', data);
    return response.data;
  } catch (error) {
    console.error('Erro ao salvar dados do MClients:', error);
    throw error;
  }
};

// Remover Cliente
export const deleteClientApi = async (id) => {
  try {
    const response = await api.delete(`/clients/${id}`);
    // DELETE retorna 204 No Content, então response.data pode ser vazio
    return response.data || { success: true, message: 'Cliente removido' };
  } catch (error) {
    console.error('Erro ao remover cliente:', error);
    throw error;
  }
};


