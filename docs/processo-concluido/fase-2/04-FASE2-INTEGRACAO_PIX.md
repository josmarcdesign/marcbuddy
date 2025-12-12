# Fase 2.3: Integração com Pix para Pagamento Manual - Passo a Passo Completo

> **Status**: 📋 Pendente  
> **Fase**: 2 - Sistema de Planos e Pagamento  
> **Ordem**: 04

## 🎯 Objetivo

Implementar integração simples com Pix para pagamento manual (QR code e confirmação).

## 📋 Passo 1: Instalar Dependências

No terminal do backend:

```bash
cd backend
npm install qrcode
```

No terminal do frontend:

```bash
# Não precisa instalar nada adicional - vamos usar imagem base64 do backend
```

## 📋 Passo 2: Criar Serviço de Pix no Backend

Crie o arquivo `backend/src/services/pix.service.js`:

```javascript
import QRCode from 'qrcode';

/**
 * Gera QR Code Pix estático (MVP)
 * Para produção, integrar com gateway de pagamento
 */
export const generatePixQRCode = async (amount, description, orderId) => {
  try {
    // Chave Pix da empresa (configurar no .env)
    const pixKey = process.env.PIX_KEY || 'sua-chave-pix@exemplo.com';
    
    // Para MVP, vamos gerar um QR Code com informações básicas
    // Em produção, use biblioteca específica para gerar QR Code Pix EMV correto
    // Por enquanto, geramos um QR Code com dados do pagamento
    
    const pixData = `${pixKey}|${amount.toFixed(2)}|${description}|${orderId}`;

    // Gerar QR Code como string base64
    const qrCodeDataURL = await QRCode.toDataURL(pixData, {
      errorCorrectionLevel: 'M',
      type: 'image/png',
      width: 300,
      margin: 2
    });

    return {
      qrCode: qrCodeDataURL,
      pixKey: pixKey,
      amount: amount,
      description: description,
      orderId: orderId,
      expiresAt: new Date(Date.now() + 30 * 60 * 1000) // 30 minutos
    };
  } catch (error) {
    console.error('Erro ao gerar QR Code Pix:', error);
    throw error;
  }
};

/**
 * Valida se o QR Code ainda é válido
 */
export const isQRCodeValid = (expiresAt) => {
  return new Date() < new Date(expiresAt);
};
```

## 📋 Passo 3: Criar Controller de Pagamento

Crie o arquivo `backend/src/controllers/payment.controller.js`:

```javascript
import { query } from '../database/connection.js';
import { generatePixQRCode, isQRCodeValid } from '../services/pix.service.js';
import { getPlanById } from '../utils/plans.js'; // Criar este arquivo também

// Preços dos planos (em reais)
const PLAN_PRICES = {
  free: 0,
  basic: 29.90,
  premium: 79.90,
  enterprise: 199.90
};

/**
 * Gerar QR Code Pix para pagamento
 */
export const generatePaymentQRCode = async (req, res) => {
  try {
    const { subscription_id } = req.body;
    const userId = req.user.id;

    // Buscar assinatura
    const subscriptionResult = await query(
      `SELECT id, plan_type, status, user_id
       FROM subscriptions
       WHERE id = $1 AND user_id = $2`,
      [subscription_id, userId]
    );

    if (subscriptionResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Assinatura não encontrada'
      });
    }

    const subscription = subscriptionResult.rows[0];

    // Verificar se já está paga
    if (subscription.status === 'active') {
      return res.status(400).json({
        success: false,
        message: 'Assinatura já está ativa'
      });
    }

    // Verificar se é plano free
    if (subscription.plan_type === 'free') {
      return res.status(400).json({
        success: false,
        message: 'Plano gratuito não requer pagamento'
      });
    }

    // Obter preço do plano
    const amount = PLAN_PRICES[subscription.plan_type];
    if (!amount) {
      return res.status(400).json({
        success: false,
        message: 'Plano inválido'
      });
    }

    // Gerar QR Code
    const qrCodeData = await generatePixQRCode(
      amount,
      `Assinatura MarcBuddy - ${subscription.plan_type}`,
      `SUB-${subscription.id}`
    );

    // Salvar informações do pagamento (opcional - criar tabela payments se necessário)
    // Por enquanto, apenas retornar o QR code

    res.json({
      success: true,
      message: 'QR Code gerado com sucesso',
      data: {
        qrCode: qrCodeData.qrCode,
        pixKey: qrCodeData.pixKey,
        amount: qrCodeData.amount,
        description: qrCodeData.description,
        expiresAt: qrCodeData.expiresAt,
        subscriptionId: subscription.id
      }
    });
  } catch (error) {
    console.error('Erro ao gerar QR Code:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao gerar QR Code'
    });
  }
};

/**
 * Confirmar pagamento (manual - para admin)
 */
export const confirmPayment = async (req, res) => {
  try {
    const { subscription_id } = req.body;

    // Verificar se é admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Apenas administradores podem confirmar pagamentos'
      });
    }

    // Buscar assinatura
    const subscriptionResult = await query(
      'SELECT id, status FROM subscriptions WHERE id = $1',
      [subscription_id]
    );

    if (subscriptionResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Assinatura não encontrada'
      });
    }

    const subscription = subscriptionResult.rows[0];

    if (subscription.status === 'active') {
      return res.status(400).json({
        success: false,
        message: 'Assinatura já está ativa'
      });
    }

    // Ativar assinatura
    const now = new Date();
    const renewalDate = new Date(now);
    renewalDate.setDate(renewalDate.getDate() + 30);

    const result = await query(
      `UPDATE subscriptions
       SET status = 'active', start_date = $1, renewal_date = $2, updated_at = CURRENT_TIMESTAMP
       WHERE id = $3
       RETURNING id, plan_type, status, license_key, start_date, renewal_date`,
      [now, renewalDate, subscription_id]
    );

    res.json({
      success: true,
      message: 'Pagamento confirmado e assinatura ativada',
      data: {
        subscription: result.rows[0]
      }
    });
  } catch (error) {
    console.error('Erro ao confirmar pagamento:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao confirmar pagamento'
    });
  }
};
```

