import React from 'react';
import {
  X,
  CheckCircle2,
  AlertTriangle,
  Eye,
  Plus,
  Sparkles,
  Sun,
  Moon,
  Zap,
} from 'lucide-react';

const AnalysisModal = ({
  open,
  onClose,
  darkMode,
  colors,
  calculateColorAnalysis,
  analyzeHarmony,
  analyzeAccessibility,
  hexToRgb,
  rgbToHsl,
}) => {
  if (!open) return null;

  const analysis = calculateColorAnalysis();
  const harmony = analyzeHarmony();
  const accessibility = analyzeAccessibility();

  const warmColors = colors.filter((c) => {
    const rgb = hexToRgb(c.hex);
    if (!rgb) return false;
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    return hsl.h >= 0 && hsl.h < 180; // cores quentes
  }).length;
  const coolColors = colors.length - warmColors;

  const renderIcon = (iconName) => {
    switch (iconName) {
      case 'CheckCircle':
        return <CheckCircle2 className="w-4 h-4 text-brand-green" />;
      case 'X':
        return <X className="w-4 h-4 text-red-500" />;
      case 'AlertTriangle':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'Eye':
        return <Eye className="w-4 h-4 text-blue-500" />;
      case 'Plus':
        return <Plus className="w-4 h-4 text-blue-500" />;
      case 'Sparkles':
        return <Sparkles className="w-4 h-4 text-purple-500" />;
      case 'Sun':
        return <Sun className="w-4 h-4 text-yellow-500" />;
      case 'Moon':
        return <Moon className="w-4 h-4 text-gray-500" />;
      default:
        return <Zap className="w-4 h-4 text-yellow-500" />;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-6">
      <div
        className={`${
          darkMode ? 'bg-gray-800' : 'bg-white'
        } rounded-2xl shadow-2xl max-w-3xl w-full max-h-[80vh] overflow-hidden flex flex-col transition-colors`}
      >
        <div
          className={`p-6 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'} flex items-center justify-between`}
        >
          <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-brand-blue-900'} font-nunito`}>
            Análise de Cores
          </h3>
          <button
            onClick={onClose}
            className={`p-2 ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} rounded-lg transition-colors`}
          >
            <X className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Estatísticas */}
            <div
              className={`p-6 rounded-xl border ${darkMode ? 'border-gray-700 bg-gray-700/50' : 'border-gray-200 bg-gray-50'}`}
            >
              <h4 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-brand-blue-900'} font-nunito mb-4`}>
                Estatísticas
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} font-poppins`}>
                    Cores Totais
                  </span>
                  <span className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-brand-blue-900'} font-nunito`}>
                    {analysis.totalColors}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} font-poppins`}>
                    Cores Dominantes
                  </span>
                  <span className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-brand-blue-900'} font-nunito`}>
                    {analysis.dominantColors}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} font-poppins`}>
                    Saturação Média
                  </span>
                  <span className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-brand-blue-900'} font-nunito`}>
                    {analysis.avgSaturation}%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} font-poppins`}>
                    Brilho Médio
                  </span>
                  <span className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-brand-blue-900'} font-nunito`}>
                    {analysis.avgBrightness}%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} font-poppins`}>
                    Matiz Médio
                  </span>
                  <span className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-brand-blue-900'} font-nunito`}>
                    {analysis.avgHue}°
                  </span>
                </div>
              </div>
            </div>

            {/* Distribuição */}
            <div
              className={`p-6 rounded-xl border ${darkMode ? 'border-gray-700 bg-gray-700/50' : 'border-gray-200 bg-gray-50'}`}
            >
              <h4 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-brand-blue-900'} font-nunito mb-4`}>
                Distribuição
              </h4>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'} font-poppins`}>Quentes</span>
                    <span className={`text-xs font-semibold ${darkMode ? 'text-white' : 'text-brand-blue-900'} font-poppins`}>
                      {analysis.totalColors > 0 ? Math.round((warmColors / analysis.totalColors) * 100) : 0}%
                    </span>
                  </div>
                  <div className={`h-2 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                    <div
                      className="h-full bg-red-500 rounded-full"
                      style={{ width: `${analysis.totalColors > 0 ? (warmColors / analysis.totalColors) * 100 : 0}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'} font-poppins`}>Frias</span>
                    <span className={`text-xs font-semibold ${darkMode ? 'text-white' : 'text-brand-blue-900'} font-poppins`}>
                      {analysis.totalColors > 0 ? Math.round((coolColors / analysis.totalColors) * 100) : 0}%
                    </span>
                  </div>
                  <div className={`h-2 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                    <div
                      className="h-full bg-blue-500 rounded-full"
                      style={{ width: `${analysis.totalColors > 0 ? (coolColors / analysis.totalColors) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Harmonia */}
            <div
              className={`p-6 rounded-xl border-2 ${darkMode ? 'border-gray-700 bg-gray-800/80' : 'border-gray-200 bg-white'} shadow-lg`}
            >
              <div className="flex items-center gap-2 mb-5">
                <div className={`p-2 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                  <Sparkles className={`w-5 h-5 ${darkMode ? 'text-yellow-400' : 'text-yellow-600'}`} />
                </div>
                <h4 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-brand-blue-900'} font-nunito`}>Harmonia</h4>
              </div>
              <div className="space-y-4">
                {harmony.suggestions.length > 0 ? (
                  harmony.suggestions.map((suggestion, idx) => {
                    const getCardStyle = () => {
                      switch (suggestion.type) {
                        case 'error':
                          return darkMode
                            ? 'border-2 border-red-500/60 bg-gradient-to-br from-red-500/20 to-red-600/10 shadow-red-500/20'
                            : 'border-2 border-red-300 bg-gradient-to-br from-red-50 to-red-100/50 shadow-red-200/50';
                        case 'warning':
                          return darkMode
                            ? 'border-2 border-yellow-500/60 bg-gradient-to-br from-yellow-500/20 to-yellow-600/10 shadow-yellow-500/20'
                            : 'border-2 border-yellow-300 bg-gradient-to-br from-yellow-50 to-yellow-100/50 shadow-yellow-200/50';
                        case 'info':
                          return darkMode
                            ? 'border-2 border-blue-500/60 bg-gradient-to-br from-blue-500/20 to-blue-600/10 shadow-blue-500/20'
                            : 'border-2 border-blue-300 bg-gradient-to-br from-blue-50 to-blue-100/50 shadow-blue-200/50';
                        case 'success':
                          return darkMode
                            ? 'border-2 border-brand-green/60 bg-gradient-to-br from-brand-green/20 to-brand-green/10 shadow-brand-green/20'
                            : 'border-2 border-brand-green/40 bg-gradient-to-br from-brand-green/20 to-brand-green/10 shadow-brand-green/20';
                        default:
                          return darkMode ? 'border-2 border-gray-600 bg-gray-700/50' : 'border-2 border-gray-200 bg-gray-50';
                      }
                    };

                    const getIconColor = () => {
                      switch (suggestion.type) {
                        case 'error':
                          return darkMode ? 'text-red-400' : 'text-red-600';
                        case 'warning':
                          return darkMode ? 'text-yellow-400' : 'text-yellow-600';
                        case 'info':
                          return darkMode ? 'text-blue-400' : 'text-blue-600';
                        case 'success':
                          return 'text-brand-green';
                        default:
                          return darkMode ? 'text-gray-400' : 'text-gray-600';
                      }
                    };

                    return (
                      <div key={idx} className={`p-4 rounded-xl ${getCardStyle()} transition-all hover:shadow-lg`}>
                        <div className="flex items-start gap-3">
                          <div
                            className={`flex-shrink-0 p-2 rounded-lg ${
                              darkMode ? 'bg-gray-700/80' : 'bg-white/80'
                            } shadow-sm`}
                          >
                            <div className={getIconColor()}>{renderIcon(suggestion.icon)}</div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm font-semibold ${darkMode ? 'text-gray-100' : 'text-gray-900'} font-poppins mb-3`}>
                              {suggestion.message}
                            </p>
                            {suggestion.colors && suggestion.colors.length > 0 && (
                              <div className="space-y-2">
                                <span
                                  className={`text-xs font-semibold uppercase tracking-wide ${
                                    darkMode ? 'text-gray-400' : 'text-gray-600'
                                  } font-poppins block mb-2`}
                                >
                                  Cores envolvidas:
                                </span>
                                <div className="flex items-center gap-3 flex-wrap">
                                  {suggestion.colors.map((color, colorIdx) => (
                                    <div
                                      key={colorIdx}
                                      className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
                                        darkMode
                                          ? 'bg-gray-700/80 border border-gray-600'
                                          : 'bg-white border-2 border-gray-200'
                                      } shadow-md transition-all hover:scale-105`}
                                    >
                                      <div
                                        className="w-6 h-6 rounded-md border-2 border-white dark:border-gray-500 shadow-lg ring-2 ring-gray-200 dark:ring-gray-600"
                                        style={{ backgroundColor: color.hex }}
                                        title={color.name}
                                      />
                                      <div className="flex flex-col">
                                        <span
                                          className={`text-xs font-bold ${
                                            darkMode ? 'text-gray-200' : 'text-gray-800'
                                          } font-poppins leading-tight`}
                                        >
                                          {color.name}
                                        </span>
                                        <span
                                          className={`text-[10px] ${
                                            darkMode ? 'text-gray-500' : 'text-gray-500'
                                          } font-mono`}
                                        >
                                          {color.hex.toUpperCase()}
                                        </span>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                                {(suggestion.similarity || suggestion.contrast) && (
                                  <div className={`mt-3 pt-3 border-t ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}>
                                    {suggestion.similarity && (
                                      <div className="flex items-center gap-2">
                                        <span className={`text-xs font-semibold ${darkMode ? 'text-gray-400' : 'text-gray-600'} font-poppins`}>
                                          Similaridade:
                                        </span>
                                        <span
                                          className={`text-xs font-bold px-2 py-0.5 rounded ${
                                            darkMode ? 'bg-yellow-500/20 text-yellow-400' : 'bg-yellow-100 text-yellow-700'
                                          } font-poppins`}
                                        >
                                          {suggestion.similarity}%
                                        </span>
                                      </div>
                                    )}
                                    {suggestion.contrast && (
                                      <div className="flex items-center gap-2 mt-1">
                                        <span className={`text-xs font-semibold ${darkMode ? 'text-gray-400' : 'text-gray-600'} font-poppins`}>
                                          Contraste:
                                        </span>
                                        <span
                                          className={`text-xs font-bold px-2 py-0.5 rounded ${
                                            darkMode ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-700'
                                          } font-poppins`}
                                        >
                                          {suggestion.contrast.toFixed(1)}:1
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div
                    className={`p-4 rounded-xl border-2 ${
                      darkMode ? 'border-gray-600 bg-gray-700/50' : 'border-gray-200 bg-gray-50'
                    } shadow-sm`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${darkMode ? 'bg-gray-600' : 'bg-brand-green/10'}`}>
                        <CheckCircle2 className={`w-5 h-5 ${darkMode ? 'text-brand-green' : 'text-brand-green'}`} />
                      </div>
                      <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} font-poppins`}>
                        Paleta harmoniosa! Nenhuma ação necessária.
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Acessibilidade */}
            <div
              className={`p-6 rounded-xl border-2 ${darkMode ? 'border-gray-700 bg-gray-800/80' : 'border-gray-200 bg-white'} shadow-lg`}
            >
              <div className="flex items-center gap-2 mb-5">
                <div className={`p-2 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-blue-100'}`}>
                  <Eye className={`w-5 h-5 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                </div>
                <h4 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-brand-blue-900'} font-nunito`}>Acessibilidade</h4>
              </div>
              <div className="space-y-4">
                {[
                  {
                    key: 'wcagAA',
                    title: 'WCAG AA (Texto Normal - 4.5:1)',
                    data: accessibility.wcagAA,
                  },
                  {
                    key: 'wcagAAA',
                    title: 'WCAG AAA (Texto Normal - 7:1)',
                    data: accessibility.wcagAAA,
                  },
                  {
                    key: 'wcagLarge',
                    title: 'WCAG AA (Texto Grande - 3:1)',
                    data: accessibility.wcagLarge,
                  },
                ].map(({ key, title, data }) => (
                  <div
                    key={key}
                    className={`p-4 rounded-xl border ${darkMode ? 'border-gray-700 bg-gray-700/30' : 'border-gray-200 bg-gray-50/80'}`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className={`text-sm font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-800'} font-poppins`}>
                        {title}
                      </span>
                      <span
                        className={`text-sm font-bold px-2.5 py-1 rounded-lg ${
                          data.ratio >= 50
                            ? darkMode
                              ? 'bg-green-500/20 text-green-400'
                              : 'bg-green-100 text-green-700'
                            : data.ratio >= 25
                            ? darkMode
                              ? 'bg-yellow-500/20 text-yellow-400'
                              : 'bg-yellow-100 text-yellow-700'
                            : darkMode
                            ? 'bg-red-500/20 text-red-400'
                            : 'bg-red-100 text-red-700'
                        } font-poppins`}
                      >
                        {data.ratio}%
                      </span>
                    </div>
                    <div className={`flex-1 h-3 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} mb-2 shadow-inner`}>
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          data.ratio >= 50
                            ? 'bg-gradient-to-r from-green-500 to-green-600'
                            : data.ratio >= 25
                            ? 'bg-gradient-to-r from-yellow-500 to-yellow-600'
                            : 'bg-gradient-to-r from-red-500 to-red-600'
                        } shadow-lg`}
                        style={{ width: `${data.ratio}%` }}
                      />
                    </div>
                    <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'} font-poppins`}>
                      {data.passes} de {data.total} pares atendem ao critério
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisModal;


