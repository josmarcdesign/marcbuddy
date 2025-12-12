import React from 'react';
import { Download, BarChart3, Trash2, X } from 'lucide-react';

const PalettePanel = ({
  colors,
  selectedColor,
  darkMode,
  onColorClick,
  onRemoveColor,
  onClearAll,
  onExport,
  onAnalysis,
}) => {
  return (
    <>
      <div className="flex items-center justify-between mb-2">
        <h3 className={`text-base font-semibold ${darkMode ? 'text-white' : 'text-brand-blue-900'} font-nunito`}>
          Paleta de Cores
        </h3>
        <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} font-poppins`}>
          {colors.length} {colors.length === 1 ? 'cor' : 'cores'}
        </span>
      </div>

      <div className={`my-2 p-3 rounded-lg border-2 ${
        darkMode ? 'border-gray-600 bg-gray-800/30' : 'border-gray-300 bg-gray-50'
      } transition-colors`}>

      <div className="palette-scroll grid grid-cols-5 sm:grid-cols-6 md:grid-cols-6 gap-2 h-[110px] overflow-y-auto overflow-x-visible pr-2 pl-1 pt-1">
        {colors.map((color, index) => (
          <div key={color.id || index} className="group relative">
            <button
              onClick={() => onColorClick(color, index)}
              className="w-full aspect-square rounded-md shadow-sm border border-brand-blue-900/30 transition-all hover:scale-[1.02] hover:shadow hover:border-brand-blue-900/60"
              style={{ backgroundColor: color.hex }}
              title={`color-${index + 1}`}
            >
              {color.dominant && (
                <div className="absolute top-1 right-1 w-2 h-2 bg-brand-green rounded-full border border-white shadow-sm" />
              )}
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRemoveColor(index);
              }}
              className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10 shadow-md"
              title="Remover cor"
            >
              <X className="w-3 h-3 text-white" />
            </button>
          </div>
        ))}
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 space-y-3 flex-shrink-0">
        <button
          onClick={onExport}
          className={`w-full py-3 rounded-xl font-semibold flex items-center justify-center gap-2 ${
            darkMode
              ? 'bg-brand-green text-brand-blue-900 hover:bg-brand-green-500'
              : 'bg-brand-green text-brand-blue-900 hover:bg-brand-green-500'
          } transition-colors font-nunito`}
        >
          <Download className="w-5 h-5" />
          Exportar Paleta
        </button>
        <button
          onClick={onAnalysis}
          className={`w-full py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2 ${
            darkMode
              ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
              : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
          } transition-colors font-poppins`}
        >
          <BarChart3 className="w-4 h-4" />
          Análise de Cores
        </button>
        <button
          onClick={onClearAll}
          disabled={colors.length === 0}
          className={`w-full py-2.5 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-all duration-200 ${
            colors.length === 0
              ? darkMode
                ? 'bg-gray-700/20 text-gray-500 border border-gray-700/30 cursor-not-allowed opacity-50'
                : 'bg-gray-100/50 text-gray-400 border border-gray-200/50 cursor-not-allowed opacity-50'
              : darkMode
              ? 'bg-gray-700/50 hover:bg-gray-700 text-gray-300 border border-gray-600/50 hover:border-gray-500'
              : 'bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300 hover:border-gray-400'
          } font-poppins group`}
        >
          <Trash2 className={`w-4 h-4 transition-transform duration-200 ${colors.length > 0 ? 'group-hover:rotate-12' : ''} ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
          <span>Limpar Paleta</span>
        </button>
      </div>
    </>
  );
};

export default PalettePanel;


