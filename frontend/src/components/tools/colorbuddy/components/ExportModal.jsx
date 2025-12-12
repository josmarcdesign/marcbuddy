import React from 'react';
import { X, CheckCircle2, Save, FileCode, Image as ImageExport, FileText, Layers, Palette } from 'lucide-react';

const formatsList = [
  { key: 'ase', label: 'Adobe Swatch', icon: Save, desc: 'Para Adobe' },
  { key: 'json', label: 'JSON', icon: FileCode, desc: 'Dados estruturados' },
  { key: 'css', label: 'CSS Variables', icon: FileCode, desc: 'Variáveis CSS' },
  { key: 'scss', label: 'SCSS', icon: FileCode, desc: 'Sass/SCSS' },
  { key: 'png', label: 'Imagem PNG', icon: ImageExport, desc: 'Paleta visual' },
  { key: 'svg', label: 'SVG', icon: ImageExport, desc: 'Retângulos com códigos' },
  { key: 'txt', label: 'Texto', icon: FileText, desc: 'Lista simples' },
  { key: 'xml', label: 'XML', icon: FileCode, desc: 'Estrutura XML' },
  { key: 'sketch', label: 'Sketch', icon: Layers, desc: 'Para Sketch' },
  { key: 'pantone', label: 'Pantone', icon: Palette, desc: 'Aproximação Pantone' },
];

const ExportModal = ({
  open,
  onClose,
  darkMode,
  extractionMode,
  exportFormats,
  setExportFormats,
  paletteName,
  setPaletteName,
  exportAsGradient,
  setExportAsGradient,
  exportPalette,
}) => {
  if (!open) return null;

  const handleExport = async () => {
    if (exportFormats.length === 0) {
      alert('Selecione pelo menos um formato para exportar');
      return;
    }
    const nameToUse = paletteName || 'Paleta de Cores';
    for (let i = 0; i < exportFormats.length; i++) {
      await exportPalette(exportFormats[i], nameToUse);
      if (i < exportFormats.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, 300));
      }
    }
    onClose();
    setExportFormats([]);
    setPaletteName('');
    setExportAsGradient(false);
  };

  return (
    <div
      className={`fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-6`}
      onClick={onClose}
    >
      <div
        className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col transition-colors`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={`p-6 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'} flex items-center justify-between flex-shrink-0`}>
          <div>
            <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-brand-blue-900'} font-nunito`}>
              Exportar Paleta
            </h3>
            {exportFormats.length > 0 && (
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} font-poppins mt-1`}>
                {exportFormats.length} formato{exportFormats.length > 1 ? 's' : ''} selecionado{exportFormats.length > 1 ? 's' : ''}
              </p>
            )}
            <div className={`mt-2 px-3 py-1.5 rounded-lg inline-flex items-center gap-2 ${darkMode ? 'bg-gray-700/50' : 'bg-gray-100'}`}>
              <span className={`text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'} font-poppins`}>
                Modo:
              </span>
              <span className={`text-xs font-semibold ${darkMode ? 'text-white' : 'text-brand-blue-900'} font-poppins`}>
                {extractionMode === 'auto' ? 'Automático' :
                  extractionMode === 'manual' ? 'Manual' :
                  extractionMode === 'gradient' ? 'Gradiente' :
                  'Automático'}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-2 ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} rounded-lg transition-colors`}
          >
            <X className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-6">
          <div className="mb-6">
            <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} font-poppins mb-2`}>
              Nome da Paleta
            </label>
            <input
              type="text"
              value={paletteName}
              onChange={(e) => setPaletteName(e.target.value)}
              placeholder="Ex: Paleta Verão 2025"
              className={`w-full px-4 py-2 rounded-lg border ${
                darkMode
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
              } focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-transparent font-poppins mb-6`}
            />

            <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} font-poppins mb-3`}>
              Formato de Exportação
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {formatsList.map(({ key, label, icon: Icon, desc }) => {
                const isSelected = exportFormats.includes(key);
                return (
                  <button
                    key={key}
                    onClick={() => {
                      if (isSelected) {
                        setExportFormats((prev) => prev.filter((f) => f !== key));
                      } else {
                        setExportFormats((prev) => [...prev, key]);
                      }
                    }}
                    className={`p-4 rounded-xl border-2 transition-all text-left relative ${
                      isSelected
                        ? darkMode
                          ? 'border-brand-green bg-gray-700/50'
                          : 'border-brand-green bg-white'
                        : darkMode
                        ? 'border-gray-700 bg-gray-700/50 hover:border-gray-600'
                        : 'border-gray-200 bg-gray-50 hover:border-gray-300'
                    }`}
                  >
                    {isSelected && (
                      <div className="absolute top-2 right-2 w-5 h-5 bg-brand-green rounded-full flex items-center justify-center">
                        <CheckCircle2 className="w-3 h-3 text-white" />
                      </div>
                    )}
                    <div className="flex items-center gap-3 mb-2">
                      <Icon className={`w-5 h-5 ${isSelected ? (darkMode ? 'text-brand-green' : 'text-brand-blue-900') : darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                      <span className={`font-semibold text-sm ${darkMode ? 'text-white' : 'text-brand-blue-900'} font-nunito`}>
                        {label}
                      </span>
                    </div>
                    <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} font-poppins`}>
                      {desc}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
        <div className={`p-6 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'} flex gap-3 flex-shrink-0`}>
          {exportFormats.length > 0 && (
            <button
              onClick={() => setExportFormats([])}
              className={`px-4 py-3 rounded-xl font-medium ${
                darkMode
                  ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              } transition-colors font-poppins`}
            >
              Limpar
            </button>
          )}
          <button
            onClick={handleExport}
            disabled={exportFormats.length === 0}
            className={`flex-1 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 ${
              exportFormats.length === 0
                ? darkMode
                  ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : darkMode
                ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                : 'bg-brand-green text-brand-blue-900 hover:bg-brand-green-500'
            } transition-colors font-nunito`}
          >
            Exportar Paleta
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExportModal;


