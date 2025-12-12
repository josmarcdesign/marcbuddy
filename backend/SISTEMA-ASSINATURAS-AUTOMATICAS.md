# Sistema de Assinaturas Automáticas

## Visão Geral

O sistema agora cria automaticamente uma assinatura gratuita para todos os novos usuários que se registram na plataforma MarcBuddy.

## Funcionamento

### 1. Registro de Novo Usuário

Quando um usuário se registra através do endpoint `/api/auth/register`:

1. ✅ Cria a conta do usuário na tabela `marcbuddy.accounts`
2. ✅ Automaticamente cria uma assinatura gratuita na tabela `marcbuddy.account_subscriptions`
3. ✅ Gera uma license key única no formato `FREE-XXXXXXXX-XXXX`
4. ✅ Define o plano como `free` com status `active`

**Arquivo:** `backend/src/controllers/auth.controller.js` - função `register()`

```javascript
// Criar assinatura gratuita padrão para o novo usuário
const licenseKey = `FREE-${Math.random().toString(36).substring(2, 10).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

await query(
  `INSERT INTO marcbuddy.account_subscriptions 
   (user_id, plan_type, status, license_key, subscription_start_date, billing_cycle, email)
   VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP, $5, $6)`,
  [user.id, 'free', 'active', licenseKey, 'monthly', email]
);
```

### 2. Login de Usuários Existentes

Quando um usuário faz login através do endpoint `/api/auth/login`:

1. ✅ Verifica se o usuário tem uma assinatura ativa
2. ✅ Se não tiver, cria automaticamente uma assinatura gratuita
3. ✅ Permite que o login continue normalmente

**Arquivo:** `backend/src/controllers/auth.controller.js` - função `login()`

Isso garante que usuários antigos (criados antes desta implementação) também recebam uma assinatura gratuita no próximo login.

## Plano Gratuito (Free)

### Configuração do Plano

- **ID:** `free`
- **Nome:** MBuddy Free
- **Descrição:** Plano gratuito básico para começar
- **Preço Mensal:** R$ 0,00
- **Preço Anual:** R$ 0,00

### Recursos Incluídos

- ✅ Acesso básico à plataforma
- ✅ Até 3 projetos
- ✅ 1GB de armazenamento
- ✅ Suporte via email

### Limitações

- 1 usuário por conta
- Sem recursos premium
- Armazenamento limitado

## Estrutura de Dados

### Tabela: `marcbuddy.subscription_plans`

```sql
SELECT * FROM marcbuddy.subscription_plans WHERE id = 'free';
```

| Campo | Valor |
|-------|-------|
| id | free |
| plan_name | MBuddy Free |
| monthly_price | 0.00 |
| annual_price | 0.00 |
| max_users | 1 |
| max_projects | 3 |
| max_storage_gb | 1.00 |
| plan_status | active |
| sort_order | 0 |

### Tabela: `marcbuddy.account_subscriptions`

Exemplo de assinatura criada automaticamente:

```sql
{
  "id": 2,
  "user_id": 3,
  "plan_type": "free",
  "status": "active",
  "license_key": "FREE-42837C26-F5C5",
  "subscription_start_date": "2025-12-11 21:05:32",
  "billing_cycle": "monthly",
  "email": "usuario@exemplo.com"
}
```

## Benefícios

### Para Usuários

1. **Acesso Imediato**: Não precisam escolher um plano durante o registro
2. **Sem Barreiras**: Podem explorar a plataforma sem compromisso
3. **Upgrade Simples**: Podem fazer upgrade para planos pagos quando desejarem

### Para a Plataforma

1. **Conversão Maior**: Remove fricção no processo de registro
2. **Dados Consistentes**: Todos os usuários têm assinatura, simplificando queries
3. **Upsell Organizado**: Base de usuários free para campanhas de upgrade

## Fluxo de Upgrade

Quando um usuário free decide fazer upgrade:

1. Escolhe um plano pago (Basic, Premium ou Enterprise)
2. Realiza o pagamento
3. Sistema atualiza a assinatura existente para o novo plano
4. Status muda de `free` para o plano escolhido
5. Nova license key é gerada
6. Recursos adicionais são desbloqueados

## Tratamento de Erros

### Se a Criação da Assinatura Falhar

- ⚠️ O erro é logado no console do backend
- ✅ O registro/login do usuário **NÃO é bloqueado**
- ✅ O usuário consegue acessar a plataforma normalmente
- ⚠️ Um log de aviso é exibido para investigação

```javascript
try {
  // ... criar assinatura
} catch (subError) {
  console.error('⚠️ Erro ao criar assinatura gratuita:', subError);
  // Não bloqueia o registro/login
}
```

## Monitoramento

### Logs Importantes

- ✅ `Assinatura gratuita criada para usuário email@exemplo.com (ID: 123)`
- ⚠️ `Usuário email@exemplo.com (ID: 123) sem assinatura ativa. Criando assinatura gratuita...`
- ❌ `Erro ao criar assinatura gratuita para novo usuário: [erro]`

### Verificar Usuários sem Assinatura

```sql
SELECT a.id, a.email, a.name
FROM marcbuddy.accounts a
LEFT JOIN marcbuddy.account_subscriptions s ON a.id = s.user_id AND s.status = 'active'
WHERE s.id IS NULL;
```

## Segurança

### License Keys

- **Formato:** `FREE-XXXXXXXX-XXXX`
- **Geração:** Aleatória usando base36
- **Unicidade:** Verificada no banco antes da inserção (em subscriptions normais)
- **Uso:** Identificação única da assinatura

### Validações

- ✅ Email único por usuário
- ✅ Hash de senha com bcrypt (10 rounds)
- ✅ Status da conta verificado no login
- ✅ Assinatura criada em transação separada (não afeta registro)

## Manutenção

### Atualizar Recursos do Plano Free

```sql
UPDATE marcbuddy.subscription_plans
SET 
  max_projects = 5,  -- aumentar de 3 para 5
  max_storage_gb = 2,  -- aumentar de 1GB para 2GB
  features_list = ARRAY[
    'Acesso básico à plataforma',
    'Até 5 projetos',
    '2GB de armazenamento',
    'Suporte via email',
    'Novo recurso X'
  ]
WHERE id = 'free';
```

### Criar Assinatura Manualmente

```sql
INSERT INTO marcbuddy.account_subscriptions 
(user_id, plan_type, status, license_key, subscription_start_date, billing_cycle, email)
VALUES 
(123, 'free', 'active', 'FREE-MANUAL01-ABCD', CURRENT_TIMESTAMP, 'monthly', 'email@exemplo.com');
```

## Próximos Passos

### Melhorias Futuras

1. **Dashboard do Plano Free**
   - Mostrar limite de uso de recursos
   - Sugerir upgrade quando próximo dos limites

2. **Email de Boas-Vindas**
   - Enviar email explicando o plano free
   - Tutorial de como usar a plataforma

3. **Métricas de Conversão**
   - Rastrear usuários free que fazem upgrade
   - Tempo médio até upgrade
   - Taxa de conversão por canal

4. **Limitação de Recursos**
   - Implementar verificação de limites (projetos, storage)
   - Bloquear criação além dos limites
   - Sugerir upgrade quando limite atingido

## Referências

- **Arquivo Principal:** `backend/src/controllers/auth.controller.js`
- **Tabelas:** `marcbuddy.accounts`, `marcbuddy.account_subscriptions`, `marcbuddy.subscription_plans`
- **Regras do Projeto:** `.cursor/rules/custom-rules.mdc`

---

✅ **Sistema implementado e funcionando!**
