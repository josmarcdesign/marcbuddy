# Como Obter a Connection String do Supabase

## ⚠️ IMPORTANTE: A connection string deve ser copiada diretamente do painel do Supabase

O formato pode variar dependendo da região e configuração do seu projeto.

## Passo a Passo:

1. **Acesse o painel do Supabase:**
   - https://supabase.com/dashboard
   - Faça login na sua conta

2. **Selecione seu projeto:**
   - Nome: `MarcbuddyDataBaseDev`
   - URL: `https://umydjofqoknbggwtwtqv.supabase.co`

3. **Vá em Settings (Configurações):**
   - Menu lateral esquerdo → **Settings** (ícone de engrenagem)

4. **Clique em Database:**
   - No menu lateral de Settings

5. **Role até a seção "Connection string":**
   - Você verá diferentes opções: "URI", "JDBC", "Golang", etc.

6. **Selecione "URI":**
   - Clique na aba "URI" (não "Session mode" ou "Transaction mode")

7. **Copie a connection string completa:**
   - Ela terá um formato como:
     ```
     postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres
     ```
   - **OU** pode ter outro formato dependendo da sua região

8. **Cole no arquivo `.env`:**
   - Abra `backend/.env`
   - Encontre a linha `SUPABASE_DB_CONNECTION_STRING=`
   - Cole a connection string completa após o `=`
   - Exemplo:
     ```
     SUPABASE_DB_CONNECTION_STRING=postgresql://postgres.umydjofqoknbggwtwtqv:SUA_SENHA@aws-0-us-east-1.pooler.supabase.com:6543/postgres
     ```

9. **Teste a conexão:**
   ```bash
   npm run test-supabase
   ```

## 🔐 Nota sobre a Senha:

A senha que você forneceu (`GkJWkn13oFT9vd1C`) pode ser:
- A senha do banco de dados (que você definiu ao criar o projeto)
- Ou pode ser diferente da connection string

A connection string do Supabase já inclui a senha codificada corretamente, então é melhor copiá-la diretamente do painel.

## ❓ Se ainda não funcionar:

1. Verifique se o projeto está ativo no Supabase
2. Verifique se o banco de dados está acessível
3. Tente resetar a senha do banco em Settings > Database > Reset database password
4. Copie a nova connection string gerada

