# Guia de Migrações do Banco de Dados

Este documento descreve como gerenciar migrações do banco de dados quando houver mudanças no backend.

## 📋 Scripts Disponíveis

### Migração Inicial (V1)
```bash
npm run migrate
```
Cria as tabelas básicas:
- `users` - Tabela de usuários
- `subscriptions` - Tabela de assinaturas
- Índices necessários

### Migração V2 (Atualizações de Assinaturas)
```bash
npm run migrate:v2
```
Adiciona colunas à tabela `subscriptions`:
- `billing_period` - Período de cobrança (monthly/annual)
- `amount` - Valor pago
- `currency` - Moeda (padrão: BRL)
- `auto_renew` - Renovação automática
- `cancelled_at` - Data de cancelamento
- `cancellation_reason` - Motivo do cancelamento

### Migração V3 (Coluna Email em Subscriptions)
```bash
npm run migrate:v3
```
Adiciona coluna `email` à tabela `subscriptions`:
- `email` - Email do usuário (para facilitar consultas e identificação)
- Preenche automaticamente com os emails dos usuários relacionados
- Cria índice para melhor performance

### Migração V4 (Tabela de Formas de Pagamento)
```bash
npm run migrate:v4
```
Cria a tabela `payment_methods` com configurações completas:
- `code` - Código único da forma de pagamento (pix, credit_card, etc.)
- `name` - Nome da forma de pagamento
- `enabled` - Se está ativa ou não
- `icon` - Ícone/emoji
- `description` - Descrição
- `max_installments` - Número máximo de parcelas
- `min_installment_value` - Valor mínimo por parcela
- `fee_percentage` - Taxa percentual
- `fee_fixed` - Taxa fixa
- `accepts_credit` - Aceita cartão de crédito
- `accepts_debit` - Aceita cartão de débito

Insere formas de pagamento padrão: PIX, Cartão de Crédito, Cartão de Débito, Boleto e PayPal.

### Migração Completa (Recomendado)
```bash
npm run migrate:all
```
Executa todas as migrações em ordem (V1 + V2 + V3 + V4). **Use este comando para garantir que tudo está atualizado.**

## 🔄 Quando Executar Migrações

Execute migrações sempre que:

1. **Adicionar novas tabelas** ao banco de dados
2. **Adicionar novas colunas** a tabelas existentes
3. **Modificar estrutura** de tabelas (tipos, constraints, etc.)
4. **Adicionar novos índices** ou constraints
5. **Fazer deploy** em um novo ambiente

## 📝 Criando Novas Migrações

Quando precisar criar uma nova migração:

1. Crie um novo arquivo `migrate-v4.js` (ou próximo número)
2. Adicione o script ao `package.json`:
   ```json
   "migrate:v4": "node src/database/migrate-v4.js"
   ```
3. Atualize `migrate-all.js` para incluir a nova migração
4. Documente as mudanças neste arquivo

## ⚠️ Importante

- **Sempre faça backup** do banco antes de executar migrações em produção
- **Teste as migrações** em ambiente de desenvolvimento primeiro
- As migrações são **idempotentes** - podem ser executadas múltiplas vezes sem problemas
- Use `IF NOT EXISTS` ou verificações para evitar erros em colunas/tabelas já existentes

## 🐛 Troubleshooting

### Erro: "column already exists"
- Normal se a migração já foi executada
- O script verifica antes de adicionar, mas pode ocorrer em casos específicos
- Pode ser ignorado se a coluna já existe

### Erro: "relation does not exist"
- Execute primeiro `npm run migrate` para criar as tabelas básicas
- Ou use `npm run migrate:all` para executar tudo

### Verificar estrutura atual
```bash
npm run test-db
```
Este script mostra informações sobre o banco, incluindo tabelas e usuários.

### Sincronizar emails em subscriptions
```bash
npm run sync-emails
```
Este script preenche a coluna `email` em todas as assinaturas que não têm email, sincronizando com os emails dos usuários relacionados.

