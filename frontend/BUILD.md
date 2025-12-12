# 🏗️ Build de Produção - MarcBuddy Frontend

## 📋 Pré-requisitos

- Node.js 18+ instalado
- NPM ou Yarn
- Todas as dependências instaladas (`npm install`)

## 🚀 Como fazer Build para Produção

### 1. Build Padrão

```bash
cd frontend
npm run build
```

Isso irá:
- ✅ Compilar todo o código React
- ✅ Processar e minificar CSS com Tailwind
- ✅ Otimizar imagens e assets
- ✅ Gerar bundles otimizados com code splitting
- ✅ Criar hash nos arquivos para cache busting
- ✅ Processar fontes e cursores customizados

### 2. Build com Análise

```bash
npm run build:analyze
```

Útil para analisar o tamanho dos bundles e identificar otimizações.

### 3. Preview Local

```bash
npm run preview
```

Testa o build localmente antes de fazer deploy.

## 📁 Estrutura de Saída (pasta `dist/`)

```
dist/
├── index.html                 # HTML principal
├── assets/
│   ├── js/                   # JavaScript otimizado
│   │   ├── [name]-[hash].js  # Chunks da aplicação
│   │   └── vendor-[hash].js  # Bibliotecas externas
│   ├── fonts/                # Fontes TTF
│   │   ├── Nunito-*-[hash].ttf
│   │   └── Poppins-*-[hash].ttf
│   ├── images/               # Imagens e SVGs
│   │   ├── cursor-*.svg
│   │   ├── logos/
│   │   ├── icons/
│   │   └── ilustrations/
│   └── [name]-[hash].css     # CSS minificado
```

## 🔧 Otimizações Aplicadas

### CSS
- ✅ Tailwind CSS purge (remove classes não usadas)
- ✅ PostCSS autoprefixer (compatibilidade cross-browser)
- ✅ cssnano minification (reduz tamanho)
- ✅ URLs de assets resolvidas corretamente

### JavaScript
- ✅ Code splitting automático
- ✅ Tree shaking (remove código não usado)
- ✅ Minificação
- ✅ Vendor chunks separados (React, Material-UI, etc)

### Assets
- ✅ Fontes otimizadas com `font-display: swap`
- ✅ Imagens com hash para cache
- ✅ SVGs inline quando necessário

### Performance
- ✅ Lazy loading de componentes
- ✅ Cache busting com hashes
- ✅ Chunks separados para melhor cache
- ✅ Preload de recursos críticos

## ⚠️ Problemas Comuns e Soluções

### 1. Fontes não carregam em produção

**Problema:** URLs relativas não resolvidas
**Solução:** ✅ Já corrigido - URLs agora usam `/src/assets/fonts/...`

### 2. CSS não aplicado corretamente

**Problema:** Classes Tailwind removidas por engano
**Solução:** ✅ Já configurado - `content` no `tailwind.config.js` inclui todos os arquivos JSX

### 3. Cursores customizados não funcionam

**Problema:** SVGs não encontrados
**Solução:** ✅ Já corrigido - URLs agora usam `/src/assets/cursor/...`

### 4. Imagens quebradas

**Problema:** Paths incorretos após build
**Solução:** Use sempre imports ES6:
```jsx
import logo from '@/assets/logos/isotipo.svg';
<img src={logo} alt="Logo" />
```

## 🌐 Deploy

### Opção 1: Hospedagem Estática (Netlify, Vercel, etc)

1. Faça build: `npm run build`
2. Configure o diretório de saída: `frontend/dist`
3. Configure comando de build: `cd frontend && npm run build`

### Opção 2: Servidor Próprio (Nginx, Apache)

1. Faça build: `npm run build`
2. Copie o conteúdo de `frontend/dist` para o servidor
3. Configure o servidor para:
   - Servir `index.html` para todas as rotas (SPA)
   - Habilitar compressão Gzip/Brotli
   - Configurar cache para assets com hash

### Exemplo Nginx

```nginx
server {
    listen 80;
    server_name marcbuddy.com;
    root /var/www/marcbuddy/dist;
    
    # Gzip compression
    gzip on;
    gzip_types text/css application/javascript image/svg+xml;
    
    # Cache para assets com hash
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # SPA routing
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

## 📊 Checklist de Build

Antes de fazer deploy, verifique:

- [ ] Build executado sem erros: `npm run build`
- [ ] Preview local funciona: `npm run preview`
- [ ] Fontes carregam corretamente
- [ ] Imagens e logos aparecem
- [ ] Navegação entre páginas funciona
- [ ] CSS aplicado corretamente
- [ ] Cursores customizados funcionam
- [ ] Backend API configurada corretamente
- [ ] Variáveis de ambiente configuradas

## 🐛 Debug de Problemas

### Ver tamanho dos bundles

```bash
npm run build
ls -lh dist/assets/js/
```

### Testar localmente com servidor

```bash
npm run preview
```

### Verificar warnings do build

Preste atenção em:
- ⚠️ Chunks muito grandes (>500KB)
- ⚠️ Imports dinâmicos falhando
- ⚠️ Assets não encontrados

## 📝 Notas Adicionais

- Build otimizado tem ~2-3MB (incluindo fontes)
- Tempo de build: ~30-60 segundos
- Primeiro carregamento: ~1-2s (com cache)
- Navegação subsequente: instantânea

## 🔗 Links Úteis

- [Vite Build Guide](https://vitejs.dev/guide/build.html)
- [Tailwind CSS Production](https://tailwindcss.com/docs/optimizing-for-production)
- [React Performance](https://react.dev/learn/render-and-commit)
