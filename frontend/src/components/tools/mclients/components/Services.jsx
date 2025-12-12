import { Plus, Trash2, Edit2, ArrowUp, ArrowDown } from 'lucide-react';

const Services = ({
  services,
  onNewService,
  onEdit,
  onDelete,
  onMove,
  getStatusColor
}) => {
  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 mb-4 sm:mb-8">
        <h2 className="text-xl font-semibold text-gray-900 font-poppins">Serviços</h2>
        <button
          onClick={onNewService}
          className="w-full sm:w-auto bg-gray-900 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 font-poppins"
        >
          <Plus className="w-4 h-4" />
          Novo Serviço
        </button>
      </div>

      {/* Desktop: Tabela */}
      <div className="hidden md:block bg-white border border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider font-poppins w-12"></th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider font-poppins">Nome</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider font-poppins">Descrição</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider font-poppins">Categoria</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider font-poppins">Preço</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider font-poppins">Duração</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider font-poppins">Status</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider font-poppins">Ações</th>
            </tr>
          </thead>
          <tbody>
            {services.map((service, index) => (
              <tr key={service.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                <td className="py-3 px-4">
                  <div className="flex flex-col gap-1">
                    <button
                      onClick={() => onMove(service.id, 'up')}
                      disabled={index === 0}
                      className="text-gray-400 hover:text-gray-600 disabled:opacity-30 transition-colors"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onMove(service.id, 'down')}
                      disabled={index === services.length - 1}
                      className="text-gray-400 hover:text-gray-600 disabled:opacity-30 transition-colors"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
                <td className="py-3 px-4 text-sm font-semibold text-gray-900 font-poppins">{service.name}</td>
                <td className="py-3 px-4 text-sm text-gray-600 font-poppins">{service.description}</td>
                <td className="py-3 px-4 text-sm text-gray-600 font-poppins">{service.category}</td>
                <td className="py-3 px-4 text-sm font-semibold text-gray-900 font-poppins">
                  R$ {service.price.toFixed(2).replace('.', ',')}
                </td>
                <td className="py-3 px-4 text-sm text-gray-600 font-poppins">{service.duration}</td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(service.active ? 'active' : 'inactive')} font-poppins`}>
                    {service.active ? 'Ativo' : 'Inativo'}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onEdit(service)}
                      className="text-gray-400 hover:text-blue-500 p-1 rounded transition-colors"
                      title="Editar"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(service.id)}
                      className="text-gray-400 hover:text-red-500 p-1 rounded transition-colors"
                      title="Excluir"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile: Cards */}
      <div className="md:hidden space-y-3">
        {services.map((service, index) => (
          <div key={service.id} className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="text-base font-semibold text-gray-900 font-poppins mb-1">{service.name}</h3>
                <p className="text-sm text-gray-600 font-poppins">{service.description}</p>
              </div>
              <span className={`px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(service.active ? 'active' : 'inactive')} font-poppins ml-2 flex-shrink-0`}>
                {service.active ? 'Ativo' : 'Inativo'}
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <span className="text-xs text-gray-500 font-poppins block mb-1">Categoria</span>
                <span className="text-sm text-gray-900 font-poppins">{service.category}</span>
              </div>
              <div>
                <span className="text-xs text-gray-500 font-poppins block mb-1">Duração</span>
                <span className="text-sm text-gray-900 font-poppins">{service.duration}</span>
              </div>
              <div>
                <span className="text-xs text-gray-500 font-poppins block mb-1">Preço</span>
                <span className="text-sm font-semibold text-gray-900 font-poppins">
                  R$ {service.price.toFixed(2).replace('.', ',')}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onMove(service.id, 'up')}
                  disabled={index === 0}
                  className="text-gray-400 hover:text-gray-600 disabled:opacity-30 transition-colors p-1"
                >
                  <ArrowUp className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onMove(service.id, 'down')}
                  disabled={index === services.length - 1}
                  className="text-gray-400 hover:text-gray-600 disabled:opacity-30 transition-colors p-1"
                >
                  <ArrowDown className="w-4 h-4" />
                </button>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onEdit(service)}
                  className="text-gray-400 hover:text-blue-500 p-2 rounded transition-colors"
                  title="Editar"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDelete(service.id)}
                  className="text-gray-400 hover:text-red-500 p-2 rounded transition-colors"
                  title="Excluir"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Services;

