import { useState, useEffect } from 'react';
import api from '../../services/api';

const ToolsManagement = () => {
  const [tools, setTools] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTools();
  }, []);

  const loadTools = async () => {
    try {
      const response = await api.get('/admin/tools');
      setTools(response.data.data.tools);
      setLoading(false);
    } catch (error) {
      console.error('Erro ao carregar ferramentas:', error);
      setLoading(false);
    }
  };

  const toggleTool = async (toolId) => {
    try {
      setLoading(true);
      const tool = tools.find(t => t.id === toolId);
      await api.put(`/admin/tools/${toolId}/toggle`, {
        enabled: !tool.enabled
      });
      await loadTools(); // Recarregar lista
      alert(`Ferramenta ${tool.enabled ? 'desativada' : 'ativada'} com sucesso!`);
    } catch (error) {
      console.error('Erro ao atualizar ferramenta:', error);
      alert(error.response?.data?.message || 'Erro ao atualizar ferramenta');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl sm:text-2xl font-bold text-brand-blue-900 font-nunito">
          Gerenciamento de Ferramentas
        </h2>
      </div>

      <div className="space-y-3">
        {tools.map((tool) => (
          <div
            key={tool.id}
            className={`p-3 sm:p-4 border-2 rounded-lg transition-colors ${
              tool.enabled
                ? 'border-green-200 bg-green-50'
                : 'border-gray-200 bg-gray-50'
            }`}
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                <span className="text-2xl sm:text-3xl flex-shrink-0">{tool.icon}</span>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base sm:text-lg font-bold text-brand-blue-900 font-nunito">
                    {tool.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 font-poppins">
                    {tool.description}
                  </p>
                  <div className="mt-1 sm:mt-2">
                    <span className={`inline-block px-2 sm:px-3 py-1 rounded-full text-xs font-semibold font-nunito ${
                      tool.enabled
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {tool.enabled ? '✓ Ativa' : '✗ Inativa'}
                    </span>
                  </div>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                <input
                  type="checkbox"
                  checked={tool.enabled}
                  onChange={() => toggleTool(tool.id)}
                  disabled={loading}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-green/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-green"></div>
              </label>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
        <p className="text-xs sm:text-sm text-blue-800 font-poppins">
          <strong>Dica:</strong> Desative ferramentas temporariamente para manutenção. Usuários não conseguirão acessar ferramentas inativas.
        </p>
      </div>
    </div>
  );
};

export default ToolsManagement;

