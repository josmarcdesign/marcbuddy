import { Plus, Trash2, Mail, Phone, MapPin, Search, CheckCircle2, Clock, LinkIcon } from 'lucide-react';

const Clients = ({
  filteredClients,
  searchTerm,
  setSearchTerm,
  filterStatus,
  setFilterStatus,
  onNewClient,
  onEditClient,
  onDeleteClient,
  onNewDemand,
  getClientDemands,
  getClientPayments,
  getClientDocuments,
  getStatusColor
}) => {
  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 mb-4 sm:mb-8">
        <div className="flex items-center gap-3 flex-1 max-w-2xl">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Buscar clientes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-transparent font-poppins text-gray-700 placeholder-gray-400"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-transparent font-poppins text-gray-700"
          >
            <option value="all">Todos</option>
            <option value="active">Ativos</option>
            <option value="inactive">Inativos</option>
          </select>
        </div>
        <button
          onClick={onNewClient}
          className="bg-gray-900 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors flex items-center gap-2 font-poppins"
        >
          <Plus className="w-4 h-4" />
          Novo Cliente
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {filteredClients.map(client => (
          <div key={client.id} className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 hover:border-gray-300 transition-colors">
            <div className="flex items-start justify-between mb-3 sm:mb-5">
              <div className="flex-1 min-w-0">
                <h3 className="text-sm sm:text-base font-semibold text-gray-900 font-poppins mb-1 truncate">{client.name}</h3>
                {client.company && (
                  <p className="text-xs sm:text-sm text-gray-500 font-poppins truncate">{client.company}</p>
                )}
              </div>
              <span className={`px-2 py-0.5 rounded text-xs font-medium flex-shrink-0 ${getStatusColor(client.status)} font-poppins`}>
                {client.status === 'active' ? 'Ativo' : 'Inativo'}
              </span>
            </div>

            <div className="space-y-2 sm:space-y-2.5 mb-3 sm:mb-5">
              <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                <Mail className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gray-400 flex-shrink-0" />
                <span className="font-poppins truncate">{client.email}</span>
              </div>
              {client.phone && (
                <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                  <Phone className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gray-400 flex-shrink-0" />
                  <span className="font-poppins">{client.phone}</span>
                </div>
              )}
              {client.address && (
                <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                  <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gray-400 flex-shrink-0" />
                  <span className="font-poppins line-clamp-1">{client.address}</span>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-3 sm:pt-4 border-t border-gray-100">
              <button
                onClick={() => onNewDemand(client.id)}
                className="flex-1 bg-brand-green text-white px-3 py-2 rounded text-xs sm:text-sm font-medium hover:bg-brand-green-500 transition-colors font-poppins flex items-center justify-center gap-1"
              >
                <Plus className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                Nova Demanda
              </button>
              <button
                onClick={() => onEditClient(client)}
                className="flex-1 bg-gray-100 text-gray-700 px-3 py-2 rounded text-xs sm:text-sm font-medium hover:bg-gray-200 transition-colors font-poppins"
              >
                Editar
              </button>
              <button
                onClick={() => onDeleteClient(client.id)}
                className="text-gray-400 hover:text-red-500 px-2 sm:px-3 py-2 rounded text-xs sm:text-sm transition-colors flex items-center justify-center"
              >
                <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
            </div>

            <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-100 space-y-2">
              {/* Demandas */}
              <div>
                <div className="flex items-center justify-between text-xs text-gray-500 mb-1.5">
                  <span className="font-poppins">Demandas</span>
                  <span className="font-medium text-gray-900 font-poppins">{getClientDemands(client.id).length}</span>
                </div>
                {getClientDemands(client.id).length > 0 && (
                  <div className="flex items-center gap-3 text-xs text-gray-600 mt-1">
                    <span className="font-poppins flex items-center gap-1">
                      <Clock className="w-3 h-3 text-yellow-500" />
                      {getClientDemands(client.id).filter(d => d.status === 'pending' || d.status === 'in_progress').length} pendentes
                    </span>
                    <span className="font-poppins flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-green-500" />
                      {getClientDemands(client.id).filter(d => d.status === 'completed').length} concluídas
                    </span>
                  </div>
                )}
              </div>
              
              <div className="flex items-center justify-between text-xs text-gray-500 mb-1.5 sm:mb-2">
                <span className="font-poppins">Pagamentos</span>
                <span className="font-medium text-gray-900 font-poppins">{getClientPayments(client.id).length}</span>
              </div>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span className="font-poppins">Documentos</span>
                <span className="font-medium text-gray-900 font-poppins">{getClientDocuments(client.id).length}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Clients;

