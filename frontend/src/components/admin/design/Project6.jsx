import { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import JSZip from 'jszip';
import { 
  Upload,
  FileText,
  Download,
  X,
  Edit2,
  Hash,
  Calendar,
  Type,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Bell,
  Trash2,
  Copy,
  RefreshCw,
  GripVertical,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { BRAND_COLORS, BRAND_TYPOGRAPHY } from '../../../config/brand';
import Input from '../../ui/Input';
import Select from '../../ui/Select';

const Project6 = ({ isFullscreen = false }) => {
  const [customization, setCustomization] = useState({
    primaryColor: BRAND_COLORS.primary.green.hex,
    secondaryColor: BRAND_COLORS.primary.blue.hex,
    backgroundColor: '#F5F5F5',
    textColor: BRAND_COLORS.primary.blue.hex,
    fontFamily: BRAND_TYPOGRAPHY.primary.family,
    showCustomization: false
  });

  const [files, setFiles] = useState([]);
  const [renameMode, setRenameMode] = useState('batch'); // 'batch' ou 'individual'
  const [selectedPatterns, setSelectedPatterns] = useState({
    sequential: true,
    date: false,
    custom: false
  }); // Múltiplos padrões podem ser selecionados
  const [customPrefix, setCustomPrefix] = useState('');
  const [customSuffix, setCustomSuffix] = useState('');
  const [startNumber, setStartNumber] = useState(1);
  const [dateFormat, setDateFormat] = useState('YYYY-MM-DD');
  const [renamedFiles, setRenamedFiles] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState(null);
  const fileInputRef = useRef(null);
  const dropZoneRef = useRef(null);

  // Função para gerar nome de arquivo baseado nos padrões selecionados
  const generateFileName = (originalName, index) => {
    const extension = originalName.split('.').pop();
    const nameWithoutExt = originalName.substring(0, originalName.lastIndexOf('.')) || originalName;
    
    const parts = [];

    // Adicionar prefixo personalizado se houver
    if (customPrefix) {
      parts.push(customPrefix);
    }

    // Adicionar data se selecionado
    if (selectedPatterns.date) {
      const now = new Date();
      let dateStr = '';
      
      if (dateFormat === 'YYYY-MM-DD') {
        dateStr = now.toISOString().split('T')[0];
      } else if (dateFormat === 'DD-MM-YYYY') {
        const day = String(now.getDate()).padStart(2, '0');
        const month = String(now.getMonth() + 1).padStart(2, '0');
        dateStr = `${day}-${month}-${now.getFullYear()}`;
      } else if (dateFormat === 'YYYYMMDD') {
        dateStr = now.toISOString().split('T')[0].replace(/-/g, '');
      }
      
      parts.push(dateStr);
    }

    // Adicionar número sequencial se selecionado
    if (selectedPatterns.sequential) {
      const paddedNumber = String(startNumber + index).padStart(3, '0');
      parts.push(paddedNumber);
    }

    // Adicionar nome original se personalizado estiver selecionado
    if (selectedPatterns.custom) {
      parts.push(nameWithoutExt);
    }

    // Se nenhum padrão estiver selecionado e não houver prefixo/sufixo, usar nome padrão
    if (parts.length === 0 && !customPrefix && !customSuffix) {
      parts.push(`arquivo_${index + 1}`);
    }

    // Juntar as partes com underscore
    let newName = parts.length > 0 ? parts.join('_') : '';

    // Adicionar sufixo se houver
    if (customSuffix) {
      newName = newName ? `${newName}_${customSuffix}` : customSuffix;
    }

    // Se ainda estiver vazio, usar nome padrão
    if (!newName) {
      newName = `arquivo_${index + 1}`;
    }

    return `${newName}.${extension}`;
  };

  // Atualizar preview quando mudar configurações
  useEffect(() => {
    if (files.length > 0) {
      const preview = files.map((file, index) => ({
        original: file.name,
        renamed: generateFileName(file.name, index),
        file: file
      }));
      setRenamedFiles(preview);
    } else {
      setRenamedFiles([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [files, selectedPatterns, customPrefix, customSuffix, startNumber, dateFormat]);

  // Handlers de upload
  const handleFileSelect = (selectedFiles) => {
    const fileArray = Array.from(selectedFiles);
    const newFiles = fileArray.map(file => ({
      id: Date.now() + Math.random(),
      file: file,
      name: file.name,
      size: file.size,
      type: file.type
    }));
    setFiles(prev => [...prev, ...newFiles]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFiles = e.dataTransfer.files;
    handleFileSelect(droppedFiles);
  };

  const handleDropZoneDragOver = (e) => {
    e.preventDefault();
  };

  const removeFile = (fileId) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const clearAll = () => {
    setFiles([]);
    setRenamedFiles([]);
  };

  // Renomear arquivo individual
  const updateIndividualName = (fileId, newName) => {
    setRenamedFiles(prev => prev.map(item => {
      if (item.file.id === fileId) {
        const extension = item.original.split('.').pop();
        return {
          ...item,
          renamed: newName.endsWith(`.${extension}`) ? newName : `${newName}.${extension}`
        };
      }
      return item;
    }));
  };

  // Reorganizar arquivos - o useEffect vai recalcular os nomes automaticamente
  const reorderFiles = (fromIndex, toIndex) => {
    setFiles(prevFiles => {
      const newFiles = [...prevFiles];
      const [movedFile] = newFiles.splice(fromIndex, 1);
      newFiles.splice(toIndex, 0, movedFile);
      return newFiles;
    });
    // O useEffect vai recalcular renamedFiles automaticamente baseado na nova ordem
  };

  // Handlers de drag and drop
  const handleDragStart = (index) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;
    
    // Reorganizar arquivos e recalcular nomes
    reorderFiles(draggedIndex, index);
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  // Mover arquivo para cima ou para baixo e recalcular nomes
  const moveFile = (index, direction) => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= renamedFiles.length) return;
    reorderFiles(index, newIndex);
  };

  // Processar renomeação e download
  const processRename = async () => {
    if (files.length === 0) return;
    
    setIsProcessing(true);
    
    try {
      // Criar ZIP com arquivos renomeados
      const zip = new JSZip();

      // Para cada arquivo, adicionar ao ZIP com o novo nome
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const renamedItem = renamedFiles.find(r => r.file.id === file.id);
        const newName = renamedItem ? renamedItem.renamed : file.name;
        
        zip.file(newName, file.file);
      }

      // Gerar ZIP
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(zipBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'arquivos_renomeados.zip';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setIsProcessing(false);
    } catch (error) {
      console.error('Erro ao processar arquivos:', error);
      setIsProcessing(false);
    }
  };

  // Formatar tamanho do arquivo
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const toggleCustomization = () => {
    setCustomization(prev => ({ ...prev, showCustomization: !prev.showCustomization }));
  };

  const resetToBrand = () => {
    setCustomization({
      primaryColor: BRAND_COLORS.primary.green.hex,
      secondaryColor: BRAND_COLORS.primary.blue.hex,
      backgroundColor: '#F5F5F5',
      textColor: BRAND_COLORS.primary.blue.hex,
      fontFamily: BRAND_TYPOGRAPHY.primary.family,
      showCustomization: customization.showCustomization
    });
  };

  return (
    <div 
      className={`${isFullscreen ? 'h-screen' : 'h-[calc(100vh-200px)]'} flex flex-col overflow-hidden ${isFullscreen ? '' : 'rounded-lg shadow-lg'} relative`}
      style={{
        backgroundColor: customization.backgroundColor || '#F5F5F5',
        color: customization.textColor,
        fontFamily: customization.fontFamily
      }}
    >
      {/* Customization Panel */}
      {customization.showCustomization && (
        <div 
          className="absolute top-0 right-0 w-80 h-full bg-white shadow-2xl z-50 p-6 overflow-y-auto border-l"
          style={{ borderColor: `${customization.textColor}20` }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold" style={{ fontFamily: customization.fontFamily }}>
              Personalização
            </h3>
            <button
              onClick={toggleCustomization}
              className="p-2 hover:bg-gray-100 rounded transition-colors"
            >
              <span className="text-xl">×</span>
            </button>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Cor Primária</label>
              <div className="flex gap-2">
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
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Cor Secundária</label>
              <div className="flex gap-2">
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
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Cor de Fundo</label>
              <div className="flex gap-2">
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
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Cor do Texto</label>
              <div className="flex gap-2">
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
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Fonte</label>
              <select
                value={customization.fontFamily}
                onChange={(e) => setCustomization(prev => ({ ...prev, fontFamily: e.target.value }))}
                className="w-full px-3 py-2 border rounded"
              >
                <option value="Nunito, sans-serif">Nunito</option>
                <option value="Poppins, sans-serif">Poppins</option>
                <option value="Inter, sans-serif">Inter</option>
                <option value="Roboto, sans-serif">Roboto</option>
              </select>
            </div>
            <button
              onClick={resetToBrand}
              className="w-full px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              Restaurar Identidade da Marca
            </button>
          </div>
        </div>
      )}

      {/* Scrollable Content Container */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        {/* Header */}
        <div 
          className="sticky top-0 z-40 px-6 py-4 border-b backdrop-blur-md"
          style={{ 
            backgroundColor: `${customization.backgroundColor || '#F5F5F5'}F5`,
            borderColor: `${customization.textColor}10`
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 
                className="text-2xl font-bold mb-1"
                style={{ 
                  color: customization.secondaryColor,
                  fontFamily: customization.fontFamily
                }}
              >
                Renomeador de Arquivos
              </h1>
              <p 
                className="text-sm opacity-70"
                style={{ fontFamily: customization.fontFamily }}
              >
                Renomeie arquivos individualmente ou em lote com padrões personalizados
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                className="p-2 rounded-lg hover:bg-gray-200 transition-colors relative"
                title="Notificações"
              >
                <Bell className="w-5 h-5" style={{ color: customization.textColor }} />
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full" style={{ backgroundColor: customization.primaryColor }}></span>
              </button>
              <button
                onClick={toggleCustomization}
                className="p-2 rounded-lg hover:bg-gray-200 transition-colors"
                title="Personalizar"
              >
                <Sparkles className="w-5 h-5" style={{ color: customization.primaryColor }} />
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-6 space-y-6">
          {/* Upload Area */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h2 
                className="text-lg font-bold"
                style={{ 
                  color: customization.secondaryColor,
                  fontFamily: customization.fontFamily
                }}
              >
                Adicionar Arquivos
              </h2>
              {files.length > 0 && (
                <button
                  onClick={clearAll}
                  className="text-sm font-semibold text-red-600 hover:text-red-700 transition-colors flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Limpar tudo
                </button>
              )}
            </div>
            
            <div
              ref={dropZoneRef}
              onDrop={handleDrop}
              onDragOver={handleDropZoneDragOver}
              className="border-2 border-dashed rounded-lg p-12 text-center transition-colors hover:border-brand-green cursor-pointer"
              style={{ 
                borderColor: files.length > 0 ? customization.primaryColor : `${customization.textColor}30`,
                backgroundColor: files.length > 0 ? `${customization.primaryColor}05` : 'transparent'
              }}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                multiple
                className="hidden"
                onChange={(e) => handleFileSelect(e.target.files)}
              />
              <Upload className="w-12 h-12 mx-auto mb-4" style={{ color: customization.primaryColor }} />
              <p className="text-lg font-semibold mb-2" style={{ color: customization.secondaryColor }}>
                Arraste arquivos aqui ou clique para selecionar
              </p>
              <p className="text-sm opacity-70" style={{ fontFamily: customization.fontFamily }}>
                Suporta múltiplos arquivos de qualquer tipo
              </p>
              {files.length > 0 && (
                <p className="text-sm mt-4 font-semibold" style={{ color: customization.primaryColor }}>
                  {files.length} arquivo(s) adicionado(s)
                </p>
              )}
            </div>
          </div>

          {/* Configuration Panel */}
          {files.length > 0 && (
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h2 
                  className="text-lg font-bold"
                  style={{ 
                    color: customization.secondaryColor,
                    fontFamily: customization.fontFamily
                  }}
                >
                  Configurações de Renomeação
                </h2>
              </div>

              {/* Mode Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-3" style={{ fontFamily: customization.fontFamily }}>
                  Modo de Renomeação
                </label>
                <div className="flex gap-4">
                  <button
                    onClick={() => setRenameMode('batch')}
                    className={`px-6 py-3 rounded-lg font-semibold transition-all flex items-center gap-2 ${
                      renameMode === 'batch' 
                        ? 'text-white' 
                        : 'border-2'
                    }`}
                    style={renameMode === 'batch' ? {
                      backgroundColor: customization.primaryColor,
                      color: 'white'
                    } : {
                      borderColor: `${customization.textColor}30`,
                      color: customization.textColor
                    }}
                  >
                    <Hash 
                      className="w-5 h-5" 
                      style={{ 
                        color: renameMode === 'batch' ? 'white' : customization.textColor 
                      }} 
                    />
                    Em Lote
                  </button>
                  <button
                    onClick={() => setRenameMode('individual')}
                    className={`px-6 py-3 rounded-lg font-semibold transition-all flex items-center gap-2 ${
                      renameMode === 'individual' 
                        ? 'text-white' 
                        : 'border-2'
                    }`}
                    style={renameMode === 'individual' ? {
                      backgroundColor: customization.primaryColor,
                      color: 'white'
                    } : {
                      borderColor: `${customization.textColor}30`,
                      color: customization.textColor
                    }}
                  >
                    <Edit2 
                      className="w-5 h-5" 
                      style={{ 
                        color: renameMode === 'individual' ? 'white' : customization.textColor 
                      }} 
                    />
                    Individual
                  </button>
                </div>
              </div>

              {/* Batch Configuration */}
              {renameMode === 'batch' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ fontFamily: customization.fontFamily }}>
                      Padrões de Renomeação (pode selecionar múltiplos)
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      <button
                        onClick={() => setSelectedPatterns(prev => ({ ...prev, sequential: !prev.sequential }))}
                        className={`p-4 rounded-lg border-2 transition-all flex flex-col items-center justify-center ${
                          selectedPatterns.sequential 
                            ? 'border-brand-green bg-brand-green/10' 
                            : 'border-gray-200'
                        }`}
                      >
                        <Hash 
                          className="w-6 h-6 mx-auto mb-2" 
                          style={{ 
                            color: selectedPatterns.sequential 
                              ? customization.secondaryColor 
                              : customization.primaryColor 
                          }} 
                        />
                        <p 
                          className="text-sm font-semibold"
                          style={{ 
                            color: selectedPatterns.sequential 
                              ? customization.secondaryColor 
                              : customization.textColor 
                          }}
                        >
                          Sequencial
                        </p>
                        {selectedPatterns.sequential && (
                          <CheckCircle2 className="w-4 h-4 mt-1" style={{ color: customization.secondaryColor }} />
                        )}
                      </button>
                      <button
                        onClick={() => setSelectedPatterns(prev => ({ ...prev, date: !prev.date }))}
                        className={`p-4 rounded-lg border-2 transition-all flex flex-col items-center justify-center ${
                          selectedPatterns.date 
                            ? 'border-brand-green bg-brand-green/10' 
                            : 'border-gray-200'
                        }`}
                      >
                        <Calendar 
                          className="w-6 h-6 mx-auto mb-2" 
                          style={{ 
                            color: selectedPatterns.date 
                              ? customization.secondaryColor 
                              : customization.primaryColor 
                          }} 
                        />
                        <p 
                          className="text-sm font-semibold"
                          style={{ 
                            color: selectedPatterns.date 
                              ? customization.secondaryColor 
                              : customization.textColor 
                          }}
                        >
                          Data
                        </p>
                        {selectedPatterns.date && (
                          <CheckCircle2 className="w-4 h-4 mt-1" style={{ color: customization.secondaryColor }} />
                        )}
                      </button>
                      <button
                        onClick={() => setSelectedPatterns(prev => ({ ...prev, custom: !prev.custom }))}
                        className={`p-4 rounded-lg border-2 transition-all flex flex-col items-center justify-center ${
                          selectedPatterns.custom 
                            ? 'border-brand-green bg-brand-green/10' 
                            : 'border-gray-200'
                        }`}
                      >
                        <Type 
                          className="w-6 h-6 mx-auto mb-2" 
                          style={{ 
                            color: selectedPatterns.custom 
                              ? customization.secondaryColor 
                              : customization.primaryColor 
                          }} 
                        />
                        <p 
                          className="text-sm font-semibold"
                          style={{ 
                            color: selectedPatterns.custom 
                              ? customization.secondaryColor 
                              : customization.textColor 
                          }}
                        >
                          Personalizado
                        </p>
                        {selectedPatterns.custom && (
                          <CheckCircle2 className="w-4 h-4 mt-1" style={{ color: customization.secondaryColor }} />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ fontFamily: customization.fontFamily }}>
                        Prefixo
                      </label>
                      <Input
                        type="text"
                        value={customPrefix}
                        onChange={(e) => setCustomPrefix(e.target.value)}
                        placeholder="Ex: foto_"
                        style={{ fontFamily: customization.fontFamily }}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ fontFamily: customization.fontFamily }}>
                        Sufixo
                      </label>
                      <Input
                        type="text"
                        value={customSuffix}
                        onChange={(e) => setCustomSuffix(e.target.value)}
                        placeholder="Ex: _final"
                        style={{ fontFamily: customization.fontFamily }}
                      />
                    </div>
                  </div>

                  {selectedPatterns.sequential && (
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ fontFamily: customization.fontFamily }}>
                        Número Inicial
                      </label>
                      <Input
                        type="number"
                        value={startNumber}
                        onChange={(e) => setStartNumber(parseInt(e.target.value) || 1)}
                        min="1"
                        style={{ fontFamily: customization.fontFamily }}
                      />
                    </div>
                  )}

                  {selectedPatterns.date && (
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ fontFamily: customization.fontFamily }}>
                        Formato de Data
                      </label>
                      <Select
                        value={dateFormat}
                        onChange={(e) => setDateFormat(e.target.value)}
                        style={{ fontFamily: customization.fontFamily }}
                      >
                        <option value="YYYY-MM-DD">2025-01-15</option>
                        <option value="DD-MM-YYYY">15-01-2025</option>
                        <option value="YYYYMMDD">20250115</option>
                      </Select>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Preview Area */}
          {files.length > 0 && (
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h2 
                  className="text-lg font-bold"
                  style={{ 
                    color: customization.secondaryColor,
                    fontFamily: customization.fontFamily
                  }}
                >
                  Preview de Renomeação
                </h2>
                <button
                  onClick={processRename}
                  disabled={isProcessing || files.length === 0}
                  className="px-6 py-3 rounded-lg font-semibold text-sm transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    backgroundColor: customization.primaryColor,
                    color: customization.secondaryColor
                  }}
                >
                  {isProcessing ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      Processando...
                    </>
                  ) : (
                    <>
                      <Download className="w-5 h-5" />
                      Baixar Arquivos Renomeados
                    </>
                  )}
                </button>
              </div>

              <div className="space-y-3 max-h-96 overflow-y-auto">
                {renamedFiles.map((item, index) => (
                  <div
                    key={item.file.id}
                    draggable
                    onDragStart={() => handleDragStart(index)}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDragEnd={handleDragEnd}
                    className={`flex items-center gap-4 p-4 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors cursor-move ${
                      draggedIndex === index ? 'opacity-50 bg-gray-100' : ''
                    }`}
                  >
                    {/* Controles de reorganização */}
                    <div className="flex flex-col gap-1 flex-shrink-0">
                      <button
                        onClick={() => moveFile(index, 'up')}
                        disabled={index === 0}
                        className="p-1 rounded hover:bg-gray-200 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                        title="Mover para cima"
                      >
                        <ArrowUp className="w-4 h-4" style={{ color: customization.textColor }} />
                      </button>
                      <div className="flex items-center justify-center p-1">
                        <GripVertical className="w-4 h-4 opacity-50" style={{ color: customization.textColor }} />
                      </div>
                      <button
                        onClick={() => moveFile(index, 'down')}
                        disabled={index === renamedFiles.length - 1}
                        className="p-1 rounded hover:bg-gray-200 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                        title="Mover para baixo"
                      >
                        <ArrowDown className="w-4 h-4" style={{ color: customization.textColor }} />
                      </button>
                    </div>

                    <FileText className="w-8 h-8 flex-shrink-0" style={{ color: customization.primaryColor }} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm font-semibold truncate" style={{ color: customization.secondaryColor }}>
                          {item.original}
                        </p>
                        <span className="text-xs opacity-50">({formatFileSize(item.file.size)})</span>
                      </div>
                      {renameMode === 'individual' ? (
                        <Input
                          type="text"
                          value={item.renamed.replace(/\.[^/.]+$/, '')}
                          onChange={(e) => updateIndividualName(item.file.id, e.target.value)}
                          className="text-sm py-1.5"
                          style={{ fontFamily: customization.fontFamily }}
                        />
                      ) : (
                        <div className="flex items-center gap-2">
                          <ArrowRight className="w-4 h-4 opacity-50" />
                          <p className="text-sm font-medium" style={{ color: customization.primaryColor }}>
                            {item.renamed}
                          </p>
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => removeFile(item.file.id)}
                      className="p-2 rounded-lg hover:bg-red-50 transition-colors text-red-600 flex-shrink-0"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {files.length === 0 && (
            <div className="bg-white rounded-xl p-12 text-center border border-gray-100">
              <FileText className="w-16 h-16 mx-auto mb-4 opacity-30" style={{ color: customization.textColor }} />
              <p className="text-lg font-semibold mb-2" style={{ color: customization.secondaryColor }}>
                Nenhum arquivo adicionado
              </p>
              <p className="text-sm opacity-70" style={{ fontFamily: customization.fontFamily }}>
                Adicione arquivos para começar a renomeação
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Project6;