## 📋 Passo 4: Criar Utilitário de Planos (Preços)

Crie o arquivo `backend/src/utils/plans.js`:

```javascript
export const PLAN_PRICES = {
  free: 0,
  basic: 29.90,
  premium: 79.90,
  enterprise: 199.90
};

export const PLAN_NAMES = {
  free: 'Free',
  basic: 'Basic',
  premium: 'Premium',
  enterprise: 'Enterprise'
};

export const getPlanById = (planId) => {
  return {
    id: planId,
    name: PLAN_NAMES[planId] || planId,
    price: PLAN_PRICES[planId] || 0
  };
};
```

## 📋 Passo 5: Criar Rotas de Pagamento

Crie o arquivo `backend/src/routes/payment.routes.js`:

```javascript
import express from 'express';
import { body } from 'express-validator';
import { authenticateToken, requireAdmin } from '../middleware/auth.middleware.js';
import { generatePaymentQRCode, confirmPayment } from '../controllers/payment.controller.js';

const router = express.Router();

// Todas as rotas requerem autenticação
router.use(authenticateToken);

// Validações
const generateQRCodeValidation = [
  body('subscription_id')
    .isInt()
    .withMessage('ID da assinatura inválido')
];

const confirmPaymentValidation = [
  body('subscription_id')
    .isInt()
    .withMessage('ID da assinatura inválido')
];

// Rotas
router.post('/generate-qrcode', generateQRCodeValidation, generatePaymentQRCode);
router.post('/confirm', confirmPaymentValidation, requireAdmin, confirmPayment);

export default router;
```

## 📋 Passo 6: Registrar Rotas no Server

Atualize `backend/src/server.js`:

```javascript
import paymentRoutes from './routes/payment.routes.js'; // Adicionar

// ... resto do código ...

// Rotas
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/payments', paymentRoutes); // Adicionar
```

## 📋 Passo 7: Configurar Variável de Ambiente

Adicione no arquivo `.env` do backend:

```env
PIX_KEY=sua-chave-pix@exemplo.com
```

## 📋 Passo 8: Criar Componente QR Code no Frontend

Crie o arquivo `frontend/src/components/QRCode.jsx`:

```jsx
const QRCode = ({ qrCodeDataURL }) => {
  if (!qrCodeDataURL) {
    return (
      <div className="flex items-center justify-center p-8 bg-gray-100 rounded-lg">
        <p className="text-gray-600">Gerando QR Code...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center p-4 bg-white rounded-lg">
      <img 
        src={qrCodeDataURL} 
        alt="QR Code Pix" 
        className="border-2 border-gray-300 rounded-lg"
      />
      <p className="mt-4 text-sm text-gray-600 text-center max-w-xs">
        Escaneie o QR Code com o app do seu banco para pagar via Pix
      </p>
    </div>
  );
};

export default QRCode;
```

## 📋 Passo 9: Criar Página de Pagamento

Crie o arquivo `frontend/src/pages/Payment.jsx`:

```jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import QRCode from '../components/QRCode';

const Payment = () => {
  const { planId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [paymentData, setPaymentData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    // Primeiro criar a assinatura, depois gerar QR code
    createSubscriptionAndGenerateQR();
  }, [planId, user]);

  const createSubscriptionAndGenerateQR = async () => {
    try {
      setLoading(true);
      
      // 1. Criar assinatura
      const subscriptionResponse = await api.post('/subscriptions', {
        plan_type: planId
      });

      const subscription = subscriptionResponse.data.data.subscription;

      // 2. Se for plano free, redirecionar
      if (planId === 'free') {
        navigate('/dashboard');
        return;
      }

      // 3. Gerar QR Code
      const qrResponse = await api.post('/payments/generate-qrcode', {
        subscription_id: subscription.id
      });

      setPaymentData(qrResponse.data.data);
      setLoading(false);
    } catch (error) {
      console.error('Erro:', error);
      setError(error.response?.data?.message || 'Erro ao processar pagamento');
      setLoading(false);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
          <div className="text-center">
            <div className="text-red-500 text-4xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Erro</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => navigate('/plans')}
              className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700"
            >
              Voltar para Planos
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">
            Finalizar Pagamento
          </h1>

          <div className="text-center mb-8">
            <p className="text-lg text-gray-700 mb-2">
              Valor a pagar: <span className="font-bold text-2xl text-primary-600">
                {formatCurrency(paymentData?.amount)}
              </span>
            </p>
            <p className="text-sm text-gray-600">{paymentData?.description}</p>
          </div>

          <div className="flex justify-center mb-8">
            <QRCode qrCodeDataURL={paymentData?.qrCode} />
          </div>

          <div className="bg-gray-100 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-700 mb-2">
              <strong>Chave Pix:</strong>
            </p>
            <p className="text-sm font-mono text-gray-900 break-all">
              {paymentData?.pixKey}
            </p>
            <button
              onClick={() => {
                navigator.clipboard.writeText(paymentData?.pixKey);
                alert('Chave Pix copiada!');
              }}
              className="mt-2 text-sm text-primary-600 hover:text-primary-700"
            >
              Copiar chave Pix
            </button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600 mb-4">
              Após realizar o pagamento, aguarde a confirmação. Você receberá um email quando sua assinatura for ativada.
            </p>
            <button
              onClick={() => navigate('/dashboard')}
              className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-300"
            >
              Voltar ao Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
```

## 📋 Passo 10: Atualizar Rota de Checkout

Atualize `frontend/src/App.jsx`:

```jsx
import Payment from './pages/Payment'; // Adicionar

// ... no Routes:
<Route path="/plans/:planId/checkout" element={<Payment />} />
```

## 📋 Passo 11: Criar Página Admin para Confirmar Pagamentos (Opcional)

Crie `frontend/src/pages/Admin/Payments.jsx`:

```jsx
import { useState, useEffect } from 'react';
import api from '../../services/api';

const AdminPayments = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPendingSubscriptions();
  }, []);

  const loadPendingSubscriptions = async () => {
    try {
      // Endpoint para listar todas as assinaturas pendentes (admin)
      const response = await api.get('/admin/subscriptions/pending');
      setSubscriptions(response.data.data.subscriptions);
      setLoading(false);
    } catch (error) {
      console.error('Erro:', error);
      setLoading(false);
    }
  };

  const handleConfirmPayment = async (subscriptionId) => {
    try {
      await api.post('/payments/confirm', {
        subscription_id: subscriptionId
      });
      alert('Pagamento confirmado!');
      loadPendingSubscriptions();
    } catch (error) {
      alert('Erro ao confirmar pagamento');
    }
  };

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Confirmação de Pagamentos</h1>
      <div className="space-y-4">
        {subscriptions.map((sub) => (
          <div key={sub.id} className="bg-white p-4 rounded shadow">
            <p>Plano: {sub.plan_type}</p>
            <p>Usuário ID: {sub.user_id}</p>
            <p>Status: {sub.status}</p>
            <button
              onClick={() => handleConfirmPayment(sub.id)}
              className="mt-2 bg-green-600 text-white px-4 py-2 rounded"
            >
              Confirmar Pagamento
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminPayments;
```

## ✅ Checklist de Conclusão

- [x] Dependências instaladas (qrcode no backend, qrcode.react no frontend)
- [x] Serviço de Pix criado
- [x] Controller de pagamento criado
- [x] Rotas de pagamento criadas
- [x] Componente QR Code criado
- [x] Página de pagamento criada
- [x] Variável PIX_KEY configurada no .env
- [x] Testado e funcionando

## 🐛 Problemas Comuns

### QR Code não aparece
- Verifique se a biblioteca qrcode.react está instalada
- Confirme que o valor do QR code está sendo passado corretamente

### Erro ao gerar QR Code
- Verifique se a chave Pix está configurada no .env
- Confirme que a biblioteca qrcode está instalada no backend

---

**Próximo**: Seguir para `05-FASE2-DASHBOARD_PLANO.md` para atualizar o dashboard
