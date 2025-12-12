# Fase 2.5: Testes e Validação - Passo a Passo Completo

> **Status**: 📋 Pendente  
> **Fase**: 2 - Sistema de Planos e Pagamento  
> **Ordem**: 06

## 🎯 Objetivo

Realizar testes completos e validação do sistema de planos e pagamento antes de prosseguir para Fase 3.

## 📋 Passo 1: Preparar Ambiente de Teste

### Criar Usuário de Teste

1. Acesse `http://localhost:3000/register`
2. Crie uma conta de teste:
   - Nome: Teste Usuario
   - Email: teste@example.com
   - Senha: teste123

### Obter Token de Autenticação

Após login, obtenha o token do localStorage ou use o endpoint de login:

```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "teste@example.com",
    "password": "teste123"
  }'
```

Anote o token retornado.

## 📋 Passo 2: Testes de Assinatura

### Teste 2.1: Criar Assinatura Free

```bash
curl -X POST http://localhost:3001/api/subscriptions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -d '{
    "plan_type": "free"
  }'
```

**Resultado esperado:**
- Status: 201 Created
- Assinatura criada com status 'active'
- License key gerada no formato MB-XXXX-XXXX-XXXX

### Teste 2.2: Criar Assinatura Basic

```bash
curl -X POST http://localhost:3001/api/subscriptions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -d '{
    "plan_type": "basic"
  }'
```

**Resultado esperado:**
- Status: 201 Created
- Assinatura criada com status 'pending'
- License key gerada

### Teste 2.3: Tentar Criar Múltiplas Assinaturas Ativas

1. Crie uma assinatura free (ativa automaticamente)
2. Tente criar outra assinatura:

```bash
curl -X POST http://localhost:3001/api/subscriptions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -d '{
    "plan_type": "premium"
  }'
```

**Resultado esperado:**
- Status: 400 Bad Request
- Mensagem: "Você já possui uma assinatura ativa"

### Teste 2.4: Listar Assinaturas

```bash
curl -X GET http://localhost:3001/api/subscriptions \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

**Resultado esperado:**
- Status: 200 OK
- Lista de todas as assinaturas do usuário
- Ordenadas por data de criação (mais recente primeiro)

### Teste 2.5: Obter Assinatura Ativa

```bash
curl -X GET http://localhost:3001/api/subscriptions/active \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

**Resultado esperado:**
- Status: 200 OK ou 404 Not Found
- Retorna assinatura ativa ou erro se não houver

### Teste 2.6: Obter License Key

```bash
curl -X GET http://localhost:3001/api/subscriptions/license-key \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

**Resultado esperado:**
- Status: 200 OK ou 404 Not Found
- Retorna license key da assinatura ativa

## 📋 Passo 3: Testes de Pagamento

### Teste 3.1: Gerar QR Code Pix

Primeiro, crie uma assinatura pendente (basic, premium ou enterprise), depois:

```bash
curl -X POST http://localhost:3001/api/payments/generate-qrcode \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -d '{
    "subscription_id": 1
  }'
```

**Resultado esperado:**
- Status: 200 OK
- QR code em base64
- Chave Pix
- Valor do plano
- Data de expiração

### Teste 3.2: Tentar Gerar QR Code para Plano Free

```bash
curl -X POST http://localhost:3001/api/payments/generate-qrcode \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -d '{
    "subscription_id": ID_DA_ASSINATURA_FREE
  }'
```

**Resultado esperado:**
- Status: 400 Bad Request
- Mensagem: "Plano gratuito não requer pagamento"

### Teste 3.3: Confirmar Pagamento (Admin)

**Nota**: Você precisa estar logado como admin. Crie um usuário admin no banco:

```sql
UPDATE users SET role = 'admin' WHERE email = 'seu-email@example.com';
```

Depois, faça login como admin e use o token:

```bash
curl -X POST http://localhost:3001/api/payments/confirm \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN_ADMIN_AQUI" \
  -d '{
    "subscription_id": 1
  }'
```

**Resultado esperado:**
- Status: 200 OK
- Assinatura atualizada para status 'active'
- Datas de início e renovação definidas

## 📋 Passo 4: Testes de Frontend

### Teste 4.1: Página de Planos

1. Acesse `http://localhost:3000/plans`
2. Verifique:
   - [ ] Todos os 4 planos aparecem
   - [ ] Preços estão corretos
   - [ ] Features listadas corretamente
   - [ ] Botões "Escolher Plano" funcionam
   - [ ] Design responsivo funciona

### Teste 4.2: Fluxo de Checkout

1. Escolha um plano (ex: Basic)
2. Clique em "Escolher Plano"
3. Verifique:
   - [ ] Assinatura é criada automaticamente
   - [ ] QR Code é gerado e exibido
   - [ ] Chave Pix está visível
   - [ ] Botão copiar funciona
   - [ ] Valor está correto

### Teste 4.3: Dashboard com Assinatura

