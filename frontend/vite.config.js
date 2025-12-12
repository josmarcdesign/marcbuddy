import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';

// Verificar se os certificados SSL existem
const certsDir = path.resolve(__dirname, '../certs');

// Detectar automaticamente o certificado mais recente
let httpsConfig = undefined;
if (fs.existsSync(certsDir)) {
  const certFiles = fs.readdirSync(certsDir)
    .filter(file => file.startsWith('localhost+') && file.endsWith('.pem') && !file.includes('-key'))
    .map(file => ({
      name: file,
      path: path.join(certsDir, file),
      stats: fs.statSync(path.join(certsDir, file))
    }))
    .sort((a, b) => b.stats.mtimeMs - a.stats.mtimeMs); // Mais recente primeiro
  
  if (certFiles.length > 0) {
    const latestCert = certFiles[0];
    const certName = latestCert.name.replace('.pem', '');
    const keyPath = path.join(certsDir, `${certName}-key.pem`);
    const certPath = latestCert.path;
    
    if (fs.existsSync(keyPath) && fs.existsSync(certPath)) {
      httpsConfig = {
        key: fs.readFileSync(keyPath),
        cert: fs.readFileSync(certPath),
      };
      console.log('🔒 HTTPS habilitado - Certificados encontrados:', certName);
    }
  }
}

if (!httpsConfig) {
  console.log('⚠️  HTTPS não configurado - Execute o script setup-https.ps1 para gerar certificados');
}

export default defineConfig({
  base: '/',
  publicDir: 'public',
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@assets': path.resolve(__dirname, './src/assets'),
    },
  },
  server: {
    port: 3000,
    host: true, // Permite acesso de qualquer IP na mesma rede local
    // Permitir localhost e IPs da rede local
    allowedHosts: ['localhost', '127.0.0.1', '10.0.0.104'],
    // HTTPS configurado automaticamente se os certificados existirem
    https: httpsConfig,
    proxy: {
      '/api': {
        target: httpsConfig ? 'https://localhost:3001' : 'http://localhost:3001',
        changeOrigin: true,
        secure: false, // Aceita certificados auto-assinados
        ws: true,
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.log('❌ Proxy error:', err.message);
            if (err.code === 'ECONNREFUSED') {
              console.log('⚠️  Backend não está rodando na porta 3001. Certifique-se de executar: npm run dev no diretório backend');
            }
          });
        },
      },
      '/uploads': {
        target: httpsConfig ? 'https://localhost:3001' : 'http://localhost:3001',
        changeOrigin: true,
        secure: false, // Aceita certificados auto-assinados
      }
    }
  },
  build: {
    assetsDir: 'assets',
    cssCodeSplit: true,
    sourcemap: false,
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          // Manter fontes e imagens com nome limpo para cache
          if (assetInfo.name.match(/\.(woff|woff2|eot|ttf|otf)$/)) {
            return 'assets/fonts/[name]-[hash][extname]';
          }
          if (assetInfo.name.match(/\.(png|jpe?g|svg|gif|webp|ico)$/)) {
            return 'assets/images/[name]-[hash][extname]';
          }
          return 'assets/[name]-[hash][extname]';
        },
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        manualChunks: {
          // Separar vendor chunks para melhor cache
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['lucide-react', '@mui/material', '@emotion/react', '@emotion/styled'],
      },
    },
    },
    chunkSizeWarningLimit: 1000,
  },
});

