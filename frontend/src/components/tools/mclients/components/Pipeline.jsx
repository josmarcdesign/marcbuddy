import { List, Kanban, Trash2, Plus, MessageSquare, Timer, CheckSquare, Users, CalendarIcon } from 'lucide-react';

const Pipeline = ({
  demandView,
  setDemandView,
  demands,
  clients,
  tasks,
  comments,
  timeEntries,
  onSelectDemand,
  onUpdateStatus,
  onDelete,
  onAddTask,
  onAddComment,
  onAddTimeTracking,
  getStatusColor,
  getPriorityColor
}) => {
  const statusLabels = {
    pending: 'Pendente',
    in_progress: 'Em Andamento',
    completed: 'Concluída',
    cancelled: 'Cancelada'
  };

  const statusColors = {
    pending: 'bg-yellow-50 border-yellow-200',
    in_progress: 'bg-blue-50 border-blue-200',
    completed: 'bg-green-50 border-green-200',
    cancelled: 'bg-red-50 border-red-200'
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900 font-poppins">Pipeline de Demandas</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setDemandView('list')}
            className={`p-2 rounded-lg transition-colors ${
              demandView === 'list' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600'
            }`}
          >
            <List className="w-4 h-4" />
          </button>
          <button
            onClick={() => setDemandView('kanban')}
            className={`p-2 rounded-lg transition-colors ${
              demandView === 'kanban' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600'
            }`}
          >
            <Kanban className="w-4 h-4" />
          </button>
        </div>
      </div>

      {demandView === 'kanban' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {['pending', 'in_progress', 'completed', 'cancelled'].map(status => {
            const statusDemands = demands.filter(d => d.status === status);
            
            return (
              <div key={status} data-status={status} className={`border-2 rounded-lg p-3 sm:p-4 ${statusColors[status]}`}>
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <h3 className="font-semibold text-gray-900 font-poppins text-sm sm:text-base">{statusLabels[status]}</h3>
                  <span className="bg-white px-2 py-1 rounded text-xs font-semibold text-gray-700 font-poppins">
                    {statusDemands.length}
                  </span>
                </div>
                <div className="space-y-2 sm:space-y-3">
                  {statusDemands.map(demand => {
                    const client = clients.find(c => c.id === demand.clientId);
                    return (
                      <div
                        key={demand.id}
                        onClick={() => onSelectDemand(demand)}
                        className="bg-white border border-gray-200 rounded-lg p-2 sm:p-3 cursor-pointer hover:shadow-md transition-shadow"
                      >
                        <h4 className="font-semibold text-xs sm:text-sm text-gray-900 mb-1 font-poppins">{demand.title}</h4>
                        <p className="text-xs text-gray-600 mb-2 font-poppins">{client?.name}</p>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded text-xs font-medium ${getPriorityColor(demand.priority)} font-poppins`}>
                            {demand.priority === 'high' ? 'Alta' : demand.priority === 'medium' ? 'Média' : 'Baixa'}
                          </span>
                          {demand.dueDate && (
                            <span className="text-xs text-gray-500 font-poppins">
                              {new Date(demand.dueDate).toLocaleDateString('pt-BR')}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="space-y-3">
          {demands.map(demand => {
            const client = clients.find(c => c.id === demand.clientId);
            const demandTasks = tasks.filter(t => t.demandId === demand.id);
            const demandComments = comments.filter(c => c.demandId === demand.id);
            const demandTimeEntries = timeEntries.filter(t => t.demandId === demand.id);
            const totalHours = demandTimeEntries.reduce((sum, t) => sum + t.hours, 0);
            
            return (
              <div 
                key={demand.id} 
                className="bg-white border border-gray-200 rounded-lg p-5 hover:border-gray-300 transition-colors group"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 
                        className="text-base font-semibold text-gray-900 font-poppins cursor-pointer hover:text-gray-600"
                        onClick={() => onSelectDemand(demand)}
                      >
                        {demand.title}
                      </h3>
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(demand.status)} font-poppins`}>
                        {demand.status === 'pending' ? 'Pendente' : demand.status === 'in_progress' ? 'Em Andamento' : demand.status === 'completed' ? 'Concluída' : 'Cancelada'}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${getPriorityColor(demand.priority)} font-poppins`}>
                        {demand.priority === 'high' ? 'Alta' : demand.priority === 'medium' ? 'Média' : 'Baixa'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3 font-poppins">{demand.description}</p>
                    
                    {/* Informações adicionais */}
                    <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                      <span className="font-poppins flex items-center gap-1">
                        <Users className="w-3.5 h-3.5" />
                        {client?.name}
                      </span>
                      {demand.dueDate && (
                        <span className="font-poppins flex items-center gap-1">
                          <CalendarIcon className="w-3.5 h-3.5" />
                          {new Date(demand.dueDate).toLocaleDateString('pt-BR')}
                        </span>
                      )}
                      {demandTasks.length > 0 && (
                        <span className="font-poppins flex items-center gap-1">
                          <CheckSquare className="w-3.5 h-3.5" />
                          {demandTasks.filter(t => t.completed).length}/{demandTasks.length} tarefas
                        </span>
                      )}
                      {demandComments.length > 0 && (
                        <span className="font-poppins flex items-center gap-1">
                          <MessageSquare className="w-3.5 h-3.5" />
                          {demandComments.length} comentários
                        </span>
                      )}
                      {totalHours > 0 && (
                        <span className="font-poppins flex items-center gap-1">
                          <Timer className="w-3.5 h-3.5" />
                          {totalHours.toFixed(1)}h
                        </span>
                      )}
                    </div>

                    {/* Ações rápidas */}
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => onAddTask(demand)}
                        className="text-xs text-gray-600 hover:text-gray-900 px-2 py-1 rounded hover:bg-gray-100 transition-colors font-poppins flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3" />
                        Tarefa
                      </button>
                      <button
                        onClick={() => onAddComment(demand)}
                        className="text-xs text-gray-600 hover:text-gray-900 px-2 py-1 rounded hover:bg-gray-100 transition-colors font-poppins flex items-center gap-1"
                      >
                        <MessageSquare className="w-3 h-3" />
                        Comentar
                      </button>
                      <button
                        onClick={() => onAddTimeTracking(demand)}
                        className="text-xs text-gray-600 hover:text-gray-900 px-2 py-1 rounded hover:bg-gray-100 transition-colors font-poppins flex items-center gap-1"
                      >
                        <Timer className="w-3 h-3" />
                        Registrar Tempo
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
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
      )}
    </div>
  );
};

export default Pipeline;

