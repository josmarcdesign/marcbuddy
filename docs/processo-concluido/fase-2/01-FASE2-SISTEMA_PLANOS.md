# Fase 2: Sistema de Planos e Pagamento Inicial

> **Status**: 📋 Pendente  
> **Fase**: 2 - Sistema de Planos e Pagamento  
> **Ordem**: 01

## 📋 Objetivos da Fase 2

1. Implementar página de planos estática
2. Criar endpoints para criação e gerenciamento de assinaturas
3. Implementar integração simples com Pix para pagamento manual (QR code e confirmação)
4. Desenvolver dashboard básico que mostra plano ativo, data de renovação e license key

## 🎯 Checklist da Fase 2

- [ ] Criar página de planos estática no frontend
- [ ] Implementar endpoints de assinaturas no backend
- [ ] Criar sistema de geração de license keys
- [ ] Implementar integração com Pix (QR code)
- [ ] Adicionar confirmação manual de pagamento
- [ ] Atualizar dashboard com informações de plano
- [ ] Testar fluxo completo de assinatura

## 📚 Estrutura de Arquivos a Criar

### Backend
```
backend/src/
├── controllers/
│   └── subscription.controller.js    # Lógica de assinaturas
├── routes/
│   └── subscription.routes.js        # Rotas de assinaturas
├── utils/
│   └── licenseKey.js                 # Geração de license keys
└── services/
    └── pix.service.js                # Serviço de Pix (opcional)
```

### Frontend
```
frontend/src/
├── pages/
│   ├── Plans.jsx                     # Página de planos
│   └── Payment.jsx                   # Página de pagamento
├── components/
│   ├── PlanCard.jsx                  # Card de plano
│   ├── QRCode.jsx                    # Componente QR Code
│   └── SubscriptionInfo.jsx          # Info de assinatura no dashboard
└── services/
    └── subscription.service.js       # API de assinaturas
```

## 🔄 Fluxo Completo

1. **Usuário acessa página de planos** → Vê opções disponíveis
2. **Escolhe um plano** → Clica em "Escolher Plano"
3. **Cria assinatura** → Backend gera license key e define status 'pending'
4. **Gera QR Code Pix** → Exibe QR code para pagamento
5. **Admin confirma pagamento** → Status muda para 'active'
6. **Dashboard atualizado** → Mostra plano ativo e license key

## 📝 Planos Definidos

### Free (Gratuito)
- **Preço**: R$ 0,00/mês
- **Recursos**: Acesso básico às ferramentas
- **Limitações**: Uso limitado
- **Suporte**: Comunidade

### Basic
- **Preço**: R$ 29,90/mês
- **Recursos**: Acesso completo às ferramentas básicas
- **Limitações**: Sem limitações de uso básico
- **Suporte**: Email

### Premium
- **Preço**: R$ 79,90/mês
- **Recursos**: Todas as ferramentas + recursos avançados
- **Limitações**: Sem limitações
- **Suporte**: Prioritário + API access

### Enterprise
- **Preço**: R$ 199,90/mês
- **Recursos**: Tudo do Premium + customizações
- **Limitações**: Sem limitações
- **Suporte**: Dedicado + SLA garantido

## 🗄️ Estrutura do Banco de Dados

A tabela `subscriptions` já existe (criada na Fase 1):

```sql
subscriptions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  plan_type VARCHAR(50) CHECK (plan_type IN ('free', 'basic', 'premium', 'enterprise')),
  status VARCHAR(50) CHECK (status IN ('pending', 'active', 'cancelled', 'expired')),
  license_key VARCHAR(255) UNIQUE,
  start_date TIMESTAMP,
  end_date TIMESTAMP,
  renewal_date TIMESTAMP,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)
```

## 📦 Dependências Adicionais Necessárias

### Backend
```bash
npm install qrcode uuid
```

### Frontend
```bash
# Não são necessárias dependências adicionais - QR Code vem como imagem do backend
```

## 🚀 Ordem de Implementação

1. **02-FASE2-PAGINA_PLANOS.md** - Criar página de planos estática
2. **03-FASE2-ENDPOINTS_ASSINATURAS.md** - Implementar endpoints backend
3. **04-FASE2-INTEGRACAO_PIX.md** - Integração com Pix
4. **05-FASE2-DASHBOARD_PLANO.md** - Atualizar dashboard
5. **06-FASE2-TESTES_VALIDACAO.md** - Testes e validação

## 📝 Notas Importantes

- **License Key**: Formato `MB-XXXX-XXXX-XXXX` (16 caracteres alfanuméricos)
- **Status inicial**: Sempre 'pending' ao criar assinatura
- **Ativação**: Apenas após confirmação de pagamento
- **Validação**: Um usuário pode ter apenas uma assinatura ativa por vez

## ⚠️ Considerações de Segurança

- Validar planos permitidos no backend
- Gerar license keys únicas e seguras
- Proteger rotas de assinatura com autenticação
- Validar permissões para cancelar/atualizar assinaturas

---

**Próximo**: Seguir para `02-FASE2-PAGINA_PLANOS.md` para criar a página de planos estática
