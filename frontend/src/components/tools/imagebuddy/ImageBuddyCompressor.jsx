import { useState, useRef } from 'react';
import { 
  Upload, 
  Image as ImageIcon, 
  Download, 
  X, 
  Settings,
  History,
  Moon,
  Sun,
  FileImage,
  Zap,
  TrendingDown,
  CheckCircle2,
  Maximize2,
  Minus,
  FileType
} from 'lucide-react';
import { useTool } from '../../../contexts/ToolContext';

const ImageBuddyCompressor = () => {
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [compressedImage, setCompressedImage] = useState(null);
  const [compressedImageUrl, setCompressedImageUrl] = useState(null);
  const [quality, setQuality] = useState(80);
  const [isCompressing, setIsCompressing] = useState(false);
  const [outputFormat, setOutputFormat] = useState('original'); // original, jpeg, png, webp
  const [resizeEnabled, setResizeEnabled] = useState(false);
  const [maxWidth, setMaxWidth] = useState(1920);
  const [maxHeight, setMaxHeight] = useState(1080);
  const [maintainAspectRatio, setMaintainAspectRatio] = useState(true);
  const [originalDimensions, setOriginalDimensions] = useState({ width: 0, height: 0 });
  const { showHistory, setShowHistory, showSettings, setShowSettings, darkMode, setDarkMode } = useTool();
  const fileInputRef = useRef(null);
  const canvasRef = useRef(null);
  const imageRef = useRef(null);

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Por favor, selecione um arquivo de imagem válido.');
        return;
      }
      setImage(file);
      const url = URL.createObjectURL(file);
      setImageUrl(url);
      setCompressedImage(null);
      setCompressedImageUrl(null);
      
      // Detectar dimensões originais
      const img = new Image();
      img.onload = () => {
        setOriginalDimensions({ width: img.width, height: img.height });
        // Inicializar com as dimensões originais
        setMaxWidth(img.width);
        setMaxHeight(img.height);
      };
      img.src = url;
      
      // Detectar formato original
      if (file.type === 'image/jpeg' || file.type === 'image/jpg') {
        setOutputFormat('jpeg');
      } else if (file.type === 'image/png') {
        setOutputFormat('png');
      } else if (file.type === 'image/webp') {
        setOutputFormat('webp');
      } else {
        setOutputFormat('jpeg'); // Padrão para outros formatos
      }
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setImage(file);
      const url = URL.createObjectURL(file);
      setImageUrl(url);
      setCompressedImage(null);
      setCompressedImageUrl(null);
      
      // Detectar dimensões originais
      const img = new Image();
      img.onload = () => {
        setOriginalDimensions({ width: img.width, height: img.height });
        // Inicializar com as dimensões originais
        setMaxWidth(img.width);
        setMaxHeight(img.height);
      };
      img.src = url;
      
      // Detectar formato original
      if (file.type === 'image/jpeg' || file.type === 'image/jpg') {
        setOutputFormat('jpeg');
      } else if (file.type === 'image/png') {
        setOutputFormat('png');
      } else if (file.type === 'image/webp') {
        setOutputFormat('webp');
      } else {
        setOutputFormat('jpeg');
      }
    }
  };

  const compressImage = () => {
    if (!image || !imageUrl) return;

    setIsCompressing(true);
    const img = new Image();
    img.onload = () => {
      const canvas = canvasRef.current || document.createElement('canvas');
      
      // Calcular dimensões finais
      let finalWidth = img.width;
      let finalHeight = img.height;
      
      if (resizeEnabled) {
        if (maintainAspectRatio) {
          const aspectRatio = img.width / img.height;
          // Usar a largura como base e calcular altura proporcionalmente
          finalWidth = maxWidth;
          finalHeight = Math.round(maxWidth / aspectRatio);
        } else {
          // Sem manter proporções - usar exatamente os valores definidos
          finalWidth = maxWidth;
          finalHeight = maxHeight;
        }
      }
      
      canvas.width = finalWidth;
      canvas.height = finalHeight;
      const ctx = canvas.getContext('2d');
      
      // Configurar qualidade de renderização
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      
      ctx.drawImage(img, 0, 0, finalWidth, finalHeight);

      // Determinar MIME type baseado no formato escolhido
      let mimeType = image.type || 'image/jpeg';
      if (outputFormat === 'jpeg') {
        mimeType = 'image/jpeg';
      } else if (outputFormat === 'png') {
        mimeType = 'image/png';
      } else if (outputFormat === 'webp') {
        mimeType = 'image/webp';
      } else if (outputFormat === 'original') {
        mimeType = image.type || 'image/jpeg';
      }

      canvas.toBlob(
        (blob) => {
          if (blob) {
            setCompressedImage(blob);
            const url = URL.createObjectURL(blob);
            setCompressedImageUrl(url);
            setIsCompressing(false);
          }
        },
        mimeType,
        quality / 100
      );
    };
    img.src = imageUrl;
  };

  const downloadCompressed = () => {
    if (!compressedImage) return;
    const url = URL.createObjectURL(compressedImage);
    const a = document.createElement('a');
    a.href = url;
    
    // Determinar extensão baseada no formato
    let extension = '';
    if (outputFormat === 'jpeg') {
      extension = '.jpg';
    } else if (outputFormat === 'png') {
      extension = '.png';
    } else if (outputFormat === 'webp') {
      extension = '.webp';
    } else {
      // Manter extensão original
      const originalExt = image.name.split('.').pop();
      extension = originalExt ? `.${originalExt}` : '.jpg';
    }
    
    const baseName = image.name.replace(/\.[^/.]+$/, '');
    a.download = `compressed-${baseName}${extension}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const resetImage = () => {
    if (imageUrl) URL.revokeObjectURL(imageUrl);
    if (compressedImageUrl) URL.revokeObjectURL(compressedImageUrl);
    setImage(null);
    setImageUrl(null);
    setCompressedImage(null);
    setCompressedImageUrl(null);
    setOriginalDimensions({ width: 0, height: 0 });
    setQuality(80);
    setOutputFormat('original');
    setResizeEnabled(false);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const getCompressionRatio = () => {
    if (!image || !compressedImage) return 0;
    const originalSize = image.size;
    const compressedSize = compressedImage.size;
    return Math.round(((originalSize - compressedSize) / originalSize) * 100);
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-brand-white'} transition-colors`}>
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Área Principal */}
          <div className="col-span-12 lg:col-span-8">
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-xl border ${darkMode ? 'border-gray-700' : 'border-gray-200'} transition-colors`}>
              {imageUrl && (
                <div className={`px-4 py-3 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'} flex items-center justify-between`}>
                  <div className="flex items-center gap-2">
                    <ImageIcon className={`w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                    <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} font-poppins`}>
                      {image.name}
                    </span>
                    <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'} font-poppins`}>
                      ({formatFileSize(image.size)})
                    </span>
                  </div>
                  <button
                    onClick={resetImage}
                    className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all ${
                      darkMode
                        ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                    } font-poppins`}
                  >
                    <X className="w-4 h-4" />
                    Nova Imagem
                  </button>
                </div>
              )}

              {!imageUrl ? (
                <div
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`relative h-[500px] flex flex-col items-center justify-center border-2 border-dashed ${darkMode ? 'border-gray-600' : 'border-gray-300'} rounded-xl m-6 cursor-pointer hover:border-brand-green transition-all group`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <div className={`w-20 h-20 ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} rounded-2xl flex items-center justify-center mb-4 group-hover:bg-brand-green/10 transition-colors`}>
                    <Upload className={`w-10 h-10 ${darkMode ? 'text-gray-400' : 'text-gray-500'} group-hover:text-brand-green transition-colors`} />
                  </div>
                  <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-brand-blue-900'} font-nunito mb-2`}>
                    Arraste uma imagem aqui
                  </h3>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} font-poppins`}>
                    ou clique para selecionar
                  </p>
                  <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'} font-poppins mt-2`}>
                    PNG, JPG, GIF até 10MB
                  </p>
                </div>
              ) : (
                <div className="p-6">
                  {/* Comparação Antes/Depois */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    {/* Imagem Original */}
                    <div>
                      <div className={`flex items-center justify-between mb-3`}>
                        <h3 className={`text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'} font-poppins`}>
                          Original
                        </h3>
                        <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'} font-poppins`}>
                          {formatFileSize(image.size)}
                        </span>
                      </div>
                      <div className={`rounded-xl border-2 ${darkMode ? 'border-gray-700' : 'border-gray-200'} overflow-hidden bg-gray-100`}>
                        <img
                          ref={imageRef}
                          src={imageUrl}
                          alt="Original"
                          className="w-full h-auto max-h-[400px] object-contain mx-auto"
                        />
                      </div>
                    </div>

                    {/* Imagem Comprimida */}
                    <div>
                      <div className={`flex items-center justify-between mb-3`}>
                        <h3 className={`text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'} font-poppins`}>
                          Comprimida
                        </h3>
                        {compressedImage && (
                          <span className={`text-xs ${darkMode ? 'text-green-400' : 'text-green-600'} font-poppins font-semibold`}>
                            {formatFileSize(compressedImage.size)} ({getCompressionRatio()}% menor)
                          </span>
                        )}
                      </div>
                      <div className={`rounded-xl border-2 ${darkMode ? 'border-gray-700' : 'border-gray-200'} overflow-hidden bg-gray-100 min-h-[200px] flex items-center justify-center`}>
                        {compressedImageUrl ? (
                          <img
                            src={compressedImageUrl}
                            alt="Comprimida"
                            className="w-full h-auto max-h-[400px] object-contain mx-auto"
                          />
                        ) : isCompressing ? (
                          <div className="flex flex-col items-center gap-3">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-green"></div>
                            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} font-poppins`}>
                              Comprimindo...
                            </p>
                          </div>
                        ) : (
                          <div className={`text-center p-8 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                            <FileImage className="w-12 h-12 mx-auto mb-2 opacity-50" />
                            <p className="text-sm font-poppins">Clique em "Comprimir" para ver o resultado</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Controles de Compressão */}
                  <div className={`p-4 border-t ${darkMode ? 'border-gray-700 bg-gray-800/50' : 'border-gray-200 bg-gray-50'} transition-colors`}>
                    <div className="space-y-5">
                      {/* Formato de Saída */}
                      <div>
                        <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} font-poppins mb-3`}>
                          <FileType className="w-4 h-4 inline mr-2" />
                          Formato de Saída
                        </label>
                        <div className="grid grid-cols-4 gap-2">
                          {[
                            { value: 'original', label: 'Original' },
                            { value: 'jpeg', label: 'JPEG' },
                            { value: 'png', label: 'PNG' },
                            { value: 'webp', label: 'WebP' }
                          ].map((format) => (
                            <button
                              key={format.value}
                              onClick={() => setOutputFormat(format.value)}
                              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                                outputFormat === format.value
                                  ? 'bg-brand-green text-brand-blue-900 font-semibold'
                                  : darkMode
                                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                              } font-poppins`}
                            >
                              {format.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Controle de Qualidade */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} font-poppins`}>
                            Qualidade
                          </label>
                          <span className={`text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'} font-poppins`}>
                            {quality}%
                          </span>
                        </div>
                        <input
                          type="range"
                          min="10"
                          max="100"
                          value={quality}
                          onChange={(e) => setQuality(Number(e.target.value))}
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-green"
                        />
                        <div className="flex justify-between text-xs text-gray-500 mt-1 font-poppins">
                          <span>Menor tamanho</span>
                          <span>Melhor qualidade</span>
                        </div>
                      </div>

                      {/* Redimensionamento */}
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <label className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} font-poppins flex items-center gap-2`}>
                            <Maximize2 className="w-4 h-4" />
                            Redimensionar
                          </label>
                          <button
                            onClick={() => setResizeEnabled(!resizeEnabled)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                              resizeEnabled ? 'bg-brand-green' : darkMode ? 'bg-gray-600' : 'bg-gray-300'
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                resizeEnabled ? 'translate-x-6' : 'translate-x-1'
                              }`}
                            />
                          </button>
                        </div>
                        
                        {resizeEnabled && (
                          <div className={`p-4 rounded-xl border ${darkMode ? 'border-gray-600 bg-gray-700/30' : 'border-gray-200 bg-white'} space-y-3`}>
                            {originalDimensions.width > 0 && (
                              <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'} font-poppins mb-3`}>
                                Dimensões originais: {originalDimensions.width} × {originalDimensions.height}px
                              </p>
                            )}
                            
                            <div className="flex items-center gap-2 mb-3">
                              <input
                                type="checkbox"
                                id="maintainAspect"
                                checked={maintainAspectRatio}
                                onChange={(e) => setMaintainAspectRatio(e.target.checked)}
                                className="w-4 h-4 rounded border-gray-300 text-brand-green focus:ring-brand-green"
                              />
                              <label htmlFor="maintainAspect" className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'} font-poppins cursor-pointer`}>
                                Manter proporções
                              </label>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <label className={`block text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'} font-poppins mb-1`}>
                                  Largura (px)
                                </label>
                                <input
                                  type="number"
                                  min="1"
                                  max="10000"
                                  value={maxWidth}
                                  onChange={(e) => {
                                    const newWidth = Number(e.target.value);
                                    setMaxWidth(newWidth);
                                    if (maintainAspectRatio && originalDimensions.width > 0) {
                                      const aspectRatio = originalDimensions.width / originalDimensions.height;
                                      setMaxHeight(Math.round(newWidth / aspectRatio));
                                    }
                                  }}
                                  className={`w-full px-3 py-2 rounded-lg text-sm border ${
                                    darkMode
                                      ? 'bg-gray-700 border-gray-600 text-gray-300'
                                      : 'bg-white border-gray-300 text-gray-700'
                                  } focus:ring-2 focus:ring-brand-green focus:border-brand-green font-poppins`}
                                />
                              </div>
                              <div>
                                <label className={`block text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'} font-poppins mb-1`}>
                                  Altura (px)
                                </label>
                                <input
                                  type="number"
                                  min="1"
                                  max="10000"
                                  value={maxHeight}
                                  onChange={(e) => {
                                    const newHeight = Number(e.target.value);
                                    setMaxHeight(newHeight);
                                    if (maintainAspectRatio && originalDimensions.width > 0) {
                                      const aspectRatio = originalDimensions.width / originalDimensions.height;
                                      setMaxWidth(Math.round(newHeight * aspectRatio));
                                    }
                                  }}
                                  disabled={maintainAspectRatio}
                                  className={`w-full px-3 py-2 rounded-lg text-sm border ${
                                    darkMode
                                      ? 'bg-gray-700 border-gray-600 text-gray-300'
                                      : 'bg-white border-gray-300 text-gray-700'
                                  } focus:ring-2 focus:ring-brand-green focus:border-brand-green font-poppins disabled:opacity-50 disabled:cursor-not-allowed`}
                                />
                              </div>
                            </div>

                            {/* Presets rápidos */}
                            <div className="flex flex-wrap gap-2 pt-2">
                              {[
                                { label: 'HD (1280×720)', width: 1280, height: 720 },
                                { label: 'Full HD (1920×1080)', width: 1920, height: 1080 },
                                { label: '2K (2560×1440)', width: 2560, height: 1440 },
                                { label: '4K (3840×2160)', width: 3840, height: 2160 }
                              ].map((preset) => (
                                <button
                                  key={preset.label}
                                  onClick={() => {
                                    if (maintainAspectRatio && originalDimensions.width > 0) {
                                      const aspectRatio = originalDimensions.width / originalDimensions.height;
                                      // Usar largura do preset e calcular altura proporcionalmente
                                      setMaxWidth(preset.width);
                                      setMaxHeight(Math.round(preset.width / aspectRatio));
                                    } else {
                                      setMaxWidth(preset.width);
                                      setMaxHeight(preset.height);
                                    }
                                  }}
                                  className={`px-2 py-1 text-xs rounded-lg transition-colors ${
                                    darkMode
                                      ? 'bg-gray-600 hover:bg-gray-500 text-gray-300'
                                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                                  } font-poppins`}
                                >
                                  {preset.label}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Botão Comprimir */}
                      <button
                        onClick={compressImage}
                        disabled={isCompressing}
                        className={`w-full py-3 rounded-xl font-semibold flex items-center justify-center gap-2 ${
                          darkMode
                            ? 'bg-brand-green hover:bg-brand-green-500 text-brand-blue-900'
                            : 'bg-brand-green text-brand-blue-900 hover:bg-brand-green-500'
                        } transition-colors font-nunito disabled:opacity-50 disabled:cursor-not-allowed`}
                      >
                        <Zap className="w-5 h-5" />
                        {isCompressing ? 'Comprimindo...' : 'Comprimir Imagem'}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <canvas ref={canvasRef} className="hidden" />
            </div>
          </div>

          {/* Painel Lateral */}
          <div className="col-span-12 lg:col-span-4 flex flex-col">
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-xl border ${darkMode ? 'border-gray-700' : 'border-gray-200'} p-6 transition-colors flex flex-col h-full`}>
              <div className="flex items-center justify-between mb-6">
                <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-brand-blue-900'} font-nunito`}>
                  Informações
                </h2>
              </div>

              {/* Estatísticas */}
              {image && (
                <div className="space-y-4 mb-6">
                  <div className={`p-4 rounded-xl border ${darkMode ? 'border-gray-700 bg-gray-700/30' : 'border-gray-200 bg-gray-50/80'}`}>
                    <div className="flex items-center gap-2 mb-2">
                      <FileImage className={`w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                      <span className={`text-sm font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-800'} font-poppins`}>
                        Tamanho Original
                      </span>
                    </div>
                    <p className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-brand-blue-900'} font-nunito`}>
                      {formatFileSize(image.size)}
                    </p>
                  </div>

                  {compressedImage && (
                    <>
                      <div className={`p-4 rounded-xl border ${darkMode ? 'border-gray-700 bg-gray-700/30' : 'border-gray-200 bg-gray-50/80'}`}>
                        <div className="flex items-center gap-2 mb-2">
                          <TrendingDown className={`w-4 h-4 ${darkMode ? 'text-green-400' : 'text-green-600'}`} />
                          <span className={`text-sm font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-800'} font-poppins`}>
                            Tamanho Comprimido
                          </span>
                        </div>
                        <p className={`text-lg font-bold ${darkMode ? 'text-green-400' : 'text-green-600'} font-nunito`}>
                          {formatFileSize(compressedImage.size)}
                        </p>
                      </div>

                      <div className={`p-4 rounded-xl border ${darkMode ? 'border-gray-700 bg-gray-700/30' : 'border-gray-200 bg-gray-50/80'}`}>
                        <div className="flex items-center gap-2 mb-2">
                          <CheckCircle2 className={`w-4 h-4 ${darkMode ? 'text-brand-green' : 'text-brand-green'}`} />
                          <span className={`text-sm font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-800'} font-poppins`}>
                            Economia
                          </span>
                        </div>
                        <p className={`text-2xl font-bold ${darkMode ? 'text-brand-green' : 'text-brand-green'} font-nunito`}>
                          {getCompressionRatio()}%
                        </p>
                        <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'} font-poppins mt-1`}>
                          {formatFileSize(image.size - compressedImage.size)} economizados
                        </p>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Botão Download */}
              {compressedImage && (
                <div className="mt-auto pt-6 border-t border-gray-200 dark:border-gray-700">
                  <button
                    onClick={downloadCompressed}
                    className={`w-full py-3 rounded-xl font-semibold flex items-center justify-center gap-2 ${
                      darkMode
                        ? 'bg-brand-green hover:bg-brand-green-500 text-brand-blue-900'
                        : 'bg-brand-green text-brand-blue-900 hover:bg-brand-green-500'
                    } transition-colors font-nunito`}
                  >
                    <Download className="w-5 h-5" />
                    Baixar Imagem Comprimida
                  </button>
                </div>
              )}

              {/* Placeholder quando não há imagem */}
              {!image && (
                <div className={`text-center py-12 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                  <FileImage className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p className="text-sm font-poppins">
                    Carregue uma imagem para ver as informações de compressão
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageBuddyCompressor;

