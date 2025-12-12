# Fase 3.2: Extrator de Cores - Passo a Passo

> **Status**: 📋 Pendente  
> **Fase**: 3 - Ferramentas Web  
> **Ordem**: 03

## 📋 Objetivo

Criar ferramenta para extrair paleta de cores de imagens com exibição em múltiplos formatos (HEX, RGB, HSL).

## 🎯 O Que Será Implementado

- Extração de 5-10 cores dominantes
- Conversão para HEX, RGB, HSL
- Interface visual de paleta
- Copiar código de cor
- Download da paleta
- Limitações por plano

## 🔧 Passo 1: Instalar Dependência

```bash
cd backend
npm install sharp node-vibrant
```

## 📝 Passo 2: Criar Serviço de Extração (Backend)

**Arquivo:** `backend/src/services/colorExtractor.service.js`

```javascript
import Vibrant from 'node-vibrant';
import path from 'path';

/**
 * Converte RGB para HEX
 */
const rgbToHex = (r, g, b) => {
  return '#' + [r, g, b]
    .map(x => {
      const hex = Math.round(x).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    })
    .join('');
};

/**
 * Converte RGB para HSL
 */
const rgbToHsl = (r, g, b) => {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100)
  };
};

/**
 * Extrai cores de uma imagem
 */
export const extractColors = async (imagePath) => {
  try {
    const palette = await Vibrant.from(imagePath).getPalette();
    
    const colors = [];
    const swatchNames = ['Vibrant', 'DarkVibrant', 'LightVibrant', 'Muted', 'DarkMuted', 'LightMuted'];

    swatchNames.forEach(name => {
      const swatch = palette[name];
      if (swatch) {
        const [r, g, b] = swatch.rgb;
        const hex = rgbToHex(r, g, b);
        const hsl = rgbToHsl(r, g, b);

        colors.push({
          name,
          hex,
          rgb: {
            r: Math.round(r),
            g: Math.round(g),
            b: Math.round(b)
          },
          hsl,
          population: swatch.population
        });
      }
    });

    return colors.sort((a, b) => b.population - a.population);
  } catch (error) {
    console.error('Erro ao extrair cores:', error);
    throw error;
  }
};
```

## 📝 Passo 3: Criar Controller (Backend)

**Arquivo:** `backend/src/controllers/colorExtractor.controller.js`

```javascript
import { extractColors } from '../services/colorExtractor.service.js';
import path from 'path';
import fs from 'fs';

/**
 * Extrai cores de uma imagem
 */
export const extractColorsFromImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Nenhuma imagem enviada'
      });
    }

    const imagePath = path.join(process.cwd(), 'uploads', req.file.filename);

    // Verificar se arquivo existe
    if (!fs.existsSync(imagePath)) {
      return res.status(404).json({
        success: false,
        message: 'Arquivo não encontrado'
      });
    }

    // Extrair cores
    const colors = await extractColors(imagePath);

    res.json({
      success: true,
      message: 'Cores extraídas com sucesso',
      data: {
        colors,
        image: {
          filename: req.file.filename,
          originalName: req.file.originalname,
          url: `/uploads/${req.file.filename}`
        }
      }
    });
  } catch (error) {
    console.error('Erro ao extrair cores:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao extrair cores da imagem'
    });
  }
};
```

## 📝 Passo 4: Criar Rotas (Backend)

**Arquivo:** `backend/src/routes/tools.routes.js`

```javascript
import express from 'express';
import { authenticateToken } from '../middleware/auth.middleware.js';
import uploadMiddleware from '../middleware/upload.middleware.js';
import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { extractColorsFromImage } from '../controllers/colorExtractor.controller.js';

const router = express.Router();

// Configuração específica para upload único
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    cb(null, `${uuidv4()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Tipo de arquivo não suportado'));
    }
  }
});

// Requer autenticação
router.use(authenticateToken);

// Rotas
router.post('/color-extractor', upload.single('image'), extractColorsFromImage);

export default router;
```

## 📝 Passo 5: Registrar Rotas no Server

**Arquivo:** `backend/src/server.js`

Adicionar:
```javascript
import toolsRoutes from './routes/tools.routes.js';

// Rotas
app.use('/api/tools', toolsRoutes);
```

## 📝 Passo 6: Criar Serviço no Frontend

**Arquivo:** `frontend/src/services/tools.service.js`

```javascript
import api from './api';

