import { useState } from 'react';
import { Upload, FileText, Download, Settings, X, Check, Palette, Type as TypeIcon, RefreshCw } from 'lucide-react';
import { BRAND_COLORS, BRAND_TYPOGRAPHY } from '../../../config/brand';

const Project2 = ({ isFullscreen = false }) => {
  // Estado de personalização
  const [customization, setCustomization] = useState({
    primaryColor: BRAND_COLORS.primary.green.hex,
    secondaryColor: BRAND_COLORS.primary.blue.hex,
    backgroundColor: BRAND_COLORS.primary.white.hex,
    textColor: BRAND_COLORS.primary.blue.hex,
    fontFamily: BRAND_TYPOGRAPHY.primary.family,
    showCustomization: false
  });

  // Estado do renomeador
  const [files, setFiles] = useState([
    { id: 1, originalName: 'foto-001.jpg', newName: 'foto-001.jpg', status: 'pending' },
    { id: 2, originalName: 'imagem-antiga.png', newName: 'imagem-antiga.png', status: 'pending' },
    { id: 3, originalName: 'documento.pdf', newName: 'documento.pdf', status: 'pending' },
  ]);
  const [pattern, setPattern] = useState('{original}');
  const [previewMode, setPreviewMode] = useState(true);

  const toggleCustomization = () => {
    setCustomization(prev => ({ ...prev, showCustomization: !prev.showCustomization }));
  };

  const resetToBrand = () => {
    setCustomization({
      primaryColor: BRAND_COLORS.primary.green.hex,
      secondaryColor: BRAND_COLORS.primary.blue.hex,
      backgroundColor: BRAND_COLORS.primary.white.hex,
      textColor: BRAND_COLORS.primary.blue.hex,
      fontFamily: BRAND_TYPOGRAPHY.primary.family,
      showCustomization: customization.showCustomization
    });
  };

  const applyPattern = () => {
    setFiles(files.map(file => ({
      ...file,
      newName: pattern.replace('{original}', file.originalName).replace('{index}', file.id)
    })));
  };

  return (
    <div 
      className={`min-h-[600px] ${isFullscreen ? 'h-screen' : 'h-[calc(100vh-200px)]'} flex flex-col ${isFullscreen ? '' : 'rounded-lg'} overflow-hidden ${isFullscreen ? '' : 'shadow-lg'}`}
      style={{
        backgroundColor: customization.backgroundColor,
        color: customization.textColor,
        fontFamily: customization.fontFamily
      }}
    >
      {/* Header */}
      <div 
        className="h-16 flex items-center justify-between px-6 border-b"
        style={{
          backgroundColor: customization.secondaryColor,
          color: '#F5F5F5',
          borderColor: `${customization.secondaryColor}80`
        }}
      >
        <div className="flex items-center gap-4">
          <FileText className="w-6 h-6" />
          <h1 className="text-xl font-bold" style={{ fontFamily: customization.fontFamily }}>
            Renomeador em Lote
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={toggleCustomization}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
            title="Personalizar"
          >
            <Palette className="w-5 h-5" />
          </button>
          <button
            onClick={resetToBrand}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
            title="Restaurar identidade da marca"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Painel de Personalização */}
        {customization.showCustomization && (
          <div 
            className="w-80 border-r p-4 overflow-y-auto"
            style={{
              backgroundColor: customization.backgroundColor,
              borderColor: `${customization.textColor}20`
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold" style={{ fontFamily: customization.fontFamily }}>
                Personalização
              </h3>
              <button
                onClick={toggleCustomization}
                className="p-1 hover:bg-gray-200 rounded transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Cor Primária */}
              <div>
                <label className="block text-sm font-medium mb-2" style={{ fontFamily: customization.fontFamily }}>
                  Cor Primária
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={customization.primaryColor}
                    onChange={(e) => setCustomization(prev => ({ ...prev, primaryColor: e.target.value }))}
                    className="w-12 h-12 rounded border cursor-pointer"
                  />
                  <input
                    type="text"
                    value={customization.primaryColor}
                    onChange={(e) => setCustomization(prev => ({ ...prev, primaryColor: e.target.value }))}
                    className="flex-1 px-3 py-2 border rounded"
                    style={{ borderColor: `${customization.textColor}30` }}
                  />
                </div>
              </div>

              {/* Cor Secundária */}
              <div>
                <label className="block text-sm font-medium mb-2" style={{ fontFamily: customization.fontFamily }}>
                  Cor Secundária
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={customization.secondaryColor}
                    onChange={(e) => setCustomization(prev => ({ ...prev, secondaryColor: e.target.value }))}
                    className="w-12 h-12 rounded border cursor-pointer"
                  />
                  <input
                    type="text"
                    value={customization.secondaryColor}
                    onChange={(e) => setCustomization(prev => ({ ...prev, secondaryColor: e.target.value }))}
                    className="flex-1 px-3 py-2 border rounded"
                    style={{ borderColor: `${customization.textColor}30` }}
                  />
                </div>
              </div>

              {/* Cor de Fundo */}
              <div>
                <label className="block text-sm font-medium mb-2" style={{ fontFamily: customization.fontFamily }}>
                  Cor de Fundo
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={customization.backgroundColor}
                    onChange={(e) => setCustomization(prev => ({ ...prev, backgroundColor: e.target.value }))}
                    className="w-12 h-12 rounded border cursor-pointer"
                  />
                  <input
                    type="text"
                    value={customization.backgroundColor}
                    onChange={(e) => setCustomization(prev => ({ ...prev, backgroundColor: e.target.value }))}
                    className="flex-1 px-3 py-2 border rounded"
                    style={{ borderColor: `${customization.textColor}30` }}
                  />
                </div>
              </div>

              {/* Cor do Texto */}
              <div>
                <label className="block text-sm font-medium mb-2" style={{ fontFamily: customization.fontFamily }}>
                  Cor do Texto
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={customization.textColor}
                    onChange={(e) => setCustomization(prev => ({ ...prev, textColor: e.target.value }))}
                    className="w-12 h-12 rounded border cursor-pointer"
                  />
                  <input
                    type="text"
                    value={customization.textColor}
                    onChange={(e) => setCustomization(prev => ({ ...prev, textColor: e.target.value }))}
                    className="flex-1 px-3 py-2 border rounded"
                    style={{ borderColor: `${customization.textColor}30` }}
                  />
                </div>
              </div>

              {/* Fonte */}
              <div>
                <label className="block text-sm font-medium mb-2" style={{ fontFamily: customization.fontFamily }}>
                  Fonte
                </label>
                <select
                  value={customization.fontFamily}
                  onChange={(e) => setCustomization(prev => ({ ...prev, fontFamily: e.target.value }))}
                  className="w-full px-3 py-2 border rounded"
                  style={{ borderColor: `${customization.textColor}30` }}
                >
                  <option value="Nunito, sans-serif">Nunito (Padrão)</option>
                  <option value="Poppins, sans-serif">Poppins</option>
                  <option value="Inter, sans-serif">Inter</option>
                  <option value="Roboto, sans-serif">Roboto</option>
                  <option value="Open Sans, sans-serif">Open Sans</option>
                  <option value="Montserrat, sans-serif">Montserrat</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Conteúdo Principal */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Área de Upload */}
          <div 
            className="p-6 border-b"
            style={{ borderColor: `${customization.textColor}20` }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold" style={{ fontFamily: customization.fontFamily }}>
                Adicionar Arquivos
              </h2>
              <label
                className="flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer transition-colors font-medium"
                style={{
                  backgroundColor: customization.primaryColor,
                  color: customization.secondaryColor
                }}
              >
                <Upload className="w-5 h-5" />
                Selecionar Arquivos
                <input type="file" multiple className="hidden" />
              </label>
            </div>

            {/* Padrão de Renomeação */}
            <div className="space-y-2">
              <label className="block text-sm font-medium" style={{ fontFamily: customization.fontFamily }}>
                Padrão de Renomeação
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={pattern}
                  onChange={(e) => setPattern(e.target.value)}
                  placeholder="Ex: novo-nome-{index}"
                  className="flex-1 px-4 py-2 border rounded-lg"
                  style={{ borderColor: `${customization.textColor}30` }}
                />
                <button
                  onClick={applyPattern}
                  className="px-4 py-2 rounded-lg transition-colors font-medium"
                  style={{
                    backgroundColor: customization.primaryColor,
                    color: customization.secondaryColor
                  }}
                >
                  Aplicar
                </button>
              </div>
              <p className="text-xs opacity-70" style={{ fontFamily: customization.fontFamily }}>
                Use {'{original}'} para manter o nome original e {'{index}'} para numerar
              </p>
            </div>
          </div>

          {/* Lista de Arquivos */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold" style={{ fontFamily: customization.fontFamily }}>
                Arquivos ({files.length})
              </h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPreviewMode(!previewMode)}
                  className={`px-3 py-1 rounded text-sm transition-colors ${
                    previewMode ? 'opacity-100' : 'opacity-50'
                  }`}
                  style={{
                    backgroundColor: previewMode ? customization.primaryColor : 'transparent',
                    color: previewMode ? customization.secondaryColor : customization.textColor
                  }}
                >
                  Preview
                </button>
              </div>
            </div>

            <div className="space-y-3">
              {files.map((file) => (
                <div
                  key={file.id}
                  className="p-4 rounded-lg border flex items-center justify-between"
                  style={{
                    borderColor: `${customization.textColor}20`,
                    backgroundColor: `${customization.textColor}05`
                  }}
                >
                  <div className="flex items-center gap-4 flex-1">
                    <FileText 
                      className="w-8 h-8"
                      style={{ color: customization.primaryColor }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3">
                        <span 
                          className="text-sm font-medium truncate"
                          style={{ fontFamily: customization.fontFamily }}
                        >
                          {file.originalName}
                        </span>
                        <span className="text-gray-400">→</span>
                        <span 
                          className="text-sm font-semibold truncate"
                          style={{ 
                            color: customization.primaryColor,
                            fontFamily: customization.fontFamily
                          }}
                        >
                          {file.newName}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span 
                          className="text-xs px-2 py-0.5 rounded"
                          style={{
                            backgroundColor: `${customization.primaryColor}20`,
                            color: customization.primaryColor
                          }}
                        >
                          {file.status === 'pending' ? 'Pendente' : 'Renomeado'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {file.status === 'pending' ? (
                      <button
                        className="p-2 rounded-lg hover:bg-gray-200 transition-colors"
                        style={{ color: customization.primaryColor }}
                      >
                        <Check className="w-5 h-5" />
                      </button>
                    ) : (
                      <div 
                        className="p-2 rounded-lg"
                        style={{ color: customization.primaryColor }}
                      >
                        <Check className="w-5 h-5" />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer com Ações */}
          <div 
            className="p-4 border-t flex items-center justify-between"
            style={{ borderColor: `${customization.textColor}20` }}
          >
            <div className="text-sm opacity-70" style={{ fontFamily: customization.fontFamily }}>
              {files.filter(f => f.status === 'pending').length} arquivo(s) pendente(s)
            </div>
            <div className="flex gap-3">
              <button
                className="px-4 py-2 rounded-lg border transition-colors font-medium"
                style={{
                  borderColor: `${customization.textColor}30`,
                  color: customization.textColor
                }}
              >
                Cancelar
              </button>
              <button
                className="px-6 py-2 rounded-lg transition-colors font-medium flex items-center gap-2"
                style={{
                  backgroundColor: customization.primaryColor,
                  color: customization.secondaryColor
                }}
              >
                <Download className="w-5 h-5" />
                Renomear Arquivos
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Project2;

