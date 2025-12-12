# Plano de Migração do Banco (Supabase → Hostinger)

## Objetivo
- Migrar toda a persistência atualmente no Supabase para o banco da Hostinger, preservando funcionalidades e dados.

## Escopo do que usa banco hoje
- **Backend (`/backend`)**: API Node/Express, queries diretas ao Supabase PostgreSQL (schemas `public` e `mclients`), uso de `SUPABASE_DB_CONNECTION_STRING`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`.
- **Autenticação e sessões**: Tabelas de usuários/roles no schema `public`, RLS do Supabase (bypass pelo service_role no backend).
- **Planos/assinaturas/pagamentos**: Tabelas `public.subscriptions`, `public.plans`, `public.payment_methods`, `public.coupons`, `public.coupon_usage`.
- **Módulo mclients (schema `mclients`)**: 12 tabelas relacionais (`mclients_clients`, `mclients_follow_throughs`, `mclients_follow_through_models`, `mclients_demands`, `mclients_payments`, `mclients_documents`, `mclients_services`, `mclients_tasks`, `mclients_pending_approvals`, `mclients_time_entries`, `mclients_activities`, `mclients_briefing_submissions`) com FKs e `external_id` (UUID).
- **Realtime**: Supabase Realtime para tabelas de `mclients` e `public`.
- **Storage (se houver uso)**: Qualquer upload que hoje esteja no storage do Supabase; se não houver, ignorar.
- **Frontend/hooks**: Hooks que consomem Supabase (`useRealtime`, `useRealtimeTable`, `useMClientsData`) dependem de Realtime e da API backend para dados.

## Decisões prévias
- **SGBD alvo**: Confirmar se Hostinger será PostgreSQL (preferível) ou MySQL/MariaDB (exige ajustes de SQL e tipos).
- **Cliente/ORM**: Definir lib (`pg`/`postgres` para Postgres; `mysql2` para MySQL) ou adotar ORM/query builder (Prisma/Knex) para padronizar.
- **Realtime substituto**: Escolher alternativa (ex.: websockets + triggers + NOTIFY/LISTEN se Postgres; ou polling/eventos custom).

## Inventário de dependências e env vars a revisar
- Substituir `SUPABASE_DB_CONNECTION_STRING`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` por novas envs do Hostinger, p.ex.: `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `DB_SSL`.
- Se mantiver Postgres: manter schemas, tipos UUID, `ON CONFLICT`, funções como `gen_random_uuid()`.
- Se for MySQL/MariaDB: adaptar `ON CONFLICT` → `INSERT ... ON DUPLICATE KEY`, tipos UUID → `CHAR(36)` ou `BINARY(16)`, remover schemas ou simular via prefixos.
- Revisar uso de `@supabase/supabase-js` (se presente no backend) e remover/isoslar.

## Gaps técnicos esperados
- **RLS**: Fora do Supabase não há RLS nativa; mover checagens de autorização para a API (middleware/queries filtrando por `user_id`).
- **Realtime**: Reimplementar camada de eventos; hooks de frontend precisam de novo provedor de notificações.
- **Storage**: Se usava Supabase Storage, apontar para novo provedor (S3/Hostinger) e ajustar URLs salvas.
- **UUID generation**: Garantir geração no backend ou via DB (funcção no Postgres ou lib no app para MySQL).
- **Migrações**: Recriar esquema `public` e `mclients` (ou equivalente) no novo banco.

## Passo a passo proposto
1. **Escolher stack do DB**: Confirmar Postgres vs MySQL/MariaDB na Hostinger.
2. **Provisionar banco**: Criar instância, usuário e SSL (se exigido).
3. **Exportar schema e dados** do Supabase (pg_dump) para referência e migração.
4. **Adaptar schema**:
   - Postgres→Postgres: manter schemas `public`/`mclients`, FKs, índices, `ON CONFLICT`.
   - Postgres→MySQL: converter DDL, ajustar tipos, remover schemas (ou usar prefixos), reescrever constraints.
5. **Recriar migrações** no repositório (Prisma/Knex/SQL) para infra reprodutível.
6. **Configurar camada de acesso** no backend: introduzir pool do novo client (`pg` ou `mysql2`) centralizado (ex.: `backend/src/db/index.js`).
7. **Refatorar queries**: Substituir chamadas Supabase por SQL direto ou via ORM/query builder; respeitar regras críticas do mclients (briefing_url, ON CONFLICT em `external_id`, validações de pendingApprovals).
8. **Reimplementar autenticação/autorização**: Se Supabase Auth era usado, migrar para JWT próprio/Auth0/outro; mover checagens de RLS para middleware/serviços.
9. **Realtime**: Definir estratégia (NOTIFY/LISTEN + websocket no backend se Postgres; ou outra fila/evento) e atualizar hooks do frontend.
10. **Storage (se aplicável)**: Redirecionar uploads para novo bucket/serviço e ajustar salvamento de URLs.
11. **Variáveis de ambiente**: Adicionar novas envs no `.env` e pipelines CI/CD; documentar.
12. **Testes**: Unitários e de integração das rotas críticas (mclients, auth, planos), além de realtime se houver.
13. **Migração de dados**: Importar no Hostinger e validar integridade (contagem por tabela, FKs).
14. **Cutover**: Usar feature flag/env para alternar; janela curta; smoke tests após troca.
15. **Observabilidade**: Ativar logs de slow query; monitorar erros e conexões.

## Arquitetura-alvo sugerida (Postgres)
- **Camada DB**: Pool `pg` com SSL se necessário.
- **Camada de dados**: Query builder (Knex) ou ORM (Prisma) para DDL/migrations.
- **Realtime**: Listener Postgres + serviço websocket no backend.
- **Auth**: Middleware JWT + roles; validações de `user_id` em todas as queries.

## Checklist de execução
- Tipo de SGBD Hostinger definido.
- Banco provisionado e acessível.
- Novas envs criadas e secretadas em CI/CD.
- Migrações reescritas e aplicadas no novo banco.
- Queries críticas (mclients/assinaturas/auth) refatoradas.
- RLS substituída por checagens na API.
- Realtime redefinido e frontend ajustado.
- Storage (se usado) apontando para novo provedor.
- Testes de regressão (API + frontend) passando.
- Plano de rollback: snapshot do Supabase mantido até estabilizar.

## Próximos passos imediatos
- Confirmar tipo de banco disponível na Hostinger (Postgres recomendado).
- Escolher client/ORM.
- Exportar schema/dados do Supabase para mapear gaps.
- Definir estratégia de realtime e auth antes de refatorar rotas.

