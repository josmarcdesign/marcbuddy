# Fase 3: Ferramentas Web - Visão Geral

> **Status**: 📋 Pendente  
> **Fase**: 3 - Ferramentas Web  
> **Ordem**: 01

## 📋 Objetivos da Fase 3

Implementar as ferramentas principais do MarcBuddy que agregam valor aos usuários:

1. **Extrator de Cores** - Extrair paleta de cores de imagens
2. **Compressor de Imagens** - Otimizar tamanho de imagens
3. **Renomeador em Lote** - Renomear múltiplos arquivos simultaneamente
4. **Sistema de Upload** - Upload seguro de arquivos
5. **Interface Unificada** - Dashboard de ferramentas

## 🎯 Checklist da Fase 3

### Backend
- [ ] Criar endpoint de upload de arquivos
- [ ] Implementar serviço de extração de cores
- [ ] Implementar serviço de compressão de imagens
- [ ] Implementar serviço de renomeação em lote
- [ ] Adicionar validação de tipos de arquivo
- [ ] Implementar limpeza automática de arquivos temporários
- [ ] Adicionar limitações por plano

### Frontend
- [ ] Criar componente de Upload de Arquivos
- [ ] Criar página de Extrator de Cores
- [ ] Criar página de Compressor de Imagens
- [ ] Criar página de Renomeador em Lote
- [ ] Criar Dashboard de Ferramentas
- [ ] Adicionar validação de plano ativo
- [ ] Implementar feedback visual (loading, progress)

### Testes
- [ ] Testar upload de diferentes tipos de arquivo
- [ ] Testar extração de cores de imagens
- [ ] Testar compressão de imagens
- [ ] Testar renomeação em lote
- [ ] Validar limitações por plano
- [ ] Testar comportamento com arquivos grandes

## 📚 Estrutura de Arquivos

### Backend
```
backend/src/
├── controllers/
│   ├── upload.controller.js          # Upload de arquivos
│   ├── colorExtractor.controller.js  # Extração de cores
│   ├── imageCompressor.controller.js # Compressão
│   └── fileRenamer.controller.js     # Renomeação
├── services/
│   ├── colorExtractor.service.js
│   ├── imageCompressor.service.js
│   └── fileRenamer.service.js
├── routes/
│   └── tools.routes.js               # Rotas das ferramentas
├── middleware/
│   ├── upload.middleware.js          # Multer config
│   └── planRestrictions.middleware.js # Validação de plano
└── utils/
    └── fileCleanup.js                # Limpeza de arquivos temp
```

### Frontend
```
frontend/src/
├── pages/
│   ├── Tools/
│   │   ├── Dashboard.jsx             # Dashboard de ferramentas
│   │   ├── ColorExtractor.jsx        # Extrator de cores
│   │   ├── ImageCompressor.jsx       # Compressor
│   │   └── FileRenamer.jsx           # Renomeador
├── components/
│   ├── FileUpload.jsx                # Componente de upload
│   ├── ColorPalette.jsx              # Exibição de paleta
│   ├── ProgressBar.jsx               # Barra de progresso
│   └── ToolCard.jsx                  # Card de ferramenta
└── services/
    └── tools.service.js              # API das ferramentas
```

## 🔧 Tecnologias Adicionais

### Backend
```bash
npm install multer sharp colorthief fast-csv
```

- **multer**: Upload de arquivos
- **sharp**: Processamento de imagens
- **colorthief**: Extração de cores
- **fast-csv**: Manipulação de CSV

### Frontend
```bash
npm install react-dropzone
```

- **react-dropzone**: Componente de drag & drop

## 🎨 Ferramentas Planejadas

### 1. Extrator de Cores
**Funcionalidade:**
- Upload de imagem
- Extração de paleta de cores (5-10 cores principais)
- Exibição de cores em hex, RGB e HSL
- Copiar código de cores
- Download da paleta

