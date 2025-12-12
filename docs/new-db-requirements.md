# Requisitos do Novo Banco de Dados (Hostinger) - Estrutura Simplificada

Objetivo: banco novo (sem migração de dados) com schemas separados por contexto e **um schema por ferramenta** para evitar bagunça.

## Schema `public` (plataforma geral)
- `users`: id, name, email (unique), password_hash, role (`user|admin`), is_active, created_at, updated_at.
- `subscriptions`: id, user_id (FK users), plan_type (`free|basic|premium|enterprise`), status (`pending|active|cancelled|expired`), license_key (unique), start_date, end_date, renewal_date, billing_period (`monthly|annual`), amount, currency (`BRL` default), auto_renew (bool), cancelled_at, cancellation_reason, created_at, updated_at.
- `payment_methods`: id, code (unique), name, enabled, icon (ref), description, max_installments, min_installment_value.
- `plans`: id, code (unique), name, description, price, period, features (json/text), is_active.
- `payments` (separado das pendências de assinatura): id, subscription_id (FK subscriptions), method_id (FK payment_methods), status, amount, currency, pix_qr (opcional), pix_payload (opcional), created_at.
- `coupons`: id, code (unique), type (`percent|value`), value, max_redemptions, expires_at, is_active.
- `coupon_usage`: id, coupon_id (FK coupons), user_id (FK users), subscription_id (FK subscriptions), used_at.

## Schema `mclients` (ferramenta mclients)
- `mclients_clients`: id (serial), external_id (uuid unique), name, email, phone, company, status, user_id (FK public.users, opcional), created_at, updated_at.
- `mclients_follow_through_models`: id (serial), external_id (uuid unique), title, description, steps (json), user_id (FK), created_at, updated_at.
- `mclients_follow_throughs`: id (serial), external_id (uuid unique), model_id (FK mclients_follow_through_models), client_id (FK mclients_clients), status, token, briefing_url, user_id (FK), created_at, updated_at.
- `mclients_demands`: id, follow_through_id (FK mclients_follow_throughs), title, description, status, user_id (FK), created_at, updated_at.
- `mclients_payments`: id, demand_id (FK mclients_demands), amount, currency, status, paid_at, due_date, user_id (FK), created_at.
- `mclients_documents`: id, demand_id (FK mclients_demands), url, type, uploaded_at, user_id (FK).
- `mclients_services`: id, name, description, price, is_active, user_id (FK), created_at.
- `mclients_tasks`: id, demand_id (FK mclients_demands), title, description, status, due_date, assigned_to (FK public.users opcional), user_id (FK), created_at.
- `mclients_pending_approvals`: id, follow_through_id (FK mclients_follow_throughs), payload (json), status (`pending|approved|rejected`), user_id (FK), created_at, resolved_at.
- `mclients_time_entries`: id, task_id (FK mclients_tasks), user_id (FK public.users), started_at, ended_at, duration_minutes, notes.
- `mclients_activities`: id, entity_type, entity_id, action, metadata (json), user_id (FK), created_at.
- `mclients_briefing_submissions`: id, follow_through_id (FK mclients_follow_throughs), answers (json), submitted_at, user_id (FK opcional).

## Schema por ferramenta (obrigatório, um por ferramenta)
- Para cada nova ferramenta criar um schema dedicado, com tabelas prefixadas pelo nome da ferramenta e FKs para `public.users`.
- Exemplos de planejamento:
  - Schema `colorbuddy`: tabelas para paletas geradas, uploads de imagem/referência, históricos de extração/geração, presets de marca.
  - Schema `imagebuddy`: tabelas para jobs de compressão/transformação, arquivos de entrada/saída (paths/URLs), fila/estado de processamento.
  - Schema `mclients`: já descrito acima.

## Considerações gerais
- Usar UUID para campos `external_id`/tokens públicos; SERIAL/IDENTITY para IDs internos.
- Incluir índices em chaves estrangeiras e colunas de busca (emails, codes, status).
- Habilitar timestamps padrão (`created_at`, `updated_at`) conforme necessidade.
- Manter FKs cruzando schemas (`public` ↔ ferramenta) conforme regras atuais.

