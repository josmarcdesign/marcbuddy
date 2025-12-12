import { Plus, Trash2, CalendarIcon, CheckSquare, Square } from 'lucide-react';

const Tasks = ({
  tasks,
  demands,
  clients,
  onNewTask,
  onToggleComplete,
  onDelete,
  getPriorityColor
}) => {
  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 mb-4 sm:mb-8">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 font-poppins">Tarefas</h2>
        <button
          onClick={onNewTask}
          className="bg-gray-900 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors flex items-center gap-2 font-poppins"
        >
          <Plus className="w-4 h-4" />
          Nova Tarefa
        </button>
      </div>

      <div className="space-y-3">
        {tasks.map(task => {
          const demand = demands.find(d => d.id === task.demandId);
          const client = demand ? clients.find(c => c.id === demand.clientId) : null;
          return (
            <div key={task.id} className="bg-white border border-gray-200 rounded-lg p-5 hover:border-gray-300 transition-colors">
              <div className="flex items-start gap-3">
                <button
                  onClick={() => onToggleComplete(task.id)}
                  className="mt-1"
                >
                  {task.completed ? (
                    <CheckSquare className="w-5 h-5 text-green-500" />
                  ) : (
                    <Square className="w-5 h-5 text-gray-400" />
                  )}
                </button>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className={`text-base font-semibold font-poppins ${task.completed ? 'text-gray-400 line-through' : 'text-gray-900'}`}>
                      {task.title}
                    </h3>
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${getPriorityColor(task.priority)} font-poppins`}>
                      {task.priority === 'high' ? 'Alta' : task.priority === 'medium' ? 'Média' : 'Baixa'}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-500 mb-2">
                    {demand && (
                      <span className="font-poppins">Demanda: {demand.title}</span>
                    )}
                    {client && (
                      <span className="font-poppins">Cliente: {client.name}</span>
                    )}
                    {task.dueDate && (
                      <span className="font-poppins flex items-center gap-1">
                        <CalendarIcon className="w-3.5 h-3.5" />
                        {new Date(task.dueDate).toLocaleDateString('pt-BR')}
                      </span>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => onDelete(task.id)}
                  className="text-gray-400 hover:text-red-500 p-1.5 rounded transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Tasks;