export const toolsService = {
  extractColors: async (imageFile) => {
    const formData = new FormData();
    formData.append('image', imageFile);

    const response = await api.post('/tools/color-extractor', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    return response.data;
  }
};

export default toolsService;
```

## 📝 Passo 7: Criar Componente de Paleta de Cores

**Arquivo:** `frontend/src/components/ColorPalette.jsx`

```javascript
import { useState } from 'react';

const ColorPalette = ({ colors }) => {
  const [copiedIndex, setCopiedIndex] = useState(null);

  const copyToClipboard = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  if (!colors || colors.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Paleta de Cores</h3>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {colors.map((color, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Cor */}
            <div 
              className="h-24 w-full" 
              style={{ backgroundColor: color.hex }}
            />
            
            {/* Informações */}
            <div className="p-4">
              <p className="text-sm font-medium text-gray-700 mb-2">
                {color.name}
              </p>
              
              {/* HEX */}
              <div className="mb-2">
                <button
                  onClick={() => copyToClipboard(color.hex, `${index}-hex`)}
                  className="w-full text-left text-sm font-mono text-gray-900 hover:text-primary-600 transition-colors"
                >
                  {color.hex}
                  {copiedIndex === `${index}-hex` && (
                    <span className="ml-2 text-green-600">✓</span>
                  )}
                </button>
              </div>
              
              {/* RGB */}
              <div className="mb-2">
                <button
                  onClick={() => copyToClipboard(`rgb(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b})`, `${index}-rgb`)}
                  className="w-full text-left text-xs font-mono text-gray-600 hover:text-primary-600 transition-colors"
                >
                  rgb({color.rgb.r}, {color.rgb.g}, {color.rgb.b})
                  {copiedIndex === `${index}-rgb` && (
                    <span className="ml-2 text-green-600">✓</span>
                  )}
                </button>
              </div>
              
              {/* HSL */}
              <div>
                <button
                  onClick={() => copyToClipboard(`hsl(${color.hsl.h}, ${color.hsl.s}%, ${color.hsl.l}%)`, `${index}-hsl`)}
                  className="w-full text-left text-xs font-mono text-gray-600 hover:text-primary-600 transition-colors"
                >
                  hsl({color.hsl.h}, {color.hsl.s}%, {color.hsl.l}%)
                  {copiedIndex === `${index}-hsl` && (
                    <span className="ml-2 text-green-600">✓</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ColorPalette;
```

## 📝 Passo 8: Criar Página do Extrator de Cores

**Arquivo:** `frontend/src/pages/Tools/ColorExtractor.jsx`

```javascript
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FileUpload from '../../components/FileUpload';
import ColorPalette from '../../components/ColorPalette';
import toolsService from '../../services/tools.service';

const ColorExtractor = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleUploadComplete = async (files) => {
    if (!files || files.length === 0) return;

    try {
      setLoading(true);
      setError('');

      // Arquivo já foi enviado pelo FileUpload, mas precisamos enviar para o endpoint específico
      // Por isso vamos fazer upload direto aqui
      const imageFile = files[0]; // Só precisamos do primeiro arquivo

      const response = await toolsService.extractColors(imageFile);
      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao extrair cores');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/tools')}
            className="text-primary-600 hover:text-primary-700 mb-4"
          >
            ← Voltar para Ferramentas
          </button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Extrator de Cores
          </h1>
          <p className="text-gray-600">
            Faça upload de uma imagem para extrair sua paleta de cores
          </p>
        </div>

        {/* Upload */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <FileUpload
            onUploadComplete={handleUploadComplete}
            accept={{
              'image/*': ['.jpeg', '.jpg', '.png', '.webp']
            }}
            maxSize={10 * 1024 * 1024}
            maxFiles={1}
          />
        </div>

        {/* Loading */}
        {loading && (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Extraindo cores...</p>
          </div>
        )}

        {/* Erro */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 p-4 rounded mb-6">
            {error}
          </div>
        )}

        {/* Resultado */}
        {result && !loading && (
          <div className="bg-white rounded-lg shadow p-6">
            {/* Imagem original */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Imagem Original
              </h3>
              <img 
                src={`http://localhost:3001${result.image.url}`}
                alt={result.image.originalName}
                className="max-w-md rounded-lg shadow-md"
              />
            </div>

            {/* Paleta */}
            <ColorPalette colors={result.colors} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ColorExtractor;
```

## 📝 Passo 9: Adicionar Rota no App.jsx

**Arquivo:** `frontend/src/App.jsx`

Adicionar:
```javascript
import ColorExtractor from './pages/Tools/ColorExtractor';

// Na seção de Routes:
<Route
  path="/tools/color-extractor"
  element={
    <ProtectedRoute>
      <ColorExtractor />
    </ProtectedRoute>
  }
/>
```

## ✅ Checklist de Conclusão

- [ ] Dependência node-vibrant instalada
- [ ] Serviço de extração criado
- [ ] Controller criado
- [ ] Rotas criadas e registradas
- [ ] Serviço frontend criado
- [ ] Componente ColorPalette criado
- [ ] Página ColorExtractor criada
- [ ] Rota adicionada ao App.jsx
- [ ] Testado com diferentes imagens
- [ ] Validado cópia de cores
- [ ] Verificado formatos HEX, RGB, HSL

## 🧪 Testar

1. Acesse `/tools/color-extractor`
2. Faça upload de uma imagem colorida
3. Verifique se as cores são extraídas
4. Teste copiar cores em diferentes formatos
5. Verifique responsividade

---

**Próximo**: `04-FASE3-COMPRESSOR_IMAGENS.md` - Implementar compressor de imagens

