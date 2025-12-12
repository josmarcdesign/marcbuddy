import { BarChart3, TrendingUp, AlertCircle, Timer, CheckCircle2, History } from 'lucide-react';

const Dashboard = ({ 
  clients, 
  demands, 
  payments, 
  timeEntries, 
  activities,
  setActiveTab,
  setDemandView 
}) => {
  return (
    <div>
      <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6 font-poppins">Dashboard</h2>
      
      {/* Cards de Métricas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
        <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs sm:text-sm text-gray-600 font-poppins">Receita Total</span>
            <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
          </div>
          <div className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 font-poppins">
            R$ {payments.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0).toFixed(2).replace('.', ',')}
          </div>
          <div className="text-xs text-gray-500 mt-1 font-poppins">Este mês</div>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs sm:text-sm text-gray-600 font-poppins">Pendente</span>
            <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />
          </div>
          <div className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 font-poppins">
            R$ {payments.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0).toFixed(2).replace('.', ',')}
          </div>
          <div className="text-xs text-gray-500 mt-1 font-poppins">{payments.filter(p => p.status === 'pending').length} pagamentos</div>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs sm:text-sm text-gray-600 font-poppins">Horas Trabalhadas</span>
            <Timer className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
          </div>
          <div className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 font-poppins">
            {timeEntries.reduce((sum, t) => sum + t.hours, 0).toFixed(1)}h
          </div>
          <div className="text-xs text-gray-500 mt-1 font-poppins">Este mês</div>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs sm:text-sm text-gray-600 font-poppins">Taxa de Conclusão</span>
            <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
          </div>
          <div className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 font-poppins">
            {demands.length > 0 ? Math.round((demands.filter(d => d.status === 'completed').length / demands.length) * 100) : 0}%
          </div>
          <div className="text-xs text-gray-500 mt-1 font-poppins">{demands.filter(d => d.status === 'completed').length} de {demands.length}</div>
        </div>
      </div>

      {/* Gráficos e Listas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
        {/* Demandas por Status */}
        <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 font-poppins">Demandas por Status</h3>
          <div className="space-y-3">
            {['pending', 'in_progress', 'completed', 'cancelled'].map(status => {
              const count = demands.filter(d => d.status === status).length;
              const percentage = demands.length > 0 ? (count / demands.length) * 100 : 0;
              const statusLabels = {
                pending: 'Pendente',
                in_progress: 'Em Andamento',
                completed: 'Concluída',
                cancelled: 'Cancelada'
              };
              return (
                <div 
                  key={status}
                  onClick={() => {
                    setActiveTab('pipeline');
                    setDemandView('kanban');
                    // Scroll para a coluna específica após um pequeno delay
                    setTimeout(() => {
                      const column = document.querySelector(`[data-status="${status}"]`);
                      if (column) {
                        column.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                        // Destacar a coluna
                        column.style.transform = 'scale(1.02)';
                        column.style.transition = 'transform 0.3s';
                        setTimeout(() => {
                          column.style.transform = 'scale(1)';
                        }, 500);
                      }
                    }, 100);
                  }}
                  className="cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors -m-2"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-600 font-poppins">
                      {statusLabels[status]}
                    </span>
                    <span className="text-sm font-semibold text-gray-900 font-poppins">{count}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all ${
                        status === 'pending' ? 'bg-yellow-500' : 
                        status === 'in_progress' ? 'bg-blue-500' : 
                        status === 'completed' ? 'bg-green-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Atividades Recentes */}
        <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 font-poppins">Atividades Recentes</h3>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {activities.slice(0, 5).map(activity => (
              <div key={activity.id} className="flex items-start gap-3 pb-3 border-b border-gray-100 last:border-0">
                <History className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900 font-poppins">{activity.description}</p>
                  <p className="text-xs text-gray-500 font-poppins">
                    {new Date(activity.createdAt).toLocaleString('pt-BR')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Origem dos Leads */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 font-poppins">Origem dos Leads</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          {['instagram', 'facebook', 'google', 'indicacao', 'outros'].map(source => {
            const count = clients.filter(c => c.leadSource === source).length;
            const percentage = clients.length > 0 ? (count / clients.length) * 100 : 0;
            const sourceLabels = {
              instagram: 'Instagram',
              facebook: 'Facebook',
              google: 'Google',
              indicacao: 'Indicação',
              outros: 'Outros'
            };
            return (
              <div key={source} className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-lg sm:text-xl font-bold text-gray-900 font-poppins">{count}</div>
                <div className="text-xs text-gray-600 font-poppins">{sourceLabels[source]}</div>
                <div className="text-xs text-gray-500 font-poppins mt-1">{percentage.toFixed(0)}%</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

