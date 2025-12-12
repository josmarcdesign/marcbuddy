import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import subscriptionRoutes from './routes/subscription.routes.js';
import paymentRoutes from './routes/payment.routes.js';
import adminRoutes from './routes/admin.routes.js';
import couponRoutes from './routes/coupon.routes.js';
import plansRoutes from './routes/plans.routes.js';
import supportBotRoutes from './routes/supportbot.routes.js';
import emailRoutes from './routes/email.routes.js';
import stripeRoutes from './routes/stripe.routes.js';

// Carregar variáveis de ambiente
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Verificar se os certificados SSL existem
const certsDir = path.resolve(__dirname, '../../certs');

// Detectar automaticamente o certificado mais recente
let httpsOptions = null;
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
      httpsOptions = {
        key: fs.readFileSync(keyPath),
        cert: fs.readFileSync(certPath),
      };
      console.log('🔒 HTTPS habilitado - Certificados encontrados:', certName);
    }
  }
}

if (!httpsOptions) {
  console.log('⚠️  HTTPS não configurado - Execute o script setup-https.ps1 para gerar certificados');
}

// Configurar CORS para aceitar localhost, IPs locais e endereço específico para testes
const allowedOrigins = [
  'http://localhost:3000',
  'https://localhost:3000',
  'https://10.0.0.104:3000',
  process.env.FRONTEND_URL
].filter(Boolean);

// Middlewares
app.use(cors({
  origin: function (origin, callback) {
    // Permitir requisições sem origin (mobile apps, Postman, etc)
    if (!origin) return callback(null, true);
    
    // Permitir se estiver na lista de origens permitidas ou for localhost/IP local
    if (allowedOrigins.includes(origin) || 
        origin.includes('localhost') || 
        origin.includes('127.0.0.1') ||
        /^https?:\/\/10\./.test(origin) || // IPs privados 10.x.x.x (HTTP ou HTTPS)
        /^https?:\/\/192\.168\./.test(origin) || // IPs privados 192.168.x.x (HTTP ou HTTPS)
        /^https?:\/\/172\.(1[6-9]|2[0-9]|3[0-1])\./.test(origin)) { // IPs privados 172.16-31.x.x (HTTP ou HTTPS)
      callback(null, true);
    } else {
      callback(new Error('Não permitido pelo CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
// IMPORTANTE: Webhook do Stripe precisa do body raw, então configuramos antes do express.json()
// Mas como o webhook tem sua própria rota com express.raw(), isso está OK
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir arquivos estáticos de uploads
app.use('/uploads', express.static('uploads'));

// Rota de health check (DEVE vir ANTES de todas as outras rotas /api para não ser interceptada)
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'MarcBuddy API está funcionando!',
    timestamp: new Date().toISOString()
  });
});

// Rotas
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/plans', plansRoutes);
app.use('/api/admin/supportbot', supportBotRoutes);
app.use('/api', emailRoutes);
app.use('/api/stripe', stripeRoutes);

// Middleware de tratamento de erros
app.use((err, req, res, next) => {
  console.error('Erro:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Erro interno do servidor',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Iniciar servidor
if (httpsOptions) {
  // Servidor HTTPS
  https.createServer(httpsOptions, app).listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Servidor HTTPS rodando na porta ${PORT}`);
    console.log(`📡 Ambiente: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🌐 Acessível em: https://0.0.0.0:${PORT}`);
    console.log(`🔗 CORS configurado para aceitar: localhost e IPs locais (mesma rede)`);
    if (allowedOrigins.length > 0) {
      console.log(`   Origens permitidas: ${allowedOrigins.join(', ')}`);
    }
  });
} else {
  // Servidor HTTP (fallback)
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Servidor HTTP rodando na porta ${PORT}`);
  console.log(`📡 Ambiente: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 Acessível em: http://0.0.0.0:${PORT}`);
  console.log(`🔗 CORS configurado para aceitar: localhost e IPs locais (mesma rede)`);
  if (allowedOrigins.length > 0) {
    console.log(`   Origens permitidas: ${allowedOrigins.join(', ')}`);
  }
});
}

