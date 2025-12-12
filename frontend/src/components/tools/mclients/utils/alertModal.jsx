import { useState } from 'react';
import { AlertCircle, CheckCircle2, X } from 'lucide-react';

export const useAlertModal = () => {
  const [alertModal, setAlertModal] = useState({
    show: false,
    type: 'info', // 'info', 'warning', 'error', 'success', 'confirm'
    title: '',
    message: '',
    onConfirm: null,
    onCancel: null
  });

  const showAlert = (message, type = 'info', title = '') => {
    setAlertModal({
      show: true,
      type,
      title: title || (type === 'error' ? 'Erro' : type === 'warning' ? 'Atenção' : type === 'success' ? 'Sucesso' : 'Informação'),
      message,
      onConfirm: () => setAlertModal({ ...alertModal, show: false }),
      onCancel: null
    });
  };

  const showConfirm = (message, onConfirm, title = 'Confirmar', type = 'warning') => {
    setAlertModal({
      show: true,
      type,
      title,
      message,
      onConfirm: () => {
        if (onConfirm) onConfirm();
        setAlertModal({ ...alertModal, show: false });
      },
      onCancel: () => setAlertModal({ ...alertModal, show: false })
    });
  };

  return { alertModal, setAlertModal, showAlert, showConfirm };
};

export const AlertModalComponent = ({ alertModal, setAlertModal }) => {
  if (!alertModal.show) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4">
      <div className="bg-white rounded-lg max-w-md w-full shadow-xl border border-gray-200">
        {/* Header */}
        <div className={`px-6 py-4 border-b ${
          alertModal.type === 'error' ? 'bg-red-50 border-red-200' :
          alertModal.type === 'warning' ? 'bg-yellow-50 border-yellow-200' :
          alertModal.type === 'success' ? 'bg-green-50 border-green-200' :
          alertModal.type === 'confirm' ? 'bg-yellow-50 border-yellow-200' :
          'bg-blue-50 border-blue-200'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {alertModal.type === 'error' && <AlertCircle className="w-5 h-5 text-red-600" />}
              {alertModal.type === 'warning' && <AlertCircle className="w-5 h-5 text-yellow-600" />}
              {alertModal.type === 'success' && <CheckCircle2 className="w-5 h-5 text-green-600" />}
              {alertModal.type === 'confirm' && <AlertCircle className="w-5 h-5 text-yellow-600" />}
              {(alertModal.type === 'info' || !alertModal.type) && <AlertCircle className="w-5 h-5 text-blue-600" />}
              <h3 className={`text-lg font-semibold font-poppins ${
                alertModal.type === 'error' ? 'text-red-900' :
                alertModal.type === 'warning' ? 'text-yellow-900' :
                alertModal.type === 'success' ? 'text-green-900' :
                alertModal.type === 'confirm' ? 'text-yellow-900' :
                'text-blue-900'
              }`}>
                {alertModal.title}
              </h3>
            </div>
            <button
              onClick={() => setAlertModal({ ...alertModal, show: false })}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        {/* Body */}
        <div className="px-6 py-4">
          <p className="text-gray-700 whitespace-pre-line font-poppins">
            {alertModal.message}
          </p>
        </div>
        
        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-end gap-3 bg-gray-50">
          {alertModal.type === 'confirm' && alertModal.onCancel && (
            <button
              onClick={alertModal.onCancel}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-poppins"
            >
              Não
            </button>
          )}
          <button
            onClick={alertModal.onConfirm || (() => setAlertModal({ ...alertModal, show: false }))}
            className={`px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors font-poppins ${
              alertModal.type === 'error' ? 'bg-red-600 hover:bg-red-700' :
              alertModal.type === 'warning' ? 'bg-yellow-600 hover:bg-yellow-700' :
              alertModal.type === 'success' ? 'bg-green-600 hover:bg-green-700' :
              alertModal.type === 'confirm' ? 'bg-gray-900 hover:bg-gray-800' :
              'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {alertModal.type === 'confirm' ? 'Sim' : 'OK'}
          </button>
        </div>
      </div>
    </div>
  );
};

