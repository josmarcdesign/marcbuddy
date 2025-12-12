import { Plus, Trash2, Edit2, Eye, FileImage } from 'lucide-react';

const Payments = ({
  payments,
  clients,
  onNewPayment,
  onEdit,
  onDelete,
  onMarkAsPaid,
  onViewReceipt,
  getStatusColor
}) => {
  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 mb-4 sm:mb-8">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 font-poppins">Pagamentos</h2>
        <button
          onClick={onNewPayment}
          className="w-full sm:w-auto bg-gray-900 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 font-poppins"
        >
          <Plus className="w-4 h-4" />
          Novo Pagamento
        </button>
      </div>

      {/* Desktop: Tabela */}
      <div className="hidden md:block bg-white border border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider font-poppins">Cliente</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider font-poppins">Descrição</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider font-poppins">Valor</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider font-poppins">Vencimento</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider font-poppins">Status</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider font-poppins">Comprovante</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider font-poppins">Ações</th>
            </tr>
          </thead>
          <tbody>
            {payments.map(payment => {
              const client = clients.find(c => c.id === payment.clientId);
              return (
                <tr key={payment.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4 text-sm text-gray-900 font-poppins">{client?.name || 'N/A'}</td>
                  <td className="py-3 px-4 text-sm text-gray-600 font-poppins">{payment.description}</td>
                  <td className="py-3 px-4 text-sm font-semibold text-gray-900 font-poppins">
                    R$ {payment.amount.toFixed(2).replace('.', ',')}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600 font-poppins">
                    {new Date(payment.dueDate).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(payment.status)} font-poppins`}>
                      {payment.status === 'paid' ? 'Pago' : 'Pendente'}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    {payment.receiptImage ? (
                      <span className="text-xs text-green-600 font-poppins flex items-center gap-1">
                        <FileImage className="w-3.5 h-3.5" />
                        Enviado
                      </span>
                    ) : (
                      <span className="text-xs text-gray-400 font-poppins">-</span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      {payment.receiptImage && (
                        <button
                          onClick={() => onViewReceipt(payment.receiptImage)}
                          className="text-gray-400 hover:text-blue-500 p-1 rounded transition-colors"
                          title="Ver comprovante"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      )}
                      {payment.status === 'pending' && (
                        <button
                          onClick={() => onMarkAsPaid(payment.id)}
                          className="text-xs text-gray-600 hover:text-green-600 px-2 py-1 rounded transition-colors font-poppins"
                        >
                          Marcar como Pago
                        </button>
                      )}
                      <button
                        onClick={() => onEdit(payment)}
                        className="text-gray-400 hover:text-blue-500 p-1 rounded transition-colors"
                        title="Editar pagamento"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDelete(payment.id)}
                        className="text-gray-400 hover:text-red-500 p-1 rounded transition-colors"
                        title="Excluir pagamento"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile: Cards */}
      <div className="md:hidden space-y-3">
        {payments.map(payment => {
          const client = clients.find(c => c.id === payment.clientId);
          return (
            <div key={payment.id} className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="text-base font-semibold text-gray-900 font-poppins mb-1">{client?.name || 'N/A'}</h3>
                  <p className="text-sm text-gray-600 font-poppins">{payment.description}</p>
                </div>
                <span className={`px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(payment.status)} font-poppins ml-2 flex-shrink-0`}>
                  {payment.status === 'paid' ? 'Pago' : 'Pendente'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <span className="text-xs text-gray-500 font-poppins block mb-1">Valor</span>
                  <span className="text-sm font-semibold text-gray-900 font-poppins">
                    R$ {payment.amount.toFixed(2).replace('.', ',')}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-gray-500 font-poppins block mb-1">Vencimento</span>
                  <span className="text-sm text-gray-900 font-poppins">
                    {new Date(payment.dueDate).toLocaleDateString('pt-BR')}
                  </span>
                </div>
              </div>

              {payment.receiptImage && (
                <div className="mb-3 pb-3 border-b border-gray-100">
                  <span className="text-xs text-green-600 font-poppins flex items-center gap-1">
                    <FileImage className="w-3.5 h-3.5" />
                    Comprovante enviado
                  </span>
                </div>
              )}

              <div className="flex items-center gap-2 flex-wrap">
                {payment.receiptImage && (
                  <button
                    onClick={() => onViewReceipt(payment.receiptImage)}
                    className="flex-1 bg-gray-100 text-gray-700 px-3 py-2 rounded text-xs font-medium hover:bg-gray-200 transition-colors font-poppins flex items-center justify-center gap-1"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    Ver Comprovante
                  </button>
                )}
                {payment.status === 'pending' && (
                  <button
                    onClick={() => onMarkAsPaid(payment.id)}
                    className="flex-1 bg-green-50 text-green-700 px-3 py-2 rounded text-xs font-medium hover:bg-green-100 transition-colors font-poppins"
                  >
                    Marcar como Pago
                  </button>
                )}
                <button
                  onClick={() => onEdit(payment)}
                  className="p-2 text-gray-400 hover:text-blue-500 rounded transition-colors"
                  title="Editar"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDelete(payment.id)}
                  className="p-2 text-gray-400 hover:text-red-500 rounded transition-colors"
                  title="Excluir"
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

export default Payments;