**Limitações por Plano:**
- Free: 5 extrações/dia
- Basic: 50 extrações/dia
- Premium: Ilimitado
- Enterprise: Ilimitado

### 2. Compressor de Imagens
**Funcionalidade:**
- Upload de múltiplas imagens (JPG, PNG, WebP)
- Compressão automática (mantém qualidade)
- Preview antes/depois
- Download individual ou em ZIP
- Estatísticas de economia de espaço

**Limitações por Plano:**
- Free: 5 imagens/dia, max 2MB cada
- Basic: 50 imagens/dia, max 10MB cada
- Premium: 500 imagens/dia, max 50MB cada
- Enterprise: Ilimitado

### 3. Renomeador em Lote
**Funcionalidade:**
- Upload de múltiplos arquivos
- Padrões de renomeação:
  - Prefixo/Sufixo
  - Numeração sequencial
  - Data/Hora
  - Substituir texto
- Preview antes de renomear
- Download em ZIP

**Limitações por Plano:**
- Free: 10 arquivos/vez
- Basic: 50 arquivos/vez
- Premium: 200 arquivos/vez
- Enterprise: Ilimitado

## 📊 Limitações e Validações

### Tamanho de Arquivos
```javascript
const FILE_SIZE_LIMITS = {
  free: 2 * 1024 * 1024,      // 2MB
  basic: 10 * 1024 * 1024,    // 10MB
  premium: 50 * 1024 * 1024,  // 50MB
  enterprise: 100 * 1024 * 1024 // 100MB
};
```

### Uso Diário
```javascript
const DAILY_LIMITS = {
  colorExtractor: {
    free: 5,
    basic: 50,
    premium: -1, // ilimitado
    enterprise: -1
  },
  imageCompressor: {
    free: 5,
    basic: 50,
    premium: 500,
    enterprise: -1
  },
  fileRenamer: {
    free: 10,
    basic: 50,
    premium: 200,
    enterprise: -1
  }
};
```

## 🗄️ Estrutura do Banco de Dados

### Tabela: tool_usage
```sql
CREATE TABLE tool_usage (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  tool_name VARCHAR(50) NOT NULL,
  usage_date DATE DEFAULT CURRENT_DATE,
  usage_count INTEGER DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, tool_name, usage_date)
);

CREATE INDEX idx_tool_usage_user_date ON tool_usage(user_id, usage_date);
```

## 🚀 Ordem de Implementação

1. **02-FASE3-UPLOAD_ARQUIVOS.md** - Sistema de upload
2. **03-FASE3-EXTRATOR_CORES.md** - Ferramenta de cores
3. **04-FASE3-COMPRESSOR_IMAGENS.md** - Compressor
4. **05-FASE3-RENOMEADOR_LOTE.md** - Renomeador
5. **06-FASE3-DASHBOARD_FERRAMENTAS.md** - Interface unificada
6. **07-FASE3-RESTRICOES_PLANOS.md** - Limitações por plano
7. **08-FASE3-TESTES_VALIDACAO.md** - Testes completos

## 📝 Notas Importantes

### Segurança
- Validar tipos MIME dos arquivos
- Sanitizar nomes de arquivos
- Limitar tamanho de upload
- Usar tokens únicos para arquivos
- Limpar arquivos temporários após 1 hora

### Performance
- Processar arquivos em background (se muitos)
- Implementar cache quando possível
- Otimizar processamento de imagens

### UX
- Feedback visual durante processamento
- Barra de progresso para uploads
- Preview antes de processar
- Mensagens de erro claras

## ⚠️ Considerações

- Arquivos são temporários (não são armazenados permanentemente)
- Processamento é assíncrono para arquivos grandes
- Validação de plano ativo antes de usar ferramentas
- Tracking de uso para respeitar limites

---

**Próximo**: Seguir para `02-FASE3-UPLOAD_ARQUIVOS.md` para implementar o sistema de upload

