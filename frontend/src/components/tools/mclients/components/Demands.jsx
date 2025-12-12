import { Plus, Trash2, CalendarIcon } from 'lucide-react';

const Demands = ({
  demands,
  clients,
  onNewDemand,
  onUpdateStatus,
  onDelete,
  getStatusColor,
  getPriorityColor
}) => {
  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 mb-4 sm:mb-8">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 font-poppins">Demandas</h2>
        <button
          onClick={onNewDemand}
          className="w-full sm:w-auto bg-gray-900 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 font-poppins"
        >
          <Plus className="w-4 h-4" />
          Nova Demanda
        </button>
      </div>

      <div className="space-y-3">
        {demands.map(demand => {
          const client = clients.find(c => c.id === demand.clientId);
          return (
            <div key={demand.id} className="bg-white border border-gray-200 rounded-lg p-4 md:p-5 hover:border-gray-300 transition-colors">
              {/* Mobile: Layout em coluna */}
              <div className="md:hidden">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-base font-semibold text-gray-900 font-poppins flex-1 mr-2">{demand.title}</h3>
                  <button
                    onClick={() => onDelete(demand.id)}
                    className="text-gray-400 hover:text-red-500 p-1.5 rounded transition-colors flex-shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex items-center gap-2 mb-3 flex-wrap">
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(demand.status)} font-poppins`}>
                    {demand.status === 'pending' ? 'Pendente' : demand.status === 'in_progress' ? 'Em Andamento' : 'Concluída'}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${getPriorityColor(demand.priority)} font-poppins`}>
                    {demand.priority === 'high' ? 'Alta' : demand.priority === 'medium' ? 'Média' : 'Baixa'}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-3 font-poppins">{demand.description}</p>
                <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                  <span className="font-poppins">{client?.name}</span>
                  {demand.dueDate && (
                    <span className="font-poppins flex items-center gap-1">
                      <CalendarIcon className="w-3.5 h-3.5" />
                      {new Date(demand.dueDate).toLocaleDateString('pt-BR')}
                    </span>
                  )}
                </div>
                <select
                  value={demand.status}
                  onChange={(e) => onUpdateStatus(demand.id, e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-transparent font-poppins text-gray-700"
                >
                  <option value="pending">Pendente</option>
                  <option value="in_progress">Em Andamento</option>
                  <option value="completed">Concluída</option>
                  <option value="cancelled">Cancelada</option>
                </select>
              </div>

              {/* Desktop: Layout original em linha */}
              <div className="hidden md:flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <h3 className="text-base font-semibold text-gray-900 font-poppins">{demand.title}</h3>
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(demand.status)} font-poppins`}>
                      {demand.status === 'pending' ? 'Pendente' : demand.status === 'in_progress' ? 'Em Andamento' : 'Concluída'}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${getPriorityColor(demand.priority)} font-poppins`}>
                      {demand.priority === 'high' ? 'Alta' : demand.priority === 'medium' ? 'Média' : 'Baixa'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3 font-poppins">{demand.description}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span className="font-poppins">{client?.name}</span>
                    {demand.dueDate && (
                      <span className="font-poppins flex items-center gap-1">
                        <CalendarIcon className="w-3.5 h-3.5" />
                        {new Date(demand.dueDate).toLocaleDateString('pt-BR')}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-4 flex-shrink-0">
                  <select
                    value={demand.status}
                    onChange={(e) => onUpdateStatus(demand.id, e.target.value)}
                    className="px-3 py-1.5 bg-white border border-gray-200 rounded text-xs focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-transparent font-poppins text-gray-700"
                  >
                    <option value="pending">Pendente</option>
                    <option value="in_progress">Em Andamento</option>
                    <option value="completed">Concluída</option>
                    <option value="cancelled">Cancelada</option>
                  </select>
                  <button
                    onClick={() => onDelete(demand.id)}
                    className="text-gray-400 hover:text-red-500 p-1.5 rounded transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Demands;

