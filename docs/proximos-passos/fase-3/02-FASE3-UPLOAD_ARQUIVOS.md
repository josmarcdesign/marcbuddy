# Fase 3.1: Sistema de Upload de Arquivos - Passo a Passo

> **Status**: 📋 Pendente  
> **Fase**: 3 - Ferramentas Web  
> **Ordem**: 02

## 📋 Objetivo

Implementar sistema seguro de upload de arquivos com validação de tipo, tamanho e limpeza automática.

## 🎯 O Que Será Implementado

- Upload de arquivos via multipart/form-data
- Validação de tipo MIME
- Limitações de tamanho por plano
- Armazenamento temporário
- Limpeza automática de arquivos antigos
- Componente React de drag & drop

## 🔧 Passo 1: Instalar Dependências

### Backend
```bash
cd backend
npm install multer uuid
```

### Frontend
```bash
cd frontend
npm install react-dropzone
```

## 📝 Passo 2: Criar Middleware de Upload (Backend)

**Arquivo:** `backend/src/middleware/upload.middleware.js`

```javascript
import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';

// Criar pasta de uploads se não existir
const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configuração de armazenamento
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

// Filtro de tipos de arquivo
const fileFilter = (req, file, cb) => {
  const allowedMimes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp',
    'image/svg+xml'
  ];

  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Tipo de arquivo não suportado'), false);
  }
};

// Limites de tamanho por plano
const getSizeLimit = (planType) => {
  const limits = {
    free: 2 * 1024 * 1024,      // 2MB
    basic: 10 * 1024 * 1024,    // 10MB
    premium: 50 * 1024 * 1024,  // 50MB
    enterprise: 100 * 1024 * 1024 // 100MB
  };
  return limits[planType] || limits.free;
};

// Middleware de upload
export const uploadMiddleware = (req, res, next) => {
  // Obter plano do usuário (assumindo que está em req.user)
  const planType = req.user?.plan_type || 'free';
  const sizeLimit = getSizeLimit(planType);

  const upload = multer({
    storage,
    fileFilter,
    limits: {
      fileSize: sizeLimit,
      files: 10 // máximo de 10 arquivos por vez
    }
  }).array('files', 10);

  upload(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
          success: false,
          message: `Arquivo muito grande. Limite: ${Math.round(sizeLimit / 1024 / 1024)}MB`
        });
      }
      return res.status(400).json({
        success: false,
        message: err.message
      });
    } else if (err) {
      return res.status(400).json({
        success: false,
        message: err.message
      });
    }
    next();
  });
};

export default uploadMiddleware;
```

## 📝 Passo 3: Criar Utilitário de Limpeza (Backend)

**Arquivo:** `backend/src/utils/fileCleanup.js`

```javascript
import fs from 'fs';
import path from 'path';

const UPLOADS_DIR = path.join(process.cwd(), 'uploads');
const MAX_AGE = 60 * 60 * 1000; // 1 hora em milissegundos

/**
 * Remove arquivos mais antigos que MAX_AGE
 */
export const cleanupOldFiles = () => {
  try {
    if (!fs.existsSync(UPLOADS_DIR)) {
      return;
    }

    const files = fs.readdirSync(UPLOADS_DIR);
    const now = Date.now();

    files.forEach(file => {
      const filePath = path.join(UPLOADS_DIR, file);
      const stats = fs.statSync(filePath);
      const age = now - stats.mtimeMs;

      if (age > MAX_AGE) {
        fs.unlinkSync(filePath);
        console.log(`Arquivo removido: ${file}`);
      }
    });
  } catch (error) {
    console.error('Erro na limpeza de arquivos:', error);
  }
};

// Executar limpeza a cada 30 minutos
setInterval(cleanupOldFiles, 30 * 60 * 1000);

export default cleanupOldFiles;
```

## 📝 Passo 4: Criar Controller de Upload (Backend)

**Arquivo:** `backend/src/controllers/upload.controller.js`

```javascript
import path from 'path';

/**
 * Upload de arquivos
 */
export const uploadFiles = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Nenhum arquivo enviado'
      });
    }

    const files = req.files.map(file => ({
      filename: file.filename,
      originalName: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      path: `/uploads/${file.filename}`
    }));

    res.json({
      success: true,
      message: 'Arquivos enviados com sucesso',
      data: { files }
    });
  } catch (error) {
    console.error('Erro no upload:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao fazer upload'
    });
  }
};
```

