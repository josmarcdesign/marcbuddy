# 📧 Configuração de Faturas e Emails no Stripe

## Status: Configurado ✅

### O que foi configurado:

1. **Invoices Automáticos:**
   - ✅ `invoice_creation.enabled = true` no Checkout Session
   - ✅ Invoices são criados automaticamente para assinaturas
   - ✅ Invoices aparecem nas transações do Stripe Dashboard

2. **Cupom de 99% Criado:**
   - ✅ Código: `DESC99`
   - ✅ Desconto: 99%
   - ✅ Válido por 1 ano
   - ✅ Limite: 100 usos

---

## 📋 Configuração de Emails no Stripe Dashboard

Para receber emails do Stripe quando usuários assinarem, você precisa configurar no Stripe Dashboard:

### 1. Acesse Configurações de Email:
- URL: https://dashboard.stripe.com/settings/emails
- Ou: Dashboard → Settings → Emails

### 2. Habilitar Emails de Notificação:

**Para Receber Emails:**
- ✅ Invoice payment succeeded (Pagamento de fatura bem-sucedido)
- ✅ Invoice payment failed (Falha no pagamento)
- ✅ Customer subscription created (Assinatura criada)
- ✅ Customer subscription updated (Assinatura atualizada)
- ✅ Customer subscription canceled (Assinatura cancelada)

**Para Clientes Receberem Emails:**
- ✅ Invoice created (Fatura criada)
- ✅ Invoice payment succeeded (Pagamento confirmado)
- ✅ Invoice payment failed (Falha no pagamento)
- ✅ Subscription created (Assinatura criada)
- ✅ Subscription updated (Assinatura atualizada)
- ✅ Subscription canceled (Assinatura cancelada)

### 3. Configurar Email de Remetente:
- Settings → Emails → From email address
- Use um email verificado no seu domínio

---

## 🧾 Como Funcionam as Faturas

### Assinaturas com Cartão:
1. Checkout Session criada com `invoice_creation.enabled = true`
2. Usuário completa pagamento
3. Stripe cria invoice automaticamente
4. Invoice aparece em: Dashboard → Payments → Invoices
5. Email enviado automaticamente (se configurado)

### Assinaturas com PIX:
1. Checkout Session criada (modo payment)
2. Usuário paga via PIX
3. Invoice criada após confirmação do pagamento
4. Email enviado (se configurado)

### Renovações:
1. Stripe cria invoice automaticamente na data de renovação
2. Cobra automaticamente do cartão salvo
3. Invoice aparece nas transações
4. Email enviado (se configurado)

---

## 🎫 Cupom de 99% Desconto

**Código:** `DESC99`

**Detalhes:**
- Desconto: 99%
- Tipo: Percentual
- Válido até: 1 ano a partir de agora
- Limite de usos: 100
- Usos por usuário: 1
- Aplicável a: Todos os planos
- Status: Ativo

**Como usar:**
1. Acesse `/plans` e escolha um plano
2. Vá para checkout
3. Digite: `DESC99`
4. Clique em "Aplicar"
5. Desconto de 99% será aplicado

---

## 🔍 Verificar Faturas no Stripe

### No Dashboard:
1. Acesse: https://dashboard.stripe.com/payments
2. Vá em "Invoices" (Faturas)
3. Todas as faturas aparecerão lá:
   - Faturas de assinatura inicial
   - Faturas de renovação
   - Faturas de PIX (após pagamento)

### Informações Exibidas:
- ID da fatura
- Cliente (email)
- Valor
- Status (paid, open, void)
- Data de criação
- Data de pagamento
- Método de pagamento

---

## 📧 Configuração de Email (Passo a Passo)

### 1. Acesse o Stripe Dashboard:
https://dashboard.stripe.com/settings/emails

### 2. Em "Email notifications":
- Marque as opções que você quer receber
- Configure o email de destino

### 3. Em "Customer emails":
- Marque as opções que clientes devem receber
- Personalize os templates (opcional)

### 4. Em "From email address":
- Configure o email remetente
- Deve ser verificado no seu domínio

---

## ✅ Checklist de Configuração

- [x] Invoices automáticos habilitados no código
- [x] Cupom DESC99 criado (99% desconto)
- [ ] Emails habilitados no Stripe Dashboard (você precisa fazer)
- [ ] Email remetente configurado no Stripe
- [x] Webhook configurado para processar eventos
- [x] Eventos de invoice configurados no webhook

---

## 🧪 Testar

1. **Teste de Fatura:**
   - Crie uma assinatura com cartão
   - Verifique em: Dashboard → Payments → Invoices
   - Deve aparecer uma fatura criada

2. **Teste de Email:**
   - Após configurar emails no dashboard
   - Crie uma assinatura
   - Verifique se recebeu email de confirmação

3. **Teste de Cupom:**
   - Use cupom `DESC99` no checkout
   - Deve aplicar 99% de desconto
   - Valor final será 1% do original

---

**Status:** Invoices configurados ✅ | Cupom criado ✅ | Emails precisam ser configurados no Dashboard ⚠️
