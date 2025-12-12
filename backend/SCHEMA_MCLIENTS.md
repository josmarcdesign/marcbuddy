# Schema mclients - Documentação

## 📋 Resumo

As tabelas da ferramenta `mclients` foram movidas para um schema separado chamado `mclients` no Supabase, mantendo o schema `public` apenas para as tabelas da plataforma principal.

## 🗂️ Estrutura de Schemas

### Schema `public` (Plataforma)
- `users` - Usuários da plataforma
- `subscriptions` - Assinaturas
- `plans` - Planos de assinatura
- `payment_methods` - Formas de pagamento
- `coupons` - Cupons de desconto
- `coupon_usage` - Uso de cupons

### Schema `mclients` (Ferramenta MClients)
- `mclients_clients` - Clientes
- `mclients_follow_through_models` - Modelos de follow-through
- `mclients_follow_throughs` - Follow-throughs
- `mclients_demands` - Demandas
- `mclients_payments` - Pagamentos
- `mclients_documents` - Documentos
- `mclients_services` - Serviços
- `mclients_tasks` - Tarefas
- `mclients_pending_approvals` - Aprovações pendentes
- `mclients_time_entries` - Registros de tempo
- `mclients_activities` - Atividades
- `mclients_briefing_submissions` - Submissões de briefing

## 🔄 Migração Realizada

A migração V17 (`migrate-v17-schema-mclients.js`) foi executada com sucesso:
1. ✅ Schema `mclients` criado
2. ✅ Todas as 12 tabelas movidas do `public` para `mclients`
3. ✅ Foreign keys mantidas (funcionam entre schemas)
4. ✅ Realtime atualizado (tabelas já estavam na publicação)

## 📝 Uso no Código

Todas as queries no código foram atualizadas para usar o schema `mclients.`:

```sql
-- Antes
SELECT * FROM mclients_clients WHERE user_id = $1;

-- Depois
SELECT * FROM mclients.mclients_clients WHERE user_id = $1;
```

## 🔌 Realtime

Os canais Realtime agora usam o formato:
- `realtime:mclients:mclients_clients`
- `realtime:mclients:mclients_follow_throughs`
- etc.

## ✅ Status

- ✅ Schema criado
- ✅ Tabelas movidas
- ✅ Queries atualizadas no `mclients.controller.js`
- ✅ Realtime configurado
- ⚠️ Políticas RLS precisam ser atualizadas (próxima migração V18)

## 📌 Próximos Passos

1. Executar migração V18 para atualizar políticas RLS para o schema `mclients`
2. Testar todas as funcionalidades da ferramenta mclients
3. Verificar se há outras referências às tabelas em outros arquivos