## 📝 Passo 5: Criar Rotas de Upload (Backend)

**Arquivo:** `backend/src/routes/upload.routes.js`

```javascript
import express from 'express';
import { authenticateToken } from '../middleware/auth.middleware.js';
import uploadMiddleware from '../middleware/upload.middleware.js';
import { uploadFiles } from '../controllers/upload.controller.js';

const router = express.Router();

// Requer autenticação
router.use(authenticateToken);

// Rota de upload
router.post('/', uploadMiddleware, uploadFiles);

export default router;
```

## 📝 Passo 6: Registrar Rotas no Server (Backend)

**Arquivo:** `backend/src/server.js`

Adicionar:
```javascript
import uploadRoutes from './routes/upload.routes.js';
import { cleanupOldFiles } from './utils/fileCleanup.js';

// Rotas
app.use('/api/uploads', uploadRoutes);

// Servir arquivos estáticos
app.use('/uploads', express.static('uploads'));

// Iniciar limpeza de arquivos
cleanupOldFiles();
```

## 📝 Passo 7: Criar Serviço de Upload (Frontend)

**Arquivo:** `frontend/src/services/upload.service.js`

```javascript
import api from './api';

export const uploadService = {
  uploadFiles: async (files) => {
    const formData = new FormData();
    
    files.forEach(file => {
      formData.append('files', file);
    });

    const response = await api.post('/uploads', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    return response.data;
  }
};

export default uploadService;
```

## 📝 Passo 8: Criar Componente de Upload (Frontend)

**Arquivo:** `frontend/src/components/FileUpload.jsx`

```javascript
import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import uploadService from '../services/upload.service';

const FileUpload = ({ onUploadComplete, accept, maxSize, maxFiles = 10 }) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const onDrop = useCallback(async (acceptedFiles) => {
    try {
      setUploading(true);
      setError('');

      const result = await uploadService.uploadFiles(acceptedFiles);
      
      if (onUploadComplete) {
        onUploadComplete(result.data.files);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao fazer upload');
    } finally {
      setUploading(false);
    }
  }, [onUploadComplete]);

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept,
    maxSize,
    maxFiles,
    disabled: uploading
  });

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
          transition-colors
          ${isDragActive ? 'border-primary-500 bg-primary-50' : 'border-gray-300'}
          ${isDragReject ? 'border-red-500 bg-red-50' : ''}
          ${uploading ? 'opacity-50 cursor-not-allowed' : 'hover:border-primary-400'}
        `}
      >
        <input {...getInputProps()} />
        
        <div className="flex flex-col items-center">
          <svg className="w-12 h-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          
          {uploading ? (
            <p className="text-gray-600">Enviando arquivos...</p>
          ) : isDragActive ? (
            <p className="text-primary-600">Solte os arquivos aqui</p>
          ) : (
            <>
              <p className="text-gray-600 mb-2">
                Arraste arquivos aqui ou clique para selecionar
              </p>
              <p className="text-sm text-gray-500">
                Máximo de {maxFiles} arquivo(s) • Até {Math.round(maxSize / 1024 / 1024)}MB cada
              </p>
            </>
          )}
        </div>
      </div>

      {error && (
        <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
    </div>
  );
};

export default FileUpload;
```

## ✅ Checklist de Conclusão

- [ ] Dependências instaladas (multer, uuid, react-dropzone)
- [ ] Middleware de upload criado
- [ ] Utilitário de limpeza implementado
- [ ] Controller de upload criado
- [ ] Rotas registradas no server
- [ ] Pasta /uploads servida como estática
- [ ] Serviço de upload no frontend criado
- [ ] Componente FileUpload criado
- [ ] Testado upload de arquivo único
- [ ] Testado upload de múltiplos arquivos
- [ ] Validado limite de tamanho
- [ ] Validado tipos de arquivo

## 🧪 Testar

```bash
# No Postman ou curl
curl -X POST http://localhost:3001/api/uploads \
  -H "Authorization: Bearer SEU_TOKEN" \
  -F "files=@imagem.jpg"
```

---

**Próximo**: `03-FASE3-EXTRATOR_CORES.md` - Implementar ferramenta de extração de cores