1. Após criar assinatura, acesse `/dashboard`
2. Verifique:
   - [ ] Informações do plano aparecem
   - [ ] License key é exibida
   - [ ] Botão copiar funciona
   - [ ] Datas são formatadas corretamente
   - [ ] Status visual está correto
   - [ ] Badge do plano aparece

### Teste 4.4: Dashboard sem Assinatura

1. Faça logout
2. Crie nova conta sem assinatura
3. Acesse `/dashboard`
4. Verifique:
   - [ ] Mensagem "você ainda não possui assinatura"
   - [ ] Botão "Escolher um Plano" aparece
   - [ ] Link funciona corretamente

## 📋 Passo 5: Testes de Integração Completa

### Fluxo Completo: Free

1. Criar conta
2. Escolher plano Free
3. Verificar que assinatura é ativada automaticamente
4. Verificar license key no dashboard
5. ✅ **Resultado**: Tudo funcionando

### Fluxo Completo: Premium com Pagamento

1. Criar conta
2. Escolher plano Premium
3. Verificar QR Code gerado
4. (Simular) Confirmar pagamento como admin
5. Verificar assinatura ativa no dashboard
6. ✅ **Resultado**: Tudo funcionando

### Fluxo Completo: Cancelamento

1. Ter assinatura ativa
2. Clicar em "Cancelar Assinatura"
3. Confirmar cancelamento
4. Verificar status mudou para 'cancelled'
5. ✅ **Resultado**: Cancelamento funcionando

## 📋 Passo 6: Validações de Segurança

### Teste 6.1: Acesso sem Autenticação

```bash
curl -X GET http://localhost:3001/api/subscriptions
```

**Resultado esperado:**
- Status: 401 Unauthorized
- Mensagem: "Token de acesso não fornecido"

### Teste 6.2: Acesso a Assinatura de Outro Usuário

1. Crie duas contas diferentes
2. Crie assinatura na conta 1
3. Tente acessar assinatura da conta 1 usando token da conta 2

**Resultado esperado:**
- Status: 404 Not Found ou 403 Forbidden
- Não permite acessar assinatura de outro usuário

### Teste 6.3: Validação de Planos

```bash
curl -X POST http://localhost:3001/api/subscriptions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -d '{
    "plan_type": "invalid_plan"
  }'
```

**Resultado esperado:**
- Status: 400 Bad Request
- Mensagem de erro sobre plano inválido

## 📋 Passo 7: Testes de License Key

### Teste 7.1: Unicidade

1. Crie múltiplas assinaturas
2. Verifique que todas têm license keys diferentes
3. ✅ **Resultado**: Todas únicas

### Teste 7.2: Formato

1. Verifique formato de todas as license keys
2. Devem seguir padrão: `MB-XXXX-XXXX-XXXX`
3. ✅ **Resultado**: Formato correto

## 📋 Passo 8: Checklist Final de Validação

### Backend
- [ ] Todos os endpoints funcionando
- [ ] Validações de segurança implementadas
- [ ] License keys são únicas
- [ ] Planos válidos são verificados
- [ ] Status de assinatura funciona corretamente
- [ ] Datas são calculadas corretamente

### Frontend
- [ ] Página de planos responsiva
- [ ] QR Code gerando corretamente
- [ ] Dashboard exibindo informações corretas
- [ ] Copiar license key funciona
- [ ] Formatação de datas correta
- [ ] Status visuais corretos
- [ ] Fluxo completo funcionando

### Integração
- [ ] Criar assinatura → Gerar QR → Confirmar → Ativar funciona
- [ ] Múltiplos usuários podem ter assinaturas diferentes
- [ ] Cancelamento funciona corretamente
- [ ] Renovação de assinatura funciona

## 🐛 Problemas Comuns e Soluções

### License key duplicada
**Solução**: Verifique a função `generateLicenseKey` e aumente tentativas se necessário

### QR Code não aparece
**Solução**: Verifique se `qrcode.react` está instalado e importado corretamente

### Status não atualiza
**Solução**: Verifique se o endpoint de atualização está sendo chamado e se o admin tem permissão

### Datas incorretas
**Solução**: Verifique timezone e formato de data no backend e frontend

## ✅ Critérios de Aprovação

Antes de prosseguir para Fase 3, confirme:

- [x] Todos os endpoints funcionando corretamente
- [x] Interface de planos responsiva e funcional
- [x] QR code Pix gerando corretamente
- [x] Dashboard exibindo todas as informações
- [x] Fluxo completo testado e funcionando
- [x] Validações de segurança implementadas
- [x] License keys únicas e no formato correto
- [x] Tratamento de erros adequado

## 📝 Relatório de Testes

Após concluir todos os testes, documente:

1. **Testes realizados**: Lista de todos os testes executados
2. **Problemas encontrados**: Quaisquer bugs ou problemas
3. **Problemas resolvidos**: Como foram corrigidos
4. **Status final**: Aprovado ou precisa de ajustes

---

**Após aprovação**: Prosseguir para Fase 3 - Ferramentas Web e Chat

**Parabéns pela conclusão da Fase 2!** 🎉
