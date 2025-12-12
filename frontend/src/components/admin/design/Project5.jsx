import { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Upload, 
  Image as ImageIcon, 
  Palette, 
  Download, 
  Copy, 
  X, 
  ZoomIn, 
  ZoomOut, 
  RotateCw,
  Filter,
  Sparkles,
  TrendingUp,
  History,
  Settings,
  Eye,
  EyeOff,
  CheckCircle2,
  RefreshCw,
  FileText,
  Layers,
  Wand2,
  Lightbulb,
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
  Sun,
  Moon,
  Plus
} from 'lucide-react';

const Project5 = ({ isFullscreen = false }) => {
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [colors, setColors] = useState([]);
  const [selectedColor, setSelectedColor] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [initialZoom, setInitialZoom] = useState(1); // Zoom inicial calculado automaticamente
  const colorIdCounter = useRef(1); // Contador para IDs únicos das cores
  const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [showHistory, setShowHistory] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [extractionMode, setExtractionMode] = useState('auto'); // auto, manual, grid, gradient
  const [colorCount, setColorCount] = useState(8);
  const [paletteHistory, setPaletteHistory] = useState([]);
  const [showComplementary, setShowComplementary] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [exportFormats, setExportFormats] = useState([]); // Array de formatos selecionados
  const [paletteName, setPaletteName] = useState(''); // Nome da paleta para exportação
  const [gradientType, setGradientType] = useState('linear'); // linear, radial, conic
  const [exportAsGradient, setExportAsGradient] = useState(false); // Exportar como gradiente ou cores separadas
  const [showColorModal, setShowColorModal] = useState(null); // null ou o índice da cor selecionada
  const [copiedCode, setCopiedCode] = useState(null); // { colorIndex, format }
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

  // Função para converter coordenadas relativas da imagem (0-1) para coordenadas da tela
  const getScreenPositionFromRelative = useCallback((relX, relY) => {
    if (!imageRef.current) return { x: 0, y: 0 };
    
    const container = imageRef.current.parentElement;
    if (!container) return { x: 0, y: 0 };
    
    const containerRect = container.getBoundingClientRect();
    const centerX = containerRect.width / 2;
    const centerY = containerRect.height / 2;
    
    const img = imageRef.current;
    const imgDisplayWidth = img.naturalWidth * zoom;
    const imgDisplayHeight = img.naturalHeight * zoom;
    
    // Converter coordenadas relativas (0-1) para coordenadas da tela
    const screenX = centerX + (relX - 0.5) * imgDisplayWidth + imagePosition.x;
    const screenY = centerY + (relY - 0.5) * imgDisplayHeight + imagePosition.y;
    
    return { x: screenX, y: screenY };
  }, [zoom, imagePosition]);

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
    const imgDisplayWidth = img.naturalWidth * zoom;
    const imgDisplayHeight = img.naturalHeight * zoom;
    
    // Converter coordenadas da tela para coordenadas relativas (0-1)
    const relX = (mouseX - centerX - imagePosition.x) / imgDisplayWidth + 0.5;
    const relY = (mouseY - centerY - imagePosition.y) / imgDisplayHeight + 0.5;
    
    return { relX, relY };
  }, [zoom, imagePosition]);

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
    const container = img.parentElement;
    if (!container) return null;
    
    const containerRect = container.getBoundingClientRect();
    
    // Posição do mouse relativa ao container
    const mouseX = clientX - containerRect.left;
    const mouseY = clientY - containerRect.top;
    
    // Centro do container
    const centerX = containerRect.width / 2;
    const centerY = containerRect.height / 2;
    
    // Tamanho da imagem renderizada (com zoom)
    const imgDisplayWidth = img.naturalWidth * zoom;
    const imgDisplayHeight = img.naturalHeight * zoom;
    
    // Posição relativa no container (0 a 1)
    const relX = (mouseX - centerX - imagePosition.x) / imgDisplayWidth + 0.5;
    const relY = (mouseY - centerY - imagePosition.y) / imgDisplayHeight + 0.5;
    
    // Converter para coordenadas da imagem original
    const imgX = Math.floor(relX * img.naturalWidth);
    const imgY = Math.floor(relY * img.naturalHeight);
    
    // Validar limites
    if (imgX < 0 || imgX >= img.naturalWidth || imgY < 0 || imgY >= img.naturalHeight) {
      return null;
    }
    
    // Criar canvas temporário para extrair cor
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = img.naturalWidth;
    tempCanvas.height = img.naturalHeight;
    const tempCtx = tempCanvas.getContext('2d');
    tempCtx.drawImage(img, 0, 0);
    
    const imageData = tempCtx.getImageData(imgX, imgY, 1, 1);
    const [r, g, b, a] = imageData.data;
    
    if (a < 128) return null; // Ignorar pixels transparentes
    
    return createColorObject(r, g, b);
  }, [createColorObject, zoom, imagePosition]);

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

  // Ajustar zoom automaticamente para imagens retrato/verticais
  useEffect(() => {
    if (imageUrl && imageRef.current) {
      const img = imageRef.current;
      
      const calculateAutoZoom = () => {
        // Aguardar um pouco para garantir que o container tenha dimensões
        setTimeout(() => {
          if (!img || !img.naturalWidth || !img.naturalHeight) return;
          
          // Obter dimensões do container
          const container = img.parentElement;
          if (!container) return;
          
          const containerHeight = container.clientHeight || 500;
          const containerWidth = container.clientWidth || 800;
          
          const imgNaturalWidth = img.naturalWidth;
          const imgNaturalHeight = img.naturalHeight;
          
          // Calcular proporções para que a imagem caiba completamente
          const widthRatio = containerWidth / imgNaturalWidth;
          const heightRatio = containerHeight / imgNaturalHeight;
          
          // Usar o menor para garantir que a imagem caiba completamente
          const autoZoom = Math.min(widthRatio, heightRatio, 1); // máximo 100%
          
          // Aplicar zoom apenas se for menor que 1 (imagem maior que container)
          if (autoZoom < 1) {
            setZoom(autoZoom);
            setInitialZoom(autoZoom); // Salvar zoom inicial
            setImagePosition({ x: 0, y: 0 });
          } else {
            // Se a imagem é menor que o container, manter zoom 1
            setZoom(1);
            setInitialZoom(1); // Salvar zoom inicial
            setImagePosition({ x: 0, y: 0 });
          }
          
          // Extrair cores automaticamente se estiver no modo auto
          if (extractionMode === 'auto') {
            extractColors();
          }
        }, 100);
      };
      
      // Se a imagem já está carregada
      if (img.complete && img.naturalWidth > 0 && img.naturalHeight > 0) {
        calculateAutoZoom();
      } else {
        // Adicionar listener para quando a imagem carregar
        img.addEventListener('load', calculateAutoZoom);
        return () => {
          img.removeEventListener('load', calculateAutoZoom);
        };
      }
    }
  }, [imageUrl, extractionMode, extractColors]);

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0] || e.dataTransfer?.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      setImage(file);
      setImageUrl(url);
      // Resetar zoom inicial - será calculado automaticamente pelo useEffect quando a imagem carregar
      setInitialZoom(1);
      setImagePosition({ x: 0, y: 0 });
      setColors([]); // Limpar cores anteriores
      colorIdCounter.current = 1; // Resetar contador quando limpar todas as cores
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

  const handleZoom = (delta) => {
    setZoom(prev => Math.max(0.5, Math.min(3, prev + delta)));
  };

  const handleResetView = () => {
    setZoom(initialZoom);
    setImagePosition({ x: 0, y: 0 });
  };

  // Função para atualizar a lupinha
  const updateMagnifier = useCallback((clientX, clientY) => {
    if (!magnifierCanvasRef.current || !imageRef.current) return;

    const img = imageRef.current;
    const container = img.parentElement;
    if (!container) return;

    const containerRect = container.getBoundingClientRect();
    const magnifierCanvas = magnifierCanvasRef.current;
    const magnifierCtx = magnifierCanvas.getContext('2d');
    
    // Calcular posição relativa ao container
    const mouseX = clientX - containerRect.left;
    const mouseY = clientY - containerRect.top;
    
    // Centro do container
    const centerX = containerRect.width / 2;
    const centerY = containerRect.height / 2;
    
    // Tamanho da imagem renderizada (com zoom)
    const imgDisplayWidth = img.naturalWidth * zoom;
    const imgDisplayHeight = img.naturalHeight * zoom;
    
    // Posição relativa no container (0 a 1)
    const relX = (mouseX - centerX - imagePosition.x) / imgDisplayWidth + 0.5;
    const relY = (mouseY - centerY - imagePosition.y) / imgDisplayHeight + 0.5;
    
    // Converter para coordenadas da imagem original
    const imgX = Math.floor(relX * img.naturalWidth);
    const imgY = Math.floor(relY * img.naturalHeight);
    
    // Validar limites
    if (imgX < 0 || imgX >= img.naturalWidth || imgY < 0 || imgY >= img.naturalHeight) {
      return;
    }
    
    // Tamanho da área ampliada (20x20 pixels da imagem para zoom menor)
    const zoomSize = 20;
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
  }, [zoom, imagePosition]);

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
    
    // Comportamento normal de arrastar quando zoom > 1
    if (zoom > 1) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - imagePosition.x, y: e.clientY - imagePosition.y });
    }
  };

  const handleImageMouseMove = (e) => {
    // Se estiver arrastando um ponto de cor
    if (draggingColorPoint !== null && imageRef.current) {
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
        x: e.clientX,
        y: e.clientY
      }));
      updateMagnifier(e.clientX, e.clientY);
      return;
    }
    
    // Se estiver no modo manual ou gradiente e adicionando cor, atualizar lupinha
    if ((extractionMode === 'manual' || extractionMode === 'gradient') && isAddingColor) {
      setMagnifier(prev => ({
        ...prev,
        show: true, // Garantir que a lupa esteja visível quando o mouse entrar no container
        x: e.clientX,
        y: e.clientY
      }));
      updateMagnifier(e.clientX, e.clientY);
    }
    
    // Comportamento normal de arrastar quando zoom > 1
    if (isDragging && zoom > 1) {
      setImagePosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
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
      // Verificar se o mouse está dentro do container da imagem
      if (!imageContainerRef.current) return;
      
      const containerRect = imageContainerRef.current.getBoundingClientRect();
      const mouseX = e.clientX;
      const mouseY = e.clientY;
      
      // Verificar se o mouse está dentro dos limites do container
      const isInsideContainer = 
        mouseX >= containerRect.left &&
        mouseX <= containerRect.right &&
        mouseY >= containerRect.top &&
        mouseY <= containerRect.bottom;
      
      // Só atualizar a lupa se o mouse estiver dentro do container
      if (isInsideContainer) {
        setMagnifier(prev => ({
          ...prev,
          x: e.clientX,
          y: e.clientY
        }));
        updateMagnifier(e.clientX, e.clientY);
      }
    };

    window.addEventListener('mousemove', handleGlobalMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleGlobalMouseMove);
    };
  }, [isAddingColor, extractionMode, updateMagnifier]);

  // Função para remover cor da paleta
  const removeColor = (index) => {
    setColors(prev => {
      const newColors = prev.filter((_, i) => i !== index);
      
      // Se todas as cores foram removidas, resetar o contador
      if (newColors.length === 0) {
        colorIdCounter.current = 1;
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

  const copyColor = (color, format, colorIndex) => {
    let text = '';
    switch(format) {
      case 'hex': text = color.hex; break;
      case 'rgb': text = color.rgb; break;
      case 'cmyk': text = color.cmyk; break;
      default: text = color.hex;
    }
    navigator.clipboard.writeText(text).then(() => {
      setCopiedCode({ colorIndex, format });
      setTimeout(() => setCopiedCode(null), 2000);
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
  const exportPalette = (format, customPaletteName = '') => {
    if (colors.length === 0) {
      alert('Nenhuma cor na paleta para exportar');
      return;
    }

    const name = customPaletteName || paletteName || 'Paleta de Cores';
    const sanitizedName = sanitizeFileName(name);
    
    // Sempre usar apenas as cores definidas, sem cores intermediárias
    let content = '';
    let mimeType = '';
    let filename = '';

    switch (format) {
      case 'json':
        content = JSON.stringify({
          name: name,
          type: 'separate',
          colors: colors.map(c => ({
            id: c.id || `color-${colors.indexOf(c) + 1}`,
            name: c.name,
            hex: c.hex,
            rgb: c.rgb,
            cmyk: c.cmyk,
            dominant: c.dominant
          }))
        }, null, 2);
        mimeType = 'application/json';
        filename = `${sanitizedName}.json`;
        break;

      case 'css':
        content = `/* ${name} */\n:root {\n`;
        colors.forEach((c, i) => {
          const varName = (c.id || `color-${i + 1}`).toLowerCase().replace(/[^a-z0-9]/gi, '-').replace(/-+/g, '-');
          content += `  --${varName}: ${c.hex};\n`;
          content += `  --${varName}-rgb: ${c.rgb.replace('rgb(', '').replace(')', '')};\n`;
        });
        content += '}';
        mimeType = 'text/css';
        filename = `${sanitizedName}.css`;
        break;

      case 'scss':
        content = `// ${name}\n`;
        content += '$colors: (\n';
        colors.forEach((c, i) => {
          const varName = (c.id || `color-${i + 1}`).toLowerCase().replace(/[^a-z0-9]/gi, '-').replace(/-+/g, '-');
          content += `  ${varName}: ${c.hex}${i < colors.length - 1 ? ',' : ''}\n`;
        });
        content += ');';
        mimeType = 'text/scss';
        filename = `${sanitizedName}.scss`;
        break;

      case 'txt':
        content = `${name}\n`;
        content += '='.repeat(30) + '\n\n';
        colors.forEach((c, i) => {
          content += `${c.id || `color-${i + 1}`} - ${c.name}\n`;
          content += `   HEX: ${c.hex}\n`;
          content += `   RGB: ${c.rgb}\n`;
          content += `   CMYK: ${c.cmyk}\n`;
          if (c.dominant) content += `   [Cor Dominante]\n`;
          content += '\n';
        });
        mimeType = 'text/plain';
        filename = `${sanitizedName}.txt`;
        break;

      case 'xml':
        content = '<?xml version="1.0" encoding="UTF-8"?>\n';
        content += `<palette name="${name}" type="separate">\n`;
        colors.forEach((c, i) => {
          content += `  <color id="${c.id || `color-${i + 1}`}">\n`;
          content += `    <name>${c.name}</name>\n`;
          content += `    <hex>${c.hex}</hex>\n`;
          content += `    <rgb>${c.rgb}</rgb>\n`;
          content += `    <cmyk>${c.cmyk}</cmyk>\n`;
          if (c.dominant) content += `    <dominant>true</dominant>\n`;
          content += `  </color>\n`;
        });
        content += '</palette>';
        mimeType = 'application/xml';
        filename = `${sanitizedName}.xml`;
        break;

      case 'ase':
        // Formato ASE simplificado (Adobe Swatch Exchange)
        // Nota: Formato binário complexo, aqui uma versão simplificada
        alert('Exportação ASE requer biblioteca especializada. Use JSON ou outro formato.');
        return;

      case 'png':
        // Criar imagem PNG da paleta
        const canvas = document.createElement('canvas');
        const size = Math.ceil(Math.sqrt(colors.length));
        const swatchSize = 100;
        canvas.width = size * swatchSize;
        canvas.height = size * swatchSize;
        const ctx = canvas.getContext('2d');
        
        colors.forEach((c, i) => {
          const x = (i % size) * swatchSize;
          const y = Math.floor(i / size) * swatchSize;
          ctx.fillStyle = c.hex;
          ctx.fillRect(x, y, swatchSize, swatchSize);
        });
        
        canvas.toBlob((blob) => {
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `${sanitizedName}.png`;
          a.click();
          URL.revokeObjectURL(url);
        });
        return;

      case 'svg':
        // Modo individual: retângulos com códigos (apenas cores definidas)
        const rectWidth = 800 / colors.length;
        const rectHeight = 150;
        content = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="${rectHeight}">\n`;
        content += `<title>${name}</title>\n`;
        
        colors.forEach((c, i) => {
          const x = i * rectWidth;
          const colorId = c.id || `color-${i + 1}`;
          content += `<rect x="${x}" y="0" width="${rectWidth}" height="${rectHeight}" fill="${c.hex}" />\n`;
          content += `<text x="${x + rectWidth / 2}" y="${rectHeight / 2 - 30}" font-family="Arial" font-size="12" font-weight="bold" fill="white" text-anchor="middle" stroke="black" stroke-width="0.5">${colorId}</text>\n`;
          content += `<text x="${x + rectWidth / 2}" y="${rectHeight / 2 - 10}" font-family="Arial" font-size="11" fill="white" text-anchor="middle" stroke="black" stroke-width="0.5">${c.name}</text>\n`;
          content += `<text x="${x + rectWidth / 2}" y="${rectHeight / 2 + 10}" font-family="Arial" font-size="12" fill="white" text-anchor="middle" stroke="black" stroke-width="0.5">${c.hex}</text>\n`;
          content += `<text x="${x + rectWidth / 2}" y="${rectHeight / 2 + 25}" font-family="Arial" font-size="10" fill="white" text-anchor="middle" stroke="black" stroke-width="0.5">${c.rgb}</text>\n`;
          content += `<text x="${x + rectWidth / 2}" y="${rectHeight / 2 + 40}" font-family="Arial" font-size="10" fill="white" text-anchor="middle" stroke="black" stroke-width="0.5">${c.cmyk}</text>\n`;
        });
        
        content += '</svg>';
        mimeType = 'image/svg+xml';
        filename = `${sanitizedName}.svg`;
        break;

      case 'sketch':
        // Formato Sketch é complexo, usar JSON como alternativa
        content = JSON.stringify({
          name: name,
          version: 1,
          colors: colors.map(c => ({
            name: c.name,
            hex: c.hex,
            rgb: c.rgb
          }))
        }, null, 2);
        mimeType = 'application/json';
        filename = `${sanitizedName}-sketch.json`;
        break;

      case 'pantone':
        // Exportação Pantone - aproximação baseada em RGB
        content = `Pantone Color Palette: ${name}\n`;
        content += '='.repeat(50) + '\n\n';
        content += 'NOTA: Cores Pantone são aproximações baseadas em RGB.\n';
        content += 'Para valores Pantone exatos, consulte um guia Pantone oficial.\n\n';
        content += '-'.repeat(50) + '\n\n';
        
        colors.forEach((c, i) => {
          // Converter HEX para RGB
          const hex = c.hex.replace('#', '');
          const r = parseInt(hex.substr(0, 2), 16);
          const g = parseInt(hex.substr(2, 2), 16);
          const b = parseInt(hex.substr(4, 2), 16);
          
          // Aproximar Pantone (simplificado - baseado em valores comuns)
          const pantoneCode = approximatePantone(r, g, b);
          
          content += `${i + 1}. ${c.name}\n`;
          content += `   Pantone: ${pantoneCode}\n`;
          content += `   HEX: ${c.hex}\n`;
          content += `   RGB: ${c.rgb}\n`;
          content += `   CMYK: ${c.cmyk}\n`;
          if (c.dominant) content += `   [Cor Dominante]\n`;
          content += '\n';
        });
        
        mimeType = 'text/plain';
        filename = `${sanitizedName}-pantone.txt`;
        break;

      default:
        alert('Formato não suportado');
        return;
    }

    // Criar e baixar arquivo
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

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

        // Distribuição por matiz (categorias)
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
    <div className={`w-full ${isFullscreen ? 'h-screen overflow-y-auto' : 'min-h-full'} ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} transition-colors duration-300`}>
      <div className="max-w-[1600px] mx-auto p-6">
        {/* Header Premium */}
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-xl border ${darkMode ? 'border-gray-700' : 'border-gray-200'} p-6 mb-6 transition-colors`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-brand-green to-brand-green-500 rounded-xl flex items-center justify-center shadow-lg">
                <Palette className="w-7 h-7 text-brand-blue-900" />
              </div>
              <div>
                <h1 className={`text-3xl font-black ${darkMode ? 'text-white' : 'text-brand-blue-900'} font-nunito`}>
                  Color Extractor
                </h1>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} font-poppins mt-1`}>
                  Extraia paletas profissionais de qualquer imagem
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowHistory(!showHistory)}
                className={`p-3 rounded-xl ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'} transition-colors`}
                title="Histórico"
              >
                <History className={`w-5 h-5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`} />
              </button>
              <button
                onClick={() => setShowSettings(!showSettings)}
                className={`p-3 rounded-xl ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'} transition-colors`}
                title="Configurações"
              >
                <Settings className={`w-5 h-5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`} />
              </button>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`p-3 rounded-xl ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'} transition-colors`}
                title={darkMode ? 'Modo Claro' : 'Modo Escuro'}
              >
                {darkMode ? <Eye className="w-5 h-5 text-gray-300" /> : <EyeOff className="w-5 h-5 text-gray-700" />}
              </button>
            </div>
          </div>
        </div>

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
                      setImage(null);
                      setImageUrl(null);
                      setColors([]);
                      setZoom(1);
                      setInitialZoom(1);
                      setImagePosition({ x: 0, y: 0 });
                    }}
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
                <div className="relative">
                  {/* Controles da Imagem */}
                  <div className="absolute top-4 right-4 z-10 flex gap-2">
                    <div className={`${darkMode ? 'bg-gray-800/90' : 'bg-white/90'} backdrop-blur-sm rounded-xl p-2 flex gap-2 shadow-lg`}>
                      <button
                        onClick={() => handleZoom(-0.25)}
                        className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition-colors`}
                      >
                        <ZoomOut className={`w-4 h-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`} />
                      </button>
                      <span className={`px-3 py-2 text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} font-poppins`}>
                        {Math.round(zoom * 100)}%
                      </span>
                      <button
                        onClick={() => handleZoom(0.25)}
                        className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition-colors`}
                      >
                        <ZoomIn className={`w-4 h-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`} />
                      </button>
                      <button
                        onClick={handleResetView}
                        className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition-colors`}
                        title="Resetar visualização"
                      >
                        <RefreshCw className={`w-4 h-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`} />
                      </button>
                    </div>
                  </div>

                  {/* Imagem com Zoom e Pan */}
                  <div
                    ref={imageContainerRef}
                    className={`h-[500px] overflow-hidden relative ${(extractionMode === 'manual' || extractionMode === 'gradient') ? (isAddingColor ? 'cursor-none' : 'cursor-crosshair') : zoom > 1 ? 'cursor-move' : 'cursor-default'}`}
                    onMouseDown={handleImageMouseDown}
                    onMouseMove={handleImageMouseMove}
                    onMouseUp={handleImageMouseUp}
                    onMouseLeave={handleImageMouseLeave}
                  >
                    <img
                      ref={imageRef}
                      src={imageUrl}
                      alt="Uploaded"
                      className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-transform duration-200"
                      style={{
                        transform: `translate(calc(-50% + ${imagePosition.x}px), calc(-50% + ${imagePosition.y}px)) scale(${zoom})`,
                        maxWidth: 'none',
                        height: 'auto'
                      }}
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
          <div className="col-span-12 lg:col-span-4">
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-xl border ${darkMode ? 'border-gray-700' : 'border-gray-200'} p-6 transition-colors`}>
              <div className="flex items-center justify-between mb-6">
                <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-brand-blue-900'} font-nunito`}>
                  Paleta de Cores
                </h2>
                <div className="flex items-center gap-2">
                  <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} font-poppins`}>
                    {colors.length} cores
                  </span>
                </div>
              </div>

              {/* Grid de Cores Compacto */}
              <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-4 gap-3 max-h-[500px] overflow-y-auto overflow-x-visible pr-2 pl-1 pt-1">
                {colors.map((color, index) => (
                  <div
                    key={color.id || index}
                    className="group relative"
                  >
                    <button
                      onClick={() => {
                        setSelectedColor(color);
                        setShowColorModal(index);
                      }}
                      className={`w-full aspect-square rounded-lg shadow-md border-2 transition-all hover:scale-105 hover:shadow-lg ${
                        selectedColor?.hex === color.hex
                          ? 'border-brand-green ring-2 ring-brand-green/50'
                          : 'border-white/50 hover:border-white'
                      }`}
                      style={{ backgroundColor: color.hex }}
                      title={`${color.id || `color-${index + 1}`} - ${color.name}`}
                    >
                      {color.dominant && (
                        <div className="absolute top-1 right-1 w-2 h-2 bg-brand-green rounded-full border border-white shadow-sm" />
                      )}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeColor(index);
                      }}
                      className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10 shadow-md"
                      title="Remover cor"
                    >
                      <X className="w-3 h-3 text-white" />
                    </button>
                    {/* ID da cor */}
                    <div className="mt-1 text-center">
                      <span className={`text-xs font-mono font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        {color.id || `color-${index + 1}`}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Ações da Paleta */}
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 space-y-3">
                <button
                  onClick={() => setShowExport(true)}
                  className={`w-full py-3 rounded-xl font-semibold flex items-center justify-center gap-2 ${
                    darkMode
                      ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                      : 'bg-brand-green text-brand-blue-900 hover:bg-brand-green-500'
                  } transition-colors font-nunito`}
                >
                  <Download className="w-5 h-5" />
                  Exportar Paleta
                </button>
                <button
                  onClick={() => setShowAnalysis(true)}
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
                  onClick={() => setShowComplementary(!showComplementary)}
                  className={`w-full py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2 ${
                    darkMode
                      ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  } transition-colors font-poppins`}
                >
                  <Sparkles className="w-4 h-4" />
                  Cores Complementares
                </button>
              </div>
            </div>

            {/* Janela de Dicas/Tutoriais */}
            <div className={`mt-4 ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-xl border ${darkMode ? 'border-gray-700' : 'border-gray-200'} p-4 transition-colors`}>
              <div className="flex items-center gap-2 mb-3">
                <Lightbulb className={`w-5 h-5 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                <h3 className={`text-sm font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-800'} font-nunito`}>
                  Dicas e Tutoriais
                </h3>
              </div>
              <div className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-600'} font-poppins space-y-2`}>
                {extractionMode === 'auto' && (
                  <>
                    <p className="font-medium">Modo Automático:</p>
                    <ul className="list-disc list-inside space-y-1 ml-2">
                      <li>Clique em "Extrair Cores" para análise automática</li>
                      <li>O sistema identifica as cores mais frequentes na imagem</li>
                      <li>As 2 primeiras cores são marcadas como dominantes</li>
                    </ul>
                  </>
                )}
                {extractionMode === 'manual' && (
                  <>
                    <p className="font-medium">Modo Manual:</p>
                    <ul className="list-disc list-inside space-y-1 ml-2">
                      <li>Primeiro clique: ativa a lupa para visualizar pixels</li>
                      <li>Segundo clique: coleta a cor na posição da lupa</li>
                      <li>Arraste os pontos na imagem para atualizar as cores</li>
                      <li>Use o zoom para maior precisão na coleta</li>
                    </ul>
                  </>
                )}
                {extractionMode === 'gradient' && (
                  <>
                    <p className="font-medium">Modo Gradiente:</p>
                    <ul className="list-disc list-inside space-y-1 ml-2">
                      <li>Primeiro clique: ativa a lupa para visualizar pixels</li>
                      <li>Segundo clique: coleta a cor na posição da lupa</li>
                      <li>Colete múltiplas cores para criar um gradiente suave</li>
                      <li>As cores são conectadas visualmente na imagem</li>
                      <li>O preview mostra o gradiente gerado automaticamente</li>
                      <li>Arraste os pontos para ajustar o gradiente</li>
                    </ul>
                  </>
                )}
              </div>
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
                    <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-brand-blue-900'} font-nunito`}>
                      {colors[showColorModal].name}
                    </h3>
                    <span className={`text-xs font-mono font-semibold ${darkMode ? 'text-gray-400' : 'text-gray-600'} font-poppins`}>
                      {colors[showColorModal].id || `color-${showColorModal + 1}`}
                    </span>
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
                {/* Lista de Códigos */}
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
                      onClick={() => {
                        copyColor(colors[showColorModal], 'hex', showColorModal);
                      }}
                      className={`ml-3 p-2 ${darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'} rounded-lg transition-colors flex-shrink-0 ${
                        copiedCode?.colorIndex === showColorModal && copiedCode?.format === 'hex' ? 'bg-brand-green/20' : ''
                      }`}
                      title="Copiar HEX"
                    >
                      {copiedCode?.colorIndex === showColorModal && copiedCode?.format === 'hex' ? (
                        <CheckCircle2 className={`w-4 h-4 text-brand-green`} />
                      ) : (
                        <Copy className={`w-4 h-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`} />
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
                      onClick={() => {
                        copyColor(colors[showColorModal], 'rgb', showColorModal);
                      }}
                      className={`ml-3 p-2 ${darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'} rounded-lg transition-colors flex-shrink-0 ${
                        copiedCode?.colorIndex === showColorModal && copiedCode?.format === 'rgb' ? 'bg-brand-green/20' : ''
                      }`}
                      title="Copiar RGB"
                    >
                      {copiedCode?.colorIndex === showColorModal && copiedCode?.format === 'rgb' ? (
                        <CheckCircle2 className={`w-4 h-4 text-brand-green`} />
                      ) : (
                        <Copy className={`w-4 h-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`} />
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
                      onClick={() => {
                        copyColor(colors[showColorModal], 'cmyk', showColorModal);
                      }}
                      className={`ml-3 p-2 ${darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'} rounded-lg transition-colors flex-shrink-0 ${
                        copiedCode?.colorIndex === showColorModal && copiedCode?.format === 'cmyk' ? 'bg-brand-green/20' : ''
                      }`}
                      title="Copiar CMYK"
                    >
                      {copiedCode?.colorIndex === showColorModal && copiedCode?.format === 'cmyk' ? (
                        <CheckCircle2 className={`w-4 h-4 text-brand-green`} />
                      ) : (
                        <Copy className={`w-4 h-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`} />
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

        {/* Histórico de Paletas */}
        {showHistory && (
          <div className={`fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-6`}>
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden flex flex-col transition-colors`}>
              <div className={`p-6 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'} flex items-center justify-between`}>
                <h3 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-brand-blue-900'} font-nunito`}>
                  Histórico de Paletas
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

        {/* Modal de Exportação */}
        {showExport && (
          <div 
            className={`fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-6`}
            onClick={() => {
              setShowExport(false);
              setExportFormats([]);
              setPaletteName('');
              setExportAsGradient(false);
            }}
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
                  {/* Indicador do modo de extração */}
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
                  onClick={() => {
                    setShowExport(false);
                    setExportFormats([]);
                    setPaletteName('');
                  }}
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
                    {[
                      { key: 'ase', label: 'Adobe Swatch', icon: Save, desc: 'Para Adobe' },
                      { key: 'json', label: 'JSON', icon: FileCode, desc: 'Dados estruturados' },
                      { key: 'css', label: 'CSS Variables', icon: Code, desc: 'Variáveis CSS' },
                      { key: 'scss', label: 'SCSS', icon: Code, desc: 'Sass/SCSS' },
                      { key: 'png', label: 'Imagem PNG', icon: ImageExport, desc: 'Paleta visual' },
                      { key: 'svg', label: 'SVG', icon: ImageExport, desc: 'Gradiente SVG' },
                      { key: 'txt', label: 'Texto', icon: FileText, desc: 'Lista simples' },
                      { key: 'xml', label: 'XML', icon: FileCode, desc: 'Estrutura XML' },
                      { key: 'sketch', label: 'Sketch', icon: Layers, desc: 'Para Sketch' },
                      { key: 'pantone', label: 'Pantone', icon: Palette, desc: 'Códigos Pantone' }
                    ].map(({ key, label, icon: Icon, desc }) => {
                      const isSelected = exportFormats.includes(key);
                      return (
                        <button
                          key={key}
                          onClick={() => {
                            // Toggle seleção
                            if (isSelected) {
                              setExportFormats(prev => prev.filter(f => f !== key));
                            } else {
                              setExportFormats(prev => [...prev, key]);
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
                  onClick={async () => {
                    if (exportFormats.length === 0) {
                      alert('Selecione pelo menos um formato para exportar');
                      return;
                    }
                    // Exportar todos os formatos selecionados com delay para evitar bloqueio
                    const nameToUse = paletteName || 'Paleta de Cores';
                    for (let i = 0; i < exportFormats.length; i++) {
                      exportPalette(exportFormats[i], nameToUse);
                      // Pequeno delay entre downloads (exceto o último)
                      if (i < exportFormats.length - 1) {
                        await new Promise(resolve => setTimeout(resolve, 300));
                      }
                    }
                    setShowExport(false);
                    setExportFormats([]);
                    setPaletteName('');
                    setExportAsGradient(false);
                  }}
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
                  <Download className="w-5 h-5" />
                  Exportar {exportFormats.length > 0 && `(${exportFormats.length})`}
                </button>
                <button
                  onClick={() => {
                    setShowExport(false);
                    setExportFormats([]);
                    setPaletteName('');
                  }}
                  className={`px-6 py-3 rounded-xl font-medium ${
                    darkMode
                      ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  } transition-colors font-poppins`}
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal de Análise de Cores */}
        {showAnalysis && (
          <div className={`fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-6`}>
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-2xl max-w-3xl w-full max-h-[80vh] overflow-hidden flex flex-col transition-colors`}>
              <div className={`p-6 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'} flex items-center justify-between`}>
                <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-brand-blue-900'} font-nunito`}>
                  Análise de Cores
                </h3>
                <button
                  onClick={() => setShowAnalysis(false)}
                  className={`p-2 ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} rounded-lg transition-colors`}
                >
                  <X className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-6">
                {(() => {
                  const analysis = calculateColorAnalysis();
                  const harmony = analyzeHarmony();
                  const accessibility = analyzeAccessibility();
                  const warmColors = colors.filter(c => {
                    const rgb = hexToRgb(c.hex);
                    if (!rgb) return false;
                    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
                    return hsl.h >= 0 && hsl.h < 180; // Cores quentes (vermelho a amarelo)
                  }).length;
                  const coolColors = colors.length - warmColors;
                  
                  // Função para renderizar ícone baseado no tipo
                  const renderIcon = (iconName) => {
                    switch(iconName) {
                      case 'CheckCircle': return <CheckCircle2 className="w-4 h-4 text-brand-green" />;
                      case 'X': return <X className="w-4 h-4 text-red-500" />;
                      case 'AlertTriangle': return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
                      case 'Eye': return <Eye className="w-4 h-4 text-blue-500" />;
                      case 'Plus': return <Plus className="w-4 h-4 text-blue-500" />;
                      case 'Sparkles': return <Sparkles className="w-4 h-4 text-purple-500" />;
                      case 'Sun': return <Sun className="w-4 h-4 text-yellow-500" />;
                      case 'Moon': return <Moon className="w-4 h-4 text-gray-500" />;
                      default: return <Zap className="w-4 h-4 text-yellow-500" />;
                    }
                  };
                  
                  return (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Estatísticas */}
                      <div className={`p-6 rounded-xl border ${darkMode ? 'border-gray-700 bg-gray-700/50' : 'border-gray-200 bg-gray-50'}`}>
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
                      <div className={`p-6 rounded-xl border ${darkMode ? 'border-gray-700 bg-gray-700/50' : 'border-gray-200 bg-gray-50'}`}>
                        <h4 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-brand-blue-900'} font-nunito mb-4`}>
                          Distribuição
                        </h4>
                        <div className="space-y-3">
                          <div>
                            <div className="flex justify-between mb-1">
                              <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'} font-poppins`}>
                                Quentes
                              </span>
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
                              <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'} font-poppins`}>
                                Frias
                              </span>
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
                      <div className={`p-6 rounded-xl border-2 ${darkMode ? 'border-gray-700 bg-gray-800/80' : 'border-gray-200 bg-white'} shadow-lg`}>
                        <div className="flex items-center gap-2 mb-5">
                          <div className={`p-2 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                            <Sparkles className={`w-5 h-5 ${darkMode ? 'text-yellow-400' : 'text-yellow-600'}`} />
                          </div>
                          <h4 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-brand-blue-900'} font-nunito`}>
                            Harmonia
                          </h4>
                        </div>
                        <div className="space-y-4">
                          {harmony.suggestions.length > 0 ? (
                            harmony.suggestions.map((suggestion, idx) => {
                              const getCardStyle = () => {
                                switch(suggestion.type) {
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
                                    return darkMode 
                                      ? 'border-2 border-gray-600 bg-gray-700/50' 
                                      : 'border-2 border-gray-200 bg-gray-50';
                                }
                              };

                              const getIconColor = () => {
                                switch(suggestion.type) {
                                  case 'error': return darkMode ? 'text-red-400' : 'text-red-600';
                                  case 'warning': return darkMode ? 'text-yellow-400' : 'text-yellow-600';
                                  case 'info': return darkMode ? 'text-blue-400' : 'text-blue-600';
                                  case 'success': return darkMode ? 'text-brand-green' : 'text-brand-green';
                                  default: return darkMode ? 'text-gray-400' : 'text-gray-600';
                                }
                              };

                              return (
                                <div 
                                  key={idx} 
                                  className={`p-4 rounded-xl ${getCardStyle()} transition-all hover:shadow-lg`}
                                >
                                  <div className="flex items-start gap-3">
                                    <div className={`flex-shrink-0 p-2 rounded-lg ${darkMode ? 'bg-gray-700/80' : 'bg-white/80'} shadow-sm`}>
                                      <div className={getIconColor()}>
                                        {renderIcon(suggestion.icon)}
                                      </div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p className={`text-sm font-semibold ${darkMode ? 'text-gray-100' : 'text-gray-900'} font-poppins mb-3`}>
                                        {suggestion.message}
                                      </p>
                                      {suggestion.colors && suggestion.colors.length > 0 && (
                                        <div className="space-y-2">
                                          <span className={`text-xs font-semibold uppercase tracking-wide ${darkMode ? 'text-gray-400' : 'text-gray-600'} font-poppins block mb-2`}>
                                            Cores envolvidas:
                                          </span>
                                          <div className="flex items-center gap-3 flex-wrap">
                                            {suggestion.colors.map((color, colorIdx) => (
                                              <div 
                                                key={colorIdx} 
                                                className={`flex items-center gap-2 px-3 py-2 rounded-lg ${darkMode ? 'bg-gray-700/80 border border-gray-600' : 'bg-white border-2 border-gray-200'} shadow-md transition-all hover:scale-105`}
                                              >
                                                <div 
                                                  className="w-6 h-6 rounded-md border-2 border-white dark:border-gray-500 shadow-lg ring-2 ring-gray-200 dark:ring-gray-600"
                                                  style={{ backgroundColor: color.hex }}
                                                  title={color.name}
                                                />
                                                <div className="flex flex-col">
                                                  <span className={`text-xs font-bold ${darkMode ? 'text-gray-200' : 'text-gray-800'} font-poppins leading-tight`}>
                                                    {color.name}
                                                  </span>
                                                  <span className={`text-[10px] ${darkMode ? 'text-gray-500' : 'text-gray-500'} font-mono`}>
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
                                                  <span className={`text-xs font-bold px-2 py-0.5 rounded ${darkMode ? 'bg-yellow-500/20 text-yellow-400' : 'bg-yellow-100 text-yellow-700'} font-poppins`}>
                                                    {suggestion.similarity}%
                                                  </span>
                                                </div>
                                              )}
                                              {suggestion.contrast && (
                                                <div className="flex items-center gap-2 mt-1">
                                                  <span className={`text-xs font-semibold ${darkMode ? 'text-gray-400' : 'text-gray-600'} font-poppins`}>
                                                    Contraste:
                                                  </span>
                                                  <span className={`text-xs font-bold px-2 py-0.5 rounded ${darkMode ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-700'} font-poppins`}>
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
                            <div className={`p-4 rounded-xl border-2 ${darkMode ? 'border-gray-600 bg-gray-700/50' : 'border-gray-200 bg-gray-50'} shadow-sm`}>
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
                      <div className={`p-6 rounded-xl border-2 ${darkMode ? 'border-gray-700 bg-gray-800/80' : 'border-gray-200 bg-white'} shadow-lg`}>
                        <div className="flex items-center gap-2 mb-5">
                          <div className={`p-2 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-blue-100'}`}>
                            <Eye className={`w-5 h-5 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                          </div>
                          <h4 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-brand-blue-900'} font-nunito`}>
                            Acessibilidade
                          </h4>
                        </div>
                        <div className="space-y-4">
                          <div className={`p-4 rounded-xl border ${darkMode ? 'border-gray-700 bg-gray-700/30' : 'border-gray-200 bg-gray-50/80'}`}>
                            <div className="flex items-center justify-between mb-3">
                              <span className={`text-sm font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-800'} font-poppins`}>
                                WCAG AA (Texto Normal - 4.5:1)
                              </span>
                              <span className={`text-sm font-bold px-2.5 py-1 rounded-lg ${
                                accessibility.wcagAA.ratio >= 50 
                                  ? darkMode ? 'bg-green-500/20 text-green-400' : 'bg-green-100 text-green-700'
                                  : accessibility.wcagAA.ratio >= 25
                                  ? darkMode ? 'bg-yellow-500/20 text-yellow-400' : 'bg-yellow-100 text-yellow-700'
                                  : darkMode ? 'bg-red-500/20 text-red-400' : 'bg-red-100 text-red-700'
                              } font-poppins`}>
                                {accessibility.wcagAA.ratio}%
                              </span>
                            </div>
                            <div className={`flex-1 h-3 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} mb-2 shadow-inner`}>
                              <div 
                                className={`h-full rounded-full transition-all duration-500 ${
                                  accessibility.wcagAA.ratio >= 50 ? 'bg-gradient-to-r from-green-500 to-green-600' : 
                                  accessibility.wcagAA.ratio >= 25 ? 'bg-gradient-to-r from-yellow-500 to-yellow-600' : 
                                  'bg-gradient-to-r from-red-500 to-red-600'
                                } shadow-lg`}
                                style={{ width: `${accessibility.wcagAA.ratio}%` }}
                              />
                            </div>
                            <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'} font-poppins`}>
                              {accessibility.wcagAA.passes} de {accessibility.wcagAA.total} pares atendem ao critério
                            </p>
                          </div>
                          <div className={`p-4 rounded-xl border ${darkMode ? 'border-gray-700 bg-gray-700/30' : 'border-gray-200 bg-gray-50/80'}`}>
                            <div className="flex items-center justify-between mb-3">
                              <span className={`text-sm font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-800'} font-poppins`}>
                                WCAG AAA (Texto Normal - 7:1)
                              </span>
                              <span className={`text-sm font-bold px-2.5 py-1 rounded-lg ${
                                accessibility.wcagAAA.ratio >= 50 
                                  ? darkMode ? 'bg-green-500/20 text-green-400' : 'bg-green-100 text-green-700'
                                  : accessibility.wcagAAA.ratio >= 25
                                  ? darkMode ? 'bg-yellow-500/20 text-yellow-400' : 'bg-yellow-100 text-yellow-700'
                                  : darkMode ? 'bg-red-500/20 text-red-400' : 'bg-red-100 text-red-700'
                              } font-poppins`}>
                                {accessibility.wcagAAA.ratio}%
                              </span>
                            </div>
                            <div className={`flex-1 h-3 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} mb-2 shadow-inner`}>
                              <div 
                                className={`h-full rounded-full transition-all duration-500 ${
                                  accessibility.wcagAAA.ratio >= 50 ? 'bg-gradient-to-r from-green-500 to-green-600' : 
                                  accessibility.wcagAAA.ratio >= 25 ? 'bg-gradient-to-r from-yellow-500 to-yellow-600' : 
                                  'bg-gradient-to-r from-red-500 to-red-600'
                                } shadow-lg`}
                                style={{ width: `${accessibility.wcagAAA.ratio}%` }}
                              />
                            </div>
                            <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'} font-poppins`}>
                              {accessibility.wcagAAA.passes} de {accessibility.wcagAAA.total} pares atendem ao critério
                            </p>
                          </div>
                          <div className={`p-4 rounded-xl border ${darkMode ? 'border-gray-700 bg-gray-700/30' : 'border-gray-200 bg-gray-50/80'}`}>
                            <div className="flex items-center justify-between mb-3">
                              <span className={`text-sm font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-800'} font-poppins`}>
                                WCAG AA (Texto Grande - 3:1)
                              </span>
                              <span className={`text-sm font-bold px-2.5 py-1 rounded-lg ${
                                accessibility.wcagLarge.ratio >= 50 
                                  ? darkMode ? 'bg-green-500/20 text-green-400' : 'bg-green-100 text-green-700'
                                  : accessibility.wcagLarge.ratio >= 25
                                  ? darkMode ? 'bg-yellow-500/20 text-yellow-400' : 'bg-yellow-100 text-yellow-700'
                                  : darkMode ? 'bg-red-500/20 text-red-400' : 'bg-red-100 text-red-700'
                              } font-poppins`}>
                                {accessibility.wcagLarge.ratio}%
                              </span>
                            </div>
                            <div className={`flex-1 h-3 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} mb-2 shadow-inner`}>
                              <div 
                                className={`h-full rounded-full transition-all duration-500 ${
                                  accessibility.wcagLarge.ratio >= 50 ? 'bg-gradient-to-r from-green-500 to-green-600' : 
                                  accessibility.wcagLarge.ratio >= 25 ? 'bg-gradient-to-r from-yellow-500 to-yellow-600' : 
                                  'bg-gradient-to-r from-red-500 to-red-600'
                                } shadow-lg`}
                                style={{ width: `${accessibility.wcagLarge.ratio}%` }}
                              />
                            </div>
                            <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'} font-poppins`}>
                              {accessibility.wcagLarge.passes} de {accessibility.wcagLarge.total} pares atendem ao critério
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>
          </div>
        )}

        {/* Configurações */}
        {showSettings && (
          <div className={`fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-6`}>
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-2xl max-w-md w-full transition-colors`}>
              <div className={`p-6 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'} flex items-center justify-between`}>
                <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-brand-blue-900'} font-nunito`}>
                  Configurações
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
                    Número de Cores
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
                    Salvar Configurações
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Project5;

