import { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Upload, 
  Image as ImageIcon, 
  Palette, 
  Download, 
  Copy, 
  X, 
  RotateCw,
  Filter,
  Sparkles,
  TrendingUp,
  History,
  Settings,
  Moon,
  Sun,
  CheckCircle2,
  RefreshCw,
  FileText,
  Layers,
  Wand2,
  BarChart3,
  Share2,
  Save,
  FileCode,
  Image as ImageExport,
  Code,
  GitBranch,
  Zap,
  Trash2,
  RotateCcw,
  ArrowLeft,
  ArrowRight,
  AlertTriangle,
  Plus
} from 'lucide-react';
import { useTool } from '../../../contexts/ToolContext';
import PixelZoomPanel from './components/PixelZoomPanel';
import PalettePanel from './components/PalettePanel';
import ExportModal from './components/ExportModal';
import AnalysisModal from './components/AnalysisModal';
import { BRAND_COLOR_NAMES } from '../../../config/brand';
import { exportPaletteSvg } from './services/exporters/svgExporter';
import { usePaletteExport } from './hooks/usePaletteExport';

const ColorBuddyExtractor = () => {
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [colors, setColors] = useState([]);
  const [selectedColor, setSelectedColor] = useState(null);
  const colorIdCounter = useRef(1); // Contador para IDs �nicos das cores
  const { showHistory, setShowHistory, showSettings, setShowSettings, darkMode, setDarkMode } = useTool();
  const [showExport, setShowExport] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [extractionMode, setExtractionMode] = useState('auto'); // auto, manual, grid, gradient
  const [colorCount, setColorCount] = useState(8);
  const [paletteHistory, setPaletteHistory] = useState([]);
  const [showComplementary, setShowComplementary] = useState(false);
  const [exportFormats, setExportFormats] = useState([]); // Array de formatos selecionados
  const [paletteName, setPaletteName] = useState(''); // Nome da paleta para exportação
  const [gradientType, setGradientType] = useState('linear'); // linear, radial, conic
  const [exportAsGradient, setExportAsGradient] = useState(false); // Exportar como gradiente ou cores separadas
  const [showColorModal, setShowColorModal] = useState(null); // null ou o índice da cor selecionada
  const [copiedCode, setCopiedCode] = useState(null); // { colorIndex, format }
  const [showCopiedTooltip, setShowCopiedTooltip] = useState(null); // { colorIndex, format, x, y }
  const [isAddingColor, setIsAddingColor] = useState(false); // Se está em modo de adicionar cor
  const [magnifier, setMagnifier] = useState({ 
    show: false, 
    x: 0, 
    y: 0 
  }); // Estado da lupinha
  const [colorPoints, setColorPoints] = useState([]); // Array de pontos de cor coletados manualmente [{ relX, relY, colorIndex }] - coordenadas relativas (0-1)
  const [draggingColorPoint, setDraggingColorPoint] = useState(null); // Índice do ponto sendo arrastado
  const canvasRef = useRef(null);
  const imageRef = useRef(null);
  const fileInputRef = useRef(null);
  const extractionCanvasRef = useRef(null); // Canvas temporário para extração
  const magnifierCanvasRef = useRef(null); // Canvas para a lupinha
  const imageContainerRef = useRef(null); // Container da imagem
  const pixelZoomCanvasRef = useRef(null); // Canvas para o PixelZoomViewer
  const [pixelZoomPosition, setPixelZoomPosition] = useState(null); // Posição para o PixelZoomViewer

  // Função para converter coordenadas relativas da imagem (0-1) para coordenadas da tela
  const getScreenPositionFromRelative = useCallback((relX, relY) => {
    if (!imageRef.current) return { x: 0, y: 0 };
    
    const container = imageRef.current.parentElement;
    if (!container) return { x: 0, y: 0 };
    
    const containerRect = container.getBoundingClientRect();
    const centerX = containerRect.width / 2;
    const centerY = containerRect.height / 2;
    
    const img = imageRef.current;
    const imgDisplayWidth = img.naturalWidth;
    const imgDisplayHeight = img.naturalHeight;
    
    // Converter coordenadas relativas (0-1) para coordenadas da tela
    const screenX = centerX + (relX - 0.5) * imgDisplayWidth;
    const screenY = centerY + (relY - 0.5) * imgDisplayHeight;
    
    return { x: screenX, y: screenY };
  }, []);

  // Função para converter coordenadas da tela para coordenadas relativas da imagem (0-1)
  const getRelativePositionFromScreen = useCallback((clientX, clientY) => {
    if (!imageRef.current) return { relX: 0, relY: 0 };
    
    const container = imageRef.current.parentElement;
    if (!container) return { relX: 0, relY: 0 };
    
    const containerRect = container.getBoundingClientRect();
    const centerX = containerRect.width / 2;
    const centerY = containerRect.height / 2;
    
    const mouseX = clientX - containerRect.left;
    const mouseY = clientY - containerRect.top;
    
    const img = imageRef.current;
    const imgDisplayWidth = img.naturalWidth;
    const imgDisplayHeight = img.naturalHeight;
    
    // Converter coordenadas da tela para coordenadas relativas (0-1)
    const relX = (mouseX - centerX) / imgDisplayWidth + 0.5;
    const relY = (mouseY - centerY) / imgDisplayHeight + 0.5;
    
    return { relX, relY };
  }, []);

  // Função para converter RGB para CMYK
  const rgbToCmyk = useCallback((r, g, b) => {
    const rNorm = r / 255;
    const gNorm = g / 255;
    const bNorm = b / 255;
    const k = 1 - Math.max(rNorm, gNorm, bNorm);
    const c = k === 1 ? 0 : (1 - rNorm - k) / (1 - k);
    const m = k === 1 ? 0 : (1 - gNorm - k) / (1 - k);
    const y = k === 1 ? 0 : (1 - bNorm - k) / (1 - k);
    return {
      c: Math.round(c * 100),
      m: Math.round(m * 100),
      y: Math.round(y * 100),
      k: Math.round(k * 100)
    };
  }, []);

  // Função para gerar nome de cor baseado em RGB
  const generateColorName = useCallback((r, g, b) => {
    // Nomes básicos de cores baseados em valores RGB
    const hue = Math.atan2(Math.sqrt(3) * (g - b), 2 * r - g - b) * 180 / Math.PI;
    const saturation = (Math.max(r, g, b) - Math.min(r, g, b)) / Math.max(r, g, b, 1);
    const brightness = (r + g + b) / 3;
    
    let name = '';
    
    if (brightness < 30) name = 'Preto';
    else if (brightness > 225) name = 'Branco';
    else if (saturation < 0.1) name = brightness > 128 ? 'Cinza Claro' : 'Cinza Escuro';
    else {
      if (hue < 15 || hue > 345) name = 'Vermelho';
      else if (hue < 45) name = 'Laranja';
      else if (hue < 75) name = 'Amarelo';
      else if (hue < 150) name = 'Verde';
      else if (hue < 210) name = 'Ciano';
      else if (hue < 270) name = 'Azul';
      else if (hue < 330) name = 'Roxo';
      else name = 'Rosa';
      
      if (brightness < 85) name = 'Escuro ' + name;
      else if (brightness > 170) name = 'Claro ' + name;
    }
    
    return name;
  }, []);

  // Função para criar objeto de cor completo
  const createColorObject = useCallback((r, g, b, name = null, dominant = false) => {
    const hex = `#${[r, g, b].map(v => Math.round(v).toString(16).padStart(2, '0')).join('')}`;
    const rgb = `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`;
    const cmyk = rgbToCmyk(r, g, b);
    const cmykStr = `cmyk(${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%)`;
    // ID será atribuído quando a cor for adicionada à paleta
    
    return {
      hex,
      rgb,
      cmyk: cmykStr,
      name: name || generateColorName(r, g, b),
      dominant
    };
  }, [rgbToCmyk, generateColorName]);

  // Extração automática de cores (quantização)
  const extractAutoColors = useCallback((img) => {
    if (!img) return [];

    const tempCanvas = document.createElement('canvas');
    const maxSize = 300; // Reduzir para performance
    const scale = Math.min(maxSize / img.width, maxSize / img.height, 1);
    tempCanvas.width = Math.floor(img.width * scale);
    tempCanvas.height = Math.floor(img.height * scale);
    const tempCtx = tempCanvas.getContext('2d');
    tempCtx.drawImage(img, 0, 0, tempCanvas.width, tempCanvas.height);
    
    const imageData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
    const pixels = imageData.data;
    const colorMap = new Map();
    
    // Amostrar pixels (a cada 4 pixels para performance)
    for (let i = 0; i < pixels.length; i += 16) {
      const r = pixels[i];
      const g = pixels[i + 1];
      const b = pixels[i + 2];
      const a = pixels[i + 3];
      
      if (a < 128) continue; // Ignorar pixels transparentes
      
      // Quantização mais agressiva para agrupar cores similares
      const quantizedR = Math.floor(r / 32) * 32;
      const quantizedG = Math.floor(g / 32) * 32;
      const quantizedB = Math.floor(b / 32) * 32;
      const key = `${quantizedR},${quantizedG},${quantizedB}`;
      
      colorMap.set(key, (colorMap.get(key) || 0) + 1);
    }
    
    // Ordenar por frequência e pegar as cores mais comuns
    const sortedColors = Array.from(colorMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, colorCount)
      .map(([key], index) => {
        const [r, g, b] = key.split(',').map(Number);
        return createColorObject(r, g, b, null, index < 2); // Primeiras 2 são dominantes
      });
    
    return sortedColors;
  }, [colorCount, createColorObject]);

  // Extração manual (clicar na imagem)
  const extractManualColor = useCallback((clientX, clientY) => {
    if (!imageRef.current) return null;
    
    const img = imageRef.current;
    const imgRect = img.getBoundingClientRect();
    
    // Calcular posi��o do mouse relativa � imagem renderizada
    const mouseX = clientX - imgRect.left;
    const mouseY = clientY - imgRect.top;
    
    // Tamanho da imagem renderizada na tela
    const imgDisplayWidth = imgRect.width;
    const imgDisplayHeight = imgRect.height;
    
    // Verificar se o mouse est� dentro da imagem
    if (mouseX < 0 || mouseX >= imgDisplayWidth || mouseY < 0 || mouseY >= imgDisplayHeight) {
      return null;
    }
    
    // Calcular a propor��o entre o tamanho renderizado e o tamanho natural
    const scaleX = img.naturalWidth / imgDisplayWidth;
    const scaleY = img.naturalHeight / imgDisplayHeight;
    
    // Converter coordenadas do mouse para coordenadas da imagem original
    const imgX = Math.floor(mouseX * scaleX);
    const imgY = Math.floor(mouseY * scaleY);
    
    // Validar limites
    if (imgX < 0 || imgX >= img.naturalWidth || imgY < 0 || imgY >= img.naturalHeight) {
      return null;
    }
    
    // Criar canvas tempor�rio para extrair cor
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = img.naturalWidth;
    tempCanvas.height = img.naturalHeight;
    const tempCtx = tempCanvas.getContext('2d');
    tempCtx.drawImage(img, 0, 0);
    
    const imageData = tempCtx.getImageData(imgX, imgY, 1, 1);
    const [r, g, b, a] = imageData.data;
    
    if (a < 128) return null; // Ignorar pixels transparentes
    
    return createColorObject(r, g, b);
  }, [createColorObject]);

  // Extração por grade
  const extractGridColors = useCallback((img) => {
    if (!img) return [];
    
    const gridSize = Math.ceil(Math.sqrt(colorCount));
    const stepX = img.naturalWidth / (gridSize + 1);
    const stepY = img.naturalHeight / (gridSize + 1);
    
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = img.naturalWidth;
    tempCanvas.height = img.naturalHeight;
    const tempCtx = tempCanvas.getContext('2d');
    tempCtx.drawImage(img, 0, 0);
    
    const colors = [];
    for (let row = 1; row <= gridSize; row++) {
      for (let col = 1; col <= gridSize; col++) {
        if (colors.length >= colorCount) break;
        
        const x = Math.floor(col * stepX);
        const y = Math.floor(row * stepY);
        
        const imageData = tempCtx.getImageData(x, y, 1, 1);
        const [r, g, b, a] = imageData.data;
        
        if (a >= 128) {
          colors.push(createColorObject(r, g, b, null, colors.length < 2));
        }
      }
      if (colors.length >= colorCount) break;
    }
    
    return colors;
  }, [colorCount, createColorObject]);

  // Extração por gradiente
  const extractGradientColors = useCallback((img) => {
    if (!img) return [];
    
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = img.naturalWidth;
    tempCanvas.height = img.naturalHeight;
    const tempCtx = tempCanvas.getContext('2d');
    tempCtx.drawImage(img, 0, 0);
    
    const colors = [];
    const centerX = img.naturalWidth / 2;
    const centerY = img.naturalHeight / 2;
    const maxRadius = Math.sqrt(centerX * centerX + centerY * centerY);
    
    for (let i = 0; i < colorCount; i++) {
      let x, y;
      
      if (gradientType === 'linear') {
        x = (i / (colorCount - 1)) * img.naturalWidth;
        y = centerY;
      } else if (gradientType === 'radial') {
        const angle = (i / colorCount) * Math.PI * 2;
        const radius = (i / (colorCount - 1)) * maxRadius * 0.8;
        x = centerX + Math.cos(angle) * radius;
        y = centerY + Math.sin(angle) * radius;
      } else { // conic
        const angle = (i / colorCount) * Math.PI * 2;
        const radius = maxRadius * 0.6;
        x = centerX + Math.cos(angle) * radius;
        y = centerY + Math.sin(angle) * radius;
      }
      
      x = Math.max(0, Math.min(img.naturalWidth - 1, Math.floor(x)));
      y = Math.max(0, Math.min(img.naturalHeight - 1, Math.floor(y)));
      
      const imageData = tempCtx.getImageData(x, y, 1, 1);
      const [r, g, b, a] = imageData.data;
      
      if (a >= 128) {
        colors.push(createColorObject(r, g, b, null, i < 2));
      }
    }
    
    return colors;
  }, [colorCount, gradientType, createColorObject]);

  // Função principal de extração baseada no modo
  const extractColors = useCallback(() => {
    if (!imageRef.current) return;
    
    let extractedColors = [];
    
    switch (extractionMode) {
      case 'auto':
        extractedColors = extractAutoColors(imageRef.current);
        break;
      case 'manual':
        // Manual será acionado por clique na imagem
        return;
      case 'gradient':
        extractedColors = extractGradientColors(imageRef.current);
        break;
      default:
        extractedColors = extractAutoColors(imageRef.current);
    }
    
    if (extractedColors.length > 0) {
      setColors(prevColors => {
        // Se não havia cores antes, resetar o contador
        if (prevColors.length === 0) {
          colorIdCounter.current = 1;
        }
        // Atribuir IDs sequenciais começando do contador atual
        const colorsWithIds = extractedColors.map((color, index) => ({
          ...color,
          id: `color-${colorIdCounter.current + index}`
        }));
        colorIdCounter.current += extractedColors.length;
        
        if (image) {
          setPaletteHistory(prev => [{
            name: image.name || 'Imagem',
            colors: colorsWithIds,
            date: new Date()
          }, ...prev.slice(0, 9)]);
        }
        
        return colorsWithIds;
      });
    }
  }, [extractionMode, extractAutoColors, extractGradientColors, image]);

  // Garantir que todas as cores tenham um ID (migração de cores antigas)
  useEffect(() => {
    setColors(prevColors => {
      let needsUpdate = false;
      const updatedColors = prevColors.map((color, index) => {
        if (!color.id) {
          needsUpdate = true;
          return { ...color, id: `color-${colorIdCounter.current++}` };
        }
        return color;
      });
      return needsUpdate ? updatedColors : prevColors;
    });
  }, []);

  // Extrair cores automaticamente quando a imagem carregar
  useEffect(() => {
    if (imageUrl && imageRef.current && extractionMode === 'auto') {
      const img = imageRef.current;
      
      const extractOnLoad = () => {
        setTimeout(() => {
          extractColors();
        }, 100);
      };
      
      // Modo automático desativado - não extrair cores automaticamente ao carregar imagem
      // if (img.complete && img.naturalWidth > 0 && img.naturalHeight > 0) {
      //   extractOnLoad();
      // } else {
      //   // Adicionar listener para quando a imagem carregar
      //   img.addEventListener('load', extractOnLoad);
      //   return () => {
      //     img.removeEventListener('load', extractOnLoad);
      //   };
      // }
    }
  }, [imageUrl, extractionMode, extractColors]);

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0] || e.dataTransfer?.files?.[0];
    if (file && file.type.startsWith('image/')) {
      // Liberar URL anterior se existir
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl);
      }
      const url = URL.createObjectURL(file);
      setImage(file);
      setImageUrl(url);
      setColors([]); // Limpar cores anteriores
      colorIdCounter.current = 1; // Resetar contador quando limpar todas as cores
      // Resetar o input para permitir selecionar o mesmo arquivo novamente
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
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
    handleFileUpload(e);
  };



  // Função para atualizar a lupinha
  const updateMagnifier = useCallback((clientX, clientY) => {
    if (!magnifierCanvasRef.current || !imageRef.current) return;

    const img = imageRef.current;
    const container = img.parentElement;
    if (!container) return;

    const containerRect = container.getBoundingClientRect();
    const imgRect = img.getBoundingClientRect();
    const magnifierCanvas = magnifierCanvasRef.current;
    const magnifierCtx = magnifierCanvas.getContext('2d');
    
    // Calcular posi��o do mouse relativa � imagem renderizada
    const mouseX = clientX - imgRect.left;
    const mouseY = clientY - imgRect.top;
    
    // Tamanho da imagem renderizada na tela
    const imgDisplayWidth = imgRect.width;
    const imgDisplayHeight = imgRect.height;
    
    // Verificar se o mouse est� dentro da imagem
    if (mouseX < 0 || mouseX >= imgDisplayWidth || mouseY < 0 || mouseY >= imgDisplayHeight) {
      return;
    }
    
    // Calcular a propor��o entre o tamanho renderizado e o tamanho natural
    const scaleX = img.naturalWidth / imgDisplayWidth;
    const scaleY = img.naturalHeight / imgDisplayHeight;
    
    // Converter coordenadas do mouse para coordenadas da imagem original
    const imgX = Math.floor(mouseX * scaleX);
    const imgY = Math.floor(mouseY * scaleY);
    
    // Validar limites
    if (imgX < 0 || imgX >= img.naturalWidth || imgY < 0 || imgY >= img.naturalHeight) {
      return;
    }
    
    // Tamanho da �rea ampliada (60x60 pixels da imagem para zoom 2x)
    const zoomSize = 60;
    const magnifierSize = 120;
    
    // Desenhar área ampliada
    magnifierCtx.imageSmoothingEnabled = false;
    magnifierCtx.clearRect(0, 0, magnifierSize, magnifierSize);
    
    // Criar canvas temporário para extrair a área
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = img.naturalWidth;
    tempCanvas.height = img.naturalHeight;
    const tempCtx = tempCanvas.getContext('2d');
    tempCtx.drawImage(img, 0, 0);
    
    magnifierCtx.drawImage(
      tempCanvas,
      Math.max(0, imgX - zoomSize / 2),
      Math.max(0, imgY - zoomSize / 2),
      zoomSize,
      zoomSize,
      0,
      0,
      magnifierSize,
      magnifierSize
    );
    
    // Desenhar cruz no centro (mais visível)
    const crossCenterX = magnifierSize / 2;
    const crossCenterY = magnifierSize / 2;
    const crossLength = 20; // Tamanho da cruz
    
    // Sombra da cruz (preto) para contraste
    magnifierCtx.strokeStyle = 'rgba(0, 0, 0, 0.8)';
    magnifierCtx.lineWidth = 4;
    magnifierCtx.beginPath();
    magnifierCtx.moveTo(crossCenterX, crossCenterY - crossLength);
    magnifierCtx.lineTo(crossCenterX, crossCenterY + crossLength);
    magnifierCtx.moveTo(crossCenterX - crossLength, crossCenterY);
    magnifierCtx.lineTo(crossCenterX + crossLength, crossCenterY);
    magnifierCtx.stroke();
    
    // Cruz principal (branco)
    magnifierCtx.strokeStyle = '#ffffff';
    magnifierCtx.lineWidth = 2;
    magnifierCtx.beginPath();
    magnifierCtx.moveTo(crossCenterX, crossCenterY - crossLength);
    magnifierCtx.lineTo(crossCenterX, crossCenterY + crossLength);
    magnifierCtx.moveTo(crossCenterX - crossLength, crossCenterY);
    magnifierCtx.lineTo(crossCenterX + crossLength, crossCenterY);
    magnifierCtx.stroke();
    
    // Círculo no centro para indicar o pixel exato
    magnifierCtx.fillStyle = '#ffffff';
    magnifierCtx.beginPath();
    magnifierCtx.arc(crossCenterX, crossCenterY, 2, 0, Math.PI * 2);
    magnifierCtx.fill();
    magnifierCtx.strokeStyle = '#000000';
    magnifierCtx.lineWidth = 1;
    magnifierCtx.stroke();
  }, []);

  // Verificar se o clique foi em um ponto de cor existente
  const getColorPointAtPosition = (clientX, clientY) => {
    if (!imageRef.current || colorPoints.length === 0) return null;
    
    const container = imageRef.current.parentElement;
    if (!container) return null;
    
    const containerRect = container.getBoundingClientRect();
    const mouseX = clientX - containerRect.left;
    const mouseY = clientY - containerRect.top;
    
    // Verificar se o clique está próximo de algum ponto de cor
    for (let i = 0; i < colorPoints.length; i++) {
      const point = colorPoints[i];
      // Calcular posição na tela do ponto baseado nas coordenadas relativas
      // Compatibilidade: se o ponto tiver coordenadas antigas (x, y), usar diretamente
      let screenPos;
      if (point.relX !== undefined && point.relY !== undefined) {
        screenPos = getScreenPositionFromRelative(point.relX, point.relY);
      } else if (point.x !== undefined && point.y !== undefined) {
        // Compatibilidade com pontos antigos
        screenPos = { x: point.x, y: point.y };
      } else {
        continue;
      }
      
      const distance = Math.sqrt(
        Math.pow(mouseX - screenPos.x, 2) + Math.pow(mouseY - screenPos.y, 2)
      );
      
      if (distance < 20) { // Raio de 20px para detectar clique
        return i;
      }
    }
    
    return null;
  };

  const handleImageMouseDown = (e) => {
    // Se estiver no modo manual ou gradiente
    if ((extractionMode === 'manual' || extractionMode === 'gradient') && imageRef.current) {
      // Verificar se clicou em um ponto de cor existente
      const pointIndex = getColorPointAtPosition(e.clientX, e.clientY);
      
      if (pointIndex !== null) {
        // Iniciar arrasto do ponto de cor
        setDraggingColorPoint(pointIndex);
        setIsAddingColor(true); // Ativar lupa durante o arrasto
        setMagnifier({
          show: true,
          x: e.clientX,
          y: e.clientY
        });
        updateMagnifier(e.clientX, e.clientY);
        return;
      }
      
      // Se já está em modo de adicionar cor, coletar a cor
      if (isAddingColor) {
        const color = extractManualColor(e.clientX, e.clientY);
        if (color) {
          // Calcular coordenadas relativas da imagem (0-1)
          const { relX, relY } = getRelativePositionFromScreen(e.clientX, e.clientY);
          
          // Adicionar cor e ponto com coordenadas relativas
          setColors(prev => {
            // Se não havia cores antes, resetar o contador
            if (prev.length === 0) {
              colorIdCounter.current = 1;
            }
            // Atribuir ID sequencial
            const newColor = {
              ...color,
              id: `color-${colorIdCounter.current++}`
            };
            const newColors = [...prev, newColor];
            // Remover limite de cores para modo manual e gradiente
            if (extractionMode === 'manual' || extractionMode === 'gradient') {
              return newColors;
            }
            return newColors.slice(0, colorCount);
          });
          
          setColorPoints(prev => {
            const newIndex = prev.length; // Usar o tamanho do array antes de adicionar
            return [...prev, {
              relX: relX,  // Armazenar coordenada relativa X (0-1)
              relY: relY,  // Armazenar coordenada relativa Y (0-1)
              colorIndex: newIndex
            }];
          });
        }
        
        // Desativar modo de adicionar e esconder lupinha
        setIsAddingColor(false);
        setMagnifier({ show: false, x: 0, y: 0 });
        return;
      } else {
        // Primeiro clique: ativar lupinha
        setIsAddingColor(true);
        setMagnifier({
          show: true,
          x: e.clientX,
          y: e.clientY
        });
        updateMagnifier(e.clientX, e.clientY);
        return;
      }
    }
  };

  const handleImageMouseMove = (e) => {
    // Atualizar posição do PixelZoomViewer sempre que o mouse se mover sobre a imagem
    if (imageRef.current && pixelZoomCanvasRef.current) {
      const img = imageRef.current;
      const imgRect = img.getBoundingClientRect();
      const mouseX = e.clientX - imgRect.left;
      const mouseY = e.clientY - imgRect.top;
      
      const isInsideImage = 
        mouseX >= 0 &&
        mouseX < imgRect.width &&
        mouseY >= 0 &&
        mouseY < imgRect.height;
      
      if (isInsideImage) {
        // Converter coordenadas do display para coordenadas do canvas
        const scaleX = img.naturalWidth / imgRect.width;
        const scaleY = img.naturalHeight / imgRect.height;
        const canvasX = mouseX * scaleX;
        const canvasY = mouseY * scaleY;
        
        setPixelZoomPosition({ x: canvasX, y: canvasY });
      } else {
        setPixelZoomPosition(null);
      }
    }
    
    // Se estiver arrastando um ponto de cor
    if (draggingColorPoint !== null && imageRef.current) {
      // Verificar se o mouse est� dentro da imagem
      const img = imageRef.current;
      const imgRect = img.getBoundingClientRect();
      const relativeX = e.clientX - imgRect.left;
      const relativeY = e.clientY - imgRect.top;
      
      const isInsideImage = 
        relativeX >= 0 &&
        relativeX < imgRect.width &&
        relativeY >= 0 &&
        relativeY < imgRect.height;
      
      if (isInsideImage) {
        // Calcular coordenadas relativas da imagem (0-1)
        const { relX, relY } = getRelativePositionFromScreen(e.clientX, e.clientY);
        
        // Atualizar posição do ponto com coordenadas relativas
        setColorPoints(prev => prev.map((point, index) => 
          index === draggingColorPoint 
            ? { ...point, relX: relX, relY: relY }
            : point
        ));
        
        // Atualizar lupa
        setMagnifier(prev => ({
          ...prev,
          show: true,
          x: e.clientX,
          y: e.clientY
        }));
        updateMagnifier(e.clientX, e.clientY);
      } else {
        // Se sair da imagem durante o arrasto, esconder a lupa
        setMagnifier({ show: false, x: 0, y: 0 });
      }
      return;
    }
    
    // Se estiver no modo manual ou gradiente e adicionando cor, atualizar lupinha
    if ((extractionMode === 'manual' || extractionMode === 'gradient') && isAddingColor && imageRef.current) {
      // Verificar se o mouse est� dentro da imagem
      const img = imageRef.current;
      const imgRect = img.getBoundingClientRect();
      const relativeX = e.clientX - imgRect.left;
      const relativeY = e.clientY - imgRect.top;
      
      const isInsideImage = 
        relativeX >= 0 &&
        relativeX < imgRect.width &&
        relativeY >= 0 &&
        relativeY < imgRect.height;
      
      if (isInsideImage) {
        setMagnifier(prev => ({
          ...prev,
          show: true,
          x: e.clientX,
          y: e.clientY
        }));
        updateMagnifier(e.clientX, e.clientY);
      } else {
        // Se sair da imagem, esconder a lupa
        setMagnifier({ show: false, x: 0, y: 0 });
      }
    }
    
  };

  const handleImageMouseUp = (e) => {
    // Se estava arrastando um ponto de cor, coletar nova cor
    if (draggingColorPoint !== null && imageRef.current) {
      const color = extractManualColor(e.clientX, e.clientY);
      if (color) {
        // Atualizar a cor no índice correspondente
        setColors(prev => prev.map((c, index) => 
          index === colorPoints[draggingColorPoint].colorIndex ? color : c
        ));
      }
      
      setDraggingColorPoint(null);
      setIsAddingColor(false);
      setMagnifier({ show: false, x: 0, y: 0 });
    }
    
    setIsDragging(false);
  };

  const handleImageMouseLeave = () => {
    setIsDragging(false);
    // Ocultar a lupa quando o mouse sair do container
    if (isAddingColor) {
      setMagnifier({ show: false, x: 0, y: 0 });
    }
  };

  // Listener global para rastrear o mouse quando estiver em modo de adicionar cor
  useEffect(() => {
    if (!isAddingColor || (extractionMode !== 'manual' && extractionMode !== 'gradient')) return;

    const handleGlobalMouseMove = (e) => {
      // Verificar se o mouse está dentro da imagem renderizada
      if (!imageContainerRef.current || !imageRef.current) return;
      
      const img = imageRef.current;
      const imgRect = img.getBoundingClientRect();
      const mouseX = e.clientX;
      const mouseY = e.clientY;
      
      // Calcular posi��o do mouse relativa � imagem renderizada
      const relativeX = mouseX - imgRect.left;
      const relativeY = mouseY - imgRect.top;
      
      // Verificar se o mouse est� dentro da imagem renderizada
      const isInsideImage = 
        relativeX >= 0 &&
        relativeX < imgRect.width &&
        relativeY >= 0 &&
        relativeY < imgRect.height;
      
      // Se estiver dentro da imagem, mostrar e atualizar a lupa
      if (isInsideImage) {
        setMagnifier(prev => ({
          ...prev,
          show: true,
          x: e.clientX,
          y: e.clientY
        }));
        updateMagnifier(e.clientX, e.clientY);
      } else {
        // Se sair da imagem, esconder a lupa
        setMagnifier({ show: false, x: 0, y: 0 });
      }
    };

    window.addEventListener('mousemove', handleGlobalMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleGlobalMouseMove);
    };
  }, [isAddingColor, extractionMode, updateMagnifier]);

  // Sincronizar canvas do PixelZoomViewer com a imagem carregada
  useEffect(() => {
    if (!imageRef.current || !pixelZoomCanvasRef.current || !imageUrl) return;
    
    const img = imageRef.current;
    const canvas = pixelZoomCanvasRef.current;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return;
    
    // Aguardar a imagem carregar completamente
    if (!img.complete || img.naturalWidth === 0) {
      const handleImageLoad = () => {
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        ctx.drawImage(img, 0, 0);
        // Posi��o inicial no centro da imagem
        setPixelZoomPosition({
          x: img.naturalWidth / 2,
          y: img.naturalHeight / 2,
        });
      };
      
      img.addEventListener('load', handleImageLoad);
      return () => img.removeEventListener('load', handleImageLoad);
    }
    
    // Imagem j� est� carregada
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    ctx.drawImage(img, 0, 0);
    // Posi��o inicial no centro da imagem
    setPixelZoomPosition({
      x: img.naturalWidth / 2,
      y: img.naturalHeight / 2,
    });
  }, [imageUrl]);

  // Função para remover cor da paleta
  const clearAllColors = () => {
    setColors([]);
    setColorPoints([]);
    setSelectedColor(null);
    colorIdCounter.current = 1;
  };

  const removeColor = (index) => {
    setColors(prev => {
      const newColors = prev.filter((_, i) => i !== index);
      
      // Se todas as cores foram removidas, resetar o contador
      if (newColors.length === 0) {
        colorIdCounter.current = 1;
        setColorPoints([]);
      } else {
        // Reorganizar IDs para 1, 2, 3, etc.
        return newColors.map((color, newIndex) => ({
          ...color,
          id: `color-${newIndex + 1}`
        }));
      }
      
      return newColors;
    });
    
    setColorPoints(prev => prev.filter(point => point.colorIndex !== index).map(point => 
      point.colorIndex > index ? { ...point, colorIndex: point.colorIndex - 1 } : point
    ));
    if (selectedColor && colors[index] && selectedColor.hex === colors[index].hex) {
      setSelectedColor(null);
    }
    if (showColorModal === index) {
      setShowColorModal(null);
    }
  };

  const copyColor = (color, format, colorIndex, event) => {
    let text = '';
    switch(format) {
      case 'hex': text = color.hex; break;
      case 'rgb': text = color.rgb; break;
      case 'cmyk': text = color.cmyk; break;
      default: text = color.hex;
    }
    navigator.clipboard.writeText(text).then(() => {
      // Resetar estados anteriores imediatamente
      setCopiedCode(null);
      setShowCopiedTooltip(null);

      // Pequeno delay para garantir que o reset foi aplicado
      setTimeout(() => {
      setCopiedCode({ colorIndex, format });

        // Mostrar tooltip personalizado
        if (event) {
          const rect = event.target.getBoundingClientRect();
          setShowCopiedTooltip({
            colorIndex,
            format,
            x: rect.left + rect.width / 2,
            y: rect.top - 45
          });
        }

        // Resetar após 2 segundos
        setTimeout(() => {
          setCopiedCode(null);
          setShowCopiedTooltip(null);
        }, 2000);
      }, 10);
    }).catch(() => {
      alert(`Erro ao copiar ${format.toUpperCase()}`);
    });
  };

  // Função para sanitizar nome de arquivo
  const sanitizeFileName = (name) => {
    return name
      .replace(/[^a-z0-9]/gi, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
      .toLowerCase() || 'paleta';
  };

  // Função para aproximar código Pantone baseado em RGB
  const approximatePantone = (r, g, b) => {
    // Esta é uma aproximação simplificada
    // Pantone real requer uma tabela de referência completa
    
    // Calcular luminosidade
    const lightness = (r * 0.299 + g * 0.587 + b * 0.114) / 255;
    
    // Determinar tipo baseado em luminosidade e saturação
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const saturation = max === 0 ? 0 : (max - min) / max;
    
    // Código base Pantone (formato simplificado)
    let baseCode = '';
    
    if (lightness < 0.2) {
      baseCode = 'Black';
    } else if (lightness > 0.9) {
      baseCode = 'White';
    } else if (saturation < 0.1) {
      // Tons de cinza
      const grayValue = Math.round(lightness * 10);
      baseCode = `Cool Gray ${grayValue}C`;
    } else {
      // Cores saturadas - aproximação baseada em matiz
      const hue = Math.atan2(Math.sqrt(3) * (g - b), 2 * r - g - b) * 180 / Math.PI;
      const hueNormalized = (hue + 360) % 360;
      
      // Categorizar por matiz
      if (hueNormalized < 15 || hueNormalized > 345) {
        baseCode = 'Red';
      } else if (hueNormalized < 45) {
        baseCode = 'Orange';
      } else if (hueNormalized < 75) {
        baseCode = 'Yellow';
      } else if (hueNormalized < 150) {
        baseCode = 'Green';
      } else if (hueNormalized < 210) {
        baseCode = 'Cyan';
      } else if (hueNormalized < 270) {
        baseCode = 'Blue';
      } else if (hueNormalized < 330) {
        baseCode = 'Purple';
      } else {
        baseCode = 'Pink';
      }
      
      // Adicionar número baseado em luminosidade e saturação
      const number = Math.round((lightness * 0.5 + saturation * 0.5) * 20);
      baseCode += ` ${number}C`;
    }
    
    return baseCode;
  };

  // Função para interpolar entre duas cores RGB
  const interpolateColor = (color1, color2, factor) => {
    const hex1 = color1.hex.replace('#', '');
    const hex2 = color2.hex.replace('#', '');
    
    const r1 = parseInt(hex1.substr(0, 2), 16);
    const g1 = parseInt(hex1.substr(2, 2), 16);
    const b1 = parseInt(hex1.substr(4, 2), 16);
    
    const r2 = parseInt(hex2.substr(0, 2), 16);
    const g2 = parseInt(hex2.substr(2, 2), 16);
    const b2 = parseInt(hex2.substr(4, 2), 16);
    
    const r = Math.round(r1 + (r2 - r1) * factor);
    const g = Math.round(g1 + (g2 - g1) * factor);
    const b = Math.round(b1 + (b2 - b1) * factor);
    
    return `#${[r, g, b].map(x => {
      const hex = x.toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    }).join('')}`;
  };

  // Função para converter RGB para Lab (espaço de cor perceptualmente uniforme)
  const rgbToLab = (r, g, b) => {
    // Normalizar RGB para 0-1
    r = r / 255;
    g = g / 255;
    b = b / 255;

    // Converter para sRGB
    r = r > 0.04045 ? Math.pow((r + 0.055) / 1.055, 2.4) : r / 12.92;
    g = g > 0.04045 ? Math.pow((g + 0.055) / 1.055, 2.4) : g / 12.92;
    b = b > 0.04045 ? Math.pow((b + 0.055) / 1.055, 2.4) : b / 12.92;

    // Converter para XYZ
    let x = (r * 0.4124 + g * 0.3576 + b * 0.1805) / 0.95047;
    let y = (r * 0.2126 + g * 0.7152 + b * 0.0722) / 1.00000;
    let z = (r * 0.0193 + g * 0.1192 + b * 0.9505) / 1.08883;

    x = x > 0.008856 ? Math.pow(x, 1/3) : (7.787 * x + 16/116);
    y = y > 0.008856 ? Math.pow(y, 1/3) : (7.787 * y + 16/116);
    z = z > 0.008856 ? Math.pow(z, 1/3) : (7.787 * z + 16/116);

    return {
      L: (116 * y) - 16,
      a: 500 * (x - y),
      b: 200 * (y - z)
    };
  };

  // Função para converter Lab para RGB
  const labToRgb = (L, a, b) => {
    let y = (L + 16) / 116;
    let x = a / 500 + y;
    let z = y - b / 200;

    x = 0.95047 * (x * x * x > 0.008856 ? x * x * x : (x - 16/116) / 7.787);
    y = 1.00000 * (y * y * y > 0.008856 ? y * y * y : (y - 16/116) / 7.787);
    z = 1.08883 * (z * z * z > 0.008856 ? z * z * z : (z - 16/116) / 7.787);

    let r = x *  3.2406 + y * -1.5372 + z * -0.4986;
    let g = x * -0.9689 + y *  1.8758 + z *  0.0415;
    let bl = x *  0.0557 + y * -0.2040 + z *  1.0570;

    r = r > 0.0031308 ? 1.055 * Math.pow(r, 1/2.4) - 0.055 : 12.92 * r;
    g = g > 0.0031308 ? 1.055 * Math.pow(g, 1/2.4) - 0.055 : 12.92 * g;
    bl = bl > 0.0031308 ? 1.055 * Math.pow(bl, 1/2.4) - 0.055 : 12.92 * bl;

    return {
      r: Math.max(0, Math.min(255, Math.round(r * 255))),
      g: Math.max(0, Math.min(255, Math.round(g * 255))),
      b: Math.max(0, Math.min(255, Math.round(bl * 255)))
    };
  };

  // Função para interpolar em espaço Lab (perceptualmente uniforme)
  const interpolateColorLab = (color1, color2, factor) => {
    const hex1 = color1.hex.replace('#', '');
    const hex2 = color2.hex.replace('#', '');
    
    const r1 = parseInt(hex1.substr(0, 2), 16);
    const g1 = parseInt(hex1.substr(2, 2), 16);
    const b1 = parseInt(hex1.substr(4, 2), 16);
    
    const r2 = parseInt(hex2.substr(0, 2), 16);
    const g2 = parseInt(hex2.substr(2, 2), 16);
    const b2 = parseInt(hex2.substr(4, 2), 16);
    
    const lab1 = rgbToLab(r1, g1, b1);
    const lab2 = rgbToLab(r2, g2, b2);
    
    const lab = {
      L: lab1.L + (lab2.L - lab1.L) * factor,
      a: lab1.a + (lab2.a - lab1.a) * factor,
      b: lab1.b + (lab2.b - lab1.b) * factor
    };
    
    const rgb = labToRgb(lab.L, lab.a, lab.b);
    
    return `#${[rgb.r, rgb.g, rgb.b].map(x => {
      const hex = x.toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    }).join('')}`;
  };

  // Função para gerar stops de gradiente suaves (para preview e SVG)
  const generateGradientStops = useCallback((numStops = 100) => {
    if (colors.length < 2) return colors.map(c => c.hex);
    
    const stops = [];
    const segments = colors.length - 1;
    const stopsPerSegment = Math.ceil(numStops / segments);
    
    for (let i = 0; i < segments; i++) {
      const color1 = colors[i];
      const color2 = colors[i + 1];
      
      for (let j = 0; j < stopsPerSegment; j++) {
        const factor = j / stopsPerSegment;
        // Usar interpolação Lab para transições mais suaves
        const interpolatedHex = interpolateColorLab(color1, color2, factor);
        stops.push(interpolatedHex);
      }
    }
    
    // Adicionar última cor
    stops.push(colors[colors.length - 1].hex);
    
    return stops;
  }, [colors]);

  // Função para gerar cores interpoladas do gradiente
  const generateGradientColors = useCallback((steps = 20) => {
    if (colors.length < 2) return colors;
    
    const gradientColors = [];
    const segments = colors.length - 1;
    
    for (let i = 0; i < segments; i++) {
      const color1 = colors[i];
      const color2 = colors[i + 1];
      const segmentSteps = Math.ceil(steps / segments);
      
      for (let j = 0; j < segmentSteps; j++) {
        const factor = j / segmentSteps;
        const interpolatedHex = interpolateColor(color1, color2, factor);
        
        // Converter HEX para RGB para criar objeto de cor
        const hex = interpolatedHex.replace('#', '');
        const r = parseInt(hex.substr(0, 2), 16);
        const g = parseInt(hex.substr(2, 2), 16);
        const b = parseInt(hex.substr(4, 2), 16);
        
        gradientColors.push(createColorObject(r, g, b, `${color1.name} → ${color2.name} (${Math.round(factor * 100)}%)`));
      }
    }
    
    // Adicionar última cor
    gradientColors.push(colors[colors.length - 1]);
    
    return gradientColors;
  }, [colors, createColorObject]);

  // Função para exportar paleta
  const { exportPalette } = usePaletteExport(colors);

  const generateComplementary = (color) => {
    // Simular geração de cores complementares
    return [
      { hex: '#FFE5E5', name: 'Light Coral' },
      { hex: '#FFB3B3', name: 'Medium Coral' },
      { hex: '#CC5555', name: 'Dark Coral' },
    ];
  };

  // Função para converter HEX para RGB
  const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };

  // Função para converter RGB para HSL
  const rgbToHsl = (r, g, b) => {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
      h = s = 0; // achromatic
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
        case g: h = ((b - r) / d + 2) / 6; break;
        case b: h = ((r - g) / d + 4) / 6; break;
        default: h = 0;
      }
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100)
    };
  };

  // Função para calcular luminância relativa (para contraste WCAG)
  const getLuminance = (r, g, b) => {
    const [rs, gs, bs] = [r, g, b].map(val => {
      val = val / 255;
      return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  };

  // Função para calcular contraste WCAG entre duas cores
  const calculateContrast = (hex1, hex2) => {
    const rgb1 = hexToRgb(hex1);
    const rgb2 = hexToRgb(hex2);
    if (!rgb1 || !rgb2) return 0;

    const lum1 = getLuminance(rgb1.r, rgb1.g, rgb1.b);
    const lum2 = getLuminance(rgb2.r, rgb2.g, rgb2.b);

    const lighter = Math.max(lum1, lum2);
    const darker = Math.min(lum1, lum2);

    return (lighter + 0.05) / (darker + 0.05);
  };

  // Função para calcular similaridade entre duas cores (0-1, onde 1 = idênticas)
  const calculateColorSimilarity = (hex1, hex2) => {
    const rgb1 = hexToRgb(hex1);
    const rgb2 = hexToRgb(hex2);
    if (!rgb1 || !rgb2) return 1;

    // Distância euclidiana no espaço RGB normalizado
    const distance = Math.sqrt(
      Math.pow((rgb1.r - rgb2.r) / 255, 2) +
      Math.pow((rgb1.g - rgb2.g) / 255, 2) +
      Math.pow((rgb1.b - rgb2.b) / 255, 2)
    );

    // Converter distância em similaridade (0-1)
    return 1 - Math.min(distance / Math.sqrt(3), 1);
  };

  // Analisar harmonia da paleta
  const analyzeHarmony = useCallback(() => {
    if (colors.length === 0) {
      return {
        isBalanced: false,
        hasGoodContrast: false,
        hasDuplicates: false,
        suggestions: []
      };
    }

    // Verificar cores duplicadas ou muito similares
    const duplicates = [];
    const similarPairs = [];
    for (let i = 0; i < colors.length; i++) {
      for (let j = i + 1; j < colors.length; j++) {
        // Primeiro verificar se são exatamente iguais (HEX idêntico)
        if (colors[i].hex.toLowerCase() === colors[j].hex.toLowerCase()) {
          duplicates.push({ index1: i, index2: j, similarity: 1.0, exact: true });
        } else {
          // Se não forem idênticas, verificar similaridade
          const similarity = calculateColorSimilarity(colors[i].hex, colors[j].hex);
          if (similarity > 0.95) {
            duplicates.push({ index1: i, index2: j, similarity, exact: false });
          } else if (similarity > 0.85) {
            similarPairs.push({ index1: i, index2: j, similarity });
          }
        }
      }
    }

    // Verificar contraste entre cores
    let minContrast = Infinity;
    let maxContrast = 0;
    let contrastPairs = [];
    
    for (let i = 0; i < colors.length; i++) {
      for (let j = i + 1; j < colors.length; j++) {
        const contrast = calculateContrast(colors[i].hex, colors[j].hex);
        contrastPairs.push({ index1: i, index2: j, contrast });
        minContrast = Math.min(minContrast, contrast);
        maxContrast = Math.max(maxContrast, contrast);
      }
    }

    // Verificar distribuição de cores
    const rgbColors = colors.map(c => hexToRgb(c.hex)).filter(Boolean);
    const hslColors = rgbColors.map(rgb => rgbToHsl(rgb.r, rgb.g, rgb.b));
    
    // Calcular variância de saturação e brilho
    const saturations = hslColors.map(hsl => hsl.s);
    const brightnesses = hslColors.map(hsl => hsl.l);
    const avgSat = saturations.reduce((a, b) => a + b, 0) / saturations.length;
    const avgBright = brightnesses.reduce((a, b) => a + b, 0) / brightnesses.length;
    const satVariance = saturations.reduce((sum, s) => sum + Math.pow(s - avgSat, 2), 0) / saturations.length;
    const brightVariance = brightnesses.reduce((sum, b) => sum + Math.pow(b - avgBright, 2), 0) / brightnesses.length;

    // Verificar se está balanceada
    // Se houver duplicatas, nunca está balanceada
    const isBalanced = duplicates.length === 0 && 
                      similarPairs.length === 0 && 
                      colors.length >= 3 && // Mínimo de 3 cores para estar balanceada
                      satVariance > 200 && // Variância mínima de saturação
                      brightVariance > 200; // Variância mínima de brilho

    // Verificar contraste adequado
    // Se houver duplicatas, não há contraste adequado
    // Precisa ter pelo menos um par com contraste >= 3:1 e não pode ter cores idênticas
    const hasGoodContrast = duplicates.length === 0 && 
                            maxContrast >= 3.0 && 
                            minContrast > 1.0; // Garantir que não há cores idênticas (contraste 1:1)

    // Gerar sugestões
    const suggestions = [];
    if (duplicates.length > 0) {
      const exactDuplicates = duplicates.filter(d => d.exact);
      const nonExactDuplicates = duplicates.filter(d => !d.exact);
      
      // Adicionar sugestão para cada par de cores duplicadas
      exactDuplicates.forEach(dup => {
        suggestions.push({
          type: 'error',
          message: `Cores idênticas encontradas`,
          icon: 'X',
          colors: [colors[dup.index1], colors[dup.index2]],
          colorIndices: [dup.index1, dup.index2]
        });
      });
      
      nonExactDuplicates.forEach(dup => {
        suggestions.push({
          type: 'error',
          message: `Cores muito similares (diferença < 5%)`,
          icon: 'X',
          colors: [colors[dup.index1], colors[dup.index2]],
          colorIndices: [dup.index1, dup.index2],
          similarity: Math.round(dup.similarity * 100)
        });
      });
    }
    if (similarPairs.length > 0) {
      // Adicionar sugestão para cada par de cores similares
      similarPairs.forEach(pair => {
        suggestions.push({
          type: 'warning',
          message: `Cores muito similares`,
          icon: 'AlertTriangle',
          colors: [colors[pair.index1], colors[pair.index2]],
          colorIndices: [pair.index1, pair.index2],
          similarity: Math.round(pair.similarity * 100)
        });
      });
    }
    if (!hasGoodContrast) {
      // Encontrar o par com menor contraste
      const worstContrast = contrastPairs.find(p => p.contrast === minContrast);
      if (worstContrast) {
        suggestions.push({
          type: 'warning',
          message: `Contraste insuficiente (${minContrast.toFixed(1)}:1)`,
          icon: 'Eye',
          colors: [colors[worstContrast.index1], colors[worstContrast.index2]],
          colorIndices: [worstContrast.index1, worstContrast.index2],
          contrast: minContrast
        });
      } else {
        suggestions.push({
          type: 'warning',
          message: 'Contraste insuficiente entre as cores',
          icon: 'Eye'
        });
      }
    }
    if (colors.length < 3) {
      suggestions.push({
        type: 'info',
        message: 'Considere adicionar mais cores para uma paleta mais rica',
        icon: 'Plus'
      });
    }
    if (saturations.every(s => s < 20)) {
      suggestions.push({
        type: 'info',
        message: 'Paleta muito desaturada, considere adicionar cores mais vibrantes',
        icon: 'Sparkles'
      });
    }
    if (brightnesses.every(b => b < 30)) {
      suggestions.push({
        type: 'info',
        message: 'Paleta muito escura, considere adicionar cores mais claras',
        icon: 'Sun'
      });
    } else if (brightnesses.every(b => b > 70)) {
      suggestions.push({
        type: 'info',
        message: 'Paleta muito clara, considere adicionar cores mais escuras',
        icon: 'Moon'
      });
    }
    // Se não houver problemas e a paleta estiver balanceada
    if (duplicates.length === 0 && similarPairs.length === 0 && isBalanced && hasGoodContrast) {
      suggestions.push({
        type: 'success',
        message: 'Paleta bem balanceada e harmoniosa',
        icon: 'CheckCircle'
      });
    } else if (duplicates.length === 0 && similarPairs.length === 0 && !isBalanced) {
      // Se não há duplicatas mas não está balanceada, dar feedback
      if (colors.length < 3) {
        suggestions.push({
          type: 'info',
          message: 'Adicione pelo menos 3 cores para uma paleta balanceada',
          icon: 'Plus'
        });
      } else if (satVariance <= 200 || brightVariance <= 200) {
        suggestions.push({
          type: 'warning',
          message: 'Paleta precisa de mais variação em saturação ou brilho',
          icon: 'AlertTriangle'
        });
      }
    }

    return {
      isBalanced,
      hasGoodContrast,
      hasDuplicates: duplicates.length > 0,
      minContrast: minContrast === Infinity ? 0 : minContrast,
      maxContrast,
      suggestions
    };
  }, [colors]);

  // Analisar acessibilidade
  const analyzeAccessibility = useCallback(() => {
    if (colors.length === 0) {
      return {
        wcagAA: { passes: 0, total: 0, ratio: 0 },
        wcagAAA: { passes: 0, total: 0, ratio: 0 },
        wcagLarge: { passes: 0, total: 0, ratio: 0 }
      };
    }

    let aaPasses = 0;
    let aaaPasses = 0;
    let largePasses = 0;
    let totalPairs = 0;

    for (let i = 0; i < colors.length; i++) {
      for (let j = i + 1; j < colors.length; j++) {
        const contrast = calculateContrast(colors[i].hex, colors[j].hex);
        totalPairs++;
        
        // WCAG AA: 4.5:1 para texto normal, 3:1 para texto grande
        if (contrast >= 4.5) aaPasses++;
        if (contrast >= 7.0) aaaPasses++;
        if (contrast >= 3.0) largePasses++;
      }
    }

    return {
      wcagAA: {
        passes: aaPasses,
        total: totalPairs,
        ratio: totalPairs > 0 ? Math.round((aaPasses / totalPairs) * 100) : 0,
        threshold: 4.5
      },
      wcagAAA: {
        passes: aaaPasses,
        total: totalPairs,
        ratio: totalPairs > 0 ? Math.round((aaaPasses / totalPairs) * 100) : 0,
        threshold: 7.0
      },
      wcagLarge: {
        passes: largePasses,
        total: totalPairs,
        ratio: totalPairs > 0 ? Math.round((largePasses / totalPairs) * 100) : 0,
        threshold: 3.0
      }
    };
  }, [colors]);

  // Calcular análise de cores
  const calculateColorAnalysis = useCallback(() => {
    if (colors.length === 0) {
      return {
        totalColors: 0,
        dominantColors: 0,
        avgSaturation: 0,
        avgBrightness: 0,
        avgHue: 0,
        colorDistribution: []
      };
    }

    let totalSaturation = 0;
    let totalBrightness = 0;
    let totalHue = 0;
    const hueDistribution = {};

    colors.forEach(color => {
      const rgb = hexToRgb(color.hex);
      if (rgb) {
        const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
        totalSaturation += hsl.s;
        totalBrightness += hsl.l;
        totalHue += hsl.h;

        // Distribui��o por matiz (categorias)
        const hueCategory = Math.floor(hsl.h / 30); // 12 categorias de 30 graus
        hueDistribution[hueCategory] = (hueDistribution[hueCategory] || 0) + 1;
      }
    });

    return {
      totalColors: colors.length,
      dominantColors: colors.filter(c => c.dominant).length,
      avgSaturation: Math.round(totalSaturation / colors.length),
      avgBrightness: Math.round(totalBrightness / colors.length),
      avgHue: Math.round(totalHue / colors.length),
      colorDistribution: Object.entries(hueDistribution).map(([category, count]) => ({
        category: parseInt(category),
        count,
        percentage: Math.round((count / colors.length) * 100)
      }))
    };
  }, [colors]);

  return (
    <div className={`w-full min-h-full ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} transition-colors duration-300`}>
      <div className="max-w-[1600px] mx-auto p-6 space-y-6">
        <style>{`
          .palette-scroll {
            scrollbar-width: thin;
            scrollbar-color: ${BRAND_COLOR_NAMES.MB_GREEN} transparent;
          }
          .palette-scroll::-webkit-scrollbar {
            height: 6px;
            width: 6px;
          }
          .palette-scroll::-webkit-scrollbar-thumb {
            background: ${BRAND_COLOR_NAMES.MB_GREEN};
            border-radius: 9999px;
          }
          .palette-scroll::-webkit-scrollbar-track {
            background: transparent;
          }
        `}</style>
        <div className="grid grid-cols-12 gap-6">
          {/* Área de Upload e Visualização da Imagem */}
          <div className="col-span-12 lg:col-span-8">
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-xl border ${darkMode ? 'border-gray-700' : 'border-gray-200'} overflow-hidden transition-colors`}>
              {/* Hotbar - Aparece apenas quando há imagem */}
              {imageUrl && (
                <div className={`px-4 py-3 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'} flex items-center justify-between`}>
                  <div className="flex items-center gap-2">
                    <ImageIcon className={`w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                    <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} font-poppins`}>
                      Imagem Carregada
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      fileInputRef.current?.click();
                    }}
                    className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all ${
                      darkMode
                        ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                    } font-poppins`}
                  >
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Substituir Imagem
                  </button>
                </div>
              )}
              {/* Input de arquivo - sempre presente no DOM */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              {!imageUrl ? (
                <div
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`relative h-[500px] flex flex-col items-center justify-center border-2 border-dashed ${darkMode ? 'border-gray-600' : 'border-gray-300'} rounded-xl m-6 cursor-pointer hover:border-brand-green transition-all group`}
                >
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
                <div className="relative">
                  {/* Imagem */}
                  <div
                    ref={imageContainerRef}
                    className={`h-[500px] overflow-hidden relative ${(extractionMode === 'manual' || extractionMode === 'gradient') ? (isAddingColor ? 'cursor-none' : 'cursor-crosshair') : 'cursor-default'}`}
                    onMouseDown={handleImageMouseDown}
                    onMouseMove={handleImageMouseMove}
                    onMouseUp={handleImageMouseUp}
                    onMouseLeave={handleImageMouseLeave}
                  >
                    <img
                      ref={imageRef}
                      src={imageUrl}
                      alt="Uploaded"
                      className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 max-w-full max-h-full object-contain"
                      draggable={false}
                    />
                    
                    {/* Lupinha - aparece quando está em modo de adicionar cor */}
                    {(extractionMode === 'manual' || extractionMode === 'gradient') && magnifier.show && imageRef.current && (
                      <div
                        className="fixed pointer-events-none z-20"
                        style={{
                          left: magnifier.x - 60,
                          top: magnifier.y - 60,
                          width: 120,
                          height: 120,
                          border: '3px solid white',
                          borderRadius: '50%',
                          overflow: 'hidden',
                          boxShadow: '0 0 10px rgba(0,0,0,0.5)'
                        }}
                      >
                        <canvas
                          ref={magnifierCanvasRef}
                          width={120}
                          height={120}
                          style={{
                            display: 'block',
                            width: '100%',
                            height: '100%'
                          }}
                        />
                      </div>
                    )}
                    
                    {/* Linha conectando pontos no modo gradiente */}
                    {extractionMode === 'gradient' && colorPoints.length > 1 && (
                      <svg
                        className="absolute inset-0 z-10 pointer-events-none"
                        style={{ width: '100%', height: '100%' }}
                      >
                        <polyline
                          points={colorPoints.map(p => {
                            // Compatibilidade: se o ponto tiver coordenadas antigas (x, y), usar diretamente
                            let screenPos;
                            if (p.relX !== undefined && p.relY !== undefined) {
                              screenPos = getScreenPositionFromRelative(p.relX, p.relY);
                            } else if (p.x !== undefined && p.y !== undefined) {
                              // Compatibilidade com pontos antigos
                              screenPos = { x: p.x, y: p.y };
                            } else {
                              return '0,0';
                            }
                            return `${screenPos.x},${screenPos.y}`;
                          }).join(' ')}
                          fill="none"
                          stroke="rgba(255, 255, 255, 0.8)"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          style={{ filter: 'drop-shadow(0 0 4px rgba(0,0,0,0.5))' }}
                        />
                      </svg>
                    )}
                    
                    
                    {/* Indicadores de cor coletada - arrastáveis */}
                    {(extractionMode === 'manual' || extractionMode === 'gradient') && colorPoints.map((point, index) => {
                      const color = colors[point.colorIndex];
                      if (!color) return null;
                      
                      // Calcular posição na tela baseada nas coordenadas relativas
                      // Compatibilidade: se o ponto tiver coordenadas antigas (x, y), usar diretamente
                      let screenPos;
                      if (point.relX !== undefined && point.relY !== undefined) {
                        screenPos = getScreenPositionFromRelative(point.relX, point.relY);
                      } else if (point.x !== undefined && point.y !== undefined) {
                        // Compatibilidade com pontos antigos - usar coordenadas absolutas diretamente
                        screenPos = { x: point.x, y: point.y };
                      } else {
                        return null;
                      }
                      
                      return (
                        <div
                          key={index}
                          className="absolute z-20 cursor-move"
                          style={{
                            left: screenPos.x - 12,
                            top: screenPos.y - 12,
                            width: 24,
                            height: 24,
                            borderRadius: '50%',
                            border: '3px solid white',
                            boxShadow: '0 0 8px rgba(0,0,0,0.6)',
                            backgroundColor: color.hex,
                            pointerEvents: 'auto'
                          }}
                          onMouseDown={(e) => {
                            e.stopPropagation();
                            setDraggingColorPoint(index);
                            setIsAddingColor(true);
                            setMagnifier({
                              show: true,
                              x: e.clientX,
                              y: e.clientY
                            });
                            updateMagnifier(e.clientX, e.clientY);
                          }}
                          title={`${color.name} - Clique e arraste para mover`}
                        />
                      );
                    })}

                  </div>

                  {/* Canvas invis�vel para o PixelZoomViewer */}
                  <canvas
                    ref={pixelZoomCanvasRef}
                    className="hidden"
                    aria-hidden="true"
                  />

                </div>
              )}

              {/* Modos de Extração */}
              {imageUrl && (
                <div className={`p-4 border-t ${darkMode ? 'border-gray-700 bg-gray-800/50' : 'border-gray-200 bg-gray-50'} transition-colors relative`}>
                  <div className="space-y-3">
                    {/* Primeira linha: Modos e botão Extrair Cores */}
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} font-poppins flex-shrink-0`}>
                        Modo:
                      </span>
                      <div className="flex gap-2 flex-wrap flex-1">
                        {[
                          { key: 'auto', label: 'Automático', icon: Wand2 },
                          { key: 'manual', label: 'Manual', icon: ImageIcon },
                          { key: 'gradient', label: 'Gradiente', icon: Layers }
                        ].map(({ key, label, icon: Icon }) => (
                          <button
                            key={key}
                            onClick={() => {
                              setExtractionMode(key);
                              // Se mudar para gradiente, limpar cores e pontos anteriores
                              if (key === 'gradient') {
                                setColors([]);
                                setColorPoints([]);
                              }
                            }}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                              extractionMode === key
                                ? 'bg-brand-green text-brand-blue-900'
                                : darkMode
                                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                : 'bg-white text-gray-700 hover:bg-gray-100'
                            } font-poppins`}
                          >
                            <Icon className="w-4 h-4" />
                            {label}
                          </button>
                        ))}
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <Wand2 className={`w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                        <button
                          onClick={extractColors}
                          className={`px-4 py-2 rounded-lg text-sm font-medium ${darkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-brand-green text-brand-blue-900 hover:bg-brand-green-500'} transition-colors font-poppins`}
                        >
                          Extrair Cores
                        </button>
                      </div>
                    </div>
                  
                    {/* Preview do Gradiente (apenas quando gradiente está selecionado e há cores) */}
                    {extractionMode === 'gradient' && colors.length > 0 && (() => {
                      const gradientStops = generateGradientStops(150);
                      return (
                        <div className="mt-4">
                          <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700/50' : 'bg-gray-100'}`}>
                            <p className={`text-xs font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'} font-poppins`}>
                              Preview do Gradiente
                            </p>
                            <div
                              className="w-full h-16 rounded-lg shadow-inner"
                              style={{
                                background: gradientType === 'linear'
                                  ? `linear-gradient(to right, ${gradientStops.join(', ')})`
                                  : gradientType === 'radial'
                                  ? `radial-gradient(circle, ${gradientStops.join(', ')})`
                                  : `conic-gradient(from 0deg, ${gradientStops.join(', ')})`
                              }}
                            />
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                  
                </div>
              )}
            </div>
          </div>

          {/* Painel de Cores */}
          <div className="col-span-12 lg:col-span-4 flex flex-col">
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-xl border ${darkMode ? 'border-gray-700' : 'border-gray-200'} p-6 transition-colors flex flex-col h-full`}>

              {/* Zoom em Pixels - posicionado no topo para evitar rolagem excessiva */}
              <PixelZoomPanel
                imageUrl={imageUrl}
                pixelZoomCanvasRef={pixelZoomCanvasRef}
                pixelZoomPosition={pixelZoomPosition}
                pixelSize={14}
                gridWidth={25}
                gridHeight={11}
                highlightColor={BRAND_COLOR_NAMES.MB_GREEN}
              />

              <PalettePanel
                colors={colors}
                selectedColor={selectedColor}
                darkMode={darkMode}
                onColorClick={(color, index) => {
                        setSelectedColor(color);
                        setShowColorModal(index);
                      }}
                onRemoveColor={removeColor}
                onClearAll={clearAllColors}
                onExport={() => setShowExport(true)}
                onAnalysis={() => setShowAnalysis(true)}
              />
            </div>
          </div>
        </div>

        {/* Mini Modal de Detalhes da Cor */}
        {showColorModal !== null && colors[showColorModal] && (
          <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4" onClick={() => setShowColorModal(null)}>
            <div 
              className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-2xl max-w-sm w-full border ${darkMode ? 'border-gray-700' : 'border-gray-200'} transition-colors`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={`p-5 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className={`text-lg font-bold font-mono ${darkMode ? 'text-white' : 'text-brand-blue-900'} font-nunito`}>
                      color-{showColorModal + 1}
                    </h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeColor(showColorModal);
                        setShowColorModal(null);
                      }}
                      className={`p-1.5 ${darkMode ? 'hover:bg-red-600/20' : 'hover:bg-red-50'} rounded-lg transition-colors`}
                      title="Remover cor"
                    >
                      <Trash2 className={`w-4 h-4 ${darkMode ? 'text-red-400' : 'text-red-600'}`} />
                    </button>
                    <button
                      onClick={() => setShowColorModal(null)}
                      className={`p-1.5 ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} rounded-lg transition-colors`}
                    >
                      <X className={`w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                    </button>
                  </div>
                </div>
                {/* Swatch Grande */}
                <div
                  className="w-full h-24 rounded-xl shadow-lg border-2 border-white/50 mb-4"
                  style={{ backgroundColor: colors[showColorModal].hex }}
                />
                {colors[showColorModal].dominant && (
                  <span className={`inline-block px-3 py-1.5 ${darkMode ? 'bg-brand-green text-white' : 'bg-brand-green text-white'} rounded-full text-xs font-bold font-poppins mb-4 shadow-md`}>
                    Cor Dominante
                  </span>
                )}
              </div>
              
              <div className="p-5 space-y-3">
                {/* Lista de C�digos */}
                <div className="space-y-2">
                  {/* HEX */}
                  <div className={`flex items-center justify-between p-3 rounded-lg ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                    <div className="flex-1 min-w-0">
                      <span className={`text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'} font-poppins block mb-1`}>
                        HEX
                      </span>
                      <code className={`text-sm font-mono ${darkMode ? 'text-white' : 'text-brand-blue-900'} font-poppins`}>
                        {colors[showColorModal].hex}
                      </code>
                    </div>
                    <button
                      onClick={(e) => {
                        copyColor(colors[showColorModal], 'hex', showColorModal, e);
                      }}
                      className={`ml-3 p-2 ${darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'} rounded-lg transition-colors flex-shrink-0`}
                      title={copiedCode?.colorIndex === showColorModal && copiedCode?.format === 'hex' ? 'Copiado!' : 'Copiar HEX'}
                    >
                      {copiedCode?.colorIndex === showColorModal && copiedCode?.format === 'hex' ? (
                        <CheckCircle2 className={`w-4 h-4 text-brand-green`} />
                      ) : (
                        <Copy className={`w-4 h-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'} transition-colors ${
                          copiedCode?.colorIndex === showColorModal && copiedCode?.format === 'hex' ? 'text-brand-green' : ''
                        }`} />
                      )}
                    </button>
                  </div>

                  {/* RGB */}
                  <div className={`flex items-center justify-between p-3 rounded-lg ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                    <div className="flex-1 min-w-0">
                      <span className={`text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'} font-poppins block mb-1`}>
                        RGB
                      </span>
                      <code className={`text-sm font-mono ${darkMode ? 'text-white' : 'text-brand-blue-900'} font-poppins`}>
                        {colors[showColorModal].rgb}
                      </code>
                    </div>
                    <button
                      onClick={(e) => {
                        copyColor(colors[showColorModal], 'rgb', showColorModal, e);
                      }}
                      className={`ml-3 p-2 ${darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'} rounded-lg transition-colors flex-shrink-0`}
                      title={copiedCode?.colorIndex === showColorModal && copiedCode?.format === 'rgb' ? 'Copiado!' : 'Copiar RGB'}
                    >
                      {copiedCode?.colorIndex === showColorModal && copiedCode?.format === 'rgb' ? (
                        <CheckCircle2 className={`w-4 h-4 text-brand-green`} />
                      ) : (
                        <Copy className={`w-4 h-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'} transition-colors ${
                          copiedCode?.colorIndex === showColorModal && copiedCode?.format === 'rgb' ? 'text-brand-green' : ''
                        }`} />
                      )}
                    </button>
                  </div>

                  {/* CMYK */}
                  <div className={`flex items-center justify-between p-3 rounded-lg ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                    <div className="flex-1 min-w-0">
                      <span className={`text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'} font-poppins block mb-1`}>
                        CMYK
                      </span>
                      <code className={`text-sm font-mono ${darkMode ? 'text-white' : 'text-brand-blue-900'} font-poppins`}>
                        {colors[showColorModal].cmyk}
                      </code>
                    </div>
                    <button
                      onClick={(e) => {
                        copyColor(colors[showColorModal], 'cmyk', showColorModal, e);
                      }}
                      className={`ml-3 p-2 ${darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'} rounded-lg transition-colors flex-shrink-0`}
                      title={copiedCode?.colorIndex === showColorModal && copiedCode?.format === 'cmyk' ? 'Copiado!' : 'Copiar CMYK'}
                    >
                      {copiedCode?.colorIndex === showColorModal && copiedCode?.format === 'cmyk' ? (
                        <CheckCircle2 className={`w-4 h-4 text-brand-green`} />
                      ) : (
                        <Copy className={`w-4 h-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'} transition-colors ${
                          copiedCode?.colorIndex === showColorModal && copiedCode?.format === 'cmyk' ? 'text-brand-green' : ''
                        }`} />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Painel de Cores Complementares */}
        {showComplementary && selectedColor && (
          <div className={`mt-6 ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-xl border ${darkMode ? 'border-gray-700' : 'border-gray-200'} p-6 transition-colors`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-brand-blue-900'} font-nunito`}>
                Cores Complementares para {selectedColor.name}
              </h3>
              <button
                onClick={() => setShowComplementary(false)}
                className={`p-2 ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} rounded-lg transition-colors`}
              >
                <X className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
              </button>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {generateComplementary(selectedColor).map((comp, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-xl border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}
                >
                  <div
                    className="w-full h-20 rounded-lg mb-3 shadow-md"
                    style={{ backgroundColor: comp.hex }}
                  />
                  <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-brand-blue-900'} font-nunito mb-1`}>
                    {comp.name}
                  </p>
                  <code className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'} font-mono`}>
                    {comp.hex}
                  </code>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Hist�rico de Paletas */}
        {showHistory && (
          <div className={`fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-6`}>
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden flex flex-col transition-colors`}>
              <div className={`p-6 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'} flex items-center justify-between`}>
                <h3 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-brand-blue-900'} font-nunito`}>
                  Hist�rico de Paletas
                </h3>
                <button
                  onClick={() => setShowHistory(false)}
                  className={`p-2 ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} rounded-lg transition-colors`}
                >
                  <X className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-6">
                <div className="grid grid-cols-2 gap-4">
                  {paletteHistory.map((palette, idx) => (
                    <div
                      key={idx}
                      className={`p-4 rounded-xl border ${darkMode ? 'border-gray-700 bg-gray-700/50' : 'border-gray-200 bg-gray-50'} transition-colors`}
                    >
                      <div className="flex items-center gap-2 mb-3">
                        <div className="flex gap-1">
                          {palette.colors.slice(0, 5).map((c, i) => (
                            <div
                              key={i}
                              className="w-8 h-8 rounded border-2 border-white shadow-sm"
                              style={{ backgroundColor: c.hex }}
                            />
                          ))}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-brand-blue-900'} font-nunito truncate`}>
                            {palette.name}
                          </p>
                          <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} font-poppins`}>
                            {new Date(palette.date).toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal de Exporta��o */}
        <ExportModal
          open={showExport}
          onClose={() => {
              setShowExport(false);
              setExportFormats([]);
              setPaletteName('');
              setExportAsGradient(false);
            }}
          darkMode={darkMode}
          extractionMode={extractionMode}
          exportFormats={exportFormats}
          setExportFormats={setExportFormats}
          paletteName={paletteName}
          setPaletteName={setPaletteName}
          exportAsGradient={exportAsGradient}
          setExportAsGradient={setExportAsGradient}
          exportPalette={exportPalette}
        />

        {/* Modal de An�lise de Cores */}
        <AnalysisModal
          open={showAnalysis}
          onClose={() => setShowAnalysis(false)}
          darkMode={darkMode}
          colors={colors}
          calculateColorAnalysis={calculateColorAnalysis}
          analyzeHarmony={analyzeHarmony}
          analyzeAccessibility={analyzeAccessibility}
          hexToRgb={hexToRgb}
          rgbToHsl={rgbToHsl}
        />

        {/* Configura��es */}
        {showSettings && (
          <div className={`fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-6`}>
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-2xl max-w-md w-full transition-colors`}>
              <div className={`p-6 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'} flex items-center justify-between`}>
                <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-brand-blue-900'} font-nunito`}>
                  Configura��es
                </h3>
                <button
                  onClick={() => setShowSettings(false)}
                  className={`p-2 ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} rounded-lg transition-colors`}
                >
                  <X className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} font-poppins mb-2`}>
                    N�mero de Cores
                  </label>
                  <input
                    type="range"
                    min="4"
                    max="16"
                    value={colorCount}
                    onChange={(e) => setColorCount(Number(e.target.value))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>4</span>
                    <span className="font-semibold">{colorCount}</span>
                    <span>16</span>
                  </div>
                </div>
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <button
                    className={`w-full py-3 rounded-xl font-semibold ${
                      darkMode
                        ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                        : 'bg-brand-green text-brand-blue-900 hover:bg-brand-green-500'
                    } transition-colors font-nunito`}
                  >
                    Salvar Configura��es
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tooltip personalizado "Cor Copiada!" */}
        {showCopiedTooltip && (
          <div
            className="fixed z-[100] pointer-events-none animate-in fade-in-0 slide-in-from-bottom-2 duration-300"
            style={{
              left: showCopiedTooltip.x,
              top: showCopiedTooltip.y,
              transform: 'translate(-50%, -100%)'
            }}
          >
            <div className={`${darkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-300'} border rounded-lg px-3 py-2 shadow-lg`}>
              <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'} font-poppins whitespace-nowrap`}>
                Cor Copiada!
              </p>
              {/* Seta apontando para baixo */}
              <div
                className={`absolute top-full left-1/2 transform -translate-x-1/2 border-l border-r ${darkMode ? 'border-gray-600' : 'border-gray-300'}`}
                style={{
                  borderLeftWidth: '6px',
                  borderRightWidth: '6px',
                  borderTopWidth: '6px',
                  borderTopColor: darkMode ? '#374151' : '#ffffff'
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ColorBuddyExtractor;

