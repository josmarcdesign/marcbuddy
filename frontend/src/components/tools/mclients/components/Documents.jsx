import { Upload, Trash2, Send, FileText } from 'lucide-react';

const Documents = ({
  documents,
  clients,
  onUpload,
  onEdit,
  onSend,
  onDelete
}) => {
  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 mb-4 sm:mb-8">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 font-poppins">Documentos</h2>
        <label className="bg-gray-900 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors flex items-center gap-2 cursor-pointer font-poppins">
          <Upload className="w-4 h-4" />
          Upload Documento
          <input
            type="file"
            onChange={onUpload}
            className="hidden"
          />
        </label>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {documents.map(doc => {
          const client = clients.find(c => c.id === doc.clientId);
          return (
            <div key={doc.id} className="bg-white border border-gray-200 rounded-lg p-5 hover:border-gray-300 transition-colors">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <h3 className="font-semibold text-gray-900 font-poppins truncate text-sm">{doc.name}</h3>
                  </div>
                  <p className="text-xs text-gray-500 font-poppins mb-1">{client?.name}</p>
                  <p className="text-xs text-gray-400 font-poppins">{doc.size} • {new Date(doc.uploadedAt).toLocaleDateString('pt-BR')}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
                <button
                  onClick={() => onEdit(doc)}
                  className="flex-1 bg-gray-100 text-gray-700 px-3 py-2 rounded text-sm font-medium hover:bg-gray-200 transition-colors font-poppins"
                >
                  Editar
                </button>
                <button
                  onClick={() => onSend(doc)}
                  className="text-gray-400 hover:text-gray-600 p-2 rounded transition-colors"
                  title="Enviar"
                >
                  <Send className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDelete(doc.id)}
                  className="text-gray-400 hover:text-red-500 p-2 rounded transition-colors"
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

export default Documents;

